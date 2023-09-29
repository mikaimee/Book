import React from 'react'

const SearchBar = () => {
    return (
        <div className='search-bar-container'>
            <input type='text' placeholder='Search...'/>
            <button type='button'>Search</button>
        </div>
    )
}

export default SearchBar