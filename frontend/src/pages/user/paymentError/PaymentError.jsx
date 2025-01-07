import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PaymentError = () => {

    const { reason } = useParams();
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="backdrop-blur-sm shadow-lg mx-2 text-gray-800 bg-white/50 py-8 px-12 rounded-xl">
                <div className="text-2xl text-center my-2 font-bold">Payment unsuccessful!</div>
                <div className="text-center my-2 whitespace-pre-wrap">Reason : {reason}</div>
                <div onClick={() => { navigate('/user/account/profile') }} className="text-center my-2 text-blue-600 underline">go to profile</div>
            </div>
            <div className="-z-10 absolute top-0 overflow-hidden">
                <img className="h-screen w-screen object-cover" src="/Flowers6.jpg" alt="Background" />
            </div>
        </div>
    );
};

export default PaymentError;