import { useEffect } from 'react'
import Layout from '../../components/Layout'
import { signup } from '../../services/auth'
import { userActions } from '../../store/userReducer'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation } from '@tanstack/react-query'

const EMAIL_VALID = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const PASSWORD_VALID = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/

const Register = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userState = useSelector(state => state.user)

    const { mutate, isLoading } = useMutation({
        mutationFn: ({ firstName, lastName, email, password }) => {
            return signup({ firstName, lastName, email, password })
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

    const { register, handleSubmit, formState: {errors, isValid}, watch } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        mode: "onChange"
    })

    const submitHandler = (data) => {
        const { firstName, lastName, email, password } = data
        mutate({ firstName, lastName, email, password })
    }

    const password = watch('password')

    return (
        <Layout>
            <section>
                <div>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit(submitHandler)}>
                        <div>
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type='text'
                                id='firstName'
                                {...register("firstName", {
                                    required: {
                                        value: true,
                                        message: "First Name is required"
                                    }
                                })}
                                placeholder='Enter your first name'
                            />
                            {errors.firstName?.message && (
                                <p>{errors.firstName?.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type='text'
                                id='lastName'
                                {...register("lastName", {
                                    required: {
                                        value: true,
                                        message: "Last Name is required"
                                    }
                                })}
                                placeholder='Enter your last name'
                            />
                            {errors.lastName?.message && (
                                <p>{errors.lastName?.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                type='email'
                                id='email'
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: "Email is required"
                                    },
                                    pattern: {
                                        vallue: EMAIL_VALID,
                                        message: "Your email must be in the correct format"
                                    }
                                })}
                                placeholder='Enter your email'
                            />
                            {errors.email?.message && (
                                <p>{errors.email?.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                type='password'
                                id='password'
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message: "Password is required"
                                    },
                                    pattern: {
                                        value: PASSWORD_VALID,
                                        message: "Your password must be 8-24 characters and must include uppercase and lowercase letters, a number, and a special character."
                                    }
                                })}
                                placeholder='Enter your password'
                            />
                            {errors.password?.message && (
                                <p>{errors.password?.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type='password'
                                id='confirmPassword'
                                {...register("confirmPassword", {
                                    required: {
                                        value: true,
                                        message: "Confirm Password is required"
                                    },
                                    validate: (value) => {
                                        if(value !== password) {
                                            return "Passwords do not match"
                                        }
                                    }
                                })}
                                placeholder='Enter confirm password'
                            />
                            {errors.confirmPassword?.message && (
                                <p>{errors.confirmPassword?.message}</p>
                            )}
                        </div>
                        <Link to="/login">
                            <p>Already have an account?</p>
                        </Link>
                        <button
                            type='submit'
                            disabled={!isValid || isLoading}
                        >
                            Register
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    )
}

export default Register