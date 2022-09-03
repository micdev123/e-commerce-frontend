import React, { useContext, useReducer, useState } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom';
import SideNav from '../../../components/SideNav'
import { Store } from '../../../Store';

import './newProduct.css'
import app from '../../../firebase';
import { userRequest } from '../../../requestController';


const reducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return { ...state, loadingCreate: true };
        case 'CREATE_SUCCESS':
            return {
                ...state,
                loadingCreate: false,
            };
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false };
        default:
            return state;
    }
};


const NewProduct = () => {
    const [{ error, loadingCreate, },
    dispatch, ] = useReducer(reducer, {
        loading: true,
        error: '',
    });
    const navigate = useNavigate();

    const { state } = useContext(Store);
    const { userInfo } = state;

    const [inputs, setInputs] = useState({});
    const [img, setImg] = useState({});

    const handleChange = (e) => {
        setInputs((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
        });
    };

    // console.log(inputs);

    const createHandler = (e) => {
        e.preventDefault();
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
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // console.log('File available at', downloadURL);
                    // product = { ...inputs, img: downloadURL }
                    // console.log({ ...inputs, img: downloadURL });
                    // imgUrl = downloadURL;
                    // console.log(product);
                    const product = { ...inputs, img: downloadURL };
                    create(product);
                });
            }
        );
        
        // console.log(product);
        
    };
    const create = async (product) => {
            // const { product_ } = product
            // console.log(product);
            try {
                dispatch({ type: 'CREATE_REQUEST' });
                await userRequest.post('products', product,
                    {
                        headers: {
                            token: `Bearer ${userInfo.accessToken}`
                        },
                    }
                );
                dispatch({ type: 'CREATE_SUCCESS' });
                navigate(`/admin/products`);
            }
            catch (err) {
                dispatch({ type: 'CREATE_FAIL',});
            }
        }

    // console.log(img);
    return (
        <div>
            <Helmet>
                <title>Dashboard | Products</title>
            </Helmet>
            {/* {loadingCreate && <div>Loading..</div>} */}
            <div className='admin_container'>
                <SideNav />
                <div className='container_contents'>
                    <form className='product_create_form' onSubmit={createHandler}>
                        <h2>Create New Product</h2>
                        {/* {msg && (<p className='msg'>{msg}</p>)} */}
                        <input type='text' name='title' placeholder='Product title' required onChange={handleChange} />

                        <input type='text' name='desc' placeholder='Product description...' required onChange={handleChange} />

                        <input type='number' name='price' placeholder='Product price' required onChange={handleChange} />

                        <input type='text' name='category' placeholder='Product category' required onChange={handleChange} />

                        <input type='number' name='rating' placeholder='Product rating' required onChange={handleChange} />
                        
                        <input type='number' name='countInStock' placeholder='Product countInStock' required onChange={handleChange} />
                        <input type="file" id="file" onChange={(e) => setImg(e.target.files[0])}/>
                            
                        {loadingCreate ? (
                            <button type='submit' className='update' >Processing...</button>
                        ): (
                            <button type='submit' className='update' >Create</button>    
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default NewProduct