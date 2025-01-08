import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/context';

const PaymentSuccess = () => {

    const { setcart } = useContext(AppContext);
    const { orderId } = useParams();
    const { paymentId } = useParams();
    const [count, setCount] = useState(9);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevCount) => {
                if (prevCount <= 1) {
                    clearInterval(interval);
                    navigate('/user/account/orders');
                };
                return prevCount - 1;
            });
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [navigate]);

    useEffect(() => {
        setcart([]);
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="backdrop-blur-sm shadow-lg mx-2 text-gray-800 bg-white/50 py-8 px-12 rounded-xl">
                <div className="text-2xl text-center my-2 font-bold">Payment Successful!</div>
                <div className="text-center my-2">Order ID : {orderId}</div>
                <div className="text-center my-2">Payment ID : {paymentId}</div>
                <div className="text-center my-2">
                    If you are not redirected automatically in {count} seconds, then click "<button className="text-blue-600 underline" onClick={() => { navigate('/user/account/orders') }} >here</button>".
                </div>
            </div>
            <div className="-z-10 absolute top-0 overflow-hidden">
                <img className="h-screen w-screen object-cover" src="/Flowers7.jpg" alt="Background" />
            </div>
        </div>
    );
};

export default PaymentSuccess;