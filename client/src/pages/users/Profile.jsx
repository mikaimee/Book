import React, { useEffect } from 'react'
import Layout from '../../components/Layout'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { getUserProfile } from '../../services/user'
import ProfilePic from '../../components/user/ProfilePic'
import './user.css'

const Profile = () => {

    const navigate = useNavigate()
    const userState = useSelector((state) => state.user);

    const {
        data: profileData,
        isLoading,
        isError,
        error
    } = useQuery({
        queryFn: () => {
            return getUserProfile({ token: userState?.userInfo?.token })
        },
        queryKey: ["profile"]
    })

    // console.log('profileData:', profileData)
    
    useEffect(() => {
        if (!userState.userInfo) {
            navigate("/")
        }
    }, [navigate, userState.userInfo])

    return (
        <Layout>
            <section className='profile-section'>
                <div>
                    <h1>Profile</h1>
                    {isLoading && <div>Loading...</div>}
                    {isError && (
                        <div>Error: {error.message}</div>
                    )}
                    <div className='profile-component'>
                        <ProfilePic 
                            profilePicture={profileData?.profilePicture}
                            isEditable={false}
                        />
                    </div>
                    {profileData && (
                        <div>
                            <p>First Name: {profileData?.firstName}</p>
                            <p>Last Name: {profileData?.lastName}</p>
                            <p>Email: {profileData?.email}</p>
                        </div>
                    )}
                </div>
                <div>
                    <Link to="/user/edit">
                        <button className='p-edit-button'>Edit</button>
                    </Link>
                </div>
            </section>
        </Layout>
    )
}

export default Profile