import React from 'react'
import Layout from '../../components/Layout'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getAllBooksForUser } from '../../services/userbooks'

const MyLibrary = () => {

    const userState = useSelector((state) => state.user)

    const {
        data: libraryData,
        isLoading,
        isError,
        error
    } = useQuery({
        queryFn: () => {
            return getAllBooksForUser({ token: userState?.userInfo?.token })
        },
        queryKey: ["library"]
    })
    console.log('library data: ', libraryData)

    if(isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Layout>
            <div>
                <h2>My Library</h2>
                <ul>
                    {libraryData.map(book => (
                        <li key={book.book._id}>
                            <Link to={`/book/${book.book._id}`}>{book.book.title}</Link>
                            <p>Author: {book.book.author}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </Layout>
    )
}

export default MyLibrary