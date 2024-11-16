import React, { createContext, useEffect, useState } from 'react';

export const AppContext = createContext(" ");

export const AppProvider = ({ children }) => { 
  const [isAuth, setisAuth] = useState(JSON.parse(localStorage.getItem("isAuth")) || false);
  const [redirect, setredirect] = useState('/home');

  useEffect(() => {
    localStorage.setItem("isAuth",JSON.stringify(isAuth));
  }, [isAuth]);

  return (
    <AppContext.Provider value={{ isAuth, setisAuth , redirect ,setredirect}}>
      {children}
    </AppContext.Provider>
  );
};
