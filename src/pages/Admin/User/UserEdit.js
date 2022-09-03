import React, { useContext, useEffect, useReducer, useState } from 'react'
import "./userEdit.css";
import SideNav from '../../../components/SideNav';
import { Store } from '../../../Store';
import { useNavigate, useParams } from 'react-router-dom';
import { getError } from '../../../utils';
import { Helmet } from 'react-helmet-async';
import Skeleton from '../../../components/Skeleton';
import { userRequest } from '../../../requestController';



const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};


const UserEdit = () => {
    const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const { state } = useContext(Store);
    const { userInfo } = state;

    const params = useParams();
    const { id: userId } = params;
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const [msg, setmsg] = useState('');

    useEffect(() => {
        const fetchData = async () => {
        try {
            dispatch({ type: 'FETCH_REQUEST' });
            const { data } = await userRequest.get(`users/find/${userId}`, {
                headers: {
                    token: `Bearer ${userInfo.accessToken}`
                },
            });
            setUsername(data.username);
            setEmail(data.email);
            setIsAdmin(data.isAdmin);
            dispatch({ type: 'FETCH_SUCCESS' });
        }
        catch (err) {
            dispatch({ type: 'FETCH_FAIL', payload: getError(err), });
        }
        };
        fetchData();
    }, [userId, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            await userRequest.put(`users/${userId}`,
                {   _id: userId, 
                    username,
                    email,
                    isAdmin
                },
                {
                    headers: {
                        token: `Bearer ${userInfo.accessToken}`
                    },
                }
            );
            dispatch({ type: 'UPDATE_SUCCESS',});
            navigate('/admin/users');
        }
        catch (error) {
            dispatch({ type: 'UPDATE_FAIL' });
        }
    };
    return (
        <div className='admin_container'>
            <Helmet>
                <title>Edit User ${userId}</title>
            </Helmet>
            <SideNav />
            <div className='container_contents'>
                <div className="user">
                    {loading ? (<Skeleton type="circle"/> ) : error ? ( <p className="danger">{error}</p>) : (
                        <form className='edit_form' onSubmit={submitHandler}>
                            {msg && (<p className='msg'>{msg}</p>)}
                            <input type='text' name='name' placeholder='Enter username' value={username} required onChange={(e) => setUsername(e.target.value)} />
                            <input type='email' name='email' placeholder='Enter email' value={email}
                                required onChange={(e) => setEmail(e.target.value)} />
                            <p className='isAdmin_' >
                                <input type='checkbox' checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
                                <span>isAdmin</span>
                            </p>
                            {loadingUpdate ? (
                                <button type='submit' className='update' >Processing...</button>
                            ): (
                                <button type='submit' className='update' >Update</button>    
                            )}
                            
                        </form>
                    )
                    }
                </div>
            </div>
        </div>
    )
}

export default UserEdit