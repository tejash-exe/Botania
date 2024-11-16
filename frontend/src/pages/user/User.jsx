import React, { useEffect } from 'react'
import Sidenavbar from '../../components/Sidenavbar'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Bottomnavbar from '../../components/Bottomnavbar'

const user = () => {
    return (
        <>
            <div className='pt-[4rem] sm:pb-[2rem] pb-[4rem] flex box-border w-screen h-screen overflow-hidden'>
                <Sidenavbar />
                <Outlet />
            </div>
        </>
    )
}

export default user
