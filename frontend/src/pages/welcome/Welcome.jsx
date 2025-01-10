import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faHeadset, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';

const Welcome = () => {

  const navigate = useNavigate();

  const gotoUser = () => {
    navigate('/user/login-register');
  };

  const gotoSeller = () => {
    navigate('/seller/login-register');
  };

  return (
    <>
      <div className=''>
        <div className='overflow-hidden w-full h-screen flex flex-col justify-center relative'>
          <img src='/Flowers.jpg' className='w-full z-[-1] top-0 h-full absolute object-cover' />
          <div className='flex flex-col justify-center items-center w-screen h-screen'>
            <div className='justify-center p-4 mb-6 flex items-end flex-wrap '>
              <div className='text-5xl pb-1 pr-2 text-gray-700 text-nowrap'>Welcome to</div>
              <div className='text-6xl font-semibold'>Botania.</div>
            </div>
            <div className='flex flex-wrap justify-center'>
              <button className='text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 text-gray-600 rounded-md bg-gray-200/40 hover:bg-white/80 hover:text-black hover:scale-105  duration-200' onClick={gotoUser}>Buy plants</button>
              <button className='hover:scale-105 text-xl backdrop-blur-sm my-2 mx-7 px-4 py-3 text-gray-600 rounded-md bg-gray-200/40 hover:bg-green-700/80 hover:text-white duration-200'  onClick={gotoSeller}>Sell plants</button>
            </div>
          </div>
        </div>
        <div className='flex flex-col sm:mx-10 mx-4 mt-[6rem] items-center'>
          <div className='md:max-w-[50rem]'>
            <div className='text-5xl text-gray-700'>What is <span className='font-bold text-black'>Botania</span>?</div>
            <div className='mt-6 italic sm:text-2xl text-justify'>
              "Botania is an elegantly designed website crafted to seamlessly connect passionate plant buyers with dedicated sellers. The platform boasts an intuitive interface that allows users to effortlessly browse through a diverse range of plants, from rare succulents to exotic flowering species. Each listing is accompanied by detailed descriptions, care instructions, and high-resolution images to ensure buyers make informed decisions. Sellers can create personalized profiles, showcasing their expertise and the unique qualities of their plants. Integrated features such as secure payment options, customer reviews, and a robust search function enhance the user experience, making Botania the ultimate destination for plant enthusiasts seeking quality and variety."
            </div>
          </div>
        </div>
        <div className='flex flex-col sm:mx-10 mx-4 mt-[6rem] items-center h-[30rem]'>
          <div className='md:max-w-[50rem] w-full relative rounded-3xl overflow-hidden h-full flex justify-center items-center'>
            <img src="/Flowers9.jpg" alt="" className='absolute z-[-1] object-cover h-full w-full' />
            <div className='backdrop-blur-sm flex bg-white/20 rounded-3xl items-center justify-center sm:mx-10 mx-2'>
              <div className='w-3/5 italic text-white border-r-2 border-black py-4 sm:text-2xl sm:px-10 px-4 sm:my-6 my-3'>"Explore plants lovingly nurtured by passionate sellers who share your love for greenery."</div>
              <div className='w-2/5 flex justify-center items-center'>
                <button className='hover:scale-105 sm:text-xl text-xs backdrop-blur-sm my-2 mx-7 px-4 py-3 text-gray-600 rounded-md bg-gray-200/40 hover:bg-green-700/80 hover:text-white duration-200 text-nowrap'  onClick={gotoUser}>Browse plants</button>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col sm:mx-10 mx-4 mt-[6rem] items-center'>
          <div className='md:max-w-[50rem] bg-gray-100 w-full rounded-3xl overflow-hidden h-full flex flex-col sm:flex-row justify-center items-center'>
            <div className='sm:w-3/5 sm:pr-4'>
              <img src="/Flowers4.jpg" alt="" className=' object-cover rounded-3xl' />
            </div>
            <div className='sm:w-2/5 italic md:text-2xl px-4 my-4 sm:my-0'>
              <div className="">"Showcase your plants to a community that values your passion for greenery."</div>
              <button className='active:scale-95 md:text-xl mb-2 mt-4 px-4 py-3 text-white rounded-md bg-green-700 hover:bg-green-800 duration-200 text-nowrap'  onClick={gotoSeller}>Join as seller</button>
            </div>
          </div>
        </div>
        <div className='flex flex-col sm:mx-10 mx-4 my-[6rem] items-center'>
          <div className='md:max-w-[50rem]'>
            <div className='text-5xl text-gray-700 flex sm:items-end sm:flex-row flex-col'>
              <div className='pr-4 pb-1'>Powered by</div>
              <img className='w-[16rem] object-contain' src="./Razorpay.svg" />
            </div>
            <div className='mt-6 italic sm:text-2xl text-justify'>
              "At Botania, we ensure a seamless and secure payment experience, powered by Razorpay, a trusted leader in online transactions. Razorpay brings to the platform a host of advanced features, including robust fraud detection, multi-currency support, instant refunds, and a user-friendly interface for hassle-free payments. Whether you're buying or selling, Razorpay guarantees fast and secure processing, offering multiple payment options such as credit cards, debit cards, UPI, and net banking. With Razorpay's cutting-edge technology, Botania delivers a reliable and efficient payment experience, making your transactions smooth and worry-free."
            </div>
          </div>
        </div>
        <div className='bg-black flex flex-col py-4 items-center text-white'>
          <div className='md:max-w-[50rem] mx-4'>
            <div>By using this website, you automatically agree to our <Link target='_blank' to='https://merchant.razorpay.com/policy/PN2MkT4qFlPZzF/terms' className='text-blue-500'>Terms and Conditions</Link>, <Link target='_blank' to='https://merchant.razorpay.com/policy/PN2MkT4qFlPZzF/refund' className='text-blue-500'>Refund Policy</Link>, <Link target='_blank' to='https://merchant.razorpay.com/policy/PN2MkT4qFlPZzF/shipping' className='text-blue-500'>Shipping Policy</Link>, and <Link target='_blank' to='https://drive.google.com/file/d/1p5QMw-GU2e-FUJBX9bdoS-9h2FHHwHwo/view?usp=sharing' className='text-blue-500'>Privacy Policy</Link>.</div>
            <div className='mt-4 mb-2 text-lg'><FontAwesomeIcon className='mr-2' icon={faHeadset} /> Contact us at :</div>
            <div className='mt-1'><FontAwesomeIcon className='mr-2 w-4 h-4' icon={faPhone} />+91-6201010626</div>
            <div className='mt-1'><FontAwesomeIcon className='mr-2 w-4 h-4' icon={faEnvelope} />tejash835274@gmail.com</div>
            <div className='mt-1'><FontAwesomeIcon className='mr-2 w-4 h-4' icon={faLocationDot} />Hostel-J, NIT Jamshedpur, Adityapur, Jamshedpur, Jharkhand - 831014</div>
          </div>
        </div>
      </div>
    </>
  )
};

export default Welcome;