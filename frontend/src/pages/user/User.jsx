import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Bottomnavbar from '../../components/Bottomnavbar';

const User = () => {
    return (
        <div>
            <Navbar/>
            <Outlet />
            <Bottomnavbar/>
        </div>
    )
};

export default User;