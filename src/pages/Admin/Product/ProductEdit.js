import { AiOutlineDropbox } from 'react-icons/ai';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import SideNav from '../../../components/SideNav';
import Skeleton from '../../../components/Skeleton';
import app from '../../../firebase';
import { Store } from '../../../Store';
import { getError } from '../../../utils';

import './productEdit.css'
import { MdPublish } from 'react-icons/md';
import { userRequest } from '../../../requestController';


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                product: action.payload.product,
                loading: false
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false };
        default:
            return state;
    }
};

const ProductEdit = () => {
    const [{ loading, product, error, loadingUpdate, }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const navigate = useNavigate();
    const params = useParams(); // /product/:id
    const { id: productId } = params;

    const { state } = useContext(Store);
    const { userInfo } = state;

    const [inputs, setInputs] = useState({});
    const [img, setImg] = useState('');
    const [product_, setProducts] = useState({});
    
    const handleChange = (e) => {
        setInputs((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await userRequest.get(`products/find/${productId}`);
                setProducts(data);
                setInputs(data)
                dispatch({ type: 'FETCH_SUCCESS', payload: data  });
            }
            catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err),});
            }
        };
        fetchData();
    }, [setProducts, productId]);

    const submitHandler = (e) => {
        e.preventDefault();
        if(img) {
            const img_name = new Date().getTime() + img.name;
            const storage = getStorage(app);
            const storageRef = ref(storage, img_name);

            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                console.log('Upload is ' + progress + '% done');

                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        
                }
                }, 
                (error) => {
                    // Handle unsuccessful uploads
                }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        const updateProduct = { ...inputs, img: downloadURL };
                        update(updateProduct);
                    });
                }
            )
        } else {
            const updateProduct = { ...inputs };
            update(updateProduct);
        }
    };

    const update = async (updateProduct) => {
        // console.log(updateProduct);
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            await userRequest.put(`products/${productId}`, updateProduct,
                {
                    headers: {
                        token: `Bearer ${userInfo.accessToken}`
                    },
                }
            );
            dispatch({ type: 'UPDATE_SUCCESS', });
            navigate('/admin/products');
        }
        catch (err) {
            dispatch({ type: 'UPDATE_FAIL' });
        }
    }

    // console.log(inputs);
    return (
        <div>
            <Helmet>
                <title>Dashboard | Products</title>
            </Helmet>
            {loading ? (<Skeleton type="circle"/>) : error ? (<p className="danger">{error}</p>) : (
                <div className='admin_container'>
                    <SideNav />
                    <div className='container_contents'>
                        <div className='Product_Container'>
                            <h2 className='big_'>
                                <AiOutlineDropbox className='icon' />
                                Product :_: {productId}
                            </h2>
                            <h2 className='small_'>
                                <AiOutlineDropbox className='icon' />
                                Product :_: {productId.length >= 10 ? `${productId.substring(0, 8)}...` :  productId}
                            </h2>
                            <form className='product_edit_form' onSubmit={submitHandler}>
                                {/* {msg && (<p className='msg'>{msg}</p>)} */}
                                <input type='text' name='title' value={inputs.title} required onChange={handleChange} />

                                <input type='text' name='desc' value={inputs.desc} required onChange={handleChange} />

                                <input type='text' name='price' value={inputs.price} required onChange={handleChange} />

                                <input type='text' name='category' value={inputs.category} required onChange={handleChange} />

                                <input type='text' name='rating' value={inputs.rating} required onChange={handleChange} />
                                
                                <input type='text' name='countInStock' value={inputs.countInStock} required onChange={handleChange} />

                                <div className="productUpload">
                                    <div className='uploadImg'>
                                        <img src={inputs.img} alt="" />
                                    </div>
                                    <label htmlFor="file">
                                        <MdPublish className='icon' />
                                    </label>
                                    <input type="file" id="file" onChange={(e) => setImg(e.target.files[0])} style={{ display: "none" }} />
                                </div>
                                   
                                {loadingUpdate ? (
                                    <button type='submit' className='update' >Processing...</button>
                                ): (
                                    <button type='submit' className='update' >Update</button>    
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductEdit