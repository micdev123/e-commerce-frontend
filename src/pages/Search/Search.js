import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Product from '../../components/Product';
import Skeleton from '../../components/Skeleton';
import { userRequest } from '../../requestController';
import { getError } from '../../utils';
import Header from '../Home/Header/Header';


const ProductWrapper = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    /* margin-top: 2rem; */

    
    /* Tablet Devices :: Media Queries */
    @media screen and (min-width : 768px) and (max-width : 1024px) {
        grid-template-columns: repeat(2, 1fr);
    }

    /* Mobile Devices :: Media Queries */
    @media screen and (min-width : 320px) and (max-width : 480px) {
        grid-template-columns: 1fr;
    }
`

const Search = () => {
    // const navigate = useNavigate();

    const { search } = useLocation();
    const searchKeyword = new URLSearchParams(search);
    const query = searchKeyword.get('query') || '';
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [msg, setMsg] = useState('')

    // console.log(query);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data } = await userRequest.get('products');
                filterData(data, query);
                setLoading(false)
            }
            catch (error) {
                setMsg(getError(error));
            }
        }
        fetchData();
    }, [query])

    const filterData = (products, query) => {
        const result = products.filter((product) => product.title.toLowerCase().includes(query.toLowerCase()) || product.category.toLowerCase().includes(query.toLowerCase()));
        setProducts(result);
    }
    console.log(products);
    return (
        <div>
            <Header />
            <Helmet>
                <title>Search Product</title>
            </Helmet>
            {loading ? (<Skeleton type='circle'/>) : (
                <div className='main_container'>
                    {products.length === 0 && (
                        <div>No Product Found</div>
                    )}

                    <ProductWrapper>
                        {products.map((product) => (
                            <div className="mb-3" key={product._id}>
                                <Product item={product}></Product>
                            </div>
                        ))}
                    </ProductWrapper>
                </div>
            )}
        </div>
    )
}

export default Search