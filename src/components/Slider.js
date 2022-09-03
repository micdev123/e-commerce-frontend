import React, { useState } from 'react';
import { MdArrowLeft, MdArrowRight } from 'react-icons/md';
import styled from "styled-components";
import { BsFacebook, BsInstagram, BsGithub, BsTwitter } from 'react-icons/bs';
import './css/slider.css';
import { sliderContents } from '../data';


const SliderWrapper = styled.div`
    /* width: 100vw; */
    height: 88vh;
    display: flex;
    transition: all 1.5s ease;
    transform: translateX(${(props) => props.slideIndex * -100}vw);
`


const Slider = () => {
    // Making use of useState() Hook
    const [slideIndex, setSlideIndex] = useState(0);
    // Targetting slider btns handleClick() fnx
    const handleClick = (direction) => {
        direction === 'left' ? 
            setSlideIndex(slideIndex > 0 ? slideIndex - 1 : 2) : 
            setSlideIndex(slideIndex < 2 ? slideIndex + 1 : 0)

    }

    return (
        <div className='slider_container'>
            <div className='arrow1 arrow' onClick={() => handleClick("left")}>
                <MdArrowLeft className='arrow_icon'/>
            </div>
            <SliderWrapper className='slider_wrapper' slideIndex={slideIndex}>
                {sliderContents.map(content => (
                <div className='slide' key={content.id}>
                    <div className='contents'>
                        <div className='content'>
                            <h3 className='title1'>
                                Just Enjoy
                            </h3>
                            <h1 className='title2'>
                                {content.title2}
                            </h1>
                            <p className='des'>
                            {content.desc}
                            </p>
                            <p className='price'>$<span>{content.price}</span>.00</p>

                            <div className='cta_btns'>
                                <button className='buy'>Show Now</button>
                                <button className='explore'>Explore</button>
                            </div>
                        </div>
                        <div className='content_img'>
                            <img src={content.img} alt={content.img}/>
                        </div>
                    </div>
                </div>
                ))}
            </SliderWrapper>

            <div className='arrow2 arrow' onClick={() => handleClick("right")}>
                <MdArrowRight className='arrow_icon'/>
            </div>

            <div className='social'>
                <ul>
                    <li>
                        <a target="_blank" rel="noreferrer" href='https://github.com/micdev123/e-commerce_project'><BsGithub /></a>
                    </li>
                    <li>
                        <a href='/'><BsTwitter /></a>
                    </li>
                    <li>
                        <a href='/'><BsInstagram /></a>
                    </li>
                    <li>
                        <a href='/'><BsFacebook /></a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Slider