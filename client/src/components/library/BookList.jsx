import React from 'react'
import { getAllBooksForUser } from '../../services/userbooks'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import CoverImage from '../../components/book/CoverImage'

const BookList = ({ selectedStatus }) => {

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
    // console.log('library data: ', libraryData)

    if(isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    const filteredLibraryData = 
        selectedStatus === 'All'
            ? libraryData
            : libraryData.filter((book) => book.readerStatus === selectedStatus)

    const formatDate = (dateString) => {
        if (!dateString) {
            return "No date available"
        }
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    return (
        <div>
            <ul>
                {filteredLibraryData.map(book => (
                    <li key={book.book._id} className='mL-book-item'>
                        <div>
                            <CoverImage
                                bookId={book.book._id}
                                coverImage={book?.book?.coverImage}
                                isEditable={false}
                            />
                        </div>
                        <div className='mL-book-info'>
                            <Link to={`/book/${book.book._id}`} className='mL-book-title-link'>{book.book.title}</Link>
                            <p>Author: {book.book.author}</p>
                            <p>Status: {book.readerStatus}</p>
                            <p>Started Date: {formatDate(book.readerStarted)}</p>
                            <p>Finished Date: {formatDate(book.readerFnished)}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default BookList