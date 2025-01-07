import React from 'react';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

const CustomerCare = () => {

  return (
    <div className='flex-1 flex justify-center items-center overflow-hidden'>
      <img className='z-[-1] object-cover h-screen w-full fixed top-0 left-0' src="/Flowers2.jpg" alt="" />
      <div className='flex flex-col justify-center items-center backdrop-blur-sm bg-white/40 sm:p-8 p-4 m-4 rounded-2xl shadow-lg'>
        <div className='overflow-hidden w-[10rem] h-[10rem] rounded-full hover:scale-105 duration-500'>
          <img className='object-contain ' src="/aditya.jpg" alt="" />
        </div>
        <div className='mb-8 mt-4 text-xl font-semibold'>Aditya Choudhary</div>
        <div className='flex flex-col'>
          <div className='flex justify-center flex-wrap'>
            <div className='flex items-center w-[18rem] '>
              <div className='m-2'><FontAwesomeIcon className='w-6 h-6' icon={faInstagram} /></div>
              <div><a target='_blank' href='https://www.instagram.com/tejash.xyz/'><span className=''>Instagram</span> - @tejash.xyz</a></div>
            </div>
            <div className='flex items-center w-[18rem] '>
              <div className='m-2'><FontAwesomeIcon className='w-6 h-6' icon={faEnvelope} /></div>
              <div><div><span className=''>Gmail</span> - tejash835274@gmail.com</div></div>
            </div>
          </div>
          <div className='flex justify-center flex-wrap'>
            <div className='flex items-center w-[18rem] '>
              <div className='m-2'><FontAwesomeIcon className='w-6 h-6' icon={faLinkedin} /></div>
              <div><a target='_blank' href='https://www.linkedin.com/in/aditya-choudhary-31137b291/'><span className=''>LinkedIn</span> - Aditya Choudhary</a></div>
            </div>
            <div className='flex items-center w-[18rem] '>
              <div className='m-2'><FontAwesomeIcon className='w-6 h-6' icon={faGithub} /></div>
              <div><a target='_blank' href='https://github.com/tejash-exe'><span className=''>GitHub</span> - @tejash-exe</a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default CustomerCare;