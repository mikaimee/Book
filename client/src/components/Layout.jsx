import React from 'react'
import Header from './Header'

const Layout = ({children}) => {
    return (
        <div className='layout-container'>
            <Header/>
            {children}
        </div>
    )
}

export default Layout