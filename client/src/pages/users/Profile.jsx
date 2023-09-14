import React, { useEffect } from 'react'
import Layout from '../../components/Layout'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { getUserProfile } from '../../services/user'
import { userActions } from '../../store/userReducer'


const Profile = () => {

    const navigate = useNavigate()
    const userState = useSelector((state) => state.user);

    const {
        data: profileData
    } = useQuery({
        queryFn: () => {
            return getUserProfile({ token: userState?.userInfo?.token })
        },
        queryKey: ["profile"]
    })
    
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
                    <p>First Name: {profileData.firstName}</p>
                    <p>Last Name: {profileData.lastName}</p>
                    <p>Email: {profileData.email}</p>
                </div>
                <div>
                    <Link to="/user/edit">
                        <button>Edit</button>
                    </Link>
                    {/* <button
                        disabled={isLoadingDeleteUser}
                        type='button'
                        onClick={() => {
                            deleteHandler({
                                _id: profileData._id,
                                token: userState.userInfo.token
                            })
                        }}
                    >
                        Delete
                    </button> */}
                </div>
            </section>
        </Layout>
    )
}

export default Profile