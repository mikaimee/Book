import axios from "axios";

export const createReview = async ({token, bookId, text, rating}) => {
    try{
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const { data } = await axios.post('http://localhost:8000/reviews', {bookId, text, rating}, config)
        return data
    }
    catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
}

export const updateReview = async ({ token, text, rating, reviewId }) => {
    try{
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const { data } = await axios.patch('http://localhost:8000/reviews', { text, rating, reviewId }, config)
        return data
    }
    catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
}

export const deleteReview = async ({ token, reviewId }) => {
    try{
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const { data } = await axios.delete(`http://localhost:8000/reviews/${reviewId}`, config)
        return data
    }
    catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
}