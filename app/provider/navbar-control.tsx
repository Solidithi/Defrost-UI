'use client'

import { createContext } from 'react'
import { useState, useContext } from 'react'

interface NavBarControlContextType {
	isNavbarShown: boolean
	setIsNavbarShown: (isShown: boolean) => void
	toggleIsNavbarShow: () => void
}

const NavBarControlContext = createContext<
	NavBarControlContextType | undefined
>(undefined)

export function NavBarControlProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [isShown, setIsShown] = useState(false)

	return (
		<NavBarControlContext.Provider
			value={{
				isNavbarShown: isShown,
				setIsNavbarShown: (isShown: boolean) => setIsShown(isShown),
				toggleIsNavbarShow: () => setIsShown((prev) => !prev),
			}}
		>
			{children}
		</NavBarControlContext.Provider>
	)
}

export function useNavBarControl() {
	const context = useContext(NavBarControlContext)
	if (context === undefined) {
		throw new Error('useNavBarControl must be used within a NavBarProvider')
	}
	return context
}
