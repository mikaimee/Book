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

export const createBookGenreAssociation = async (bookId, genreId) => {
    try{
        const response = await axios.post('http://localhost:8000/bookGenres', {
            bookId,
            genreId
        })
        return response.data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}

export const removeBookGenreAssociation = async (associationId) => {
    try{
        const { data } = await axios.delete(`http://localhost:8000/bookGenres/${associationId}`)
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}

export const getAllBooksforGenre = async (genreId) => {
    try {
        const response = await axios.get(`http://localhost:8000/bookGenres/genre/${genreId}`)
        return response.data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}