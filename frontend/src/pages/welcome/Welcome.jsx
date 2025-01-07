import React from 'react'
import Navbar from '../../components/Navbar'
import Bottomnavbar from '../../components/Bottomnavbar'
import { useNavigate } from 'react-router-dom'

const Welcome = () => {
  const navigate = useNavigate();
  const gotosearch = () => {
    navigate('/user/searchresults/%20');
  };

  return (
    <>
      <div className='mt-[4rem] '>
        <div className='overflow-hidden w-full h-auto flex flex-col justify-center'>
          <img src='/Flowers.jpg' className='w-full fixed top-0 min-w-[1400px]' />
          <div className='absolute top-1/3 w-full left-0 overflow-hidden'>
            <div className='justify-center p-4 mb-6 flex items-end flex-wrap '>
              <div className='text-5xl pb-1 pr-2 text-gray-700 text-nowrap'>Welcome to</div>
              <div className='text-6xl font-semibold'>Botania.</div>
            </div>
            <div className='flex flex-wrap justify-center'>
              <button className='text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 text-gray-600 rounded-md bg-gray-200/40 hover:bg-white/80 hover:text-black hover:scale-105  duration-200' onClick={gotosearch}>Buy plants</button>
              <button className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 text-gray-600 rounded-md bg-gray-200/40 hover:bg-green-700/80 hover:text-white duration-200'>Sell plants</button>
            </div>
            <div className='w-screen flex justify-center mt-44'>
              <div className='max-w-[60rem] italic m-5 max-h-[50rem] bg-white/40 text-justify p-5 text-lg rounded-lg backdrop-blur-sm'>
                "Botania is an elegantly designed website crafted to seamlessly connect passionate plant buyers with dedicated sellers. The platform boasts an intuitive interface that allows users to effortlessly browse through a diverse range of plants, from rare succulents to exotic flowering species. Each listing is accompanied by detailed descriptions, care instructions, and high-resolution images to ensure buyers make informed decisions. Sellers can create personalized profiles, showcasing their expertise and the unique qualities of their plants. Integrated features such as secure payment options, customer reviews, and a robust search function enhance the user experience, making Botania the ultimate destination for plant enthusiasts seeking quality and variety."
              </div>
            </div>
            <div className='bg-white/90 backdrop-blur-sm text-center w-screen text-black'>Made by Aditya</div>
          </div>
          <div className='bg-black opacity-0 text-center w-screen text-white'>Made by Aditya</div>
        </div>
      </div>
    </>
  )
}

export default Welcome
