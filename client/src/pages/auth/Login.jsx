import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { signin } from '../../services/auth'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { userActions} from '../../store/userReducer'
import './auth.css'

const EMAIL_VALID = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const PASSWORD_VALID = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/

const Login = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userState = useSelector(state => state.user)

    const { mutate, isLoading } = useMutation({
        mutationFn: ({ email, password }) => {
            return signin({ email, password })
        },
        onSuccess: (data) => {
            console.log(data)
            dispatch(userActions.setUserInfo(data))
            localStorage.setItem('account', JSON.stringify(data))
        },
        onError: (error) => {
            toast.error(error.message)
            console.log(error)
        }
    })

    useEffect(() => {
        if(userState.userInfo) {
            navigate('/')
        }
    }, [navigate, userState.userInfo])

    const {register, handleSubmit, formState: {errors, isValid}} = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        mode: "onChange"
    })

    const submitHandler = (data) => {
        const { email, password } = data
        mutate({ email, password })
    }

    return (
        <Layout>
            <section className='auth-form-section'>
                <div>
                    <form onSubmit={handleSubmit(submitHandler)}>
                        <h2>Login</h2>
                        <div className='auth-form-group'>
                            <label htmlFor='email'>Email</label>
                            <input 
                                type='email'
                                id='email'
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: "Email is required"
                                    },
                                    pattern: {
                                        value: EMAIL_VALID,
                                        message: "Your email must be in the correct format"
                                    }
                                })}
                                placeholder='Enter email'
                            />
                            {errors.email?.message && (
                                <p>{errors.email?.message}</p>
                            )}
                        </div>
                        <div className='auth-form-group'>
                            <label htmlFor='password'>Password</label>
                            <input 
                                type='password'
                                id='password'
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message: "Password is required"
                                    }
                                })}
                                placeholder='Enter password'
                            />
                            {errors.password?.message && (
                                <p>{errors.password?.message}</p>
                            )}
                        </div>
                        <div className='auth-link-account'>
                            <p>
                                Need an account? <Link to="/register">Sign up</Link>
                            </p>
                        </div>
                        <button 
                            type='submit'
                            disabled={!isValid || isLoading}
                            className='auth-submit-button'
                        >
                            Login
                        </button> 
                    </form>
                </div>
            </section>
        </Layout>
    )
}

export default Login