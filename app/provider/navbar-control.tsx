'use client'

import { createContext } from 'react'
import { useState, useContext } from 'react'

interface NavBarControlContextType {
	isNavbarShown: boolean
	setIsNavbarShown: (isShown: boolean) => void
	toggleIsNavbarShow: () => void
	reactToScroll: boolean // For cases when we want the navbar to get the f* outta the way at all cost
	setReactToScroll: (isHidden: boolean) => void
}

const NavBarControlContext = createContext<
	NavBarControlContextType | undefined
>(undefined)

export function NavBarControlProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [isNavbarShown, setIsNavbarShown] = useState(true)
	const [reactToScroll, setReactToScroll] = useState(true)

	return (
		<NavBarControlContext.Provider
			value={{
				isNavbarShown,
				setIsNavbarShown,
				toggleIsNavbarShow: () => setIsNavbarShown((prev) => !prev),
				reactToScroll,
				setReactToScroll,
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
