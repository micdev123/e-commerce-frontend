import { FiShoppingCart, FiMenu } from 'react-icons/fi'
import { MdClose } from 'react-icons/md'
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import Cart from './pages/Cart/Cart';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SingleProduct from './pages/Single-Product/SingleProduct';
import Register from './pages/Register/Register';
import Shipping from './pages/Shipping/Shipping';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Order from './pages/Order/Order';

import { useContext, useState } from 'react';
import { Store } from './Store';
import { MdArrowDropDown } from 'react-icons/md'
import { ImProfile } from 'react-icons/im'
import { MdSpaceDashboard } from 'react-icons/md'
import { RiLogoutCircleLine } from 'react-icons/ri'
import Profile from './pages/Profile/Profile';
import SearchBox from './components/SearchBox';
import Search from './pages/Search/Search';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Orders from './pages/OrderHistories/Orders';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import UserList from './pages/Admin/Users/UserList';
import UserEdit from './pages/Admin/User/UserEdit';
import OrderList from './pages/Admin/Orders/OrderList';
import ProductList from './pages/Admin/Products/ProductList';
import ProductEdit from './pages/Admin/Product/ProductEdit';
import NewProduct from './pages/Admin/NewProduct/NewProduct';
import { AiOutlineDropbox, AiOutlineShop } from 'react-icons/ai';




