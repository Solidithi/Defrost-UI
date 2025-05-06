import {
	useReadContract,
	useWaitForTransactionReceipt,
	useWriteContract,
} from 'wagmi'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { abi as ERC20ABI } from '@/abi/ERC20.json'
import { abi as launchpoolABI } from '@/abi/Launchpool.json'

const defaultState = {
	approval: {
		approve: () => {},
		isApprovalNeeded: false,
		approveStatus: 'idle',
		approveError: null,
		approveTxHash: null,
		isConfirmingApproval: false,
		allowance: null,
		readAllowanceStatus: 'idle',
		readAllowanceError: null,
	},
	deposit: {
		deposit: () => {},
		depositStatus: 'idle',
		depositError: null,
		depositTxHash: null,
		isDepositStarted: false,
	},
}

export function useApproveAndeDepositToken({
	depositFunctionABI,
	depositFunctionName,
	depositFunctionArgs,
	tokenAddress,
	recipientAddress,
	amount,
}: {
	depositFunctionABI: any
	depositFunctionName: string
	depositFunctionArgs: any[]
	tokenAddress: `0x${string}`
	recipientAddress: `0x${string}`
	amount: bigint
}) {
	const { address: userAddress } = useAccount()

	// Check if we need approval
	const [isApprovalNeeded, setIsApprovalNeeded] = useState(false)
	const [isConfirmingApproval, setIsConfirmingApproval] = useState(false)
	const [isDepositStarted, setIsDepositStarted] = useState(false)

	const {
		data: allowance,
		status: readAllowanceStatus,
		error: readAllowanceError,
	} = useReadContract({
		abi: ERC20ABI,
		address: tokenAddress,
		functionName: 'allowance',
		args: [userAddress, recipientAddress],
	})

	// Effect to check if approval is needed
	useEffect(() => {
		console.log('Allowance:', allowance)
		console.log('Requested amount:', amount)
		if (readAllowanceStatus === 'success' && allowance) {
			if (allowance && (allowance as bigint) < amount) {
				setIsApprovalNeeded(true)
			} else {
				setIsApprovalNeeded(false)
			}
		}
	}, [readAllowanceStatus, allowance, amount])

	// Define write contract actions
	const {
		writeContractAsync: callApprove,
		status: approveStatus,
		error: approveError,
		data: approveTxHash,
	} = useWriteContract({})
	const { status: approveConfirmStatus } = useWaitForTransactionReceipt({
		hash: approveTxHash,
	})
	const {
		writeContractAsync: callDeposit,
		status: depositStatus,
		error: depositError,
		data: depositTxHash,
	} = useWriteContract({})

	const approve = async () => {
		await callApprove({
			abi: ERC20ABI,
			address: tokenAddress,
			functionName: 'approve',
			args: [recipientAddress, amount],
		})
	}

	const deposit = async () => {
		if (isApprovalNeeded) {
			await approve()
		}

		setIsDepositStarted(true)
	}

	useEffect(() => {
		if (!isDepositStarted) return

		if (isApprovalNeeded) {
			console.log('Approval needed, waiting for approval...')
			if (approveStatus === 'pending') {
				console.log('Approving...')
				return
			} else if (approveStatus === 'error') {
				console.error('Approve error:', approveError)
				setIsDepositStarted(false)
				return
			} else {
				console.log('Approve tx sent! Now waiting for confirmation...')
				setIsApprovalNeeded(false)
			}
		}

		if (isApprovalNeeded && approveConfirmStatus === 'pending') {
			console.log('Waiting for approve confirmation...')
			setIsConfirmingApproval(true)
		} else if (approveConfirmStatus === 'error') {
			console.error('Approve confirmation failed:', approveError)
			setIsConfirmingApproval(false)
		} else {
			setIsConfirmingApproval(false)

			// IMPORTANNT: Call the deposit function in contract
			callDeposit({
				abi: depositFunctionABI,
				address: recipientAddress,
				functionName: depositFunctionName,
				args: depositFunctionArgs,
			})
		}
	}, [isDepositStarted, approveStatus, approveConfirmStatus])

	useEffect(() => {
		if (depositStatus === 'pending') console.log('Depositing...')
		else if (depositStatus === 'error') {
			console.error('Deposit error:', depositError)
			setIsDepositStarted(false)
		} else if (depositStatus === 'success') {
			console.log('Deposit successful!')
			setIsDepositStarted(false)
		}
	}, [depositStatus])

	return {
		approval: {
			approve,
			isApprovalNeeded,
			approveStatus,
			approveError,
			approveTxHash,
			isConfirmingApproval,

			allowance,
			readAllowanceStatus,
			readAllowanceError,
		},
		deposit: {
			deposit,
			depositStatus,
			depositError,
			depositTxHash,
			isDepositStarted,
		},
	}
}
