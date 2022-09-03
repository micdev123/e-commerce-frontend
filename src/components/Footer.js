import React from 'react';
import { BsFillPhoneFill } from 'react-icons/bs';
import { MdMyLocation, MdEmail } from 'react-icons/md';
import { AiOutlineShop } from 'react-icons/ai';
import './css/footer.css';

const Footer = () => {
    return (
        <div className='footer'>
            <div className='footer_container'>
                <div className='logo'>
                    <a href='/'>
                        <AiOutlineShop className='shop_icon' />
                        <h2>E-Commerce</h2>
                    </a>
                </div>
                <div className='footer_contents'>
                    <div className='content'>
                        <h2>Get In Touch</h2>
                        <div className='contact_info'>
                            <MdMyLocation className="icon" />
                            <p>Mama Beach Village</p>
                        </div>
                        <div className='contact_info'>
                            <BsFillPhoneFill className="icon" />
                            <p>+23279596449</p>
                        </div>
                        <div className='contact_info'>
                            <MdEmail className="icon" />
                            <p>michlawbang123@gmail.com</p>
                        </div>

                    </div>
                    <div className='content content2 Big_Screen_Footer'>
                        <h2>Store</h2>
                        <p>Smart Phones</p>
                        <p>Smart Watches</p>
                        <p>Headphones</p>
                        <p>Speakers</p>

                    </div>
                    <div className='content content2 Big_Screen_Footer'>
                        <h2>Account</h2>
                        <p>My Account</p>
                        <p>Cart</p>
                        <p>Wishlist</p>
                    </div>

                    <div className='Footer_Mobile'>
                        <div className='content content2'>
                            <h2>Store</h2>
                            <p>Smart Phones</p>
                            <p>Smart Watches</p>
                            <p>Headphones</p>
                            <p>Speakers</p>
                        </div>
                        <div className='content content2'>
                            <h2>Account</h2>
                            <p>My Account</p>
                            <p>Cart</p>
                            <p>Wishlist</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer