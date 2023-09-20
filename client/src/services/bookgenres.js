import axios from 'axios'

export const getAllGenresForBook = async (bookId) => {
    try {
        const response = await axios.get(`http://localhost:8000/bookGenres/book/${bookId}`)
        return response.data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}