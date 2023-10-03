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
        mutationFn: ({ token, text, bookId }) => {
            return createReview({ token, text, bookId })
        },
        onSuccess: () => {
            toast.success("Review created successfully")
            queryClient.invalidateQueries(['bookDetails', bookId])
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
        mutationFn: ({ token, text, reviewId }) => {
            return updateReview({ token, text, reviewId })
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
        mutationFn: ({ token, text, reviewId }) => {
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

    const createReviewHandler = (text) => {
        mutateNewReview({
            text,
            token: userState.userInfo.token,
            bookId
        })
        setAffectedReview(null)
    }

    const updateReviewHandler = (text, reviewId) => {
        mutateUpdateReview({
            text,
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

    return (
        <div className='review-container'>
            <div>
                <CreateReview 
                    btnLabel="Send"
                    formSubmitHandler={(text) => createReviewHandler(text)}
                    loading={newReviewIsLoading}
                />
            </div>
            {(!reviews || reviews.length === 0) && (
                <div>No Reviews available </div>
            )}
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