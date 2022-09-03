import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './Header/Header';
import Footer from '../../components/Footer';
import Products from '../../components/Products';
import styled from 'styled-components';
import { ScrollToTop } from '../../components/ScrollToTop';

const Product = styled.div`
  margin: 8rem 0 2rem 0;
`



const Home = () => {
    return (
        <div className='home'>
            <Helmet>
              <title>E-commerce</title>
            </Helmet>
            <Header />
            <div className='main'>
                <div className='main_container'>
                <Product>
                    <Products />
                </Product>
                </div>
            </div>
            <ScrollToTop />
            <Footer />
        </div>
    )
}

export default Home