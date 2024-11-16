import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AppProvider } from './context/context.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/home/Home.jsx';
import Wishlist from './pages/user/wishlist/Wishlist.jsx';
import Cart from './pages/user/cart/Cart.jsx';
import Orders from './pages/user/orders/Orders.jsx';
import Profile from './pages/user/profile/Profile.jsx';
import Searchresults from './pages/searchresults/Searchresults.jsx';
import User from './pages/user/User.jsx';
import LoginRegister from './pages/login-register/LoginRegister.jsx';
import App from './App.jsx';
import ProductPage from './pages/product/id/ProductPage.jsx';
import SellerDashboard from './pages/seller/dashboard/SellerDashboard.jsx';
import SellerProfile from './pages/seller/dashboard/sellerProfile/SellerProfile.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'home',
        element: <Home />
      },
      {
        path: '/user/',
        element: <User />,
        children: [
          {
            path: 'wishlist/',
            element: <Wishlist />
          },
          {
            path: 'profile/',
            element: <Profile />
          },
          {
            path: 'cart/',
            element: <Cart />
          },
          {
            path: 'orders/',
            element: <Orders />
          },
        ],
      },
      {
        path: '/searchresults/:search',
        element: <Searchresults />,
      },
      {
        path: '/product/id/:productid/',
        element: <ProductPage />
      }
    ]
  },
  {
    path: '/user/login-register',
    element: <LoginRegister />
  },
  {
    path: '/seller/dashboard/',
    element: <SellerDashboard />,
    children: [
      {
        path: 'profile',
        element: <SellerProfile/>
      }
    ],
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>,
)
