import React, { useContext, useEffect, useReducer, useState } from 'react'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../../components/Footer';
import { Store } from '../../Store';
import { getError } from '../../utils';

import '../Order/order.css'
import Skeleton from '../../components/Skeleton';
import { userRequest } from '../../requestController';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
        return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
        return { ...state, loading: false, order: action.payload, error: '' };
        case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
        case 'PAY_REQUEST':
          return { ...state, loadingPay: true };
        case 'PAY_SUCCESS':
          return { ...state, loadingPay: false, successPay: true };
        case 'PAY_FAIL':
          return { ...state, loadingPay: false };
        case 'PAY_RESET':
          return { ...state, loadingPay: false, successPay: false };
        case 'DELIVER_REQUEST':
          return { ...state, loadingDeliver: true };
        case 'DELIVER_SUCCESS':
          return { ...state, loadingDeliver: false, successDeliver: true };
        case 'DELIVER_FAIL':
          return { ...state, loadingDeliver: false };
        case 'DELIVER_RESET':
          return {
            ...state,
            loadingDeliver: false,
            successDeliver: false,
          };
        default:
        return state;
    }
}

const Order = () => {
    const { state } = useContext(Store);
    const { userInfo } = state;

    const params = useParams();
    const { id: orderId } = params;
    const navigate = useNavigate();

    const [msg, setMsg] = useState('');


    const [{ loading, error, order, successPay, loadingPay, loadingDeliver, successDeliver }, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
        successPay: false,
        loadingPay: false,
    });

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: { value: order.totalPrice },
                },
            ],
        })
        .then((orderID) => {
            return orderID;
        });
    }

    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            // updating the backend
            try {
                dispatch({ type: 'PAY_REQUEST' });
                const { data } = await userRequest.put(`orders/${order._id}/pay`, details,
                {
                    headers: { token: `Bearer ${userInfo.accessToken}` },
                }
                );
                dispatch({ type: 'PAY_SUCCESS', payload: data });
            }
            catch (err) {
                dispatch({ type: 'PAY_FAIL', payload: getError(err) });
                setMsg(getError(err));
            }
        });
    }

    function onError(err) {
        setMsg(getError(err));
    }


    useEffect(() => {
        const fetchOrder = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await userRequest.get(`orders/${orderId}`, {
                    headers: { token: `Bearer ${userInfo.accessToken}`},
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            }
            catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };

        if (!userInfo) {
            return navigate('/login');
        }
        // fetchOrder();
        if (!order._id || successPay || successDeliver || (order._id && order._id !== orderId)) {
            fetchOrder();
            if (successPay) {
                dispatch({ type: 'PAY_RESET' });
            }
            if (successDeliver) {
                dispatch({ type: 'DELIVER_RESET' });
            }
        }
        else {
            const loadPaypalScript = async () => {
                const { data: clientId } = await userRequest.get('/keys/paypal', {
                    headers: { token: `Bearer ${userInfo.accessToken}` },
                });
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': clientId,
                        currency: 'USD',
                    },
                });
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            };
            loadPaypalScript();
        }
    }, [order, orderId, userInfo, navigate, paypalDispatch, successPay, successDeliver]);

    async function deliverOrderHandler() {
        try {
            dispatch({ type: 'DELIVER_REQUEST' });
            const { data } = await userRequest.put(`orders/${order._id}/deliver`,
                {},
                {
                    headers: { token: `Bearer ${userInfo.accessToken}` },
                }
            );
            dispatch({ type: 'DELIVER_SUCCESS', payload: data });
        }
        catch (err) {
            setMsg(getError(err));
            dispatch({ type: 'DELIVER_FAIL' });
        }
    }
    
    return (
        loading ? (<Skeleton type='circle' />) : error ? (<div className="danger">{error}</div>) :
        (
            <div>
                <div className='main_container_'>
                    <Helmet>
                        <title>Order {orderId}</title>     
                    </Helmet>
                    {msg && (<p className='msg'>{msg}</p>)}
                    <div className='order_container'>
                        <div className='order_info'>
                            <div className='shipping_details'>
                                <p className='order__Id'>OrderId: {orderId}</p>
                                <div className='head'>
                                    <h2>Shipping Address</h2>
                                </div>
                                <p><span>Name:</span>{order.shippingAddress.fullname}</p>
                                <p className='email'><span>Email:</span>{order.shippingAddress.email}</p>
                                <p><span>Tell:</span>{order.shippingAddress.phone_number}</p>
                                <p><span>Address:</span>{order.shippingAddress.address}</p>
                                {order.isDelivered ? (
                                    <p className="success_">
                                        Delivered at {order.deliveredAt}
                                    </p>
                                ) : (
                                    <p className="danger_">Not Delivered</p>
                                )}
                            </div>
                            <div className='payment_'>
                                <h2>Payment</h2>
                                <p><span>Method:</span> {order.paymentMethod}</p>
                                {order.isPaid ? (
                                    <p className="success_">
                                        Paid at {order.paidAt}
                                    </p>
                                ) : (
                                    <p className="danger_">Not Paid</p>
                                )}
                            </div>
                            <div className='yourOrder'>
                                <h2>Your Order</h2>
                                <div className='order__contents'>
                                    {order.orderItems.map((item) => (
                                        <div className='order__content' key={item._id}>
                                            <div className='item'>
                                                <div className='item_img'>
                                                    <img src={item.image} alt={item.name} />
                                                </div>
                                                <div className='item_content'> 
                                                    <p>{item.name} *  <span> {item.quantity}</span></p>
                                                    <p>${item.price}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='OrderAction'>
                            <h2>Order Summary</h2>
                            <div className='OrderActionContainer'>
                                <div className='info_'>
                                    <p>Products In Cart</p>
                                    <p>{order.orderItems.length} Items</p>
                                </div>
                                <div className='info_'>
                                    <p>Cart Subtotal</p>
                                    <p>${order.itemsPrice.toFixed(2)}</p>
                                </div>
                                <div className='info_'>
                                    <p>Shipping</p>
                                    <p>${order.shippingPrice.toFixed(2)}</p>
                                </div>
                                <div className='info_'>
                                    <p>Tax</p>
                                    <p>${order.taxPrice.toFixed(2)}</p>
                                </div>
                                <div className='total'>
                                    <p>Total</p>
                                    <p>${order.totalPrice.toFixed(2)}</p>
                                </div>
                            </div>
                            {!order.isPaid && (
                                <>
                                    {isPending ? (
                                    <Skeleton type='circle'/>
                                    ) : (
                                    <div className='paypal_btn'>
                                        <PayPalButtons
                                            createOrder={createOrder}
                                            onApprove={onApprove}
                                            onError={onError}
                                        ></PayPalButtons>
                                    </div>
                                    )}
                                    {loadingPay && <Skeleton type='circle'/>}
                                </>
                            )}
                            {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <>
                                    {loadingDeliver && <Skeleton type='circle'/>}
                                    <button type="button" className='Order_action_btn' onClick={deliverOrderHandler}>
                                        Deliver Order
                                    </button>
                                </>
                            )}
                            
                        </div>
                    </div>
                    
                </div>
                <Footer />
            </div>
        )
    )
}

export default Order