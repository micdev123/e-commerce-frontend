import { useContext, useEffect, useReducer} from "react";
import { AiFillEye, AiOutlineUser } from 'react-icons/ai';

import './css/widgetSm.css'
import { getError } from "../utils";
import { Store } from "../Store";
import { Link } from "react-router-dom";
import Skeleton from "./Skeleton";
import { userRequest } from "../requestController";


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                users: action.payload,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};


export default function WidgetSm() {
    const [{ loading, users, error }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });
    const { state } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        const getUsers = async () => {
            try {
                const { data } = await userRequest.get("users/?new=true", {
                    headers: { token: `Bearer ${userInfo.accessToken}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
                
            }
            catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err),});
            }
        };
        getUsers();
    }, [userInfo]);
    // console.log(users);
  
  
    return (
        loading ? ( <Skeleton type='circle'/> ) : error ? ( <p className="danger">{error}</p>) : (
            <div className="widgetSm">
                <h3 className="widgetSmTitle">New join members</h3>
                <ul className="widgetSmList">
                    {users.map((user) => (
                    <li className="widgetSmListItem" key={user._id}>
                        <AiOutlineUser className="widgetSmIcon" />
                        <div className="widgetSmUser">
                            <span className="widgetSmUsername">{user.username}</span>
                        </div>
                        <Link to='/' className="widgetSmButton">
                            <AiFillEye className="widgetSmIcon" />
                        </Link>
                    </li>
                    ))}
                </ul>
            </div>
        )
    );
}
