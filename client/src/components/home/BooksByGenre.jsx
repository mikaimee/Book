import React, { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllBooksforGenre } from '../../services/bookgenres'
import { allGenres } from '../../services/genre'
import CoverImage from '../book/CoverImage'
import { Link } from 'react-router-dom'

const BooksByGenre = ({ genreName }) => {

    const [genreId, setGenreId] = useState(null)

    // Retrieve all genres
    const {
        data: genresData,
        isLoading: isLoadingGenres,
        isError: isErrorGenres,
        error: genresError
    } = useQuery(['allGenres'], allGenres)
    // console.log('genreData: ', genresData)

    // Set genreId based on genreName
    useEffect(() => {
        if (genresData) {
            const selectedGenre = genresData.find(genre => genre.name === genreName)
            if (selectedGenre) {
                setGenreId(selectedGenre._id)
            }
            else {
                setGenreId(null)
            }
        }
    }, [genresData, genreName])
    // console.log("genreId: ",genreId)

    // Retrieve all books in one genre
    const {
        data: genreBooksData,
        isLoading: isLoadingGenreBooksData,
        isEror: isErrorgenreBooks,
        error: genreBooksError
    } = useQuery(
        ['booksForGenre', genreId],
        () => getAllBooksforGenre(genreId),
        { enabled: !!genreId} // only query when genreId is available
    )
    // console.log('booksForGenreData: ', genreBooksData)

    // CSS
    const containerRef = useRef(null)
    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft -= 350
        }
    }
    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += 350
        }
    }

    const hasMoreItemsToLeft = containerRef.current && containerRef.current.scrollLeft > 0
    const hasMoreItemsToRight =
        containerRef.current &&
        containerRef.current.scrollLeft + containerRef.current.clientWidth <
        containerRef.current.scrollWidth

    if (!genreId) {
        return <div>Genre not found.</div>
    }

    if (isLoadingGenres || isLoadingGenreBooksData) {
        return <div>Loading...</div>;
    }

    if (isErrorGenres || isErrorgenreBooks) {
        return <div>Error: {genresError || genreBooksError}</div>
    }

    return (
        <div className='hS-wrap'>
            <h2 className='hS-title'>{genreName}</h2>
            <div className='hS-item-container' ref={containerRef}>
                {genreBooksData
                    .filter(book => book?.book?._id)
                    .map(book => (
                        <div className='hS-item' key={book?.book?._id}>
                            <div>
                                <CoverImage 
                                    bookId={book?.book?._id}
                                    coverImage={book?.book?.coverImage}
                                    isEditable={false}
                                />
                            </div>
                            <Link to={`/book/${book?.book?._id}`}>
                                <h2 className='hS-title'>{book?.book?.title}</h2>
                            </Link>
                            <p className='hS-information'>{book?.book?.author}</p>
                        </div>
                ))}
            </div>
            <div className='hS-scroll-button left' onClick={scrollLeft}>&lt;</div>
            <div className='hS-scroll-button right' onClick={scrollRight}>&gt;</div>
        </div>
    )
}

export default BooksByGenre