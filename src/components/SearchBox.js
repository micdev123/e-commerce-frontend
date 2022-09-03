import React, { useState } from 'react'
import { BiSearchAlt } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

import './css/searchBox.css'

const SearchBox = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const submitHandler = (e) => {
        e.preventDefault();
        navigate(query ? `/search/?query=${query}` : '/search');
    };
    return (
        <form onSubmit={submitHandler} className='search desktop'> 
            <input type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <button type="submit" className="search_btn">
                <BiSearchAlt className="icon" />
            </button>
        </form>
    )
}

export default SearchBox