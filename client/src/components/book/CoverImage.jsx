import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCoverImage } from '../../services/book'
import stables from '../../constants/stable'
import { HiOutlineCamera } from 'react-icons/hi'

const CoverImage = ({ bookId, coverImage, isEditable }) => {

    const queryClient = useQueryClient()
    const [photo, setPhoto] = useState(null)
    const [openCrop, setOpenCrop] = useState(false)

    const { mutate, isLoading } = useMutation({
        mutationFn:({ bookId, file }) => {
            return updateCoverImage({ bookId, file })
        },
        onSuccess: () => {
            setOpenCrop(false);
            queryClient.invalidateQueries(['bookDetails']);
            toast.success(' Cover Image is removed');
        },
        onError: (error) => {
            toast.error(error.message);
            console.error(error);
        }
    })

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPhoto({ url: URL.createObjectURL(file), file });
        setOpenCrop(true);
    }

    const handleDeleteImage = () => {
        if (window.confirm('Do you want to delete this cover image')) {
            try {
                const formData = new FormData();
                formData.append('coverImage', '');

            mutate({ bookId: bookId, file: formData });
            } 
            catch (error) {
            toast.error(error.message);
            console.log(error);
            }
        }
    }

    return (
        <div>
            <div>
                <label htmlFor='coverImage'>
                    {coverImage ? (
                        <img
                            src={stables.UPLOAD_FOLDER_BASE_URL + coverImage}
                            alt='book cover'
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

export default CoverImage