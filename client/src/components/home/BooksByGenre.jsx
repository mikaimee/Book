import React, { useState, useEffect } from 'react'
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
        <div>
            <h2>{genreName}</h2>
            {genreBooksData.map(book => (
                <div key={book?.book?._id}>
                    <h3>{book?.book?.title}</h3>
                    <p>{book?.book?.author}</p>
                </div>
            ))}
        </div>
    )
}

export default BooksByGenre