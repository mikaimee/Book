import axios from 'axios'

export const createBook = async ({
    title,
    author,
    pages,
    publishedDate,
    description,
    language,
    ISBN,
    slug,
    coverImage
    }) => {
        try{
            const { data } = await axios.post('http://localhost:8000/books/', {
                title,
                author,
                pages,
                publishedDate,
                description,
                language,
                ISBN,
                slug,
                coverImage
            })
            return data
        }
        catch(err) {
            if (err.response && err.response.data.message) 
                throw new Error(err.response.data.message)
            throw new Error (err.message)
        }
}

export const getBookDetails = async (bookId) => {
    try {
        const response = await axios.get(`http://localhost:8000/books/${bookId}`, {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': 0
        })
        return response.data.book
    }  
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}

export const editBook = async ({bookData, bookId}) => {
    try{
        const { data } = await axios.patch(`http://localhost:8000/books/${bookId}`, bookData)
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}

export const updateCoverImage = async ({ bookId, file }) => {
    try{
        const formData = new FormData()
        formData.append('coverImage', file)

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        }
        const { data } = await axios.put(`http://localhost:8000/books/${bookId}/uploadCoverImage`, formData, config);
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}

export const getAllBooks = async () => {
    try {
        const { data } = await axios.get('http://localhost:8000/books/')
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}
