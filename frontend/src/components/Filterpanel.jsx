import React from 'react';

const Filterpanel = (props) => {
    return (
        <div className='md:w-1/5 max-w-[300px] md:min-w-[210px] sm:block hidden border-r h-screen overflow-hidden z-10'>
            <div className='flex flex-col items-start'>
            <div className='ml-4 mt-5'>Sort by:</div>
            <button onClick={() => props.setsearchby('Recently added')} className={' border-green-700 px-3 ml-4 my-1 py-2 border-2 rounded-xl duration-200' + ((props.searchby === 'Recently added') ? ' bg-green-700 text-white hover:bg-green-700 ' : ' hover:bg-green-700/10 ' )}>Recently added</button>
            <button onClick={() => props.setsearchby('Price: High to low')} className={' border-green-700 px-3 ml-4 my-1 py-2 border-2 rounded-xl duration-200' + ((props.searchby === 'Price: High to low') ? ' bg-green-700 text-white hover:bg-green-700 ' : ' hover:bg-green-700/10 ') }>Price: High to low</button>
            <button onClick={() => props.setsearchby('Price: Low to high')} className={' border-green-700 px-3 ml-4 my-1 py-2 border-2 rounded-xl duration-200' + ((props.searchby === 'Price: Low to high') ? ' bg-green-700 text-white hover:bg-green-700 ' : ' hover:bg-green-700/10 ' )}>Price: Low to high</button>
            <button onClick={() => props.setsearchby('Most ordered')} className={' border-green-700 px-3 ml-4 my-1 py-2 border-2 rounded-xl duration-200' + ((props.searchby === 'Most ordered') ? ' bg-green-700 text-white hover:bg-green-700 ' : ' hover:bg-green-700/10 ' )}>Most ordered</button>
            <button onClick={() => props.setsearchby('Avg. customer reviews')} className={' border-green-700 px-3 ml-4 my-1 py-2 border-2 rounded-xl duration-200' + ((props.searchby === 'Avg. customer reviews') ? ' bg-green-700 text-white hover:bg-green-700 ' : ' hover:bg-green-700/10 ' )}>Avg. customer reviews</button>
            </div>
        </div>
    )
};

export default Filterpanel;
