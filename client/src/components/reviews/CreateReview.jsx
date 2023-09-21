import React, { useState } from 'react'

const CreateReview = ({btnLabel, formSubmitHandler, formcancelHandler = null, initialText = "", initialRating = 0, loading = false}) => {

    const [text, setText] = useState(initialText)
    const [rating, setRating] = useState(initialRating)

    const submitHandler = (e) => {
        e.preventDefault()
        formSubmitHandler(text, rating)
        setText("")
        setRating(0)
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <div>
                    <textarea 
                        placeholder='Leave review here'
                        value={text}
                        cols="30" 
                        rows="10" 
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div>
                    <label>Rating</label>
                    <input 
                        type='number'
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                    />
                </div>
                <div>
                    {formcancelHandler && (
                        <button
                            onClick={formcancelHandler}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        disabled={loading}
                        type='submit'
                    >
                        {btnLabel}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateReview