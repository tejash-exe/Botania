import React from 'react'

const Orders = () => {
    return (
        <>
                <div className='overflow-auto flex-1 flex-col items-center'>
                    <div className='bg-yellow-300 lg:mx-20 sm:mx-10 mx-5 my-6 p-4 rounded-3xl pl-6 border-b border-l'>You made 10 orders</div>
                    <div className='flex flex-col lg:mx-20 sm:mx-10 mx-5 mb-10'>
                        <div className='flex border-b md:p-6 px-2 py-4 hover:bg-gray-100 hover:rounded-xl duration-200'>
                            <div className='md:w-[8rem] md:h-[8rem] w-[6rem] h-[6rem] flex-shrink-0 overflow-hidden rounded-lg'>
                                <img src="../plant1.jpg" alt="" />
                            </div>
                            <div className='overflow-hidden mx-4 md:mt-4 mt-2'>
                                <div className='md:text-base text-sm text-ellipsis overflow-hidden text-nowrap font-bold'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius, soluta Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis ducimus consectetur iusto aut pariatur nisi voluptatum unde illo quas? Quaerat.</div>
                                <div className='md:text-base text-sm'>Ordered on 21/06/24</div>
                                <div className='md:text-base text-sm'>₹<span>299</span></div>
                                <div className='md:text-base text-sm'>On the way</div>
                            </div>
                        </div>
                        <div className='flex border-b md:p-6 px-2 py-4 hover:bg-gray-100 hover:rounded-xl duration-200'>
                            <div className='md:w-[8rem] md:h-[8rem] w-[6rem] h-[6rem] flex-shrink-0 overflow-hidden rounded-lg'>
                                <img src="../plant1.jpg" alt="" />
                            </div>
                            <div className='overflow-hidden mx-4 md:mt-4 mt-2'>
                                <div className='md:text-base text-sm text-ellipsis overflow-hidden text-nowrap font-bold'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius, soluta Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis ducimus consectetur iusto aut pariatur nisi voluptatum unde illo quas? Quaerat.</div>
                                <div className='md:text-base text-sm'>Ordered on 21/06/24</div>
                                <div className='md:text-base text-sm'>₹<span>299</span></div>
                                <div className='md:text-base text-sm'>On the way</div>
                            </div>
                        </div>
                        <div className='flex border-b md:p-6 px-2 py-4 hover:bg-gray-100 hover:rounded-xl duration-200'>
                            <div className='md:w-[8rem] md:h-[8rem] w-[6rem] h-[6rem] flex-shrink-0 overflow-hidden rounded-lg'>
                                <img src="../plant1.jpg" alt="" />
                            </div>
                            <div className='overflow-hidden mx-4 md:mt-4 mt-2'>
                                <div className='md:text-base text-sm text-ellipsis overflow-hidden text-nowrap font-bold'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius, soluta Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis ducimus consectetur iusto aut pariatur nisi voluptatum unde illo quas? Quaerat.</div>
                                <div className='md:text-base text-sm'>Ordered on 21/06/24</div>
                                <div className='md:text-base text-sm'>₹<span>299</span></div>
                                <div className='md:text-base text-sm'>On the way</div>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    )
}

export default Orders
