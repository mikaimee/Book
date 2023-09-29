import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {logout} from '../store/user'


const Header = () => {

    const [isSmallScreen, setIsSmallScreen] = useState(false)
    const [selectedOption, setSelectedOption] = useState('')

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const userState = useSelector(state => state.user)

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 768)
        }
        return () => {
            window.removeEventListener('resize', handleResize)
        }
        console.log(isSmallScreen)
    }, [])

    const handleOptionChange = (e) => {
        const selectedValue = e.target.selectedValue
        setSelectedOption(selectedValue)
        navigate(selectedValue)
    }

    const logoutHandler = () => {
        dispatch(logout())
        navigate('/')
    }

    return (
        <section className='header-section'>
            <header>
                <Link to="/">
                    <h1>My Book Shelf</h1>
                </Link>
            </header>
            <div>
                {isSmallScreen && (
                    <div className='header-dropdown'>
                        <select value={selectedOption} onChange={handleOptionChange}>
                            {userState.userInfo ? (
                                <>
                                    <option value="/user/profile">Profile</option>
                                    <option value="/addBook">Add Books</option>
                                    <option value="/myLibrary">My Library</option>
                                    <option value="/logout">Logout</option>
                                </>
                            ) : (
                                <option value="/login">Login</option>
                            )}
                        </select>
                    </div>
                )}
                {!isSmallScreen && (
                    <div>
                        {userState.userInfo ? (
                            <>
                                <button onClick={() => navigate('/user/profile')}>Profile</button>
                                <button onClick={() => navigate('/addBook')}>Add Books</button>
                                <button onClick={() => navigate('/myLibrary')}>My Library</button>
                                <button onClick={logoutHandler}>Logout</button>
                            </>
                        ) : (
                            <button onClick={() => navigate('/login')}>Log In</button>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}

export default Header