import axios from "axios";

export const createRating = async ({token, bookId, rating}) => {
    try{
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const { data } = await axios.post('http://localhost:8000/ratings', {bookId, rating}, config)
        return data
    }
    catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
}

export const updateRating = async ({ token, ratingId, rating }) => {
    try{
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const { data } = await axios.patch(`http://localhost:8000/ratings/${ratingId}`, rating, config)
        return data
    }
    catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
}

export const singleRating = async ({ token, ratingId }) => {
    try{
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const { data } = await axios.get(`http://localhost:8000/ratings/${ratingId}`, config)
        return data
    }
    catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
}