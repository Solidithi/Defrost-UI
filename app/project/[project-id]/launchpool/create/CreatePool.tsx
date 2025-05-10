'use client'

import { motion } from 'framer-motion'
import { toast, ToastContainer } from 'react-toastify'
import { red, green, blue, amber } from 'tailwindcss/colors'
import AnimatedBlobs from '../../../../components/UI/background/AnimatedBlobs'
import Button from '../../../../components/UI/button/Button'
import Modal from '../../../../components/UI/modal/Modal'
import SplitText from '../../../../components/UI/effect/SplitText'
import SteplineChart from '../../../../components/charts/SteplineChart'
import Stepper, {
	Step,
} from '../../../../components/UI/project-progress/Stepper'
import { usePoolStore } from '@/app/store/launchpool'
import { useEffect, useState, useMemo } from 'react'
import {
	useAccount,
	useReadContract,
	useWriteContract,
	useWaitForTransactionReceipt,
	useReadContracts,
} from 'wagmi'
import { ethers } from 'ethers'
import { abi as projectHubABI } from '@/abi/ProjectHubUpgradeable.json'
import { abi as ERC20ABI } from '@/abi/ERC20.json'
import { abi as ERC20MetadataABI } from '@/abi/IERC20Metadata.json'
import { ProjectHubUpgradeable__factory } from '@/app/types/typechain'
import { AccessLockedModal } from '@/app/components/UI/shared/AccessLockedModal'
import { useParams } from 'next/navigation'
import Spinner from '../../../../components/UI/effect/Spinner'
import chains from '@/app/config/chains.json'
import { getChainName, getTokenInfoFromConfig } from '@/app/utils/chain'
import Link from 'next/link'
import { normalizeAddress, isValidAddressFormat } from '@/app/utils/address'
import AlertInfo from '@/app/components/UI/shared/AlertInfo'
import { debounce } from '@/app/utils/timing'
import { useProjectStore } from '@/app/store/project'
import { TransactionStatusModal } from '@/app/components/UI/shared/TransactionStatusModal'
import { useOnChainTime } from '@/app/hooks/useOnChainTime'
import {
	PhaseDataType,
	FormDataType,
} from '@/app/types/input/create-launchpool'

