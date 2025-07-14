import { useContext } from 'react'
import { AppKitContext } from '@/app/provider/appkit'

// Util hook to use AppKit context
export const useAppKit = () => {
	const context = useContext(AppKitContext)

	if (!context) {
		throw new Error('useAppKit must be used within an AppKitProvider')
	}
	return context
}
