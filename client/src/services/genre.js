import axios from 'axios'

export const allGenres = async () => {
    try{
        const response = await axios.get('http://localhost:8000/genres')
        return response.data.genres
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}

export const createGenre = async ({name}) => {
    try {
        const { data } = await axios.post('http://localhost:8000/genres', { name }) 
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}