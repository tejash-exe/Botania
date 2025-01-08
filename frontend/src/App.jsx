import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
const App = () => {

  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === '/') {
      navigate('/welcome');
    }
  }, []);

  return (
    <div className=''>
      <Outlet />
    </div>
  )
};

export default App;