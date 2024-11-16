import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar';
import Filterpanel from '../../components/Filterpanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBorderAll, faList, faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { AppContext } from '../../context/context';


const Searchresults = () => {
    //Sort and filter
    const { search } = useParams();
    const [searchby, setsearchby] = useState('Recently added');
    const [products, setproducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`/products/${search}/`,
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            searchBy: searchby,
                        })
                    }
                );
                const data = await response.json();
                console.log(data);
                setproducts(data.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchProducts();
    }, [search, searchby]);

    //View products
    const navigate = useNavigate();
    const gotoproducts = (productId) => {
        console.log(productId)
        navigate(`/product/id/${productId}/`);
    };

    //Handle wishlist
    const [wishlist, setwishlist] = useState(JSON.parse(localStorage.getItem("wishlist")) || []);

    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    const { isAuth, setisAuth } = useContext(AppContext);

    const handleLogout = async () => {
        const response = await fetch("/users/logout", {
          method: "POST"
        })
          .then(res => res.json())
          .then(res => {
            console.log(res);
            setisAuth(false);
            localStorage.clear();
          })
          .catch(error => console.log(error));
      };
    
    const handleLike = async (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        if (wishlist.includes(productId)) {
            const response = await fetch('/users/remove-from-wishlist', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: productId,
                })
            });
            const result = await response.json();
            if (result.status == 200) {
                console.log(result);
                setwishlist(result.data.wishlist);
            }
            else {
                handleLogout();
                console.log(result);
            }
        }
        else {
            const response = await fetch('/users/add-to-wishlist', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: productId,
                })
            });
            const result = await response.json();
            if (result.status == 200) {
                console.log(result);
                setwishlist(result.data.wishlist);
            }
            else {
                handleLogout();
                console.log(result);
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className='pt-[4rem] flex w-screen h-screen overflow-hidden'>
                <Filterpanel setsearchby={setsearchby} searchby={searchby} />
                <div className='flex-1 overflow-auto flex-col'>
                    <div className='border-b text-sm pl-2 flex justify-between items-center'>
                        <div className='py-2 px-3'>
                            yo search results with result {(search.trim() == "") ? 'all products' : search} with {searchby}
                        </div>
                    </div>
                    <div className='flex flex-wrap justify-around'>
                        {products && products.map((product) => {
                            return <div onClick={() => { gotoproducts(product._id) }} className='rounded-lg cursor-pointer flex flex-col w-[13rem] h-[20rem] m-4 overflow-hidden hover:shadow-lg' key={product._id}>
                                <div className='relative'>
                                    <img className={' object-cover w-[13rem] h-[15rem] ' + ((product.quantity == 0) ? ' opacity-50 ' : ' ')} src={product.coverImage} alt="" />
                                    {(product.quantity == 0) && <div className='text-xl absolute text-center top-1/2 w-full translate-y-[-50%]'>Sold out</div>}
                                    <div className='absolute bottom-3 mx-3'>
                                        <div className='flex bg-white rounded-md'>
                                            <div className='border-r border-black my-[2px] pl-2 pr-1 text-xs'>{product.averageRating}<span className='text-green-700'>★ </span></div>
                                            <div className='pl-1 pr-2 my-[2px] text-xs'>{product.reviews} </div>
                                        </div>
                                    </div>
                                    {isAuth && <div onClick={e => { handleLike(e, product._id) }} className='absolute bottom-3 right-0 '>
                                        <button className='mr-3 w-8 h-8 hover:scale-110 active:scale-100 duration-200 bg-white rounded-full'>{(wishlist.includes(product._id)) ? <FontAwesomeIcon className='text-red-600' icon={solidHeart} /> : <FontAwesomeIcon className='' icon={faHeart} />}</button>
                                    </div>}
                                </div>
                                <div className='mt-3 mx-3'>
                                    <div className='font-bold text-ellipsis text-nowrap overflow-hidden'>{product.name}</div>
                                    <div className='text-sm'>Rs.{product.price}</div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Searchresults
