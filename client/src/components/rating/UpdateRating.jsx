import React, { useState, useEffect } from 'react'
import Rating from 'react-rating'
import { updateRating, singleRating } from '../../services/rating'
import { useSelector } from 'react-redux'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-regular-svg-icons'

const UpdateRating = ({ ratingId }) => {

    const userState = useSelector((state) => state.user)
    const queryClient = useQueryClient()
    const [existingRating, setExistingRating] = useState(null)

    const {
        data: ratingData,
        isLoading: ratingIsLoading,
        isError: ratingIsError,
        error: ratingError,
        isSuccess: ratingIsSuccess
    } = useQuery(
        ["ratingDetails", ratingId],
        () => singleRating({token: userState?.userInfo?.token, ratingId}),
        {
            enabled: !!ratingId
        }
    )
    // console.log("Rating Details: ", ratingData)

    const bookId = ratingData?.rating?.book
    
    useEffect(() => {
        if (ratingIsSuccess) {
            setExistingRating(ratingData?.rating?.rating ?? 0)
        }
    })

    const {
        mutate,
        isLoading: updateRatingLoading,
    } = useMutation({
        mutationFn: ({ rating }) => {
            return updateRating({
                token: userState?.userInfo?.token, ratingId, rating
            })
        },
        onSuccess: () => {
            toast.success("Successful update")
            queryClient.invalidateQueries(['ratingDetails', ratingId])
            queryClient.invalidateQueries(['bookDetails', bookId])
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        }
    })

    const handleRatingChange = (newRating) => {
        setExistingRating(newRating)
    }

    const handleUpdateRating = () => {
        mutate({ existingRating })
        // console.log('Updated Rating: ', existingRating)
    }

    if (ratingIsLoading) {
        return <div>Loading...</div>
    }

    if (ratingIsError) {
        return (
            <div>
                Error: {ratingError?.message}
            </div>
        )
    }

    if (ratingIsSuccess) {
        return (
            <div className='bD-information-rating-container'>
                <p>Your Rating: </p>
                <Rating
                    initialRating={existingRating}
                    emptySymbol={<FontAwesomeIcon icon={faStar} />}
                    fullSymbol={<FontAwesomeIcon icon={fasStar} />}
                    onClick={handleRatingChange}
                />
                <button onClick={handleUpdateRating} disabled={updateRatingLoading}>
                    Update
                </button>
            </div>
        )
    }

    return null
}

export default UpdateRating