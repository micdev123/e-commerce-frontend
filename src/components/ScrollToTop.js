import React, { useEffect, useState } from 'react'
import { FaRegArrowAltCircleUp } from 'react-icons/fa';

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false)
    const toggleVisibility = () => {
        if (window.scrollY > 200) {
            setIsVisible(true)
        }
        else {
            setIsVisible(false)
        }
    }
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility)

        return () => {
            window.removeEventListener('scroll', toggleVisibility)
        }
    }, [])
    return (
        isVisible && (
            <div className='ToggleBtn'>
                <FaRegArrowAltCircleUp onClick={scrollToTop} className='icon'/>
            </div>
        )
    )
}
