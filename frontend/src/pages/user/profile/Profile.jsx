import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '../../../context/context'

const Profile = () => {
    const { setisAuth, isAuth } = useContext(AppContext);
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const picture = localStorage.getItem("picture");
    const handleLogout = async (e) => {
        e.preventDefault();
        const response = await fetch("/users/logout",{
            method: "POST"
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            if(res.status == 400){
                setisAuth(false);
                localStorage.clear();
            }
        })
        .catch(error => {
            console.log(error)
            setisAuth(false);
            localStorage.clear();
        })
    };
    return (
        <>
            <div className='overflow-auto flex-1 flex-col items-center'>
                {isAuth ? <>
                    <div className='lg:mx-20 sm:mx-10 mx-5'><div className='font-bold pb-2 mt-6'>Profile info:</div>
                        <div className='bg-gray-100 flex flex-wrap items-center rounded-xl  sm:p-10 p-4 box-border'>
                            <div className='overflow-hidden sm:h-[6rem] h-20 w-20 sm:w-[6rem] rounded-full my-2'>
                                <img className='hover:scale-105 object-cover duration-200 sm:h-[6rem] sm:w-[6rem]' src={picture ? picture : '/user.png'}></img>
                            </div>
                            <div className='px-4 my-2'>
                                <div className='pb-2'>{name &&
                                    <div className='font-bold sm:text-base text-sm text-nowrap'>Name: <span className='font-normal'>{name}</span></div>
                                }</div>
                                <div>{email &&
                                    <div className='font-bold sm:text-base text-sm text-nowrap'>Email: <span className='font-normal'>{email}</span></div>
                                }</div>
                            </div>
                        </div>
                        <div className='flex justify-end'>
                            <Link to="/updateprofile" className='mr-4 px-3 py-2 rounded-md bg-green-700 text-white hover:bg-green-800 duration-200 mt-2 active:scale-95'>Update profile</Link>
                            <button className='px-3 py-2 rounded-md bg-red-400 text-white hover:bg-red-600 duration-200 mt-2 active:scale-95' onClick={handleLogout}>Log out</button>
                        </div>
                    </div>
                    <div className='lg:mx-20 sm:mx-10 mx-5 mb-10'>
                        <div className='font-bold pb-2 mt-6'>My Addresses:</div>
                        <div className='bg-gray-100 flex flex-col rounded-xl sm:px-10 sm:py-8 p-4 box-border'>
                            <div className='sm:mb-4 my-4 flex'>
                                <Link to="" className='px-3 py-2 rounded-md bg-green-700 text-white hover:bg-green-800 duration-200 active:scale-95 '>+ Add new address</Link>
                            </div>
                            <div className='flex my-2 border-b-2 bg-white border-l-2 border-gray-200 p-4 rounded-lg'>
                                <div className='sm:mr-6 sm:ml-4 mx-3 mt-3'><FontAwesomeIcon className='sm:h-[2rem] sm:w-[2rem] text-red-600' icon={faLocationDot} /></div>
                                <div className='text-ellipsis ml-4'>
                                    <div className='font-bold'>Default address</div>
                                    <div className='text-sm sm:text-base font-semibold'>College</div>
                                    <div className='text-sm sm:text-base text-gray-500'>Hostel E, NIT Jamshedpur, Adityapur, Jharkhand</div>
                                    <div className='text-sm sm:text-base text-gray-500'>PIN: 831014</div>
                                </div>
                            </div>
                            <div className='flex my-2 border-b-2 bg-white border-l-2 border-gray-200 p-4 rounded-lg'>
                                <div className='sm:mr-6 sm:ml-4 mx-3 mt-3'><FontAwesomeIcon className='sm:h-[2rem] sm:w-[2rem] text-red-600' icon={faLocationDot} /></div>
                                <div className='text-ellipsis ml-4'>
                                    <div className='text-sm sm:text-base font-semibold'>Home</div>
                                    <div className='text-sm sm:text-base text-gray-500'>SRT-253, ACC Colony Jhinkpani, Jharkhand</div>
                                    <div className='text-sm sm:text-base text-gray-500'>PIN: 833215</div>
                                </div>
                            </div>
                            <div className='flex my-2 border-b-2 bg-white border-l-2 border-gray-200 p-4 rounded-lg'>
                                <div className='sm:mr-6 sm:ml-4 mx-3 mt-3'><FontAwesomeIcon className='sm:h-[2rem] sm:w-[2rem] text-red-600' icon={faLocationDot} /></div>
                                <div className='text-ellipsis ml-4'>
                                    <div className='text-sm sm:text-base font-semibold'>College</div>
                                    <div className='text-sm sm:text-base text-gray-500'>Hostel E, NIT Jamshedpur, Adityapur, Jharkhand</div>
                                    <div className='text-sm sm:text-base text-gray-500'>PIN: 831014</div>
                                </div>
                            </div>
                        </div>
                    </div> </> : <div>
                    <div>Hi</div>
                </div>}
            </div>
        </>
    )
}

export default Profile