export default function CreatePool() {
	/* ---------------------- Project data states ---------------------- */
	const projectID = useParams()['project-id'].toString().trim()
	const { currentProject } = useProjectStore()

	/* ---------------------- Launchpool store ---------------------- */
	const {
		projectTokenAddress,
		setTokenAddress,
		pool,
		poolData,
		addPool,
		removePool,
		updatePoolItem,
		addPhase,
		removePhase,
		updatePhase,
		isConfirming,
		setIsConfirming,
		isOpenEmissionRate,
		setIsOpenEmissionRate,
	} = usePoolStore()

	/* ---------------------- Wallet connection state ---------------------- */
	const account = useAccount()
	const [isProjectOwner, setIsProjectOwner] = useState(false)

	/* ---------------------- Access control for PO ---------------------- */
	// When project data mounts, check if current user is PO
	useEffect(() => {
		if (!currentProject) return

		console.log('user address: ', account.address)
		console.log('owner address: ', currentProject?.owner_id)

		if (
			account.isConnected &&
			normalizeAddress(account.address) ===
				normalizeAddress(currentProject?.owner_id || undefined)
		) {
			setIsProjectOwner(true)
		}
	}, [currentProject])

	// Verify that the PO's wallet is connected to the same chain as their project
	useEffect(() => {
		if (!currentProject || !account) {
			return
		}

		if (account?.chainId !== currentProject?.chain_id) {
			toast.warning(
				`Please switch to ${getChainName(currentProject.chain_id)} network to create a launchpool for this project`,
				{
					style: { backgroundColor: amber[700], color: 'white' },
				}
			)
		}
	}, [currentProject, account.chainId])

	/* ---------------------- Contract interaction: create launchpool ---------------------- */
	const {
		writeContractAsync: selfMultiCall,
		data: selfMultiCallHash,
		status: selfMultiCallStatus,
	} = useWriteContract({})

	const {
		writeContractAsync: approveTokenAsync,
		data: approveTokenHash,
		status: approveTokenStatus,
	} = useWriteContract({})

	const chainIdStr = account?.chainId?.toString() || ''
	const projectHubProxyAddress = chains[chainIdStr as keyof typeof chains]
		?.deployedContracts.ProjectHubUpgradeableProxy as `0x${string}`

	const { status: selfMultiCallReceiptStatus } = useWaitForTransactionReceipt({
		hash: selfMultiCallHash,
	})

	const { data: approveTokenReceipt, status: approveTokenReceiptStatus } =
		useWaitForTransactionReceipt({
			hash: approveTokenHash,
		})

	// Project token constants
	const projectTokenAmount = ethers.parseUnits('10', 18)

	const [isWaitingForIndexer, setIsWaitingForIndexer] = useState(false)
	const [finalError, setFinalError] = useState<string | null>(null)
	const [isTransactionStatusModalOpen, setIsTransactionStatusModalOpen] =
		useState(false)

	// Token approval state variables
	const [isApprovalNeeded, setIsApprovalNeeded] = useState(false)
	const [isApprovalComplete, setIsApprovalComplete] = useState(false)
	const [approvalError, setApprovalError] = useState<string | null>(null)

	/* ---------------------- Contract interaction: Project Token Approval ---------------------- */
	const handleTokenApproval = async () => {
		if (!account.isConnected) {
			toast.warning('Connect your wallet first', {
				style: { backgroundColor: red[500], color: 'white' },
			})
			return
		}

		if (!projectTokenAddress || !projectHubProxyAddress) {
			toast.error('Invalid token address or contract', {
				style: { backgroundColor: red[500], color: 'white' },
			})
			return
		}

		try {
			setApprovalError(null)

			await approveTokenAsync({
				abi: ERC20ABI,
				address: projectTokenAddress as `0x${string}`,
				functionName: 'approve',
				args: [projectHubProxyAddress, projectTokenAmount],
			})

			// Note: The success handling is done in the useEffect that monitors approveTokenReceiptStatus
		} catch (error) {
			console.error('Error approving token:', error)
			setApprovalError('Failed to send approval transaction')
			toast.error('Failed to approve token', {
				style: { backgroundColor: red[500], color: 'white' },
			})
		}
	}

	/* ---------------------- Transaction state management ---------------------- */
	const getTransactionState = () => {
		// Check approval states first
		if (isApprovalNeeded && !isApprovalComplete) {
			if (approveTokenStatus === 'pending') {
				return {
					status: 'approving',
					buttonText: 'Approving Tokens...',
					buttonDisabled: true,
					showApprovalSection: true,
					showApprovalButton: true,
					approvalButtonText: 'Approving...',
					approvalButtonDisabled: true,
					showApprovalSpinner: true,
				}
			}
			return {
				status: 'needs-approval',
				buttonText: 'Approve Tokens First',
				buttonDisabled: true,
				showApprovalSection: true,
				showApprovalButton: true,
				approvalButtonText: 'Approve Token Use',
				approvalButtonDisabled: false,
				showApprovalSpinner: false,
			}
		}

		// Then check transaction states
		if (selfMultiCallStatus === 'pending') {
			return {
				status: 'submitting',
				buttonText: 'Submitting Transaction...',
				buttonDisabled: true,
				showApprovalSection: isApprovalComplete,
				showApprovalButton: false,
				approvalButtonText: 'Approved ✓',
				approvalButtonDisabled: true,
				showApprovalSpinner: false,
			}
		}

		if (
			selfMultiCallReceiptStatus === 'pending' &&
			selfMultiCallStatus !== 'idle'
		) {
			return {
				status: 'confirming',
				buttonText: 'Confirming Transaction...',
				buttonDisabled: true,
				showApprovalSection: isApprovalComplete,
				showApprovalButton: false,
				approvalButtonText: 'Approved ✓',
				approvalButtonDisabled: true,
				showApprovalSpinner: false,
			}
		}

		if (isWaitingForIndexer) {
			return {
				status: 'indexing',
				buttonText: 'Syncing Data...',
				buttonDisabled: true,
				showApprovalSection: isApprovalComplete,
				showApprovalButton: false,
				approvalButtonText: 'Approved ✓',
				approvalButtonDisabled: true,
				showApprovalSpinner: false,
			}
		}

		if (finalError) {
			return {
				status: 'error',
				buttonText: 'Try Again',
				buttonDisabled: false,
				showApprovalSection: isApprovalNeeded,
				showApprovalButton: !isApprovalComplete,
				approvalButtonText: isApprovalComplete
					? 'Approved ✓'
					: 'Approve Token Use',
				approvalButtonDisabled: isApprovalComplete,
				showApprovalSpinner: false,
			}
		}

		// Default state (idle/ready)
		return {
			status: 'ready',
			buttonText: 'Create Launchpool',
			buttonDisabled: !account.isConnected,
			showApprovalSection: isApprovalNeeded,
			showApprovalButton: isApprovalNeeded && !isApprovalComplete,
			approvalButtonText: isApprovalComplete
				? 'Approved ✓'
				: 'Approve Token Use',
			approvalButtonDisabled: isApprovalComplete,
			showApprovalSpinner: false,
		}
	}

	/* ---------------------- Transaction lifecycle management ---------------------- */
	useEffect(() => {
		// When transaction is signed (after user has signed with MetaMask)
		if (selfMultiCallStatus === 'success' && selfMultiCallHash) {
			console.log('Transaction submitted! Hash:', selfMultiCallHash)
			setIsTransactionStatusModalOpen(true) // Only show modal after transaction is signed
		}
	}, [selfMultiCallStatus, selfMultiCallHash])

	// Read the token allowance between user and project hub
	const {
		data: tokenAllowance,
		status: tokenAllowanceStatus,
		error: tokenAllowanceError,
		refetch: refetchAllowance,
	} = useReadContract({
		abi: ERC20ABI,
		functionName: 'allowance',
		address: projectTokenAddress as `0x${string}`,
		args: [account.address, projectHubProxyAddress],
		query: { enabled: !!account.address && !!projectHubProxyAddress },
	})

	// Check if approval is needed when allowance data is loaded
	useEffect(() => {
		if (tokenAllowanceStatus === 'success' && tokenAllowance !== undefined) {
			const currentAllowance = BigInt(tokenAllowance?.toString() ?? '0')
			console.log('Current allowance:', currentAllowance.toString())
			console.log('Required amount:', projectTokenAmount.toString())
			setIsApprovalNeeded(currentAllowance < projectTokenAmount)
		}
	}, [tokenAllowanceStatus, tokenAllowance, projectTokenAmount])

	// Handle approval confirmation
	useEffect(() => {
		if (approveTokenReceiptStatus === 'success' && approveTokenReceipt) {
			console.log('Approval confirmed! Receipt:', approveTokenReceipt)
			setIsApprovalComplete(true)

			// Refetch allowance to confirm it's updated
			refetchAllowance().then(() => {
				toast.success('Token approval successful!', {
					style: { backgroundColor: green[500], color: 'white' },
				})
			})
		} else if (approveTokenReceiptStatus === 'error') {
			console.error('Error confirming approval')
			setApprovalError('Error confirming token approval. Please try again.')
			toast.error('Token approval failed', {
				style: { backgroundColor: red[500], color: 'white' },
			})
		}
	}, [approveTokenReceiptStatus, approveTokenReceipt, refetchAllowance])

	// Current selected pool for emission rate modal
	const [selectedPoolId, setSelectedPoolId] = useState(null)

	/* ---------------------- Editable State ---------------------- */
	const [editableFields, setEditableFields] = useState<Record<string, boolean>>(
		{}
	)
	const toggleEditable = (fieldKey: string) => {
		setEditableFields((prev) => ({
			...prev,
			[fieldKey]: !prev[fieldKey],
		}))
	}

	/* ---------------------- Add pool ---------------------- */
	const handleAddPool = () => {
		addPool()
		console.log('After addPool - poolData:', poolData)
	}

	/* ---------------------- Add phase ---------------------- */
	const handleAddPhase = (poolId: number) => {
		if (!poolId) return

		// Get current phases for this pool
		const currentPhases = poolData[poolId]?.phases || []
		if (currentPhases.length >= 3) {
			toast.warning('You can add only 3 phases.', {
				style: { backgroundColor: red[500], color: 'white' },
			})
			return
		}

		addPhase(poolId)
		console.log('After addPhase - poolData:', poolData)
	}

	/* ---------------------- Handle delete pool/phase ---------------------- */
	const handleConfirmRemove = () => {
		if (isConfirming.id !== null) {
			if (isConfirming.type === 'pool') {
				removePool(isConfirming.id)
			} else if (isConfirming.type === 'phase') {
				if (selectedPoolId) {
					removePhase(selectedPoolId, isConfirming.id)
				}
			}
		}
		setIsConfirming({ open: false, id: null, type: null })
	}

	/* ---------------------- Validate Pool Dates ---------------------- */
	const validatePoolDates = (poolId: number, field: string, value: string) => {
		const now = new Date()
		const fromDate =
			field === 'from'
				? new Date(value)
				: new Date(poolData[poolId]?.from || '')
		const toDate =
			field === 'to' ? new Date(value) : new Date(poolData[poolId]?.to || '')

		if (fromDate < now) {
			toast.error('Start date cannot be in the past.')
			return false
		}

		if (toDate <= fromDate) {
			toast.error('End date must be after the start date.')
			return false
		}

		return true
	}

	/* ---------------------- Validate Phase Dates ---------------------- */
	const validatePhaseDates = (
		poolId: number,
		phaseId: number,
		field: string,
		value: string
	) => {
		const now = new Date()
		const phases = poolData[poolId]?.phases || []
		const phaseIndex = phases.findIndex((p) => p.id === phaseId)

		if (phaseIndex === -1) return false

		const fromDate =
			field === 'from'
				? new Date(value)
				: new Date(phases[phaseIndex]?.from || '')

		const toDate =
			field === 'to' ? new Date(value) : new Date(phases[phaseIndex]?.to || '')

		// Convert pool's `from` date to a Date object for comparison
		const poolFromDate = new Date(poolData[poolId]?.from || '')

		// Check if the first phase's `from` matches the pool's `from`
		if (
			phaseIndex === 0 &&
			field === 'from' &&
			fromDate.getTime() !== poolFromDate.getTime()
		) {
			console.log('Phase from date:', fromDate)
			console.log('Pool from date:', poolFromDate)
			toast.error('The first phase must start at the same time as the pool.')
			return false
		}

		// Ensure no past dates
		if (fromDate < now) {
			toast.error('Start date cannot be in the past.')
			return false
		}

		// Ensure `to` is after `from`
		if (toDate <= fromDate) {
			toast.error('End date must be after the start date.')
			return false
		}

		// Ensure dates are contiguous
		if (phaseIndex > 0) {
			const prevPhaseTo = new Date(phases[phaseIndex - 1]?.to || '')
			if (field === 'from' && fromDate.getTime() !== prevPhaseTo.getTime()) {
				toast.error(
					'Phase start date must be contiguous with the previous phase.'
				)
				return false
			}
		}

		return true
	}

	/* ---------------------- Find mistakes in emission rate number when changed ---------------------- */
	const findMistakesInEmissionRate = (
		poolId: number,
		phaseId: number,
		newEmissionRate: number
	): { mistake: string | null } => {
		if (isNaN(newEmissionRate) || newEmissionRate <= 0) {
			return { mistake: 'Emission rate must be a positive number.' }
		}

		const totalEmitTokens =
			newEmissionRate +
			poolData[poolId]?.phases?.reduce((prev, curr) => {
				if (curr.id === phaseId) {
					return prev
				}
				return prev + curr.tokenAmount
			}, 0)

		if (totalEmitTokens > poolData[poolId]?.tokenSupply) {
			console.log('Total emitted tokens:', totalEmitTokens)
			console.log('Pool token supply:', poolData[poolId]?.tokenSupply)
			return {
				mistake:
					'Total emission rate exceeds the pool token supply. Please adjust.',
			}
		}

		return { mistake: null }
	}

	const findMistakesInTokenSupply = (
		poolId: number,
		newTokenSupply: string
	): { mistake: string | null } => {
		const parsedTokenSupply = parseFloat(newTokenSupply)
		if (isNaN(parsedTokenSupply) || parsedTokenSupply <= 0) {
			return { mistake: 'Token supply must be a positive number.' }
		}
		const totalEmitTokens =
			poolData[poolId]?.phases?.reduce((prev, curr) => {
				return prev + curr.tokenAmount
			}, 0) || 0
		if (totalEmitTokens > parsedTokenSupply) {
			return {
				mistake:
					'Total emission rate exceeds the pool token supply. Please adjust.',
			}
		}

		return { mistake: null }
	}

	/* ---------------------- Handle Change Pool ---------------------- */
	const handleChangePool = (
		poolId: number,
		field: keyof FormDataType,
		value: string
	) => {
		if (field === 'from' || field === 'to') {
			if (!validatePoolDates(poolId, field, value)) return
		}

		if (field === 'tokenSupply') {
			const { mistake } = findMistakesInTokenSupply(poolId, value)
			if (mistake) {
				toast.warning(mistake)
				return
			}
		}

		updatePoolItem(poolId, { [field]: value })
	}

	/* ---------------------- Handle Change EmissionRate ---------------------- */
	const handleChangeEmissionRate = (
		poolId: number,
		phaseId: number,
		field: keyof PhaseDataType,
		value: string
	) => {
		if (field === 'from' || field === 'to') {
			if (!validatePhaseDates(poolId, phaseId, field, value)) return
		}

		if (field === 'tokenAmount') {
			const newTokenAmount = parseFloat(value as string)
			const { mistake } = findMistakesInEmissionRate(
				poolId,
				phaseId,
				newTokenAmount
			)

			if (mistake) {
				toast.warning(mistake)
				return
			}

			updatePhase(poolId, phaseId, { [field]: newTokenAmount })
			return
		}

		updatePhase(poolId, phaseId, { [field]: value })
	}

	/* ---------------------- Open and Close Confirm Modal ---------------------- */
	const handleOpenConfirmModal = (id: number, type: 'pool' | 'phase') => {
		setIsConfirming({ open: true, id, type })
	}

	const handleCloseConfirmModal = () => {
		setIsConfirming({ open: false, id: null, type: null })
	}

	/* ---------------------- Open and Close EmissionRate Modal ---------------------- */
	const handleOpenEmissionRateModal = (poolId: any) => {
		setSelectedPoolId(poolId)
		setIsOpenEmissionRate(true)
	}

	const handleCloseEmissionRateModal = () => {
		setIsOpenEmissionRate(false)
		setSelectedPoolId(null)
	}

	useEffect(() => {
		if (poolData) {
			console.log('Pool data updated:', poolData)
		}
	}, [poolData])

	/* ---------------------- Format DateTime for Input ---------------------- */
	const formatDateTimeLocal = (dateString: string) => {
		if (!dateString) return ''
		const date = new Date(dateString)
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')
		return `${year}-${month}-${day}T${hours}:${minutes}`
	}

	/* ---------------------- Handle stepper's step change ---------------------- */
	const handleStepChange = (changeToStepNumber: number) => {
		console.log('Step number: ', changeToStepNumber)
		switch (changeToStepNumber) {
			case 2:
				if (!isValidAddressFormat(projectTokenAddress as `0x${string}`)) {
					toast.error('Invalid token address format')
				}
				break
		}
	}

	/* ---------------------- Final step: Handle Create Launchpool ---------------------- */
	const { estimateBlockNumForDate } = useOnChainTime()

	const handleCreateLaunchpool = async () => {
		// Check if approval is needed
		if (isApprovalNeeded) {
			toast.info('Token approval required before creating launchpool', {
				style: { backgroundColor: blue[500], color: 'white' },
			})
			// Handle the approval flow instead of proceeding with launchpool creation
			await handleTokenApproval()
			return
		}

		// Reset transaction states when initiating a new transaction
		setIsWaitingForIndexer(false)
		setFinalError(null)
		setIsTransactionStatusModalOpen(false)

		try {
			// Create params object exactly matching Solidity struct
			const createLaunchpoolCalldataBatch = Object.entries(poolData).map(
				([_, pool]) => {
					const startBlock = estimateBlockNumForDate(pool.from)
					const endBlock = estimateBlockNumForDate(pool.to)
					const vTokenMetadata = getTokenInfoFromConfig(
						chainIdStr,
						pool.vTokenAddress
					)
					if (!vTokenMetadata) {
						console.error('Cannot find vToken in config')
						return
					}

					const changeBlocks = [
						startBlock,
						...pool.phases
							.slice(1)
							.map((phase) => estimateBlockNumForDate(phase.from)),
					]
					const phaseCount = pool.phases.length
					const emissionRateChanges = changeBlocks.map((block, index) => {
						const currPhase = pool.phases[index]
						const phaseTokenSupply = currPhase.tokenAmount

						const blockDelta =
							index < phaseCount - 1
								? changeBlocks[index + 1] - block
								: endBlock - block

						let phaseEmissionRate = phaseTokenSupply / blockDelta

						// Adjust each phase's emissionRate if exceed token supply (probably not needed)
						const emissionRateError =
							phaseTokenSupply - phaseEmissionRate * blockDelta
						phaseEmissionRate += emissionRateError / blockDelta

						console.log(
							`Phase ${index} emission rate: ${phaseEmissionRate} tokens/block`
						)

						// Limit the maximum number of decimals
						const formattedEmissionRate = phaseEmissionRate.toFixed(
							projectTokenMetadata.decimals
						)

						return ethers.parseUnits(
							formattedEmissionRate,
							projectTokenMetadata.decimals
						)
					})

					// Build launchpool creation params
					const launchpoolParams = {
						projectId: BigInt(projectID),
						projectTokenAmount: ethers.parseUnits(
							pool.tokenSupply.toString(),
							projectTokenMetadata.decimals
						),
						projectToken: projectTokenAddress,
						vAsset: pool.vTokenAddress,
						startBlock,
						endBlock,
						maxVTokensPerStaker: ethers.parseUnits(
							pool.maxStake.toString(),
							vTokenMetadata.decimals
						),
						changeBlocks,
						emissionRateChanges,
					}

					console.log('Launchpool params: ', launchpoolParams)

					const createLaunchpoolCalldata =
						ProjectHubUpgradeable__factory.createInterface().encodeFunctionData(
							'createLaunchpool',
							[launchpoolParams]
						)

					return createLaunchpoolCalldata
				}
			)

			// 4. Call selfMultiCall
			console.log(
				'createLaunchpool payload: ',
				createLaunchpoolCalldataBatch[0]
			)

			await selfMultiCall({
				abi: projectHubABI,
				address: projectHubProxyAddress,
				functionName: 'selfMultiCall',
				args: [createLaunchpoolCalldataBatch],
			})
		} catch (error: any) {
			console.error('Error starting transaction:', error)

			// Enhanced error logging
			if (error.reason) console.error('Reason:', error.reason)
			if (error.code) console.error('Error code:', error.code)
			if (error.data) console.error('Error data:', error.data)

			toast.error('Transaction failed. See console for details.', {
				style: { backgroundColor: red[500], color: 'white' },
			})
		}
	}

	/* ---------------------- Token validation ---------------------- */
	const [isTokenValid, setIsTokenValid] = useState<boolean | undefined>(
		undefined
	)
	const [isValidatingToken, setIsValidatingToken] = useState(false)
	const [tokenValidationMessage, setTokenValidationMessage] = useState('')

	// Attempt to read token decimals (read from ZeroAddress if isValidatingToken is false)
	const tokenContract = useMemo(() => {
		if (!projectTokenAddress) return
		return {
			address: projectTokenAddress as `0x${string}`,
			abi: [...ERC20MetadataABI, ...ERC20ABI],
		}
	}, [projectTokenAddress])

	const readTokenDecimalsAndSymbol = useReadContracts({
		contracts: [
			{
				...tokenContract,
				functionName: 'decimals',
			},
			{
				...tokenContract,
				functionName: 'symbol',
			},
		],
	})

	const projectTokenMetadata = useMemo(() => {
		if (
			!isTokenValid ||
			!readTokenDecimalsAndSymbol ||
			readTokenDecimalsAndSymbol.status !== 'success'
		) {
			return {
				decimals: undefined,
				symbol: undefined,
			}
		}

		console.log('token decimals: ', readTokenDecimalsAndSymbol.data[0].result)
		console.log('token symbol: ', readTokenDecimalsAndSymbol.data[1].result)
		return {
			decimals: Number(readTokenDecimalsAndSymbol.data[0].result),
			symbol: String(readTokenDecimalsAndSymbol.data[1].result),
		}
	}, [readTokenDecimalsAndSymbol, isTokenValid])

	// const readTokenDecimals = useReadContract({
	// 	address: tokenAddress as `0x${string}`,
	// 	abi: ERC20MetadataABI,
	// 	functionName: 'decimals',
	// })

	// // Attempt to read token symbol as well (read from ZeroAddress if isValidatingToken is false)
	// const readTokenSymbol = useReadContract({
	// 	address: tokenAddress as `0x${string}`,
	// 	abi: ERC20MetadataABI,
	// 	functionName: 'symbol',
	// })

	// 500ms debounce before calling startValidatingToken()
	useEffect(() => {
		startValidatingTokenDebounced()
	}, [projectTokenAddress])

	// This function decide to set `isValidatingToken` to true or not, which will trigger token validation side effects (see useEffect below
	const startValidatingTokenDebounced = debounce(() => {
		// Abort early if tokenAddress empty, or its format is invalid
		if (
			!projectTokenAddress ||
			!isValidAddressFormat(projectTokenAddress as `0x${string}`)
		) {
			setIsTokenValid(undefined)
			setIsValidatingToken(false)
			setTokenValidationMessage('')
			return
		}

		setIsValidatingToken(true)
		setTokenValidationMessage('')
	}, 500) // add 500ms debounce before executing

	// Start validating token if done reading token decimals & symbol from contract, and isValidatingToken is set to true
	useEffect(() => {
		if (!isValidatingToken) {
			return
		}

		if (readTokenDecimalsAndSymbol.error) {
			setTokenValidationMessage(
				"Sorry, we tried our best to discover your project's token information without any luck"
			)
			console.log('read token error: ', readTokenDecimalsAndSymbol.error)
			setIsTokenValid(false)
			setIsValidatingToken(false)
			return
		}

		if (
			readTokenDecimalsAndSymbol.status === 'success' &&
			readTokenDecimalsAndSymbol.data[0].status === 'success' &&
			readTokenDecimalsAndSymbol.data[1].status === 'success'
		) {
			setTokenValidationMessage(`Token validated successfully.`)
			setIsTokenValid(true)
			setIsValidatingToken(false)
		}
	}, [readTokenDecimalsAndSymbol, isValidatingToken])

	/* ---------------------- currentChainConfig ---------------------- */
	const currentChainConfig = useMemo(() => {
		if (!account.isConnected) return null
		return chains[chainIdStr as keyof typeof chains]
	}, [account.chainId])

	/* ---------------------- Debug: Log store when poolData or phaseData changes ---------------------- */
	// useEffect(() => {
	// console.log('PoolData updated:', poolData)
	// console.log('Pool ID updated:', pool)
	// }, [poolData, pool])

	/* ---------------------- Debug: Manually log the store ---------------------- */
	// const handleLogStore = () => {
	// 	console.log('Current Store:', {
	// 		tokenAddress,
	// 		pool,
	// 		poolData,
	// 		phase,
	// 		phaseData,
	// 		isConfirming,
	// 		isOpenEmissionRate,
	// 	})
	// }

	return (
		<div className="relative page-container ">
			<AnimatedBlobs count={4} />

			{/* Project Header */}
			{currentProject && (
				<div className="mb-8 glass-component-3 p-4 rounded-xl">
					<div className="flex items-center gap-4">
						{currentProject.logo ? (
							<img
								src={`data:image/png;base64,${currentProject.logo}`}
								alt={currentProject.name || 'project logo'}
								className="w-16 h-16 rounded-full object-cover"
							/>
						) : (
							<div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
						)}
						<div>
							<h2 className="text-2xl font-orbitron text-white">
								{currentProject.name}{' '}
								<span className="text-cyan-400">Launchpool</span>
							</h2>
							<p className="text-gray-300 text-sm">
								{currentProject.short_description}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Project breadcumb navigation */}
			{currentProject && (
				<div className="flex items-center text-sm mb-6 text-gray-400">
					<Link
						href="/project-detail" // add the correct path to when we got project detail page
						className="hover:text-cyan-400 transition-colors"
					>
						My Projects
					</Link>
					<span className="mx-2">›</span>
					<Link
						href={`/project/${projectID}`}
						className="hover:text-cyan-400 transition-colors"
					>
						{currentProject.name || 'Project'}
					</Link>
					<span className="mx-2">›</span>
					<span className="text-white">Create Launchpool</span>
				</div>
			)}

			{/* --------------------------------------Title & Subtitle----------------------------------------------------- */}
			<div className=" text-center z-20">
				<SplitText
					text="Unleash Your Web3-Native Launchpool"
					className="title-text"
					delay={50}
					animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
					animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
					threshold={0.2}
					rootMargin="-50px"
				/>
			</div>
			<div className="mt-[30px] text-center max-w-5xl mx-auto z-20">
				<SplitText
					text="Provide the key details—goals, timeline, and requirements—to bring your Web3-native launchpool to life for stakeholders. This form collects everything needed to showcase your pool with impact on our platform."
					className="content-text text-gray-300"
					delay={10}
					animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
					animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
					threshold={0.2}
					rootMargin="-50px"
				/>
			</div>

			{/* -------------------------------------------Form------------------------------------------------ */}

			<div
				className={`mt-14 w-[1200px] h-auto glass-component-3 rounded-2xl p-8 transition-all duration-300 z-20`}
			>
				<Stepper
					className="w-full"
					initialStep={1}
					onFinalStepCompleted={() => handleCreateLaunchpool()}
					onStepChange={handleStepChange}
					disableStepIndicators={!isTokenValid}
					backButtonText="Previous"
					nextButtonText="Next"
				>
					{/* --------------------------------------Token Input And Token Validation----------------------------------------------------- */}
					<Step canGoToNextStep={isTokenValid === true}>
						<div className="flex flex-col items-center justify-center w-full gap-5">
							<span className="text-3xl font-orbitron text-white mb-4 flex justify-center w-full">
								Token address
							</span>
							<div className="relative w-full">
								<input
									id="projectName"
									value={projectTokenAddress}
									onChange={(e) => setTokenAddress(e.target.value)}
									placeholder="Enter your token address"
									className={`p-4 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full`}
									disabled={isValidatingToken}
								/>
								{isValidatingToken && (
									<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
										<Spinner heightWidth={5} className="border-blue-400" />
									</div>
								)}
							</div>

							{tokenValidationMessage && (
								<AlertInfo accentColor={isTokenValid ? 'green' : 'red'}>
									<div className="flex items-center">
										{isTokenValid ? (
											<div>
												<p>{tokenValidationMessage}</p>
												{projectTokenMetadata.decimals &&
													projectTokenMetadata.symbol && (
														<p className="text-sm mt-1">
															Token Symbol:{' '}
															<span className="font-medium">
																{projectTokenMetadata.decimals}
															</span>{' '}
															| Decimals:{' '}
															<span className="font-medium">
																{projectTokenMetadata.symbol}
															</span>
														</p>
													)}
											</div>
										) : (
											<div>
												<p>{tokenValidationMessage}</p>
												<p className="text-sm mt-1">
													Please check the address and ensure you&apos;re on the
													correct network.
												</p>
											</div>
										)}
									</div>
								</AlertInfo>
							)}

							{isTokenValid == undefined &&
								projectTokenAddress &&
								!isValidatingToken && (
									<div className="text-sm text-gray-400 italic">
										Please enter a complete token address
									</div>
								)}
						</div>
					</Step>

					{/* --------------------------------------Create pool form----------------------------------------------------- */}

					<Step>
						<div className="glass-component-3 w-full h--full p-10 rounded-xl text-white flex flex-col gap-5">
							<span className="text-xl font-orbitron  flex justify-start w-full">
								Select staking token
							</span>
							<Button
								onClick={handleAddPool}
								className="h-16 w-16 rounded-full glass-component-3 flex items-center justify-center "
							>
								<svg
									width="36"
									height="36"
									viewBox="0 0 46 46"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M23 3V43"
										stroke="white"
										stroke-width="5"
										stroke-linecap="round"
									/>
									<path
										d="M3 23L43 23"
										stroke="white"
										stroke-width="5"
										stroke-linecap="round"
									/>
								</svg>
							</Button>

							<div className="flex flex-wrap gap-3 w-full">
								{pool.map((poolId, index) => (
									<motion.div
										key={poolId}
										initial={{ opacity: 0, y: 50 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5 }}
										className="glass-component-3 h-auto p-4 pt-10 rounded-xl flex items-center justify-center flex-col gap-5"
										style={{ width: 'calc(50% - 0.375rem)' }}
									>
										<Button
											onClick={() => handleOpenConfirmModal(poolId, 'pool')}
											className="absolute top-5 right-5 glass-component-3 px-3 py-1"
										>
											X
										</Button>

										<div className="w-full flex items-center justify-between p-2 gap-3">
											{/* Chain indicator */}
											<div className="w-1/2 flex flex-col gap-3 relative">
												<span className="font-orbitron text-lg">Chain</span>
												<div className="p-3 rounded-xl font-comfortaa text-white glass-component-2 w-full text-sm">
													{currentProject ? (
														<div className="flex items-center gap-2">
															<span>
																{getChainName(currentProject.chain_id)}
															</span>
															<span className="text-xs text-cyan-400">
																(Same as project)
															</span>
														</div>
													) : (
														<span className="text-gray-400">Loading...</span>
													)}
												</div>
											</div>

											<div className="w-1/2 flex flex-col gap-3 relative">
												<span className="font-orbitron text-lg">Token</span>

												<div className="relative group">
													<select
														value={poolData[poolId]?.vTokenAddress || ''}
														onChange={(e) => {
															const selectedOption =
																e.target.options[e.target.selectedIndex]
															const vTokenAddress = selectedOption.value
															console.log('vToken selected: ', vTokenAddress)
															handleChangePool(
																poolId,
																'vTokenAddress',
																vTokenAddress
															)
															handleChangePool(
																poolId,
																'vTokenSymbol',
																selectedOption.text
															)
														}}
														className="p-3 pr-10 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none cursor-pointer"
													>
														<option value="" disabled>
															Select staking token
														</option>
														{currentChainConfig?.tokens.map((token) => (
															<option key={token.address} value={token.address}>
																{token.symbol}
															</option>
														))}
													</select>

													{/* Custom dropdown arrow */}
													<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none transition-transform duration-300 group-hover:translate-y-0.5">
														<svg
															className="w-5 h-5 text-white opacity-80"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M19 9l-7 7-7-7"
															/>
														</svg>
													</div>
												</div>
											</div>
										</div>

										<div className="w-full flex flex-col p-2 gap-3">
											<span className="font-orbitron text-lg">
												Project token supply
											</span>
											<div className="flex gap-5">
												<input
													type="number"
													value={poolData[poolId]?.tokenSupply || 1}
													min={1}
													onChange={(e) => {
														const value = e.target.value
														if (/^\d*$/.test(value)) {
															console.log('value: ', value)
															handleChangePool(poolId, 'tokenSupply', value)
														}
													}}
													onKeyDown={(e) => {
														const invalidChars = ['e', 'E', '+', '-', '.', ',']
														if (
															invalidChars.includes(e.key) ||
															(e.key.length === 1 && isNaN(Number(e.key)))
														) {
															e.preventDefault()
														}
													}}
													placeholder="Enter project token supply"
													className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
    																[&::-webkit-inner-spin-button]:appearance-none 
    																[&::-webkit-outer-spin-button]:appearance-none"
												/>

												<Button className="glass-component-3 rounded-xl">
													Check
												</Button>
											</div>
										</div>

										<div className="w-full flex flex-col gap-3 p-2">
											<span className="font-orbitron text-lg">
												Max stake per investor
											</span>
											<input
												type="number"
												value={poolData[poolId]?.maxStake || ''}
												onChange={(e) => {
													const value = e.target.value
													if (/^\d*$/.test(value)) {
														handleChangePool(poolId, 'maxStake', value)
													}
												}}
												onKeyDown={(e) => {
													const invalidChars = ['e', 'E', '+', '-', '.', ',']
													if (
														invalidChars.includes(e.key) ||
														(e.key.length === 1 && isNaN(Number(e.key)))
													) {
														e.preventDefault()
													}
												}}
												placeholder="Enter max stake"
												className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm appearance-none 
    															[&::-webkit-inner-spin-button]:appearance-none 
    															[&::-webkit-outer-spin-button]:appearance-none"
											/>
										</div>

										<div className="w-full flex flex-col gap-3 p-2">
											<span className="font-orbitron text-lg">From</span>
											<input
												type="datetime-local"
												value={
													formatDateTimeLocal(poolData[poolId]?.from) || ''
												}
												onChange={(e) =>
													handleChangePool(poolId, 'from', e.target.value)
												}
												placeholder="Enter start date"
												className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm"
											/>
										</div>

										<div className="w-full flex flex-col gap-3 p-2">
											<span className="font-orbitron text-lg">To</span>
											<input
												type="datetime-local"
												value={formatDateTimeLocal(poolData[poolId]?.to) || ''}
												onChange={(e) =>
													handleChangePool(poolId, 'to', e.target.value)
												}
												placeholder="Enter end date"
												className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm"
											/>
										</div>

										<div className=" w-full flex flex-col gap-3 p-2">
											<span className="font-orbitron flex text-lg  items-center gap-2">
												<span>Emission Rate</span>
												<div className="relative group cursor-pointer">
													<svg
														width="20"
														height="20"
														viewBox="0 0 27 27"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M13.5 18V13.5M13.5 9H13.5113M24.75 13.5C24.75 19.7132 19.7132 24.75 13.5 24.75C7.2868 24.75 2.25 19.7132 2.25 13.5C2.25 7.2868 7.2868 2.25 13.5 2.25C19.7132 2.25 24.75 7.2868 24.75 13.5Z"
															stroke="#F3F3F3"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
													<div className="absolute w-64 -left-[127px] top-1/2 -translate-y-28 ml-2 bg-white text-black text-xs px-3 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 font-comfortaa pointer-events-none">
														Lorem Ipsum is simply dummy text of the printing and
														typesetting industry. Lorem Ipsum has been the
														industry standard dummy text ever since the 1500s.
													</div>
												</div>
											</span>

											<Button
												onClick={() => handleOpenEmissionRateModal(poolId)}
												className="p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-sm flex justify-center items-center"
											>
												<svg
													width="29"
													height="28"
													viewBox="0 0 47 46"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M43.3516 2.83008H17.4766C16.7148 2.83232 15.9848 3.13593 15.4461 3.67462C14.9074 4.2133 14.6038 4.94327 14.6016 5.70508V25.8301C14.6038 26.5919 14.9074 27.3219 15.4461 27.8605C15.9848 28.3992 16.7148 28.7028 17.4766 28.7051H43.3516C44.1134 28.7028 44.8433 28.3992 45.382 27.8605C45.9207 27.3219 46.2243 26.5919 46.2266 25.8301V5.70508C46.2243 4.94327 45.9207 4.2133 45.382 3.67462C44.8433 3.13593 44.1134 2.83232 43.3516 2.83008ZM43.3516 25.8301H17.4766V5.70508H43.3516V25.8301Z"
														fill="white"
													/>
													<path
														d="M28.7969 34.7734H8.67188V20.3984H11.5469V17.5234H8.67188C7.91007 17.5257 7.1801 17.8293 6.64141 18.368C6.10273 18.9067 5.79911 19.6366 5.79688 20.3984V34.7734C5.79911 35.5352 6.10273 36.2652 6.64141 36.8039C7.1801 37.3426 7.91007 37.6462 8.67188 37.6484H28.7969C29.5587 37.6462 30.2887 37.3426 30.8273 36.8039C31.366 36.2652 31.6696 35.5352 31.6719 34.7734V31.8984H28.7969V34.7734Z"
														fill="white"
													/>
												</svg>
											</Button>
										</div>
									</motion.div>
								))}
							</div>
						</div>
					</Step>

					{/* --------------------------------------Launch Your Pool----------------------------------------------------- */}
					<Step>
						<div className="flex flex-col items-center justify-center w-full gap-8">
							<span className="text-3xl font-orbitron text-white mb-4">
								Launch Your Pool
							</span>

							<div className="glass-component-3 p-8 rounded-2xl w-3/4">
								<p className="text-gray-200 text-center mb-8">
									You&apos;re about to create a new launchpool on the
									blockchain. This action is irreversible and will require a
									transaction signature with your connected wallet.
								</p>

								<div className="mb-8 flex flex-col gap-4">
									<h4 className="text-white font-orbitron text-xl">
										Transaction Summary
									</h4>
									<div className="glass-component-2 p-4 rounded-xl">
										<div className="flex justify-between text-gray-300 mb-2">
											<span>Token Address:</span>
											<span className="font-mono text-blue-400">
												{projectTokenAddress.substring(0, 12)}...
												{projectTokenAddress.substring(
													projectTokenAddress.length - 6
												)}
											</span>
										</div>
										<div className="flex justify-between text-gray-300 mb-2">
											<span>Pools Created:</span>
											<span>{pool.length}</span>
										</div>
										<div className="flex justify-between text-gray-300 mb-2">
											<span>Emission Phases:</span>
											<span>
												{Object.values(poolData).reduce(
													(total, pool) => total + (pool.phases?.length || 0),
													0
												)}
											</span>
										</div>

										{/* Token Allowance Status */}
										{tokenAllowanceStatus === 'success' && (
											<div className="flex justify-between text-gray-300 mb-2">
												<span>Token Allowance:</span>
												{isApprovalNeeded ? (
													<span className="text-red-400">
														Approval required
													</span>
												) : (
													<span className="text-green-400">Sufficient</span>
												)}
											</div>
										)}
									</div>
								</div>

								{/* Get the current transaction state */}
								{(() => {
									const txState = getTransactionState()

									return (
										<>
											{/* Approval Status and Error Display */}
											{txState.showApprovalSection && (
												<div className="glass-component-2 p-4 rounded-xl mb-6">
													<div className="text-white text-sm mb-3">
														<p className="font-medium mb-2">
															Token approval required before creating launchpool
														</p>
														<p className="text-gray-300 text-xs">
															You need to approve the contract to use your
															tokens first. This is a one-time transaction that
															allows the contract to transfer tokens from your
															wallet when creating the launchpool.
														</p>
													</div>

													{approvalError && (
														<div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-3 text-xs text-red-300">
															{approvalError}
														</div>
													)}

													{isApprovalComplete && (
														<div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-3 text-xs text-green-300">
															Approval successful! You can now create the
															launchpool.
														</div>
													)}

													{txState.showApprovalButton && (
														<Button
															onClick={handleTokenApproval}
															disabled={txState.approvalButtonDisabled}
															className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 mb-3"
														>
															<span className="font-bold flex items-center justify-center">
																{txState.approvalButtonText}
																{txState.showApprovalSpinner && (
																	<Spinner heightWidth={5} className="ml-2" />
																)}
															</span>
														</Button>
													)}
												</div>
											)}

											{/* Main action button */}
											<div className="w-full">
												<div
													className={`rounded-xl p-4 ${
														txState.status === 'ready' ||
														txState.status === 'needs-approval'
															? 'bg-blue-900/20 border border-blue-800/40'
															: txState.status === 'error'
																? 'bg-red-900/20 border border-red-800/40'
																: txState.status === 'success'
																	? 'bg-green-900/20 border border-green-800/40'
																	: 'bg-purple-900/20 border border-purple-800/40'
													}`}
												>
													<div className="flex items-center">
														{/* Status icon */}
														{txState.status === 'submitting' ||
														txState.status === 'confirming' ||
														txState.status === 'indexing' ? (
															<Spinner heightWidth={5} className="mr-3" />
														) : txState.status === 'error' ? (
															<svg
																className="w-5 h-5 mr-3 text-red-400"
																fill="none"
																stroke="currentColor"
																viewBox="0 0 24 24"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth="2"
																	d="M12 8v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
																/>
															</svg>
														) : txState.status === 'success' ? (
															<svg
																className="w-5 h-5 mr-3 text-green-400"
																fill="none"
																stroke="currentColor"
																viewBox="0 0 24 24"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth="2"
																	d="M5 13l4 4L19 7"
																/>
															</svg>
														) : (
															<svg
																className="w-5 h-5 mr-3 text-blue-400"
																fill="none"
																stroke="currentColor"
																viewBox="0 0 24 24"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																/>
															</svg>
														)}

														{/* Status text */}
														<span
															className={`text-sm ${
																txState.status === 'error'
																	? 'text-red-300'
																	: txState.status === 'success'
																		? 'text-green-300'
																		: 'text-gray-300'
															}`}
														>
															{((
																status: string,
																errorMessage: string | null
															): string => {
																switch (status) {
																	case 'ready':
																		return 'Ready to create launchpool'
																	case 'needs-approval':
																		return 'Token approval required before proceeding'
																	case 'approving':
																		return 'Approving token usage...'
																	case 'submitting':
																		return 'Submitting transaction...'
																	case 'confirming':
																		return 'Confirming transaction...'
																	case 'indexing':
																		return 'Indexing data...'
																	case 'error':
																		return errorMessage || 'Transaction failed'
																	case 'success':
																		return 'Launchpool created successfully'
																	default:
																		return 'Processing...'
																}
															})(txState.status, finalError)}
														</span>
													</div>
												</div>
											</div>

											{/* Status message based on current state */}
											{['processing', 'indexing', 'confirming'].includes(
												txState.status
											) && (
												<p className="text-gray-400 text-xs text-center mt-3">
													Please wait while your transaction is being
													processed...
												</p>
											)}

											{txState.status === 'success' && (
												<p className="text-green-400 text-xs text-center mt-3">
													Launchpool created successfully!
												</p>
											)}

											{txState.status === 'error' && finalError && (
												<p className="text-red-400 text-xs text-center mt-3">
													{finalError}
												</p>
											)}
										</>
									)
								})()}
							</div>
						</div>
					</Step>
				</Stepper>
			</div>

			{/* --------------------------------------Emission Rate Modal----------------------------------------------------- */}
			<Modal
				className="w-full max-w-[1200px] sm:max-w-[1000px] px-4 sm:px-6 mx-5"
				open={isOpenEmissionRate}
				onClose={handleCloseEmissionRateModal}
			>
				<div className="h-full w-full p-3 sm:p-5 text-white overflow-y-auto max-h-[80vh]">
					<div>
						{selectedPoolId && <SteplineChart poolId={selectedPoolId} />}
					</div>
					<div className="flex flex-col gap-3 sm:gap-5 mt-3 sm:mt-5">
						<Button
							onClick={() => selectedPoolId && handleAddPhase(selectedPoolId)}
							className="h-12 w-12 sm:h-16 sm:w-16 rounded-full glass-component-3 flex items-center justify-center mx-auto sm:mx-0"
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 46 46"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="sm:w-9 sm:h-9"
							>
								<path
									d="M23 3V43"
									stroke="white"
									strokeWidth="5"
									strokeLinecap="round"
								/>
								<path
									d="M3 23L43 23"
									stroke="white"
									strokeWidth="5"
									strokeLinecap="round"
								/>
							</svg>
						</Button>
						<div className="flex flex-wrap gap-2 sm:gap-3 w-full">
							{selectedPoolId && poolData[selectedPoolId]?.phases ? (
								poolData[selectedPoolId].phases.map((phase, index) => (
									<motion.div
										key={phase.id}
										initial={{ opacity: 0, y: 50 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5 }}
										className="glass-component-3 h-auto p-3 sm:p-4 pt-8 sm:pt-10 rounded-xl flex items-center justify-center flex-col gap-2 relative w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)]"
									>
										<Button
											onClick={() => handleOpenConfirmModal(phase.id, 'phase')}
											className="absolute top-2 sm:top-5 right-2 sm:right-5 glass-component-3 px-2 sm:px-3 py-1 text-sm sm:text-base"
										>
											X
										</Button>
										<div className="w-full flex flex-col gap-2 sm:gap-3 p-1 sm:p-2">
											<span className="font-orbitron text-base sm:text-lg">
												Emitted tokens for this period
											</span>
											<div className="relative w-full">
												<input
													type="number"
													value={phase.tokenAmount || ''}
													onChange={(e) =>
														handleChangeEmissionRate(
															selectedPoolId,
															phase.id,
															'tokenAmount',
															e.target.value
														)
													}
													placeholder="Enter emission rate"
													className="p-2 sm:p-3   rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-xs sm:text-sm"
												/>
												{/* <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-xs sm:text-sm">
													%
												</span> */}
											</div>
										</div>
										<div className="w-full flex flex-col gap-2 sm:gap-3 p-1 sm:p-2">
											<span className="font-orbitron text-base sm:text-lg">
												From
											</span>
											<input
												type="datetime-local"
												value={formatDateTimeLocal(phase.from) || ''}
												onChange={(e) =>
													handleChangeEmissionRate(
														selectedPoolId,
														phase.id,
														'from',
														e.target.value
													)
												}
												placeholder="Enter start date"
												className="p-2 sm:p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-xs sm:text-sm"
											/>
										</div>
										<div className="w-full flex flex-col gap-2 sm:gap-3 p-1 sm:p-2">
											<span className="font-orbitron text-base sm:text-lg">
												To
											</span>
											<input
												type="datetime-local"
												value={formatDateTimeLocal(phase.to) || ''}
												onChange={(e) =>
													handleChangeEmissionRate(
														selectedPoolId,
														phase.id,
														'to',
														e.target.value
													)
												}
												placeholder="Enter end date"
												className="p-2 sm:p-3 rounded-xl font-comfortaa text-white glass-component-2 focus:outline-none w-full text-xs sm:text-sm"
											/>
										</div>
									</motion.div>
								))
							) : (
								<div className="w-full text-center py-6">
									<p className="font-comfortaa text-white opacity-70">
										No phases created yet. Click the plus button to add a phase.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</Modal>

			{/* --------------------------------------Confirm Modal----------------------------------------------------- */}

			<Modal
				className=""
				open={isConfirming.open}
				onClose={handleCloseConfirmModal}
			>
				<h3 className="text-lg font-semibold text-white">
					Do you want to delete this{' '}
					{isConfirming.type === 'pool' ? 'pool' : 'phase'}?
				</h3>
				<div className="flex justify-between mt-4">
					<Button
						onClick={handleCloseConfirmModal}
						className="bg-gray-500 text-white px-4 py-2 rounded-full"
					>
						No
					</Button>
					<Button
						onClick={handleConfirmRemove}
						className="warm-cool-bg text-white px-4 py-2 rounded-full"
					>
						Yes
					</Button>
				</div>
			</Modal>

			{/* --------------------------------------Transaction Status Modal----------------------------------------------------- */}
			<TransactionStatusModal
				isOpen={isTransactionStatusModalOpen}
				onClose={() => setIsTransactionStatusModalOpen(false)}
				isTransactionPending={selfMultiCallReceiptStatus === 'pending'}
				isWaitingForIndexer={false}
				isLaunchpoolCreated={selfMultiCallReceiptStatus === 'success'}
				finalError={finalError}
				txHash={selfMultiCallHash || ''}
			/>

			{/* --------------------------------------Access Control Modal - Only PO is allowed to use this page----------------------------------------------------- */}
			<AccessLockedModal
				isOpen={!account.isConnected || !isProjectOwner}
				title={
					!account.isConnected
						? 'Wallet Connection Required'
						: 'Project Owner Account Required'
				}
				description={
					!account.isConnected
						? 'Please connect your wallet using the wallet button in the navigation bar to create a launchpool. This allows us to verify your ownership of the project and handle token approvals.'
						: 'You are not the owner of this project. Please connect to owner account to access create launchpool functionality.'
				}
			/>

			{/* --------------------------------------Toast----------------------------------------------------- */}
			<ToastContainer
				position="top-right"
				autoClose={4000}
				hideProgressBar={true}
			/>
		</div>
	)
}
