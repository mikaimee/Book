import React, { useState } from 'react'
import Rating from 'react-rating'
import { createRating } from '../../services/rating'
import { useSelector } from 'react-redux'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-regular-svg-icons'

const CreateRating = ({ bookId }) => {

    const userState = useSelector((state) => state.user)
    const [rating, setRating] = useState(0)
    const queryClient = useQueryClient()

    const {
        mutate,
        isLoading
    } = useMutation({
        mutationFn: ({ rating }) => {
            return createRating({ token: userState?.userInfo?.token, bookId, rating })
        },
        onSuccess: async (data) => {
            toast.success("Successfylly created rating")
            // console.log(data)
            queryClient.invalidateQueries(["bookDetails"], bookId)
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        }
    })

    const handleRateClick = () => {
        mutate({ rating })
    }


    return (
        <div>
            <p>Your Rating: </p>
            <Rating
                initialRating={rating}
                emptySymbol={<FontAwesomeIcon icon={faStar} />}
                fullSymbol={<FontAwesomeIcon icon={fasStar} />}
                onClick={setRating}
                readonly={isLoading}
            />
            <button onClick={handleRateClick} disabled={isLoading}>
                Rate
            </button>
        </div>
    )
}

export default CreateRating