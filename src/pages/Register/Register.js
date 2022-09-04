import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AiOutlineShop } from 'react-icons/ai';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../../Store';
import { getError } from '../../utils';
import '../Login/auth.css';
import { Icon } from 'react-icons-kit'
import {eye} from 'react-icons-kit/feather/eye'
import {eyeOff} from 'react-icons-kit/feather/eyeOff'
import { userRequest } from '../../requestController';


const Register = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

   const [type, setType]=useState('password');
    const [icon, setIcon] = useState(eyeOff)
    const handleToggle=()=>{    
        if(type==='password'){
            setIcon(eye);      
            setType('text');
        }
        else{
            setIcon(eyeOff);     
            setType('password');
        }
    }


  const [msg, setmsg] = useState('');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setmsg('Passwords do not match');
      return;
    }
    try {
      const { data } = await userRequest.post("/auth/sign-up", {
        username,
        email,
        password,
      });
      // when dispatching you need to set the type and the payload 
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    }
    catch (err) {
      setmsg(getError(err));
    }
  }

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    <div>
      <div className='auth_container'>
        <Helmet>
          <title>Register</title>     
        </Helmet>
        <Link to='/' className='logo__'>
          <AiOutlineShop className='shop_icon'/>
          <h2>E-Commerce</h2>
        </Link>
        
        <form className='auth_form' onSubmit={submitHandler}>
          {msg && (<p className='msg'>{msg}</p>)}
          <h2>Create An Account</h2>
          <input type='text' name='name' placeholder='Enter name' required onChange={(e) => setUsername(e.target.value)} className='input' />
          <input type='email' name='email' placeholder='Enter email'
            required onChange={(e) => setEmail(e.target.value)} className='input' />
          <div className='Password'>
            <input type={type} name='password' placeholder='Enter password'
              required onChange={(e) => setPassword(e.target.value)} className='input' />
            <span onClick={handleToggle} className='ShowPassword'><Icon icon={icon} /></span>
          </div>
          <input type='password' name='confirm_password' placeholder='confirm password'
            required onChange={(e) => setConfirmPassword(e.target.value)} className='input' />
          <button type='submit' id='signup' className='auth_btn'>Sign-Up</button>
          <p className='caution'>By creating an account you agree to E-commerce conditions of use and sale. </p>
          <button className='info'>
            <Link to={`/login?redirect=${redirect}`} className='link'>
              Already have an account | <span>Login</span>
            </Link>
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register