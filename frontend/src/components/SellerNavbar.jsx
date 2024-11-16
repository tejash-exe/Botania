import React from 'react'

const SellerNavbar = () => {
    return (
        <>
            <div className='text-white px-6 bg-pink-800 h-[4rem] w-screen fixed top-0 left-0 flex items-center justify-between'>
                <div className='font-bold text-3xl'>Botania<span className='text-sm'>.Seller</span></div>
                <div>Greetings, Aditya Choudhary</div>
                <button className=' bg-white/10 hover:scale-105 active:scale-100 duration-200 py-2 px-4 rounded-md'>Logout</button>
            </div>
            {/* <div className='absolute z-[-1] h-screen w-screen overflow-hidden'>
            <img className='min-w-[1400px] object-cover brightness-90' src="/Flowers-rev.jpg" alt="" />
            </div> */}
        </>
    )
}

export default SellerNavbar
