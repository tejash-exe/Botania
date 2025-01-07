import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './context/context.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
//Pages
import App from './App.jsx';
//Welcome
import Welcome from './pages/welcome/Welcome.jsx';
//User
import User from './pages/user/User.jsx';
import Account from './pages/user/account/Account.jsx';
import Profile from './pages/user/account/profile/Profile.jsx';
import CustomerCare from './pages/user/account/customerCare/CustomerCare.jsx';
import Cart from './pages/user/account/cart/Cart.jsx';
import Wishlist from './pages/user/account/wishlist/Wishlist.jsx';
import Searchresults from './pages/user/searchresults/Searchresults.jsx';
import ProductPage from './pages/user/product/id/ProductPage.jsx';
import Orders from './pages/user/account/orders/Orders.jsx';
import OrderDetails from './pages/user/account/orders/orderDetails/OrderDetails.jsx';
import LoginRegister from './pages/user/login-register/LoginRegister.jsx';
import ChangeAddress from './pages/user/changeAddress/ChangeAddress.jsx';
import OrderConfirmation from './pages/user/orderConfirmation/OrderConfirmation.jsx';
import PaymentError from './pages/user/paymentError/PaymentError.jsx';
import PaymentSuccess from './pages/user/paymentSuccess/PaymentSuccess.jsx';
import SellerDetails from './pages/user/sellerDetails/SellerDetails.jsx';
//SELLER
import SellerLoginRegister from './pages/seller/sellerLoginRegister/SellerLoginRegister.jsx';
import SellerAccount from './pages/seller/sellerAccount/SellerAccount.jsx';
import SellerProfile from './pages/seller/sellerAccount/sellerProfile/SellerProfile.jsx';
import ChangeSelleraddress from './pages/seller/changeSelleraddress/ChangeSelleraddress.jsx';
import LinktoRazorpay from './pages/seller/linktoRazorpay/LinktoRazorpay.jsx';
import CreateLinkedAccount from './pages/seller/linktoRazorpay/createLinkedAccount/CreateLinkedAccount.jsx';
import CreateStakeholder from './pages/seller/linktoRazorpay/createStakeholder/CreateStakeholder.jsx';
import RequestRouteConfiguration from './pages/seller/linktoRazorpay/requestRouteConfiguration/RequestRouteConfiguration.jsx';
import UpdateRouteConfiguration from './pages/seller/linktoRazorpay/updateRouteConfiguration/UpdateRouteConfiguration.jsx';
import SellerProducts from './pages/seller/sellerAccount/sellerProducts/SellerProducts.jsx';
import AddProduct from './pages/seller/sellerAccount/sellerProducts/addProduct/AddProduct.jsx';
import UpdateProduct from './pages/seller/sellerAccount/sellerProducts/updateProduct/UpdateProduct.jsx';
import SellerProductPage from './pages/seller/sellerAccount/sellerProducts/sellerProductPage/SellerProductPage.jsx';
import Error from './pages/error/Error.jsx';
import SellerReviews from './pages/seller/sellerAccount/sellerReviews/SellerReviews.jsx';
import SellerOrders from './pages/seller/sellerAccount/sellerOrders/SellerOrders.jsx';
import SellerOrderDetails from './pages/seller/sellerAccount/sellerOrders/SellerOrderDetails/SellerOrderDetails.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // WELCOME
      {
        path: 'welcome/',
        element: <Welcome />
      },
      // USER
      {
        path: 'user/login-register/',
        element: <LoginRegister />
      },
      {
        path: 'user/change-address/',
        element: <ChangeAddress />
      },
      {
        path: 'user/order-confirmation/',
        element: <OrderConfirmation />
      },
      {
        path: 'user/payment-success/:orderId/:paymentId',
        element: <PaymentSuccess />
      },
      {
        path: 'user/payment-error/:reason',
        element: <PaymentError />
      },
      {
        path: 'user/',
        element: <User />,
        children: [
          {
            path: 'account/',
            element: <Account />,
            children: [
              {
                path: 'profile/',
                element: <Profile />
              },
              {
                path: 'wishlist/',
                element: <Wishlist />
              },
              {
                path: 'cart/',
                element: <Cart />
              },
              {
                path: 'orders/',
                element: <Orders />
              },
              {
                path: 'orders/:orderId',
                element: <OrderDetails />
              },
              {
                path: 'customer-care/',
                element: <CustomerCare />
              },
            ]
          },
          {
            path: 'searchresults/:search',
            element: <Searchresults />,
          },
          {
            path: 'product/id/:productid',
            element: <ProductPage />
          },
          {
            path: 'seller/:sellerId',
            element: <SellerDetails />
          },
        ],
      },
      //SELLER
      {
        path: 'seller/login-register/',
        element: <SellerLoginRegister />
      },
      {
        path: 'seller/change-address/',
        element: <ChangeSelleraddress />
      },
      {
        path: 'seller/link-to-razorpay/',
        element: <LinktoRazorpay />
      },
      {
        path: 'seller/link-to-razorpay/create-linked-account',
        element: <CreateLinkedAccount />
      },
      {
        path: 'seller/link-to-razorpay/create-stakeholder',
        element: <CreateStakeholder />
      },
      {
        path: 'seller/link-to-razorpay/request-route-configuration',
        element: <RequestRouteConfiguration />
      },
      {
        path: 'seller/link-to-razorpay/update-route-configuration',
        element: <UpdateRouteConfiguration />
      },
      {
        path: 'seller/account/',
        element: <SellerAccount />,
        children: [
          {
            path: 'profile/',
            element: <SellerProfile />
          },
          {
            path: 'products/',
            element: <SellerProducts />
          },
          {
            path: 'products/:productId',
            element: <SellerProductPage />
          },
          {
            path: 'products/add-product',
            element: <AddProduct />
          },
          {
            path: 'products/update-product/:productId',
            element: <UpdateProduct />
          },
          {
            path: 'reviews/',
            element: <SellerReviews />
          },
          {
            path: 'orders/',
            element: <SellerOrders />
          },
          {
            path: 'orders/:orderId',
            element: <SellerOrderDetails />
          },
        ],
      }
    ]
  },
  {
    path: '*',
    element: <Error />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>,
);