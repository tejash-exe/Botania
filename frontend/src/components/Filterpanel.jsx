import React from 'react';

const Filterpanel = (props) => {

    const handleMin = (e) => {
        let value = e.target.value;
        if (value < 0) value = 0;
        if (value >= 5000) value = 4999;
        props.setminPrice(value);
    };

    const handleMax = (e) => {
        let value = e.target.value;
        if (value < 0) value = 0;
        if (value >= 5000) value = 5000;
        props.setmaxPrice(value);
    };

    const startSearch = () => {
        props.setprevminPrice(props.minPrice);
        props.setprevmaxPrice(props.maxPrice);
        props.fetchProducts();
    };

    return (
        <div className='md:w-1/5 max-w-[300px] md:min-w-[210px] sm:block hidden border-r h-screen overflow-hidden z-10'>
            <div className='flex flex-col items-start'>
                <div className='ml-4 mt-5'>Price: </div>
                <div className='flex-col flex w-full max-w-[13rem]'>
                    <div className='flex items-center justify-between'>
                        <div className='ml-4 flex flex-col '>
                            <div>Min:</div>
                            <input onFocus={(e) => { e.target.select() }} className={' w-[5rem]  border-green-700 px-3 py-2 border-2 rounded-xl duration-200 outline-none '} type="number" name="" id="" value={props.minPrice} onChange={(e) => handleMin(e)} />
                        </div>
                        <div className='pt-4 text-xl font-bold'> - </div>
                        <div className='flex flex-col'>
                            <div>Max:</div>
                            <input onFocus={(e) => { e.target.select() }} className={' w-[5rem]  border-green-700 px-3 py-2 border-2 rounded-xl duration-200 outline-none '} type="number" name="" id="" value={props.maxPrice} onChange={(e) => handleMax(e)} />
                        </div>
                    </div>
                    <div className='flex justify-center items-center'>
                        <button disabled={props.pricechanges == false} className={((props.pricechanges == false) ? ' bg-white text-black' : ' bg-green-700 text-white ') + '  ml-4 rounded-lg border-2 duration-200 flex-grow border-green-700 mt-2 py-2'} onClick={startSearch}>Search results</button>
                    </div>
                </div>
                <div className='ml-4 mt-5'>Sort by:</div>
                <button onClick={() => props.setsearchby('Recently added')} className={' border-green-700 px-3 ml-4 my-1 py-2 border-2 rounded-xl duration-200' + ((props.searchby === 'Recently added') ? ' bg-green-700 text-white hover:bg-green-700 ' : ' hover:bg-green-700/10 ')}>Recently added</button>
                <button onClick={() => props.setsearchby('Price: High to low')} className={' border-green-700 px-3 ml-4 my-1 py-2 border-2 rounded-xl duration-200' + ((props.searchby === 'Price: High to low') ? ' bg-green-700 text-white hover:bg-green-700 ' : ' hover:bg-green-700/10 ')}>Price: High to low</button>
                <button onClick={() => props.setsearchby('Price: Low to high')} className={' border-green-700 px-3 ml-4 my-1 py-2 border-2 rounded-xl duration-200' + ((props.searchby === 'Price: Low to high') ? ' bg-green-700 text-white hover:bg-green-700 ' : ' hover:bg-green-700/10 ')}>Price: Low to high</button>
                <button onClick={() => props.setsearchby('Avg. customer reviews')} className={' border-green-700 px-3 ml-4 my-1 py-2 border-2 rounded-xl duration-200' + ((props.searchby === 'Avg. customer reviews') ? ' bg-green-700 text-white hover:bg-green-700 ' : ' hover:bg-green-700/10 ')}>Avg. customer reviews</button>
            </div>
        </div>
    )
};

export default Filterpanel;