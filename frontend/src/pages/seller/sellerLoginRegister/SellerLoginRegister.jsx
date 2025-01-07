import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/context';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
//Components
import Notification from '../../../components/Notification';

const LoginRegister = () => {

  const navigate = useNavigate();
  const { issellerAuth, setissellerAuth, sellerredirect, backend_url } = useContext(AppContext);
  const [login, setlogin] = useState(true);
  const [nameinput, setnameinput] = useState("");
  const [emailinput, setemailinput] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const [isPopup, setisPopup] = useState(false);
  const [popupMessage, setpopupMessage] = useState("");

  //Handle Login-register modes
  const changeModes = (e) => {
    e.preventDefault();
    setlogin((prev) => !prev);
  };

  //Input fields
  const changeName = (e) => {
    const value = e.target.value;
        if (/^.{0,70}$/.test(value)) {
            setnameinput(value);
        }
        else {
            setpopupMessage("Name cannot exceed 70 letters!!");
            setisPopup(true);
        };
  };

  const changeEmail = (e) => {
    setemailinput(e.target.value);
  };

  const changePassword = (e) => {
    setpassword(e.target.value);
  };

  //Handle popup
  let closeTimeout;
  useEffect(() => {
    if (isPopup) {
      setTimeout(() => {
        setisPopup(false);
      }, 3000);
    };
    return () => clearTimeout(closeTimeout);
  }, [isPopup]);

  const exitPopup = () => {
    setisPopup(false);
    clearTimeout(closeTimeout);
  };

  //Handle Login submit
  const loginSubmit = async (e) => {
    e.preventDefault();

    if (emailinput === "" || password === "") {
      setpopupMessage("Please fill in all required fields!");
      setisPopup(true);
      return;
    };

    const data = {
      email: emailinput,
      password: password,
    };

    try {
      setloading(true);
      const response = await fetch(`${backend_url}/api/sellers/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.status === 200) {
        setemailinput("");
        setnameinput("");
        setpassword("");
        // console.log(result);
        localStorage.setItem("issellerAuth", JSON.stringify(true));
        setissellerAuth(true);
      } else {
        throw new Error(result.message);
      };
    } catch (error) {
      setpopupMessage(error.message);
      setisPopup(true);
    } finally {
      setloading(false);
    };
  };

  //Handle back
  useEffect(() => {
    if (issellerAuth == true) {
      navigate(sellerredirect);
    };
  }, [issellerAuth]);

  //Handle Resgister submit
  const registerSubmit = async (e) => {
    e.preventDefault();

    if (!emailinput || !password || !nameinput) {
      // console.log("Please fill in all required fields!");
      setpopupMessage("Please fill in all required fields!");
      setisPopup(true);
      return;
    };

    const data = {
      name: nameinput,
      email: emailinput,
      password: password,
    };

    try {
      setloading(true);
      const response = await fetch(`${backend_url}/api/sellers/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.status === 200) {
        setnameinput("");
        setpassword("");
        // console.log(result);
        setemailinput(result.data.email);
        setpopupMessage("Registered successfully!");
        setisPopup(true);
        setlogin(true);
      } else {
        throw new Error(result.message);
      };
    } catch (error) {
      setpopupMessage(error.message);
      setisPopup(true);
    } finally {
      setloading(false);
    };
  };

  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      {isPopup && <Notification message={popupMessage} onexit={exitPopup} />}
      <div className='flex md:flex-row flex-col justify-center md:px-20 md:py-10 m-10 max-w-[1000px] rounded-2xl backdrop-blur-sm bg-white/40'>
        <div className='flex flex-col justify-center items-end md:border-b-0 border-b-2  md:border-r-4 p-4 mx-4 md:ml-20 border-gray-700'>
          <div>Welcome to </div>
          <div className="font-bold text-4xl">Botania</div>
          <div className="font-bold text-2xl">Seller</div>
        </div>
        <form className='flex flex-col items-center m-4 mx-6 md:w-[100%]'>
          <div className='mb-3'>Please {login ? "Login" : "Register"} to continue</div>
          <div>
            {!login && <div className='flex items-center p-2 rounded-md bg-gray-200 text-gray-700 mb-3 text-base '>
              <FontAwesomeIcon icon={faUser} />
              <input className='outline-none bg-gray-200 ml-2 w-[12rem]' disabled={(loading == true)} required name='name' value={nameinput} onChange={changeName} type="text" placeholder="Full name" />
            </div>}
            <div className='flex items-center p-2 rounded-md bg-gray-200 text-gray-700 mb-3 text-base '>
              <FontAwesomeIcon icon={faEnvelope} />
              <input className='outline-none bg-gray-200 ml-2 w-[12rem]' disabled={(loading == true)} required name='email' value={emailinput} onChange={changeEmail} type="email" placeholder="Email" />
            </div>
            <div className='flex items-center p-2 rounded-md bg-gray-200 text-gray-700 mb-3 text-base '>
              <FontAwesomeIcon icon={faLock} />
              <input className='outline-none bg-gray-200 ml-2 w-[12rem]' disabled={(loading == true)} required name='password' value={password} onChange={changePassword} type="password" placeholder="Password" />
            </div>
          </div>
          <div className='text-black mb-3'>{login ? "New user?" : "Existing user?"} <button type='button' onClick={changeModes} disabled={(loading == true)} className='text-gray-600 hover:underline hover:text-black duration-200'>{login ? "Register here" : "Login here"}</button></div>
          {login ? <div className='flex justify-center'><button className='py-2 px-4 active:scale-95 duration-200 rounded-md text-white bg-pink-800/60 hover:bg-pink-700/60' disabled={(loading == true)} onClick={loginSubmit} type='submit' >{loading ? 'logging' : 'Login'}</button></div> :
            <div className='flex justify-center'><button className='py-2 px-4 active:scale-95 duration-200 rounded-md text-white bg-pink-800/60 hover:bg-pink-700/60' disabled={(loading == true)} onClick={registerSubmit} type='submit' >{loading ? 'Registering' : 'Register'}</button></div>}
        </form>
      </div>
      <div className='w-screen h-screen fixed z-[-1] brightness-90'>
        <img className='min-w-[1400px] w-screen h-screen object-cover' src="/Flowers4.jpg" alt="" />
      </div>
    </div>
  )
};

export default LoginRegister;