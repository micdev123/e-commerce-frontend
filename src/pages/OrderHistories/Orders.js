import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import Footer from '../../components/Footer'
import { BsFillEyeFill } from 'react-icons/bs'
import { AiOutlineDropbox } from 'react-icons/ai';

import '../OrderHistories/order_history.css'

import { Store } from '../../Store'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getError } from '../../utils'
import Skeleton from '../../components/Skeleton';
import { userRequest } from '../../requestController';




const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
        return {
            ...state,
            orders: action.payload.orders,
            page: action.payload.page,
            pages: action.payload.pages,
            loading: false
          };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};


const Orders = () => {
    const [{ loading, error, orders, pages }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const navigate = useNavigate();
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const page = sp.get('page') || 1;

    const { state } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await userRequest.get(`orders/find/${userInfo._id}?page=${page}`, {
                    headers: { token: `Bearer ${userInfo.accessToken}` }
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            }
            catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(error),});
            }
        };
        fetchData();
    }, [userInfo, page]);

    // console.log(orders);
    return (
        loading ? <Skeleton type='circle'/> : error ? (<p className='msg'>Nothing Yet</p>) :
        (
            <div>
                <div className='main_container_'>
                    <Helmet>
                        <title>Returns_&_Order</title>     
                    </Helmet>
                    <div className='Orders_container'>
                        <div className='Orders'>
                            <h2>
                                <AiOutlineDropbox className='icon' />
                                Your Orders History
                            </h2>
                                <div className='big_screen'>
                                {orders?.length <= 0 ? (<p>Nothing Yet</p>) : (
                                    <>
                                        <div className='orderHead'>
                                            <p>Order ID</p>
                                            <p>Date</p>
                                            <p>Total</p>
                                            <p>Paid</p>
                                            <p>Delivered</p>
                                            <p>Action</p>
                                        </div>
                                        <div className='history'>
                                            {orders?.map((order) => (
                                                <div className='order_' key={order._id}>
                                                    <p>{order?._id}</p>
                                                    <p>{order?.createdAt.substring(0, 10)}</p>
                                                    <p>${order.totalPrice.toFixed(2)}</p>
                                                    {order?.isPaid ? (
                                                        <p className="_success_ _Info_">
                                                            Paid at {order.paidAt.substring(0, 10)}
                                                        </p>
                                                        ) : (
                                                            <p className="_danger_ _Info_">Not Paid</p>
                                                        )
                                                    }
                                                    {order?.isDelivered ? (
                                                            <p className="_success_ _Info_">
                                                                Delivered at {order.deliveredAt.substring(0, 10)}
                                                            </p>
                                                        ) : order.isPaid ? (
                                                            <p className="_pending_ _Info_">Pending</p>
                                                        ) : (
                                                            <p className="_danger_ _Info_">Not Yet</p>
                                                        )
                                                    }
                                                    <p onClick={() => {navigate(`/order/${order._id}`);}} className='view'>
                                                        <BsFillEyeFill className='eye'/>
                                                    </p>
                                                </div>
                                            ))}
                                        </div>  
                                    </>    
                                )}
                            </div>  
                                
                            <div className='tablet_screen'> 
                                {orders?.length <= 0 ? (<p>Nothing Yet</p>) : (
                                    <>
                                        <div className='orderHead'>
                                            <p>Order ID</p>
                                            <p>Date</p>
                                            <p>Total</p>
                                            <p>Action</p>
                                        </div>
                                        <div className='history'>
                                            {orders?.map((order) => (
                                                <div className='order_' key={order._id}>
                                                    <p>{order._id.length >= 10 ? `${order._id.substring(0, 15)}...` : order._id}</p>
                                                    <p>{order.createdAt.substring(0, 10)}</p>
                                                    <p>${order.totalPrice.toFixed(2)}</p>
                                                
                                                    <p onClick={() => { navigate(`/order/${order._id}`); }} className='view'>
                                                        <BsFillEyeFill className='eye' />
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}        
                            </div>

                            <div className='mobile_screen'>  
                                {orders?.length <= 0 ? (<p>Nothing Yet</p>) : (
                                    <>
                                        <div className='orderHead'>
                                            <p>Order ID</p>
                                            <p>Date</p>
                                            <p>Action</p>
                                        </div>
                                        <div className='history'>
                                            {orders.map((order) => (
                                                <div className='order_' key={order._id}>
                                                    <p>{order._id.length >= 15 ? `${order._id.substring(0, 15)}...` : order._id}</p>
                                                    <p>{order.createdAt.substring(0, 10)}</p>
                                                
                                                    <p onClick={() => { navigate(`/order/${order._id}`); }} className='view'>
                                                        <BsFillEyeFill className='eye' />
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}    
                            </div> 

                            <div className='pagination_orderHistory'>
                                {[...Array(pages).keys()].map((x) => (
                                    <Link
                                        className={x + 1 === Number(page) ? 'link active_link' : 'link'}
                                        key={x + 1} to={`/orderHistory?page=${x + 1}`}
                                    >
                                        {x + 1}
                                    </Link>
                                ))}
                            </div>    
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    )
}

export default Orders