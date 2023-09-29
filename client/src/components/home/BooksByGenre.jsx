import React, { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllBooksforGenre } from '../../services/bookgenres'
import { allGenres } from '../../services/genre'

const BooksByGenre = ({ genreName }) => {

    const [genreId, setGenreId] = useState(null)

    // Retrieve all genres
    const {
        data: genresData,
        isLoading: isLoadingGenres,
        isError: isErrorGenres,
        error: genresError
    } = useQuery(['allGenres'], allGenres)
    console.log('genreData: ', genresData)

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
    console.log("genreId: ",genreId)

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
    console.log('booksForGenreData: ', genreBooksData)

    // CSS
    const containerRef = useRef(null)
    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft -= 200
        }
    }

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
        <div className='books-by-genre'>
            <h2 className='bBG-genre-title'>{genreName}</h2>
            <div className='bbG-book-item-container' ref={containerRef}>
                {genreBooksData.map(book => (
                    <div key={book?.book?._id} className='bBG-book-iten'>
                        <h3 className='bBG-book-title'>{book?.book?.title}</h3>
                        <p className='bBG-book-author'>{book?.book?.author}</p>
                    </div>
                ))}
            </div>
            <div className='bBg-scroll-button' onClick={scrollLeft}>&lt;</div>
        </div>
    )
}

export default BooksByGenre