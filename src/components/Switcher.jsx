'use client'
import { usePathname } from 'next/navigation'
import React from 'react'
import GlobalNavbar from './Navbar'


function Switcher() {
    const pathname = usePathname()

    return (
        <>
            {!pathname.includes("/auth") && <GlobalNavbar />}
        </>
    )
}

export default Switcher