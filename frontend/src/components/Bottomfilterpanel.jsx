import React, { useEffect, useRef, useState } from 'react';
import './bottomfilterpanel.css';

const Bottomfilterpanel = (props) => {

    //Popup
    const filterpanelRef = useRef();
    const filterpanelmenuRef = useRef();
    const [filtermenu, setfiltermenu] = useState(false);

    const filterpanelclick = () => {
        setfiltermenu((prevFiltermenu) => !prevFiltermenu);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                filterpanelRef.current &&
                !filterpanelRef.current.contains(e.target) &&
                filterpanelmenuRef.current &&
                !filterpanelmenuRef.current.contains(e.target)
            ) {
                setfiltermenu(false);
            }
        };

        if (filtermenu) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [filtermenu]);


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
        <div ref={filterpanelRef} onClick={filterpanelclick} className={'fixed z-30 bottom-[4rem] h-[4rem] w-screen flex items-center justify-center border-t sm:hidden text-sm' + ((filtermenu) ? ' bg-gray-50 ' : " bg-white ")}>
            {filtermenu &&
                <div id='filtermenu' ref={filterpanelmenuRef} onClick={(e) => e.stopPropagation()} className='fixed flex bottom-[8rem] w-screen bg-gray-50 border-t'>
                    <div className='flex flex-col w-1/2 items-center border-r'>
                        <button onClick={() => props.setsearchby('Recently added')} className={' border-green-700 w-5/6 px-3 mx-4 mb-2 mt-6 py-3 border-2 rounded-xl duration-200' + ((props.searchby === 'Recently added') ? ' bg-green-700 text-white hover:bg-green-700 ' : ' hover:bg-green-700/10 ')}>Recently added</button>
                        <button onClick={() => props.setsearchby('Price: High to low')} className={' border-green-700 w-5/6 px-3 mx-4 my-2 py-3 border-2 rounded-xl duration-200' + ((props.searchby === 'Price: High to low') ? ' bg-green-700 text-white hover:bg-green-700 ' : ' hover:bg-green-700/10 ')}>Price: High to low</button>
                        <button onClick={() => props.setsearchby('Price: Low to high')} className={' border-green-700 w-5/6 px-3 mx-4 my-2 py-3 border-2 rounded-xl duration-200' + ((props.searchby === 'Price: Low to high') ? ' bg-green-700 text-white hover:bg-green-700 ' : ' hover:bg-green-700/10 ')}>Price: Low to high</button>
                        <button onClick={() => props.setsearchby('Avg. customer reviews')} className={' border-green-700 w-5/6 px-3 mx-4 mt-2 mb-6 py-3 border-2 rounded-xl duration-200' + ((props.searchby === 'Avg. customer reviews') ? ' bg-green-700 text-white hover:bg-green-700 ' : ' hover:bg-green-700/10 ')}>Avg. customer reviews</button>
                    </div>
                    <div className='w-1/2 flex flex-col items-center'>
                        <div className='flex-col flex w-full items-center justify-end h-full '>
                            <div>
                                <div className='mb-1'>Price: </div>
                                <div className='flex items-center justify-between w-[10rem]'>
                                    <div className='flex flex-col '>
                                        <div>Min:</div>
                                        <input onFocus={(e) => { e.target.select() }} className={' w-[4rem]  border-green-700 px-3 py-2 border-2 rounded-xl duration-200 outline-none '} type="number" name="" id="" value={props.minPrice} onChange={(e) => handleMin(e)} />
                                    </div>
                                    <div className='pt-4 text-xl font-bold'> - </div>
                                    <div className='flex flex-col'>
                                        <div>Max:</div>
                                        <input onFocus={(e) => { e.target.select() }} className={' w-[4rem]  border-green-700 px-3 py-2 border-2 rounded-xl duration-200 outline-none '} type="number" name="" id="" value={props.maxPrice} onChange={(e) => handleMax(e)} />
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center'>
                                <button disabled={props.pricechanges == false} className={((props.pricechanges == false) ? ' bg-white text-black' : ' bg-green-700 text-white ') + ' w-[10rem] rounded-lg border-2 duration-200 border-green-700 px-3 mx-4 mt-2 mb-6 py-3'} onClick={startSearch} >Search results</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className='flex items-center w-full'>
                <div className='w-1/2 flex justify-center items-center border-r h-full'>
                    <div>Sort by : {props.searchby}</div>
                </div>
                <div className='w-1/2 flex justify-center items-center'>
                    <div>Price : Rs.{props.prevminPrice} to {props.prevmaxPrice}</div>
                </div>
            </div>
        </div>
    )
};

export default Bottomfilterpanel;