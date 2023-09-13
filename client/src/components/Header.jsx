import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {logout} from '../store/user'


const Header = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const userState = useSelector(state => state.user)

    const logoutHandler = () => {
        dispatch(logout())
        navigate('/')
    }

    return (
        <section>
            <header>
                <Link to="/">
                    <h1>My Book Shelf</h1>
                </Link>
            </header>
            <div>
                {userState.userInfo ? (
                    <div>

                        <button
                            onClick={() => navigate('/user/profile')}
                        >
                            Profile
                        </button>
                        <button>
                            Add Books
                        </button>
                        <button
                            type='button'
                            onClick={logoutHandler}
                        >
                            Logout
                        </button>
                    </div>
                ): (
                    <button
                        onClick={() => navigate('/login')}
                    >
                        Log In
                    </button>
                )}
            </div>
        </section>
    )
}

export default Header