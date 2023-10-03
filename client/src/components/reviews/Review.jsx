import React from 'react'
import CreateReview from './CreateReview'

const Review = ({ review, loginUserId, affectedReview, setAffectedReview, addReview, updateReview, deleteReview }) => {

    const isuserLoggedIn = Boolean(loginUserId)
    const reviewBelongsToUser = loginUserId === review.user._id
    const isEditing = affectedReview && affectedReview.type === 'editing' && affectedReview._id === review._id


    return (
        <div className='eR-container'>
            <div className='eR-left'>
                <p className='review-username'>{review.user.firstName}</p>
                <p>
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>
            <div className='eR-right'>
                <div>
                {!isEditing && (
                    <div>
                        <p className='review-text'>{review.text}</p>
                    </div>
                )}
                {isEditing && (
                    <CreateReview 
                        btnLabel="Update"
                        formSubmitHandler={(text, rating) => updateReview(text, review._id)}
                        formcancelHandler={() => setAffectedReview(null)}
                        initialText={review.text}
                    />
                )}
                </div>
                <div className='review-button-container'>
                    {reviewBelongsToUser && (
                        <>
                            <button
                                onClick={() => setAffectedReview({ type: 'editing', _id: review._id })}
                                className='bD-button'
                            >
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={() => deleteReview(review._id)}
                                className='bD-button'
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