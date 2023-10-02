import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCoverImage } from '../../services/book'
import stables from '../../constants/stable'
import { HiOutlineCamera } from 'react-icons/hi'

const CoverImage = ({ bookId, coverImage, isEditable }) => {

    const queryClient = useQueryClient()
    const [selectedFile, setSelectedFile] = useState(null)
    // const [photo, setPhoto] = useState(null)
    // const [openCrop, setOpenCrop] = useState(false)

    const { mutate, isLoading } = useMutation({
        mutationFn:({ bookId, file }) => {
            return updateCoverImage({ bookId, file })
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['bookDetails'])
            toast.success(' Cover Image is removed')
        },
        onError: (error) => {
            toast.error(error.message);
            console.error(error);
        }
    })

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        console.log('Selected file: ',file)
        setSelectedFile(file)
    }

    const handleUpdateClick = () => {
        if (selectedFile) {
            mutate({ bookId: bookId, file: selectedFile})
        }
        else {
            console.log("Error while updating pic")
        }
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
        <div className='cover-image-container'>
            <div className='cover-image'>
                <div className='coverImage-wrapper'>
                    <label htmlFor='coverImage'>
                        {coverImage ? (
                            <img
                                src={stables.UPLOAD_FOLDER_BASE_URL + coverImage}
                                alt='book cover'
                                className='book-cover-image'
                            />
                        ) : (
                            <div className='no-cover-image'>
                                <HiOutlineCamera />
                            </div>
                        )}
                    </label>
                </div>
                {isEditable && (
                        <input
                            type='file'
                            id='coverImage'
                            onChange={handleFileChange}
                            className='cI-input'
                        />
                    )}
            </div>
            {isEditable && (
                <div className="cI-button-container">
                    <button
                        onClick={handleUpdateClick}
                        type='button'
                        className='cI-button'
                    >
                        Update
                    </button>
                    <button
                        onClick={handleDeleteImage}
                        type='button'
                        className='cI-button'
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    )
}

export default CoverImage