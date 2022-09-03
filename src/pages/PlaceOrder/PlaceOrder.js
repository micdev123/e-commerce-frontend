import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import { AiFillEdit } from 'react-icons/ai';


import "../PlaceOrder/placeOrder.css";
import { Store } from '../../Store';
import { getError } from '../../utils';
import { userRequest } from '../../requestController';


// reducer is independent of the component
const reducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return { ...state, loading: true };
        case 'CREATE_SUCCESS':
            return { ...state, loading: false };
        case 'CREATE_FAIL':
            return { ...state, loading: false };
        default:
            return state;
    }
};


const PlaceOrder = () => {
    const navigate = useNavigate();

    const [{ loading }, dispatch] = useReducer(reducer, {
        loading: false,
    });

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
    cart.itemsPrice = round2(
        cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    );
    cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
    cart.taxPrice = round2(0.15 * cart.itemsPrice);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

    const [msg, setMsg] = useState('');

    const placeOrderHandler = async () => { 
        try {
            dispatch({ type: 'CREATE_REQUEST' });

            const { data } = await userRequest.post(
                'orders',
                {
                    userId: userInfo._id,
                    username: userInfo.username,
                    orderItems: cart.cartItems.map((item) => ({
                        productId: item._id,
                        name: item.title,
                        quantity: item.quantity,
                        image: item.img,
                        price: item.price,
                    })),
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.shippingAddress.paymentMethodName,
                    itemsPrice: cart.itemsPrice,
                    shippingPrice: cart.shippingPrice,
                    taxPrice: cart.taxPrice,
                    totalPrice: cart.totalPrice,
                },
                {
                    headers: {
                        token: `Bearer ${userInfo.accessToken}`,
                    },
                }
            );
            ctxDispatch({ type: 'CART_CLEAR' });
            dispatch({ type: 'CREATE_SUCCESS' });
            localStorage.removeItem('cartItems');
            navigate(`/order/${data._id}`);
        }
        catch (err) {
            dispatch({ type: 'CREATE_FAIL' });
            setMsg(getError(err));
        }

    }

    useEffect(() => {
        if (!cart.shippingAddress.paymentMethodName) {
            navigate('/shipping');
        }
    }, [cart, navigate]);

    return (
        <div>
            <div className='main_container_'>
                <Helmet>
                    <title>PlaceOrder</title>     
                </Helmet>
                {msg && (<p className='msg'>{msg}</p>)}
                <div className='order_container'>
                    <div className='order_info'>
                        <div className='shipping_details'>
                            <div className='head'>
                                <h2>Shipping Address</h2>
                                <Link to='/shipping' className='link'>
                                    <AiFillEdit className='icon' />
                                </Link>
                            </div>
                            
                            <p><span>Name:</span>{cart.shippingAddress.fullname}</p>
                            <p className='email'><span>Email:</span>{cart.shippingAddress.email}</p>
                            <p><span>Tell:</span>{cart.shippingAddress.phone_number}</p>
                            <p><span>Address:</span>{cart.shippingAddress.address}</p>
                        </div>
                        <div className='payment_'>
                            <h2>Payment</h2>
                            <p><span>Method:</span> {cart.shippingAddress.paymentMethodName}</p>
                        </div>
                        <div className='yourOrder'>
                            <h2>Your Order</h2>
                            <div className='order_contents'>
                                {cart.cartItems.map((item) => (
                                    <div className='order_content' key={item._id}>
                                        <div className='item'>
                                            <div className='item_img'>
                                                <img src={item.img} alt={item._id} />
                                            </div>
                                            <div className='item_content'> 
                                                <p>{item.title} *  <span> {item.quantity}</span></p>
                                                <p>${item.price}</p>
                                            </div>
                                        </div>
                                        <div className='itemActions'>
                                            <Link to='/cart' className='link'>
                                                <AiFillEdit className='icon' />
                                            </Link>
                                        </div>
                                    
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='Order_action'>
                        <h2>Order Summary</h2>
                        <div className='info_'>
                            <p>Products In Cart</p>
                            <p>{cart.cartItems.length} Items</p>
                        </div>
                        <div className='info_'>
                            <p>Cart Subtotal</p>
                            <p>${cart.itemsPrice.toFixed(2)}</p>
                        </div>
                        <div className='info_'>
                            <p>Shipping</p>
                            <p>${cart.shippingPrice.toFixed(2)}</p>
                        </div>
                        <div className='info_'>
                            <p>Tax</p>
                            <p>${cart.taxPrice.toFixed(2)}</p>
                        </div>
                        <div className='total'>
                            <p>Total</p>
                            <p>${cart.totalPrice.toFixed(2)}</p>
                        </div>
                        {loading ? (
                            <button className='Order_action_btn' onClick={placeOrderHandler}>Processing..</button>
                        ) : (
                            <button className='Order_action_btn' onClick={placeOrderHandler}>Place Order</button>
                        )
                    }
                        
                    </div>
                </div>
                
            </div>
            <Footer />
        </div>
    )
}

export default PlaceOrder