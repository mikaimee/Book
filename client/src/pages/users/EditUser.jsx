import { useEffect, useMemo } from 'react'
import Layout from '../../components/Layout'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserProfile, updateProfile } from '../../services/user'
import { userActions } from '../../store/userReducer'
import toast from 'react-hot-toast'

const EMAIL_VALID = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const PASSWORD_VALID = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/

const EditUser = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const userState = useSelector((state) => state.user);

    const {
        data: profileData,
        isLoading: profileIsLoading,
    } = useQuery({
        queryFn: () => {
            return getUserProfile({ token: userState?.userInfo?.token })
        },
        queryKey: ["profile"]
    })

    const { mutate, isLoading: updateIsLoading } = useMutation({
        mutationFn: ({ firstName, lastName, email, password }) => {
            return updateProfile({
                token: userState.userInfo.token,
                userData: { firstName, lastName, email, password }
            })
        },
        onSuccess: (data) => {
            dispatch(userActions.setUserInfo(data))
            localStorage.setItem("account", JSON.stringify(data))
            queryClient.invalidateQueries(["profile"])
            toast.success("Profile has been updated")
            navigate('/user/profile')
        },
        onError: (error) => {
            toast.error(error.message)
            console.log(error)
        }
    })

    useEffect(() => {
        if (!userState.userInfo) {
        navigate("/");
        }
    }, [navigate, userState.userInfo]);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        },
        values: useMemo(() => {
            return {
                firstName: profileIsLoading ? "" : profileData.firstName,
                lastName: profileIsLoading ? "" : profileData.lastName,
                email: profileIsLoading ? "" : profileData.email
            }
        }, [profileData?.firstName, profileData?.lastName, profileData?.email, profileIsLoading]),
        mode: "onChange"
    })

    const submitHandler = (data) => {
        const { firstName, lastName, email, password } = data
        mutate({ firstName, lastName, email, password })
    }

    return (
        <Layout>
            <section>
                <div>
                    <h1>Edit Profile</h1>
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
                                autoComplete="email"
                            />
                            {errors.email?.message && (
                                <p>{errors.email?.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password">New Password (Optional)</label>
                            <input
                                type='password'
                                id='password'
                                {...register("password", {
                                    pattern: {
                                        value: PASSWORD_VALID,
                                        message: "Your password must be 8-24 characters and must include uppercase and lowercase letters, a number, and a special character."
                                    }
                                })}
                                placeholder='Enter new your password'
                            />
                            {errors.password?.message && (
                                <p>{errors.password?.message}</p>
                            )}
                        </div>
                        <button
                            type='submit'
                            disabled={!isValid || profileIsLoading || updateIsLoading}
                        >
                            Update
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    )
}

export default EditUser