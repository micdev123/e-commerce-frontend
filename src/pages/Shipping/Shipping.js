import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import { Store } from '../../Store';

import '../Shipping/shipping.css';

const Shipping = () => {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo, cart: { shippingAddress },} = state;

    const [fullname, setFullName] = useState(shippingAddress.fullname || '');
    const [email, setEmail] = useState(shippingAddress.email || '');
    const [phone_number, setPhoneNumber] = useState(shippingAddress.phone_number || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [address2, setAddress2] = useState(shippingAddress.address2 || '');
    const [paymentMethodName, setPaymentMethod] = useState(shippingAddress.paymentMethodName || 'PayPal');
    

    useEffect(() => {
        if (!userInfo) {
        navigate('/login?redirect=/shipping');
        }
    }, [userInfo, navigate]);
    
    const submitHandler = async (e) => {
        e.preventDefault();
        ctxDispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {
                fullname,
                email,
                phone_number,
                address,
                address2,
                paymentMethodName
            },
        })
        localStorage.setItem('shippingAddress', JSON.stringify(
            {
                fullname,
                email,
                phone_number,
                address,
                address2,
                paymentMethodName,
            })
        );
        navigate('/placeOrder');
    }
    return (
        <div>
            <div className='main_container_'>
                <Helmet>
                    <title>Shipping & Payment Method</title>     
                </Helmet>
                <form className='deliver_form' onSubmit={submitHandler}>
                    <h2>Shipping Address</h2>
                    <div className='form_group'>
                        <label for="name">Fullname</label>
                        <input type="text" id="name"
                            value={fullname}
                            onChange={(e) => setFullName(e.target.value)} required />
                    </div>
                    <div className='form_group'>
                        <label for="email">Email</label>
                        <input type="email" id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className='form_group'>
                        <label for="number">Phone Number</label>
                        <input type="text" id="number"
                            value={phone_number}
                            onChange={(e) => setPhoneNumber(e.target.value)} required />
                    </div>
                    <div className='form_group'>
                        <label for="">Flat, House no., Building, Company, Apartment</label>
                        <input type="text" id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <div className='form_group'>
                        <label for="">Area Street, Village, Town</label>
                        <input type="text" id="address"
                            value={address2}
                            onChange={(e) => setAddress2(e.target.value)} required />
                    </div>
                    <div className='payment_method'>
                        <h2>Payment Method</h2>
                        <label for="PayPal" className='payment'>
                            <input type="radio" id="PayPal" className="radio_input"
                                value="PayPal"
                                checked={paymentMethodName === 'PayPal'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <div className='radio_btn'></div>
                            PayPal
                        </label>
                        <label for="Stripe" className='payment'>
                            <input type="radio" id="Stripe" className="radio_input"
                                value="Stripe"
                                checked={paymentMethodName === 'Stripe'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <div className='radio_btn'></div>
                            Stripe
                        </label>
                    </div>
                    <div className='form_group deliver_btn'>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default Shipping