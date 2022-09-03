import { Link } from "react-router-dom";
import { SiEventstore } from 'react-icons/si';

import './css/sideNav.css'
import { AiOutlineDropbox, AiOutlineUser } from 'react-icons/ai';
import { HiUsers } from "react-icons/hi";

import { FiMenu } from 'react-icons/fi'
import { useState } from "react";
import { MdClose, MdSpaceDashboard } from "react-icons/md";


export default function SideNav() {
    const [sidebar, setSideBar] = useState(false);
    const [closeBar, setCloseBar] = useState(false);

    const closeSideNav = () => {
        setCloseBar(true);
        setSideBar(false);
    }

    return (
        <>
            <div className="sidebar">
                <div className="sidebarWrapper">
                    <div className="sidebarMenu">
                        <div className="adminImg">
                            <FiMenu className="sidebarMenuBar"/>
                            <AiOutlineUser className="admin_icon" /> 
                        </div>
                        <h3 className="sidebarTitle">Dashboard</h3>
                        <ul className="sidebarList">
                            <Link to="/admin/dashboard" className="link">
                                <li className="sidebarListItem active">
                                    <MdSpaceDashboard className="sidebarIcon" />
                                    <span>Home</span>
                                </li>
                            </Link>
                            <Link to="/admin/users" className="link">
                                <li className="sidebarListItem">
                                    <HiUsers className="sidebarIcon" />
                                    <span>Users</span>
                                </li>
                            </Link>
                            <Link to="/admin/products" className="link">
                                <li className="sidebarListItem">
                                    <AiOutlineDropbox className="sidebarIcon" />
                                    <span>Products</span>
                                </li>
                            </Link>
                            <Link to="/admin/orders" className="link">
                                <li className="sidebarListItem">
                                    <SiEventstore className="sidebarIcon" />
                                    <span>Orders</span>
                                </li>
                            </Link>
                        </ul>
                    </div>
                    
                </div>
            </div>
            <FiMenu className="sidebarMenuBar_mobile" onClick={(e) => setSideBar(!sidebar)} />
            {sidebar && (
                <div className="small_screen_sidebar">
                    <MdClose onClick={closeSideNav} className='close_btn' />
                    <div className="sidebarWrapper">
                        <div className="sidebarMenu">
                            <div className="adminImg">
                                <AiOutlineUser className="admin_icon" />
                            </div>
                            <h3 className="sidebarTitle">Dashboard</h3>
                            <ul className="sidebarList">
                                <Link to="/admin/dashboard" className="link">
                                    <li className="sidebarListItem active">
                                        <MdSpaceDashboard className="sidebarIcon" />
                                        Home
                                    </li>
                                </Link>
                                <Link to="/admin/users" className="link">
                                    <li className="sidebarListItem">
                                        <HiUsers className="sidebarIcon" />
                                        Users
                                    </li>
                                </Link>
                                <Link to="/admin/products" className="link">
                                    <li className="sidebarListItem">
                                        <AiOutlineDropbox className="sidebarIcon" />
                                        Products
                                    </li>
                                </Link>
                                <Link to="/admin/orders" className="link">
                                    <li className="sidebarListItem">
                                        <SiEventstore className="sidebarIcon" />
                                        Orders
                                    </li>
                                </Link>
                            </ul>
                        </div>
                        
                    </div>
                </div>
            )}

        </>
    );
}
