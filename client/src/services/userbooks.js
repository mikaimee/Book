import axios from 'axios'

export const getAllBooksForUser = async ({ token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${ token }`,
            },
        }
        const { data } = await axios.get(`http://localhost:8000/userBooks/myLibrary`, config)
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}

export const createUserBookAssociation = async ({ token, bookId, readerStatus, readerStarted, readerFinished }) => {
    try{
        const config = {
            headers: {
                Authorization: `Bearer ${ token }`,
            },
        }
        const data = { bookId, readerStatus, readerStarted, readerFinished }
        const response = await axios.post('http://localhost:8000/userBooks/', data, config)
        return response.data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}

export const getLibraryDetails = async ({ token, associationId }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${ token }`,
            },
        }
        const { data }= await axios.get(`http://localhost:8000/userBooks/${associationId}`, config)
        return data
    }  
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}