function App() {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;
    
    const [dropdown, setDropdown] = useState(false);
    const [menu, setMenu] = useState(false);


    // const user = false;
    const signoutHandler = () => {
        ctxDispatch({ type: 'USER_SIGNOUT' });
        localStorage.removeItem('userInfo');
        localStorage.removeItem('shippingAddress');
        localStorage.removeItem('cartItems');
        window.location.href = '/login';
    };
    return (
        <div className="App">
            <Router>
                <div className='container'>
                    <div className='wrapper'>
                        <div className='logo'>
                            <Link to='/'>
                                <AiOutlineShop className='shop_icon'/>
                                <h2>E-Commerce</h2>
                            </Link>
                        </div>
                        <SearchBox />
                        <nav className='navigation'>
                            <div className='menu_lists'>
                                <li>
                                    {userInfo && !userInfo.isAdmin ? (
                                        <div className='dropdown'>
                                            <p>Hello,</p>
                                            <p className='dropdown_email'>
                                                {userInfo.email}
                                                <MdArrowDropDown className='icon' onClick={(e) => setDropdown(!dropdown)} />
                                            </p>
                                            {dropdown && (
                                                <div className='dropdown_menu'>
                                                    <Link to='/profile' className='link' onClick={(e) => setDropdown(false)}>
                                                        <ImProfile className='icon' />
                                                        Profile
                                                    </Link>
                                                    <Link to='/' className='link' onClick={signoutHandler}>
                                                        <RiLogoutCircleLine className='icon'/>
                                                        Logout
                                                    </Link>
                                                </div>
                                            )
                                            }
                                        </div>
                                    )
                                    : userInfo && userInfo.isAdmin ? (
                                        <div className='dropdown'>
                                            <p>Hello,</p>
                                            <p className='dropdown_email'>
                                                {userInfo.email}
                                                <MdArrowDropDown className='icon' onClick={(e) => setDropdown(!dropdown)} />
                                            </p>
                                            {dropdown && (
                                                <div className='dropdown_menu'>
                                                    <Link to='/profile' className='link' onClick={(e) => setDropdown(false)}>
                                                        <ImProfile className='icon' />
                                                        Profile
                                                    </Link>
                                                    <Link to='/admin/dashboard' className='link' onClick={(e) => setDropdown(false)}>
                                                        <MdSpaceDashboard className='icon' />
                                                        Dashboard
                                                    </Link>
                                                    <Link to='/' className='link' onClick={signoutHandler}>
                                                        <RiLogoutCircleLine className='icon'/>
                                                        Logout
                                                    </Link>
                                                </div>
                                            )
                                            }
                                        </div>
                                    ):
                                    (
                                        <Link to='/login'>
                                            <p>Hello, Guest</p>
                                            <p>Login</p>
                                        </Link>
                                    )
                                    }
                                    
                                </li>
                                <li>
                                    <Link to='/orderHistory'>
                                        <p>Return</p>
                                        <p>& Orders</p>
                                    </Link>
                                </li>
                            </div>
                            <li className='cart'>
                                <Link to='/cart' className='cart_incart'>
                                    <FiShoppingCart className='cart_icon' />
                                    {cart.cartItems.length > 0 ?
                                        (
                                            <sup className='incart'>{cart.cartItems.reduce((a, c) => a + c.quantity, 0)}</sup>
                                        )
                                        :
                                        (
                                            <sup className='incart'>0</sup>
                                        )
                                    }
                                    {/* <sup className='incart'>0</sup> */}
                                </Link>
                                <div></div>
                                <span className='cart_price'>${cart.cartItems ? cart.cartItems.reduce((a, c) => a + c.price * c.quantity, 0) : 0}</span>
                            </li>
                        </nav>
                    </div>
                    <div className="small_screen_wrapper">
                        <div className="top">
                            <div className='logo'>
                                <Link to='/'>
                                    <AiOutlineShop className='shop_icon'/>
                                    <h2>E-Commerce</h2>
                                </Link>
                            </div>
                            <nav className='navigation'>
                                {!userInfo && (
                                    <Link to='/login' className='login_link'>
                                        <p>Hello, Guest</p>
                                        <p>Login</p>
                                    </Link>
                                )}
                                
                                <li className='cart'>
                                    <Link to='/cart' className='cart_incart'>
                                        <FiShoppingCart className='cart_icon' />
                                        {cart.cartItems.length > 0 ?
                                            (
                                                <sup className='incart'>{cart.cartItems.reduce((a, c) => a + c.quantity, 0)}</sup>
                                            )
                                            :
                                            (
                                                <sup className='incart'>0</sup>
                                            )
                                        }
                                        {/* <sup className='incart'>0</sup> */}
                                    </Link>
                                </li>
                                {userInfo && (
                                    <div className='Menu_Bar'>
                                        <FiMenu onClick={(e) => setMenu(!menu)} className='menu_bar'/>
                                    </div>
                                )}
                                {menu && (
                                    <div className='menu_mobile'>
                                        <li>
                                            <MdClose onClick={() => setMenu(false)} className='close_btn' />
                                            {userInfo && !userInfo.isAdmin ? (
                                                <div className='mobile_nav'>
                                                    <div className='greeting'>
                                                        <p>Hello,</p>
                                                        <p className='nav_email'>{userInfo.email}</p>
                                                    </div>
                                                    <div className='_menu'>
                                                        <Link to='/orderHistory' className='link' onClick={(e) => setMenu(false)}>
                                                            <AiOutlineDropbox className='icon' />
                                                            Orders
                                                        </Link> 
                                                        <Link to='/profile' className='link' onClick={(e) => setMenu(false)}>
                                                            <ImProfile className='icon' />
                                                            Profile
                                                        </Link>
                                                        <Link to='/' className='link' onClick={signoutHandler}>
                                                            <RiLogoutCircleLine className='icon'/>
                                                            Logout
                                                        </Link>
                                                    </div>
                                                </div>
                                            )
                                            : userInfo && userInfo.isAdmin && (
                                                <div className='mobile_nav'>
                                                    <div className='greeting'>
                                                        <p>Hello,</p>
                                                        <p className='nav_email'>{userInfo.email}</p>
                                                    </div>
                                                    <div className='_menu'>
                                                        <Link to='/profile' className='link' onClick={(e) => setMenu(false)}>
                                                            <ImProfile className='icon' />
                                                            Profile
                                                            </Link>
                                                        <Link to='/orderHistory' className='link' onClick={(e) => setMenu(false)}>
                                                            <AiOutlineDropbox className='icon'/>
                                                            Orders
                                                        </Link>
                                                        <Link to='/admin/dashboard' className='link' onClick={(e) => setMenu(false)}>
                                                            <MdSpaceDashboard className='icon' />
                                                            Dashboard
                                                        </Link>
                                                        <Link to='/' className='link' onClick={signoutHandler}>
                                                            <RiLogoutCircleLine className='icon'/>
                                                            Logout
                                                        </Link>
                                                    </div>
                                                </div>
                                            )
                                            
                                            }
                                            
                                        </li>
                                    </div>
                                )}
                            </nav>
                        </div>
                        <SearchBox />
                    </div>
                </div>
                <main onClick={(e) => setDropdown(false)}>
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route path="/product/:id" element={<SingleProduct />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/shipping" element={<Shipping />} />
                        <Route path="/placeOrder" element={<PlaceOrder />} />
                        <Route path="/order/:id"
                            element={
                                <ProtectedRoute>
                                    <Order />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/orderHistory"
                            element={
                                <ProtectedRoute>
                                    <Orders />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/admin/dashboard"
                            element={ 
                                <AdminRoute>
                                    <Dashboard />
                                </AdminRoute>
                            }
                        />
                        <Route path="/admin/users"
                            element={ 
                                <AdminRoute>
                                    <UserList />
                                </AdminRoute>
                            }
                        />
                        <Route path="/admin/user/:id"
                            element={
                                <AdminRoute>
                                    <UserEdit />
                                </AdminRoute>
                            }
                        />
                        <Route path="/admin/products"
                            element={ 
                                <AdminRoute>
                                    <ProductList />
                                </AdminRoute>
                            }
                        />
                        <Route path="/admin/product/:id"
                            element={ 
                                <AdminRoute>
                                    <ProductEdit />
                                </AdminRoute>
                            }
                        />
                        <Route path="/admin/newProduct/"
                            element={ 
                                <AdminRoute>
                                    <NewProduct />
                                </AdminRoute>
                            }
                        />
                        <Route path="/admin/orders"
                            element={ 
                                <AdminRoute>
                                    <OrderList />
                                </AdminRoute>
                            }
                        />
                    </Routes>
                </main>
            </Router>
        </div>
    );
}

export default App;
