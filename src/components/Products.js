import React, { useEffect, useReducer } from 'react';
import Product from './Product';
import Skeleton from './Skeleton';

import './css/products.css';
import { userRequest } from '../requestController';
// import axios from 'axios';

// import data from '../data'; // front-end data.js :: initial before getting product from backend

const initialState = {
    products: [],
    loading: true,
    error: '',
};

// product reducer to manage product state
const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, isLoading: true };
        case 'FETCH_SUCCESS':
            return { ...state, products: action.payload, isLoading: false }; 
        case 'FETCH_FAIL':
            return { ...state, isLoading: false, error: action.payload }; 
        default:
            return state; //Current state
    }
}


const Products = () => {
    // React Hook State
    // const [products, setProducts] = useState([]);
    const [{ isLoading, error, products }, dispatch] = useReducer(reducer, initialState); // instead of useState()
    useEffect(() => {
        // fetch products from backend :: Ajax request
        const fetchProducts = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await userRequest.get("products");
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
                // setProduct(data);
            }
            catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: error.message });
                //console.log("Failed!");
            }
        }
        // called fetchProducts() fnx
        fetchProducts();
    }, [])
    

    return (
        <div className='ProductWrapper'>
            {isLoading ? <Skeleton type="products" /> :
                (
                    products && products.map((product) => (
                        <Product item={product} key={product._id} />
                    ))
                )
            }
        </div>
    )
}

export default Products