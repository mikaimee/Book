import React from 'react'
import CreateReview from './CreateReview'

const Review = ({ review, loginUserId, affectedReview, setAffectedReview, addReview, updateReview, deleteReview }) => {

    const isuserLoggedIn = Boolean(loginUserId)
    const reviewBelongsToUser = loginUserId === review.user._id
    const isEditing = affectedReview && affectedReview.type === 'editing' && affectedReview._id === review._id


    return (
        <div>
            <div>
                <h5>{review.user.firstName}</h5>
                <span>
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit'
                    })}
                </span>
                {!isEditing && (
                    <div>
                        <p>{review.text}</p>
                        <p>{review.rating}</p>
                    </div>
                )}
                {isEditing && (
                    <CreateReview 
                        btnLabel="Update"
                        formSubmitHandler={(text, rating) => updateReview(text, rating, review._id)}
                        formcancelHandler={() => setAffectedReview(null)}
                        initialText={review.text}
                        initialRating={review.rating}
                    />
                )}
                <div>
                    {reviewBelongsToUser && (
                        <>
                            <button
                                onClick={() => setAffectedReview({ type: 'editing', _id: review._id })}
                            >
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={() => deleteReview(review._id)}
                            >
                                <span>Delete</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Review