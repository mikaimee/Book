import axios from 'axios'

export const signup = async({firstName, lastName, email, password}) => {
    try {
        const {data} = await axios.post('http://localhost:8000/auth/register', {
            firstName,
            lastName,
            email,
            password
        })
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}

export const signin = async ({email, password}) => {
    try {
        const {data} = await axios.post('http://localhost:8000/auth/login', {
            email,
            password
        })
        return data
    }
    catch(err) {
        if (err.response && err.response.data.message) 
            throw new Error(err.response.data.message)
        throw new Error (err.message)
    }
}