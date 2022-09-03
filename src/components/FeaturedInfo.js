import { useContext, useEffect, useMemo, useReducer, useState } from "react";
import { SiEventstore } from 'react-icons/si';
import { AiOutlineDropbox } from 'react-icons/ai';
import { MdOutlineAttachMoney, MdTimeline } from 'react-icons/md';


import { Store } from "../Store";
import { getError } from "../utils";
import './css/featuredInfo.css';

import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, YAxis, } from "recharts";
import { HiUsers } from "react-icons/hi";
import Skeleton from "./Skeleton";
import { userRequest } from "../requestController";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                summary: action.payload,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};


export default function FeaturedInfo() {
    const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [userStats_, setUserStats] = useState([]);

    const MONTHS = useMemo(
      () => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Agu", "Sep", "Oct", "Nov", "Dec",],
      []
    );

    useEffect(() => {
        const getSummary = async () => {
            try {
                const { data } = await userRequest.get('orders/summary', {
                    headers: { token: `Bearer ${userInfo.accessToken}` },
                });
                data.income.map((item) =>
                    setUserStats((prev) => [
                        ...prev,
                        { name: MONTHS[item._id - 1], Sales : item.total }
                    ])
                )
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            }
            catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err),});
            }
        };
        getSummary();
    }, [userInfo, MONTHS]);

    console.log(summary);
    
    return (
        loading ? (<Skeleton type='circle'/>) : error ? (<p className="danger">{error}</p>) : (
            <div className="featured_container_">
                <div className="featured">
                    <div className="featuredItem">
                        <span className="featuredTitle">
                            <MdOutlineAttachMoney className="icon" />
                            Revenue
                        </span>
                        <div className="featuredMoneyContainer">
                            <span className="featuredMoney">
                                ${summary.orders.length === 0 ? 0 : summary.orders[0].totalSales.toFixed(2)}
                            </span>
                        </div>
                        <span className="featuredSub">Compared to last month</span>
                    </div>
                    <div className="featuredItem">
                        <span className="featuredTitle">
                            <SiEventstore className="icon_" />
                            Orders
                        </span>
                        <div className="featuredMoneyContainer">
                            <span className="featuredMoney">
                            {summary.orders.length === 0 ? 0 : summary.orders[0].numOrders}
                            </span>
                        </div>
                        <span className="featuredSub">Compared to last month</span>
                    </div>
                    <div className="featuredItem">
                        <span className="featuredTitle">
                            <HiUsers className="icon" />
                            User
                        </span>
                        <div className="featuredMoneyContainer">
                            <span className="featuredMoney">
                            {summary.users.length === 0 ? 0 : summary.users[0].numUsers}
                            </span>
                        </div>
                        <span className="featuredSub">Compared to last month</span>
                    </div>
                    <div className="featuredItem">
                        <span className="featuredTitle">
                            <AiOutlineDropbox className="icon" />
                            Products
                        </span>
                        <div className="featuredMoneyContainer">
                            <span className="featuredMoney">
                            {summary.products.length === 0 ? 0 : summary.products[0].numProducts}
                            </span>
                        </div>
                        <span className="featuredSub">Compared to last month</span>
                    </div>
                </div>
                
                <div className="chart">
                    <h3 className="chartTitle">
                        <MdTimeline className="icon" />
                        Order Analytics
                    </h3>
                    <ResponsiveContainer width="100%" aspect={4 / 1}>
                        <LineChart data={userStats_}>
                            <Line type="monotone" dataKey= 'Sales' stroke="#5550bd" />
                            {<CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
                            <XAxis dataKey="name" stroke="#5550bd" />
                            <YAxis />
                            <Tooltip />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )
    );
}
