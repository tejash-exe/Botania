import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import './notification.css';

const Notification = (props) => {

    return (
    <div className='fixed z-[1000] w-screen flex justify-center items-center'>
        <div onClick={props.onexit} id='notification' className='top-[5rem] fixed md:w-1/2 w-[90%] h-[4rem] bg-gradient-to-br from-red-400 via-pink-400 to-pink-200 flex items-center justify-center rounded-lg shadow-lg p-1 z-50'>
            <div className='flex-grow bg-white h-full rounded-md flex items-center justify-between'>
                <div className='text-black font-semibold flex-grow bg-white h-full rounded-l-md flex items-center justify-start'>
                    <div className='px-4 md:text-base text-xs'>{props.message}</div>
                </div>
                <div className='pr-1 flex items-center justify-center rounded-r-md bg-white cursor-pointer h-full'>
                    <FontAwesomeIcon className='p-4 rounded-md hover:bg-gray-100' icon={faXmark}/>
                </div>
            </div>
        </div>
    </div>
    )
};

export default Notification;