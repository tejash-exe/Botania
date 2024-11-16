import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const ProductPage = () => {
    const [product, setproduct] = useState();
    const { productid } = useParams();
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/products/getproduct/${productid}/`,{ method: "POST" })
                const data = await response.json();
                setproduct(data.data);
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchProduct();
    }, [productid]);
  return (
    <div className='pt-[4rem]'>
      {product ? <div className='m-6 flex'>
        <div className='flex flex-wrap w-[42rem] justify-around bg-gray-200'>
            <img className='w-[20rem] h-[30rem] object-cover' src={product.coverImage} alt="" />
            {product.images && product.images.map((url) => {
                return <img src={url} alt="" />
            })}
        </div>
        <div>
            <div>{product.name}</div>
            <div>{product.description}</div>
            <div>{product.price}</div>
        </div>
      </div> : <div className="">Cannot find froduct</div>}
    </div>
  )
}

export default ProductPage
