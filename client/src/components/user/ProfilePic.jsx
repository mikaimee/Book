import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfilePicture } from '../../services/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userActions } from '../../store/userReducer'
import stables from '../../constants/stable'
import { HiOutlineCamera } from 'react-icons/hi'
import Cropping from './Cropping'
import './profilePic.css'

const ProfilePic = ({ profilePicture, isEditable  }) => {

    const queryClient = useQueryClient()
    const dispatch = useDispatch()
    const userState = useSelector((state) => state.user)
    const [selectedFile, setSelectedFile] = useState(null)
    // const [openCrop, setOpenCrop] = useState(false)
    // const [photo, setPhoto] = useState(null)

    const { mutate, isLoading } = useMutation({
        mutationFn: ({ token, file }) => {
            return updateProfilePicture({ token, file });
        },
        onSuccess: (data) => {
            dispatch(userActions.setUserInfo(data));
            localStorage.setItem('account', JSON.stringify(data));
            queryClient.invalidateQueries(['profile']);
            toast.success('Profile Photo is removed');
        },
        onError: (error) => {
            toast.error(error.message);
            console.error(error);
        }
    })

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log('Selected file: ', file)
        setSelectedFile(file)
    }

    const handleUpdateClick = () => {
        if (selectedFile) {
            mutate({ token: userState?.userInfo?.token, file: selectedFile})
        }
        else {
            console.log("Error while updating pic")
        }
    }

    const handleDeleteImage = () => {
        if (window.confirm('Do you want to delete your profile picture')) {
            try {
                const formData = new FormData();
                formData.append('profilePicture', '');
                mutate({ token: userState.userInfo.token, file: formData });
            } 
            catch (error) {
            toast.error(error.message);
            console.log(error);
            }
        }
    }

    return (
        <div className="profile-picture-container">
            <div className="picture-container"> 
                <label
                    htmlFor='profilePicture'
                >
                    {profilePicture ? (
                        <img
                            src={stables.UPLOAD_FOLDER_BASE_URL + profilePicture}
                            alt='profile'
                            className="profile-picture-image"
                        />
                    ) : (
                        <div className="profile-picture-none">
                            <HiOutlineCamera />
                        </div>
                    )}
                </label>
                {isEditable && (
                    <input
                        type='file'
                        id='profilePicture'
                        onChange={handleFileChange}
                    />
                )}
            </div>
            {isEditable && (
                <div>
                    <button
                        onClick={handleUpdateClick}
                        type='button'
                    >
                        Update
                    </button>
                    <button
                        onClick={handleDeleteImage}
                        type='button'
                        className="profile-picture-button"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfilePic