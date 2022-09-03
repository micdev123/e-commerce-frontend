import { AiFillEye } from 'react-icons/ai';
import { useContext, useEffect, useReducer } from "react";
import { format } from "timeago.js"
import { Store } from "../Store";
import { getError } from "../utils";

import "./css/widgetLg.css";
import Skeleton from "./Skeleton";
import { userRequest } from '../requestController';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                orders: action.payload,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};


export default function WidgetLg() {
    const [{ loading, orders, error }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const { state } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        const getOrders = async () => {
            try {
                const { data } = await userRequest.get('orders/limit5/?new=true', {
                    headers: { token: `Bearer ${userInfo.accessToken}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
                
            }
            catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err),});
            }
        };
        getOrders();
    }, [userInfo]);
    // console.log(orders);

    // const Button = ({ type }) => {
    //     return <button className={"widgetLgButton " + type}>{type}</button>;
    // };
    return (
        loading ? ( <Skeleton type='circle'/> ) : error ? ( <p className="danger">{error}</p>) : (
            <div className="widgetLg">
                <h3 className="widgetLgTitle">Latest transactions</h3>
                <div className="widgetLgTable">
                    <div className="widgetLgTr head">
                        <p className="widgetLgTh">Customer</p>
                        <p className="widgetLgTh">Date</p>
                        <p className="widgetLgTh">Amount</p>
                        <p className="widgetLgTh">Paid</p>
                        <p className="widgetLgTh">Delivered</p>
                    </div>
                    {orders.map((order) => (
                    <div className="widgetLgTr t_row" key={order._id}>
                        <p className="widgetLgUser td">{order.userId.length >= 10 ? `${order.userId.substring(0, 7)}...` : order.userId}</p>
                        <p className="widgetLgDate td">{format(order.createdAt).length >= 5 ? `${format(order.createdAt).substring(0, 10)}... `: format(order.createdAt)}</p>
                        <p className="widgetLgAmount td">${order.totalPrice}</p>
                        {order.isPaid ? (
                            <p className="success_ td">
                                Paid at {order.paidAt.substring(0, 10)}
                            </p>
                            ) : (
                                <p className="danger_ td">Not Paid</p>
                            )
                        }
                        {order.isDelivered ? (
                                <p className="success_ td">
                                    Delivered at {order.deliveredAt.substring(0, 10)}
                                </p>
                            ) : order.isPaid ? (
                                <p className="_pending_ td">Pending</p>
                            ) : (
                                <p className="danger_ td">Not Yet</p>
                            )
                        }
                    </div>
                    ))}
                </div>

                <div className="tablet_view">
                    <div className="widgetLgTr head">
                        <p className="widgetLgTh">Customer</p>
                        <p className="widgetLgTh">Date</p>
                        <p className="widgetLgTh">Amount</p>
                        <p className="widgetLgTh">Paid</p>
                    </div>
                    {orders.map((order) => (
                    <div className="widgetLgTr t_row" key={order._id}>
                        <p className="widgetLgUser td">{order.userId.length >= 10 ? `${order.userId.substring(0, 10)}...` : order.userId}</p>
                        <p className="widgetLgDate td">{format(order.createdAt).length >= 5 ? `${format(order.createdAt).substring(0, 8)}... `: format(order.createdAt)}</p>
                        <p className="widgetLgAmount td">${order.totalPrice}</p>
                        {order.isPaid ? (
                            <p className="success_ td">
                                Paid at {order.paidAt.substring(0, 10)}
                            </p>
                            ) : (
                                <p className="danger_ td">Not Paid</p>
                            )
                        }
                        
                    </div>
                    ))}
                </div>
                

                <div className="mobile_view">
                    <div className="widgetLgTr head">
                        <p className="widgetLgTh">Order Id</p>
                    </div>
                    {orders.map((order) => (
                    <div className="widgetLgTr t_row" key={order._id}>
                        <p className="widgetLgUser td">{order.userId.length >= 10 ? `${order.userId.substring(0, 23)}...` : order.userId}</p>
                        <AiFillEye className="icon" />
                    </div>
                    ))}
                </div>
                
            </div>
        )
    );
}
