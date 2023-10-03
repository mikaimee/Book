import React from 'react'
import Layout from '../../components/Layout'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getAllBooksForUser } from '../../services/userbooks'
import CoverImage from '../../components/book/CoverImage'

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

    const formatDate = (dateString) => {
        if (!dateString) {
            return "No date available"
        }
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    return (
        <Layout>
            <section>
                <h2>My Library</h2>
                <div className='mL-container-left'>
                    <ul>
                        {libraryData.map(book => (
                            <li key={book.book._id}>
                                <div>
                                    <CoverImage
                                        bookId={book.book._id}
                                        coverImage={book?.book?.coverImage}
                                        isEditable={false}
                                    />
                                </div>
                                <div>
                                    <Link to={`/book/${book.book._id}`}>{book.book.title}</Link>
                                    <p>Author: {book.book.author}</p>
                                    <p>Status: {book.readerStatus}</p>
                                    <p>Started Date: {formatDate(book.readerStarted)}</p>
                                    <p>Finished Date: {formatDate(book.readerFnished)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='mL-container-right'>
                            Where progress will eventually go
                </div>
            </section>
        </Layout>
    )
}

export default MyLibrary