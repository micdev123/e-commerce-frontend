import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import SideNav from '../../../components/SideNav';
import { Store } from '../../../Store';
import { getError } from '../../../utils';

import { MdDelete } from 'react-icons/md'
import { AiFillEdit } from 'react-icons/ai';

import './userList.css'
import { HiUsers } from 'react-icons/hi';
import Skeleton from '../../../components/Skeleton';
import { userRequest } from '../../../requestController';


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
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: false };
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loadingDelete: false,
                successDelete: true,
            };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false };
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };
        default:
            return state;
    }
};

const UserList = () => {
    const navigate = useNavigate();
    const [{ loading, error, users, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        });

    const { state } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        const fetchData = async () => {
        try {
            dispatch({ type: 'FETCH_REQUEST' });
            const { data } = await userRequest.get(`users`, {
                headers: {
                    token: `Bearer ${userInfo.accessToken}`
                },
            });
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
        }
        catch (err) {
            dispatch({ type: 'FETCH_FAIL', payload: getError(err), });
        }
        };
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
        } else {
            fetchData();
        }
    }, [userInfo, successDelete]);

    const deleteHandler = async (user) => {
        if (window.confirm('Are you sure to delete?')) {
            try {
                dispatch({ type: 'DELETE_REQUEST' });
                await userRequest.delete(`users/${user._id}`, {
                    headers: {
                        token: `Bearer ${userInfo.accessToken}`
                    },
                });
                dispatch({ type: 'DELETE_SUCCESS' });
            }
            catch (error) {
                dispatch({type: 'DELETE_FAIL',});
            }
        }
    };
    return (
        <div>
            <Helmet>
                <title>Dashboard | Users</title>
            </Helmet>
            {loadingDelete && <Skeleton type="circle"/>}
            {loading ? (<Skeleton type="circle"/>) : error ? (<p className="danger">{error}</p>) : (
                <div className='admin_container'>
                    <SideNav />
                    <div className='container_contents'>
                        <div className='Users_Container'>
                            <h2><HiUsers /> Users List</h2>
                            <div className="table">
                                <div className='head'>
                                    <p>ID</p>
                                    <p>User</p>
                                    <p>Email</p>
                                    <p>Status</p>
                                    <p>Action</p>
                                </div>
                                <div className='tbody'>
                                    {users.map((user) => (
                                    <div className='tb_content' key={user._id}>
                                        <p>{user._id.length >= 15 ? `${user._id.substring(0, 17)}...` : user._id}</p>
                                        <p>{user.username}</p>
                                        <p>{user.email}</p>
                                        <p>{user.isAdmin ? 'admin' : 'customer'}</p>
                                        <div className='userAction'>
                                            <AiFillEdit onClick={() => navigate(`/admin/user/${user._id}`)} className='icon' />
                                            <MdDelete onClick={() => deleteHandler(user)} className=' icon trash' />
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            </div>

                            <div className="tablet_view_">
                                <div className='head'>
                                    <p>ID</p>
                                    <p>User</p>
                                    <p>Status</p>
                                    <p>Action</p>
                                </div>
                                <div className='tbody'>
                                    {users.map((user) => (
                                    <div className='tb_content' key={user._id}>
                                        <p>{user._id.length >= 15 ? `${user._id.substring(0, 17)}...` : user._id}</p>
                                        <p>{user.username}</p>
                                        <p>{user.isAdmin ? 'admin' : 'customer'}</p>
                                        <div className='userAction'>
                                            <AiFillEdit onClick={() => navigate(`/admin/user/${user._id}`)} className='icon' />
                                            <MdDelete onClick={() => deleteHandler(user)} className='icon trash' />
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mobile_view_">
                                <div className='head'>
                                    <p>ID</p>
                                    <p>User</p>
                                    <p>Action</p>
                                </div>
                                <div className='tbody'>
                                    {users.map((user) => (
                                    <div className='tb_content' key={user._id}>
                                            <p>{user._id.length >= 15 ? `${user._id.substring(0, 10)}...` : user._id}</p>
                                            <p>{user.username}</p>
                                        <div className='userAction'>
                                            <AiFillEdit onClick={() => navigate(`/admin/user/${user._id}`)} className='icon' />
                                            <MdDelete onClick={() => deleteHandler(user)} className='icon trash' />
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserList