import axios from "axios";

export const getUserProfile = async ({ token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${ token }`,
            },
        };
        const { data } = await axios.get("http://localhost:8000/users/profile", config);
        return data;
    } 
    catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
}

export const updateProfile = async ({ token, userData }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${ token }`,
            },
        };
        const { data } = await axios.patch("http://localhost:8000/users/", userData, config);
        return data;
    } 
    catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
}

export const deleteUser = async ({_id, token}) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.delete("http://localhost:8000/users/", config);
        return data;
    } 
    catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
}

export const updateProfilePicture = async ({ token, file }) => {
    try {
        const formData = new FormData()
        formData.append('profilePicture', file)

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.put("http://localhost:8000/users/uploadProfilePicture", formData, config);
        return data;
    } 
    catch (error) {
        if (error.response && error.response.data.message)
            throw new Error(error.response.data.message);
        throw new Error(error.message);
    }
}