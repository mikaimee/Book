import React, { useState } from 'react'

const CreateReview = ({btnLabel, formSubmitHandler, formcancelHandler = null, initialText = "", loading = false}) => {

    const [text, setText] = useState(initialText)

    const submitHandler = (e) => {
        e.preventDefault()
        formSubmitHandler(text)
        setText("")
    }

    return (
        <div className='cR-conrainer'>
            <form onSubmit={submitHandler}>
                <div className='form-group'>
                    <textarea 
                        placeholder='Leave review here'
                        value={text}
                        cols="30" 
                        rows="10" 
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div>
                    {formcancelHandler && (
                        <button
                            onClick={formcancelHandler}
                            className='uB-button'
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        disabled={loading}
                        type='submit'
                        className='uB-button'
                    >
                        {btnLabel}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateReview