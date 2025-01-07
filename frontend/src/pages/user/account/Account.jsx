import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidenavbar from '../../../components/Sidenavbar';

const Account = () => {

    return (
        <>
            <div className='pt-[4rem] sm:pb-0 pb-[4rem] flex box-border w-screen h-screen overflow-hidden'>
                <Sidenavbar />
                <Outlet />   
            </div>
        </>
    )
};

export default Account;