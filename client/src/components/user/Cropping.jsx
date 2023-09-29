import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfilePicture } from '../../services/user'
import { userActions } from '../../store/userReducer'
import crop from './crop'
import getCroppedImage from './crop'
import Cropper from 'react-easy-crop'

const Cropping = ({ photo, setOpenCrop }) => {

    const userState = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const queryClient = useQueryClient()

    const [crop, setCrop] = useState({ x: 0, y: 0})
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(false)

    const imageSrc = useMemo(() => photo?.url, [photo])

    const { mutate, isLoading } = useMutation({
        mutationFn: ({ token, file }) => updateProfilePicture({ token, file}),
        onSuccess: (data) => {
            dispatch(userActions.setUserInfo(data))
            setOpenCrop(false)
            localStorage.setItem('account', JSON.stringify(data))
            queryClient.invalidateQueries(['profile'])
            toast.success("Profile Photo is updated")
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        }
    })

    const handleCropComplete = (cropedArea, cropedAreaPixels) => {
        setCroppedAreaPixels(cropedAreaPixels);
    };
    

    const handleCropImage = async () => {
        try {
            const croppedImg = await getCroppedImage(imageSrc, croppedAreaPixels)
            const file = new File([croppedImg.file], `${photo?.file?.name}`,{
                type: photo?.file?.type
            })

            const formData = new FormData();
            formData.append("profilePicture", file)

            mutate({ token: userState?.userInfo?.token, file: formData })
        }
        catch (error) {
            toast.error(error.message)
            console.error(error)
        }
    }

    return (
        <div>
            <div>
                <h2>Crop Image</h2>
                <div>
                    <Cropper
                        image={photo?.url}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onZoomChange={setZoom}
                        onCropChange={setCrop}
                        onCropComplete={handleCropComplete}
                    />
                </div>
                <div>
                    <label htmlFor='zoomRange'>Zoom: {`${Math.round(zoom * 100)}%`}</label>
                    <input
                        type='range'
                        id='zoomRange'
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(e.target.value)}
                    />
                </div>
                <div>
                    <button
                        disabled={isLoading}
                        onClick={() => setOpenCrop(false)}
                    > 
                        Cancel
                    </button>
                    <button
                        disabled={isLoading}
                        onClick={handleCropImage}
                    >
                        Crop and Upload
                    </button>
                </div>
            </div>
        </div>
    )
    }

export default Cropping