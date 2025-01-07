import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error = () => {

    const navigate = useNavigate();
    
    return (
        <div className="py-[4rem] flex justify-center items-center h-screen">
            <div className='backdrop-blur-sm shadow-lg mx-2 text-gray-800 bg-white/50 py-8 px-12 rounded-xl'>
                <div className='text-2xl text-center my-2'>Page not Found!!</div>
                <div className='flex justify-center items-center'><button onClick={() => { navigate('/welcome') }} className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 rounded-md bg-green-700/60 hover:bg-green-700/80 text-white duration-200'>Home</button></div>
            </div>
            <div className='-z-10 absolute top-0 overflow-hidden'><img className=' h-screen w-screen object-cover' src="/Flowers8.jpg" alt="" /></div>
        </div>
    )
};

export default Error;