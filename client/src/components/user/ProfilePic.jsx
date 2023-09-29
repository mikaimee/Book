import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfilePicture } from '../../services/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userActions } from '../../store/userReducer'
import stables from '../../constants/stable'
import { HiOutlineCamera } from 'react-icons/hi'
import Cropping from './Cropping'

const ProfilePic = ({ profilePicture, isEditable  }) => {

    const queryClient = useQueryClient()
    const dispatch = useDispatch()
    const userState = useSelector((state) => state.user)
    const [openCrop, setOpenCrop] = useState(false)
    const [photo, setPhoto] = useState(null)

    const { mutate, isLoading } = useMutation({
        mutationFn: ({ token, file }) => {
            return updateProfilePicture({ token, file });
        },
        onSuccess: (data) => {
            dispatch(userActions.setUserInfo(data));
            setOpenCrop(false);
            localStorage.setItem('account', JSON.stringify(data));
            queryClient.invalidateQueries(['profile']);
            toast.success('Profile Photo is removed');
        },
        onError: (error) => {
            toast.error(error.message);
            console.error(error);
        },
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPhoto({ url: URL.createObjectURL(file), file });
        setOpenCrop(true);
    };

    const handleDeleteImage = () => {
        if (window.confirm('Do you want to delete your profile picture')) {
            try {
                const formData = new FormData();
                formData.append('profilePicture', '');

            mutate({ token: userState.userInfo.token, formData: formData });
            } 
            catch (error) {
            toast.error(error.message);
            console.log(error);
            }
        }
    };

    return (
        <div>
            <div>
                <label
                    htmlFor='profilePicture'
                >
                    {profilePicture ? (
                        <img
                            src={stables.UPLOAD_FOLDER_BASE_URL + profilePicture}
                            alt='profile'
                        />
                    ) : (
                        <div>
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
                <button
                    onClick={handleDeleteImage}
                    type='button'
                >
                    Delete
                </button>
            )}
        </div>
    )
}

export default ProfilePic