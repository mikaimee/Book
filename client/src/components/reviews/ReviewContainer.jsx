import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { createReview, updateReview, deleteReview } from '../../services/review'
import CreateReview from './CreateReview'
import Review from './Review'

const ReviewContainer = ({loginUserId, reviews, bookId }) => {

    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)
    const [affectedReview, setAffectedReview] = useState(null)

    const {
        mutate: mutateNewReview,
        isLoading: newReviewIsLoading
    } = useMutation({
        mutationFn: ({ token, text, rating, bookId }) => {
            return createReview({ token, text, rating, bookId })
        },
        onSuccess: () => {
            toast.success("Review created successfully")
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        }
    })

    const {
        mutate: mutateUpdateReview,
        isLoading: updateReviewIsLoading
    } = useMutation({
        mutationFn: ({ token, text, rating, reviewId }) => {
            return updateReview({ token, text, rating, reviewId })
        },
        onSuccess: () => {
            toast.success("Review updated successfully")
            queryClient.invalidateQueries(["bookDetails", bookId])
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        }
    })

    const {
        mutate: mutateDeleteReview,
        isLoading: deleteReviewIsLoading
    } = useMutation({
        mutationFn: ({ token, text, rating, reviewId }) => {
            return deleteReview({ token, reviewId })
        },
        onSuccess: () => {
            toast.success("Review deleted successfully")
            queryClient.invalidateQueries(["bookDetails", bookId])
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        }
    })

    const createReviewHandler = (text, rating) => {
        mutateNewReview({
            text,
            rating,
            token: userState.userInfo.token,
            bookId
        })
        setAffectedReview(null)
    }

    const updateReviewHandler = (text, rating, reviewId) => {
        mutateUpdateReview({
            text,
            rating,
            token: userState.userInfo.token,
            reviewId
        })
        setAffectedReview(null)
    }

    const deleteReviewHandler = (reviewId) => {
        mutateDeleteReview({
            token: userState.userInfo.token,
            reviewId
        })
        setAffectedReview(null)
    }

    if (!reviews || reviews.length === 0) {
        return <div>No Reviews available </div>
    }

    return (
        <div>
            <div>
                <CreateReview 
                    btnLabel="Send"
                    formSubmitHandler={(text, rating) => createReviewHandler(text, rating)}
                    loading={newReviewIsLoading}
                />
            </div>
            <div>
                {reviews.map((review) => (
                    <Review
                        key={review._id}
                        review={review}
                        loginUserId={loginUserId}
                        affectedReview={affectedReview}
                        setAffectedReview={setAffectedReview}
                        addReview={createReviewHandler}
                        updateReview={updateReviewHandler}
                        deleteReview={deleteReviewHandler}
                    />
                ))}
            </div>
        </div>
        
    )
}

export default ReviewContainer