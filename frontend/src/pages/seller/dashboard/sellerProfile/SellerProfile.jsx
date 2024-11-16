import React, { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, registerables } from 'chart.js';
import { useNavigate } from 'react-router-dom';



ChartJS.register(...registerables)

const SellerProfile = () => {
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
            {
                label: 'Sales',
                data: [65, 59, 180, 81, 56, 55, 40],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };


    const [products, setproducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`/products/${1}/`,
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }
                );
                const data = await response.json();
                setproducts(data.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchProducts();
    }, []);

    //View products
    const navigate = useNavigate();
    const gotoproducts = (productId) => {
        console.log(productId)
        navigate(`/product/id/${productId}/`);
    };

    const changeProfilePictureButtonRef = useRef();
    const profilePictureinputRef = useRef();

    const profilePictureClick = () => {
        profilePictureinputRef.current.click();
    };

    const [picture, setpicture] = useState('plant1.jpg');

    const changePicture = (e) => {
        console.log(e.target.files[0].name)
        setpicture(e.target.files[0].name)
    };

    return (
        <div className='flex pt-[4rem] w-screen h-screen overflow-hidden bg-white'>
            <div className='p-10 w-4/6 h-screen overflow-y-auto flex-col'>
                <div className='flex justify-between items-center'>
                    <div>
                        <div className='flex items-center'>
                            <div className='font-bold text-3xl'>Aditya Choudhary</div>
                            <button className='bg-gray-200 py-2 px-4 rounded-lg font-normal text-base ml-5'>4★|100</button>
                        </div>
                        <div className='italic'>Owner of Tejash</div>
                        <div>Email: tejash835274@gmail.com</div>
                        <div>Contact no: 6201010626</div>
                        <div>Verification Status: Verified</div>
                        <div className='mt-4'>
                            <button className='px-4 py-2 bg-pink-700 mr-3 text-white border-pink-700 border-2 hover:bg-white duration-200 hover:text-black active:scale-95 rounded-lg'>Update profile</button>
                            <button className='px-4 py-2 bg-green-700 mr-3 text-white border-green-700 border-2 hover:bg-white duration-200 hover:text-black active:scale-95 rounded-lg'>Request Verification</button>
                        </div>
                    </div>
                    <div className=''>
                        <div className='w-[10rem] h-[10rem] overflow-hidden rounded-full'>
                            <img className='object-cover' src={'/' + picture} alt="" />
                        </div>
                        <button onClick={profilePictureClick} ref={changeProfilePictureButtonRef} className='hover:underline text-blue-400 pt-2'>Change profile picture</button>
                        <input onChange={e => changePicture(e)} ref={profilePictureinputRef} className=' hidden ' type="file" name="" id="" />
                        
                    </div>
                </div>
                <div className='m-8'>
                    <Bar data={data} options={options} />
                </div>
                <div className='mt-10'>
                    <div>Products</div>
                    <div className='flex flex-nowrap overflow-x-auto'>
                        <div>
                            <div onClick={() => { gotoproducts() }} className='rounded-lg cursor-pointer flex flex-col w-[13rem] h-[20rem] m-4 overflow-hidden hover:shadow-lg' key={1}>
                                <div className='relative'>
                                    <img className={' object-cover w-[13rem] h-[15rem] ' + ((1) ? ' opacity-50 ' : ' ')} src={1} alt="" />
                                    {(1) && <div className='text-xl absolute text-center top-1/2 w-full translate-y-[-50%]'>Sold out</div>}
                                    <div className='absolute bottom-3 mx-3'>
                                        <div className='flex bg-white rounded-md'>
                                            <div className='border-r border-black my-[2px] pl-2 pr-1 text-xs'>{1}<span className='text-green-700'>★ </span></div>
                                            <div className='pl-1 pr-2 my-[2px] text-xs'>{1} </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-3 mx-3'>
                                    <div className='font-bold text-ellipsis text-nowrap overflow-hidden'>{1}</div>
                                    <div className='text-sm'>Rs.1</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div onClick={() => { gotoproducts() }} className='rounded-lg cursor-pointer flex flex-col w-[13rem] h-[20rem] m-4 overflow-hidden hover:shadow-lg' key={1}>
                                <div className='relative'>
                                    <img className={' object-cover w-[13rem] h-[15rem] ' + ((1) ? ' opacity-50 ' : ' ')} src={1} alt="" />
                                    {(1) && <div className='text-xl absolute text-center top-1/2 w-full translate-y-[-50%]'>Sold out</div>}
                                    <div className='absolute bottom-3 mx-3'>
                                        <div className='flex bg-white rounded-md'>
                                            <div className='border-r border-black my-[2px] pl-2 pr-1 text-xs'>{1}<span className='text-green-700'>★ </span></div>
                                            <div className='pl-1 pr-2 my-[2px] text-xs'>{1} </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-3 mx-3'>
                                    <div className='font-bold text-ellipsis text-nowrap overflow-hidden'>{1}</div>
                                    <div className='text-sm'>Rs.1</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div onClick={() => { gotoproducts() }} className='rounded-lg cursor-pointer flex flex-col w-[13rem] h-[20rem] m-4 overflow-hidden hover:shadow-lg' key={1}>
                                <div className='relative'>
                                    <img className={' object-cover w-[13rem] h-[15rem] ' + ((1) ? ' opacity-50 ' : ' ')} src={1} alt="" />
                                    {(1) && <div className='text-xl absolute text-center top-1/2 w-full translate-y-[-50%]'>Sold out</div>}
                                    <div className='absolute bottom-3 mx-3'>
                                        <div className='flex bg-white rounded-md'>
                                            <div className='border-r border-black my-[2px] pl-2 pr-1 text-xs'>{1}<span className='text-green-700'>★ </span></div>
                                            <div className='pl-1 pr-2 my-[2px] text-xs'>{1} </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-3 mx-3'>
                                    <div className='font-bold text-ellipsis text-nowrap overflow-hidden'>{1}</div>
                                    <div className='text-sm'>Rs.1</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div onClick={() => { gotoproducts() }} className='rounded-lg cursor-pointer flex flex-col w-[13rem] h-[20rem] m-4 overflow-hidden hover:shadow-lg' key={1}>
                                <div className='relative'>
                                    <img className={' object-cover w-[13rem] h-[15rem] ' + ((1) ? ' opacity-50 ' : ' ')} src={1} alt="" />
                                    {(1) && <div className='text-xl absolute text-center top-1/2 w-full translate-y-[-50%]'>Sold out</div>}
                                    <div className='absolute bottom-3 mx-3'>
                                        <div className='flex bg-white rounded-md'>
                                            <div className='border-r border-black my-[2px] pl-2 pr-1 text-xs'>{1}<span className='text-green-700'>★ </span></div>
                                            <div className='pl-1 pr-2 my-[2px] text-xs'>{1} </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-3 mx-3'>
                                    <div className='font-bold text-ellipsis text-nowrap overflow-hidden'>{1}</div>
                                    <div className='text-sm'>Rs.1</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div onClick={() => { gotoproducts() }} className='rounded-lg cursor-pointer flex flex-col w-[13rem] h-[20rem] m-4 overflow-hidden hover:shadow-lg' key={1}>
                                <div className='relative'>
                                    <img className={' object-cover w-[13rem] h-[15rem] ' + ((1) ? ' opacity-50 ' : ' ')} src={1} alt="" />
                                    {(1) && <div className='text-xl absolute text-center top-1/2 w-full translate-y-[-50%]'>Sold out</div>}
                                    <div className='absolute bottom-3 mx-3'>
                                        <div className='flex bg-white rounded-md'>
                                            <div className='border-r border-black my-[2px] pl-2 pr-1 text-xs'>{1}<span className='text-green-700'>★ </span></div>
                                            <div className='pl-1 pr-2 my-[2px] text-xs'>{1} </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-3 mx-3'>
                                    <div className='font-bold text-ellipsis text-nowrap overflow-hidden'>{1}</div>
                                    <div className='text-sm'>Rs.1</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='my-10'>
                    <div>Orders</div>
                    <div className='flex flex-col overflow-y-auto'>
                    <div className='flex border-b md:p-6 px-2 py-4 hover:bg-gray-100 hover:rounded-xl duration-200'>
                            <div className='md:w-[8rem] md:h-[8rem] w-[6rem] h-[6rem] flex-shrink-0 overflow-hidden rounded-lg'>
                                <img src="/plant1.jpg" alt="" />
                            </div>
                            <div className='overflow-hidden mx-4 md:mt-4 mt-2'>
                                <div className='md:text-base text-sm text-ellipsis overflow-hidden text-nowrap font-bold'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius, soluta Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis ducimus consectetur iusto aut pariatur nisi voluptatum unde illo quas? Quaerat.</div>
                                <div className='md:text-base text-sm'>Ordered on 21/06/24</div>
                                <div className='md:text-base text-sm'>₹<span>299</span></div>
                                <div className='md:text-base text-sm'>On the way</div>
                            </div>
                        </div>
                    <div className='flex border-b md:p-6 px-2 py-4 hover:bg-gray-100 hover:rounded-xl duration-200'>
                            <div className='md:w-[8rem] md:h-[8rem] w-[6rem] h-[6rem] flex-shrink-0 overflow-hidden rounded-lg'>
                                <img src="/plant1.jpg" alt="" />
                            </div>
                            <div className='overflow-hidden mx-4 md:mt-4 mt-2'>
                                <div className='md:text-base text-sm text-ellipsis overflow-hidden text-nowrap font-bold'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius, soluta Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis ducimus consectetur iusto aut pariatur nisi voluptatum unde illo quas? Quaerat.</div>
                                <div className='md:text-base text-sm'>Ordered on 21/06/24</div>
                                <div className='md:text-base text-sm'>₹<span>299</span></div>
                                <div className='md:text-base text-sm'>On the way</div>
                            </div>
                        </div>
                    <div className='flex border-b md:p-6 px-2 py-4 hover:bg-gray-100 hover:rounded-xl duration-200'>
                            <div className='md:w-[8rem] md:h-[8rem] w-[6rem] h-[6rem] flex-shrink-0 overflow-hidden rounded-lg'>
                                <img src="/plant1.jpg" alt="" />
                            </div>
                            <div className='overflow-hidden mx-4 md:mt-4 mt-2'>
                                <div className='md:text-base text-sm text-ellipsis overflow-hidden text-nowrap font-bold'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius, soluta Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis ducimus consectetur iusto aut pariatur nisi voluptatum unde illo quas? Quaerat.</div>
                                <div className='md:text-base text-sm'>Ordered on 21/06/24</div>
                                <div className='md:text-base text-sm'>₹<span>299</span></div>
                                <div className='md:text-base text-sm'>On the way</div>
                            </div>
                        </div>
                    <div className='flex border-b md:p-6 px-2 py-4 hover:bg-gray-100 hover:rounded-xl duration-200'>
                            <div className='md:w-[8rem] md:h-[8rem] w-[6rem] h-[6rem] flex-shrink-0 overflow-hidden rounded-lg'>
                                <img src="/plant1.jpg" alt="" />
                            </div>
                            <div className='overflow-hidden mx-4 md:mt-4 mt-2'>
                                <div className='md:text-base text-sm text-ellipsis overflow-hidden text-nowrap font-bold'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius, soluta Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis ducimus consectetur iusto aut pariatur nisi voluptatum unde illo quas? Quaerat.</div>
                                <div className='md:text-base text-sm'>Ordered on 21/06/24</div>
                                <div className='md:text-base text-sm'>₹<span>299</span></div>
                                <div className='md:text-base text-sm'>On the way</div>
                            </div>
                        </div>
                    <div className='flex border-b md:p-6 px-2 py-4 hover:bg-gray-100 hover:rounded-xl duration-200'>
                            <div className='md:w-[8rem] md:h-[8rem] w-[6rem] h-[6rem] flex-shrink-0 overflow-hidden rounded-lg'>
                                <img src="/plant1.jpg" alt="" />
                            </div>
                            <div className='overflow-hidden mx-4 md:mt-4 mt-2'>
                                <div className='md:text-base text-sm text-ellipsis overflow-hidden text-nowrap font-bold'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius, soluta Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis ducimus consectetur iusto aut pariatur nisi voluptatum unde illo quas? Quaerat.</div>
                                <div className='md:text-base text-sm'>Ordered on 21/06/24</div>
                                <div className='md:text-base text-sm'>₹<span>299</span></div>
                                <div className='md:text-base text-sm'>On the way</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-2/6 overflow-y-auto'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum quam sequi, velit nesciunt nam quo iusto! Modi optio enim animi qui facere ab error, amet consequatur quos nam autem cum!
                Repellendus harum cumque deleniti dolor asperiores, soluta natus quasi excepturi sapiente quisquam expedita quia vitae dolore nemo enim odit similique? Error ea aperiam sunt rem esse cupiditate doloribus nesciunt dolore.
                Neque veritatis at optio iste quia corrupti nostrum sequi minus, omnis voluptates dolorum dignissimos! Esse quasi nulla sapiente velit est, fugit molestiae dignissimos, distinctio atque libero a expedita, iste cumque!
                Ullam, nulla necessitatibus voluptatem incidunt voluptatibus ipsa maxime excepturi magni! Neque, facilis quos porro dolor doloribus, assumenda ad quia laborum quas officiis voluptate earum ex libero, magni vitae magnam harum.
                Officiis debitis dolore libero quia! Tempore maxime ut consequatur facere consectetur, magnam eaque provident consequuntur ipsam aperiam iusto voluptate porro error ea. Ad laboriosam sint aliquid consequatur non eos necessitatibus.
                Quisquam possimus sapiente facilis nobis nisi iure aspernatur rem adipisci provident, eos veniam. Voluptatibus beatae vel nesciunt neque ab est consequatur eos fugit, ratione doloribus iure repudiandae, quia vitae quis.
                Tempore nostrum accusantium natus, magnam esse nulla dolores, debitis numquam, beatae quasi deleniti ipsa laborum saepe nam vero. Error vel distinctio voluptatum amet repudiandae a necessitatibus modi labore dolor ipsa?
                Quisquam repudiandae fugit iure aliquam laudantium consequuntur id placeat tempore ipsum minima vitae voluptate expedita esse laborum ratione corporis, minus fugiat ad distinctio illum! Enim modi quas nihil nobis expedita.
                Eaque, ab accusamus. Tenetur recusandae provident a cupiditate reprehenderit voluptas, praesentium beatae quae et voluptatum nesciunt quasi temporibus eum voluptatem, est similique ratione vero odio odit impedit! Dolor, necessitatibus odit.
                Facilis reprehenderit animi magnam porro perferendis nesciunt voluptatem id sequi omnis, est eaque tenetur veritatis asperiores quia soluta perspiciatis itaque rerum? Consequatur nihil ad architecto quia, error beatae quae eligendi.
                Maiores magnam deserunt incidunt cumque mollitia ad pariatur dolorem dolores temporibus! Praesentium, ut atque! Exercitationem dolores corrupti enim doloremque, et quod asperiores excepturi consequuntur quae labore minus. Quis, assumenda at?
                In error labore reiciendis praesentium blanditiis perspiciatis minus! Provident molestiae modi a ea ex fugit impedit excepturi sapiente exercitationem minus sint unde ratione, hic odio mollitia, eius voluptatem fuga aliquam!
                Obcaecati, quas rem? Incidunt est praesentium reiciendis nihil officia. Accusamus quisquam necessitatibus cum, magni quos in minima esse autem, facere illum enim reprehenderit fugit accusantium sit? Qui nulla ex labore.
                Aperiam quos, natus omnis temporibus assumenda reprehenderit. Ipsum facere nihil sint earum esse officia possimus nulla eius cupiditate maiores deleniti, sed doloremque voluptatum veritatis. Natus necessitatibus nulla fugit eaque sint.
                Quia quam ullam mollitia eaque nobis reiciendis praesentium error totam consectetur quidem, deserunt vel perferendis repudiandae voluptatum autem laborum repellendus. Quam alias veritatis quae illum ipsam atque accusamus exercitationem magni!
                Quibusdam, sunt. Laboriosam quo voluptates nemo ipsam quibusdam pariatur inventore ab aliquid, officia non tempora incidunt quas. Dolor doloremque reiciendis ipsum harum delectus, quis ea inventore asperiores, minima, quam esse?
                Neque qui in pariatur expedita sed, recusandae provident, et consectetur reiciendis libero minima aut fuga quod deleniti iusto. Modi officiis natus ducimus laboriosam quidem expedita, dicta nisi necessitatibus ipsum accusamus!
                Est ut quasi neque aliquid ex debitis, nesciunt exercitationem atque, nobis aut unde, blanditiis commodi modi obcaecati. Voluptatibus, odit, cumque repellendus aliquid, ipsum molestias itaque eveniet laborum totam voluptatem est?
                Labore natus tempora culpa minima in corporis cupiditate, ipsa maiores dignissimos, a recusandae nisi ex, quibusdam molestiae maxime quam. Nisi temporibus ad sunt possimus! Facilis libero at nostrum voluptatum quo.
                Delectus corrupti nostrum autem maiores quod doloremque asperiores consequatur veritatis, voluptatum assumenda commodi ex aspernatur, ad perspiciatis porro labore, molestiae quaerat dicta est cumque inventore vel facere. Doloribus, dicta atque!
                Quod voluptatum cupiditate vero delectus qui minus facilis accusantium, ducimus, sapiente debitis modi id ipsa quam tenetur esse corporis consequuntur dicta autem laboriosam voluptates consectetur! Tenetur ducimus assumenda ex iusto.
                Ratione ipsam porro autem, quisquam nemo exercitationem possimus pariatur odio quam? Quae temporibus repudiandae nam animi consectetur omnis distinctio consequatur ipsam minima mollitia. Ipsam quibusdam ducimus ipsum, laudantium quo soluta.
                Aliquid, tempora eum? Amet maxime est ipsa veritatis voluptas. Rem enim sit, iure similique aspernatur repudiandae adipisci, minima aut temporibus dolorum ipsum, molestiae eaque inventore. Magni, iure. Sunt, rerum itaque.
                Minima, asperiores numquam? Error, aliquam maxime magnam beatae, quaerat delectus at debitis voluptas illum dignissimos, doloribus cum pariatur? Vero obcaecati mollitia id aliquid fugiat culpa libero labore autem fugit pariatur!
                Et velit ipsum unde assumenda beatae facilis cumque perferendis esse minus voluptatem, aperiam cum odio ducimus praesentium magnam doloremque. Beatae error quae, maiores quo ducimus porro cumque nesciunt quod aliquam.
                Debitis dicta inventore doloribus, perspiciatis officia quisquam sint earum odit nobis porro repudiandae quaerat quod sequi consectetur ipsum voluptatibus mollitia! Incidunt distinctio cumque velit vitae aut, unde maxime rerum doloremque!
                Qui voluptate blanditiis voluptates quasi repudiandae totam et eum illo, neque quo optio aut est alias suscipit pariatur voluptatum consectetur vitae nam consequuntur. Cupiditate, molestiae nemo facere sit ipsam excepturi.
                Fugiat voluptates voluptatibus aperiam eaque. Nulla, natus illo? Voluptatum, animi? Eaque dicta molestias vitae delectus nemo architecto ex ipsam, accusamus repudiandae incidunt deserunt consequatur temporibus mollitia totam aspernatur nesciunt error?
                Iure facilis at illo magni voluptatem deserunt quaerat libero, atque repellat quos vel labore. Ullam amet, ratione id enim earum aspernatur quia dicta, dolorem perspiciatis necessitatibus architecto voluptatum adipisci quas.
                Debitis fugit eum sed minima optio officia excepturi. In quas voluptatum deserunt rerum, aliquid accusamus repellendus ipsum quae soluta dignissimos nesciunt fuga quibusdam animi alias debitis officiis! Tempora, sunt iusto.
                Earum reiciendis officia asperiores harum magnam distinctio cupiditate nisi repudiandae sit. Dignissimos saepe perspiciatis eum hic voluptatum repudiandae in, optio adipisci nam nobis perferendis! Natus nulla perferendis ducimus quam dolore?
                Magni, odit. Ipsum numquam, fugit nam quis voluptates fuga voluptatem aperiam cupiditate ex rerum tempore tempora voluptas consequatur alias, natus hic qui vel similique facilis explicabo cumque! Voluptatem, facere similique.
                Atque voluptatibus voluptatum iusto illum quae? Debitis, omnis esse nemo repudiandae blanditiis at voluptatem tenetur, aspernatur ab numquam quos, aliquid praesentium reiciendis dolor dolorum non. Delectus officiis repellendus nostrum rem?
                Modi reiciendis veritatis dolore dignissimos, odit vero optio repellat corrupti eveniet dolor rerum doloremque expedita, laborum eligendi officia porro est. Ipsum iste saepe officiis amet quas quod optio dignissimos eum?
                Omnis dolore animi, ipsa, eum, dicta ex sit tempore architecto illo optio dolor modi ullam voluptatum ab voluptate debitis tenetur reiciendis labore soluta. Labore soluta odio, facilis aut perspiciatis cupiditate?
                Libero minus sapiente, ut quaerat, consequuntur perspiciatis ad aliquam, dicta quo tempore quisquam commodi quae maxime iusto deserunt ratione culpa accusamus dolore eos accusantium sequi aperiam ducimus. Doloribus, veniam consectetur.
                Nesciunt dicta fugiat beatae illo inventore, quasi officiis accusamus recusandae quod nulla expedita eveniet voluptatum quae earum corrupti ratione, porro libero ex, minima consequuntur natus. Pariatur quam accusantium nesciunt distinctio!
                Earum modi accusantium similique enim consectetur voluptatum quo, numquam eos ab reprehenderit beatae officiis nam impedit excepturi aut a fugit quod? Totam, deserunt vero reprehenderit hic dolore cupiditate? Veniam, eius!
                Ipsam, iusto quia! Sequi repellendus alias dolor quia corporis odit omnis, aut aperiam nobis consequuntur necessitatibus libero impedit consectetur eum officia facere consequatur exercitationem repellat velit maiores adipisci perferendis asperiores.
                Non nobis consequatur vero. Corporis reiciendis rem repudiandae labore quam ex laboriosam, ut quod unde esse quos, quibusdam adipisci sint nisi provident. Eos, corrupti sit. Culpa provident quaerat labore fugiat.
                Sapiente, corporis! Minus quia quidem excepturi error voluptatem id veniam itaque labore exercitationem repellat in et amet nisi autem rerum non voluptas ipsa eius aliquid quibusdam, officia corporis expedita! Vitae.
                Quae necessitatibus, amet repellendus debitis earum suscipit accusantium tenetur maxime, voluptas repudiandae esse perspiciatis dignissimos, sed voluptate deserunt optio nesciunt molestiae! Non, aliquam soluta eveniet nulla nesciunt sunt eaque sint?
                Asperiores doloribus architecto reiciendis quidem? Rerum corporis sit laboriosam obcaecati repellendus minus praesentium expedita deleniti eius? Tenetur, dignissimos ea nemo totam labore quam vitae eos. Inventore itaque nemo quis vitae!
                Facere dicta, repellat nihil totam nobis fugit dolorum doloribus delectus voluptate ducimus minus aspernatur saepe quam, sed quae. Tempore quos omnis unde explicabo aut quisquam iste! Suscipit dolore aut vitae.
                Saepe explicabo ea consectetur totam quod id commodi, vel minus necessitatibus fugit provident ex suscipit nemo, illo porro animi mollitia, ut doloribus veniam quo dolores delectus inventore! Error, minus facilis.
                A, amet dignissimos accusantium eos natus tempora aperiam aliquid magnam ut maiores aliquam ab quo iure! At nobis voluptatum odit quod sapiente, ratione, earum animi doloremque commodi consequatur vel aliquam.
                Earum quas doloribus culpa ut totam reprehenderit, maiores, ullam cupiditate molestiae facilis natus officiis inventore voluptas molestias repellendus est, illo cum doloremque rem corporis fugiat exercitationem? Quos voluptate corporis esse.
                Aut eius recusandae suscipit, iusto pariatur corrupti, quos odit nobis doloribus velit dolores architecto voluptates voluptatibus vitae ipsa incidunt? Vero at, eveniet iure ducimus rerum incidunt veritatis distinctio maxime ipsum.
                Voluptatum, eaque, doloremque facilis necessitatibus id repellendus quae reiciendis quasi placeat maxime quam, praesentium odit obcaecati veritatis non consequatur quas ipsam esse labore? Ipsum culpa expedita sequi labore qui! Nostrum.
                Neque iure doloribus quasi, esse expedita doloremque earum recusandae, corrupti sint voluptas, totam at iusto repudiandae. Dicta atque, ad reiciendis ullam voluptate expedita fugiat labore soluta a odit, minima commodi!
            </div>
        </div>
    )
}
export default SellerProfile;
