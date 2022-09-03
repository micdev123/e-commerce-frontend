import React, { useContext, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { Store } from '../../Store';
import { getError } from '../../utils';

import { ImProfile } from 'react-icons/im'

import '../Profile/profile.css'
import { userRequest } from '../../requestController';


const reducer = (state, action) => {
  switch (action.type) {
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

const Profile = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const [username, setUsername] = useState(userInfo.username);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [msg, setMsg] = useState('');

    const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
        loadingUpdate: false,
    });

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await userRequest.put(`users/profile`,
                {
                    username,
                    email,
                    password,
                },
                {
                    headers: { token: `Bearer ${userInfo.accessToken}` },
                }
            );
            dispatch({ type: 'UPDATE_SUCCESS',});
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
        }
        catch (err) {
            dispatch({ type: 'FETCH_FAIL',});
            setMsg(getError(err));
        }
    };

    return (
        <div>
            <div className='main_container'>
                <Helmet>
                    <title>User Profile</title>     
                </Helmet>
                <div className='update_container'>
                    <form className='update_form mobile_update' onSubmit={submitHandler}>
                        <h2>
                            <ImProfile className='icon' />
                            User Profile
                        </h2>
                        {msg && (<p className='msg'>{msg}</p>)}
                        <input type='text' name='name' placeholder='Enter username' value={username}
                            required onChange={(e) => setUsername(e.target.value)} />
                        <input type='email' name='email' placeholder='Enter email' value={email}
                            required onChange={(e) => setEmail(e.target.value)} />
                        <input type='password' name='password' placeholder='Enter password'
                            required onChange={(e) => setPassword(e.target.value)} />
                        <input type='password' name='confirm_password' placeholder='confirm password' required onChange={(e) => setConfirmPassword(e.target.value)} />
                        <button type='submit' id='update'>Update</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile