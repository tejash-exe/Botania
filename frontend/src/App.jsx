import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Bottomnavbar from './components/Bottomnavbar';

const App = () => {
  
  return (
    <div className=''>
      <Navbar/>
      <Outlet/>
      <Bottomnavbar/>
    </div>
  )
}

export default App
