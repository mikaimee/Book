import React, { useEffect } from 'react'
import Layout from '../../components/Layout'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query'
import { getUserProfile, deleteUser } from '../../services/user'
import { userActions } from '../../store/userReducer'
import toast from 'react-hot-toast'


const Profile = () => {

    const navigate = useNavigate()
    const userState = useSelector((state) => state.user);
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        error
    } = useQuery({
        queryFn: () => {
            return getUserProfile({token: userState?.userInfo?.token})
        },
        queryKey: ["profile"]
    })

    const {mutate, isLoading: isLoadingDeleteUser} = useMutation({
        mutationFn: ({_id, token}) => {
            return deleteUser({
                _id,
                token
            })
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(["users"])
            toast.success("User has been deleted")
        },
        onError: (error) => {
            toast.error(error.message)
            console.log(error)
        }
    })

    const deleteHandler = ({_id, token}) => {
        mutate({_id, token})
    }

    // console.log(data)
    
    useEffect(() => {
        if (!userState.userInfo) {
            navigate("/")
        }
    }, [navigate, userState.userInfo])

    return (
        <Layout>
            <section>
                <div>
                    <h1>Profile</h1>
                    <p>First Name: {data.firstName} </p>
                    <p>Last Name: {data.lastName} </p>
                    <p>Email: {data.email} </p>
                </div>
                <div>
                    <Link to="/user/edit">
                        <button>Update</button>
                    </Link>
                    <button
                        disabled={isLoadingDeleteUser}
                        type='button'
                        onClick={() => {
                            deleteHandler({
                                _id: data._id,
                                token: userState.userInfo.token
                            })
                        }}
                    >
                        Delete
                    </button>
                </div>
            </section>
        </Layout>
    )
}

export default Profile