import React, { createContext, useEffect, useState } from 'react';

export const AppContext = createContext(" ");

export const AppProvider = ({ children }) => { 

  const backend_url = 'https://botania.onrender.com';
  const frontend_url = 'https://botania-by-aditya.vercel.app';

  //User
  const [isAuth, setisAuth] = useState(JSON.parse(localStorage.getItem("isAuth")) || false);
  const [name, setname] = useState((localStorage.getItem("name")) || "");
  const [email, setemail] = useState((localStorage.getItem("email")) || "");
  const [profilePicture, setprofilePicture] = useState((localStorage.getItem("profilePicture")) || "");
  const [cart, setcart] = useState(JSON.parse(localStorage.getItem("cart")) || []); 
  const [wishlist, setwishlist] = useState(JSON.parse(localStorage.getItem("wishlist")) || []); 
  const [address, setaddress] = useState(JSON.parse(localStorage.getItem("address")) || {});
  const [products, setproducts] = useState(JSON.parse(localStorage.getItem("products")) || []); 
  const [redirect, setredirect] = useState(localStorage.getItem("redirect") || '/user/searchresults/%20');
  const [isAddressChanged, setisAddressChanged] = useState(false);
  
  //Seller
  const [issellerAuth, setissellerAuth] = useState(JSON.parse(localStorage.getItem("issellerAuth")) || false);
  const [sellerredirect, setsellerredirect] = useState(localStorage.getItem("sellerredirect") || '/seller/account/profile');
  const [isProductAdded, setisProductAdded] = useState(false);
  const [isProductUpdated, setisProductUpdated] = useState(false);
  const [issellerAddressChanged, setissellerAddressChanged] = useState(false);

  //Seller
  useEffect(() => {
    localStorage.setItem("sellerredirect", (sellerredirect));
  }, [sellerredirect]);
  
  useEffect(() => {
    localStorage.setItem("issellerAuth", JSON.stringify(issellerAuth));
  }, [issellerAuth]);
  
  //User
  useEffect(() => {
    localStorage.setItem("isAuth", JSON.stringify(isAuth));
  }, [isAuth]);
  
  useEffect(() => {
    localStorage.setItem("name", (name));
  }, [name]);
  
  useEffect(() => {
    localStorage.setItem("email", (email));
  }, [email]);
  
  useEffect(() => {
    localStorage.setItem("profilePicture", (profilePicture));
  }, [profilePicture]);
  
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart)); // Save as JSON
  }, [cart]);
  
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist)); // Save as JSON
  }, [wishlist]);
  
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products)); // Save as JSON
  }, [products]);
  
  useEffect(() => {
    localStorage.setItem("address", JSON.stringify(address)); // Save as JSON
  }, [address]);

  useEffect(() => {
    localStorage.setItem("redirect", (redirect));
  }, [redirect]);

  return (
    <AppContext.Provider value={{ 
      
      backend_url,
      frontend_url,

      //Seller
      issellerAuth, 
      setissellerAuth, 
      sellerredirect,
      setsellerredirect,
      isProductAdded,
      setisProductAdded,
      isProductUpdated,
      setisProductUpdated,
      issellerAddressChanged,
      setissellerAddressChanged,
      
      //User
      isAuth, 
      setisAuth, 
      redirect,
      setredirect,
      name, 
      setname,
      email, 
      setemail,
      profilePicture, 
      setprofilePicture,
      cart, 
      setcart,
      wishlist, 
      setwishlist,
      products,
      setproducts,
      address, 
      setaddress,
      isAddressChanged,
      setisAddressChanged,
    }}>
      {children}
    </AppContext.Provider>
  );
};
