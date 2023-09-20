import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { getBookDetails } from '../../services/book'
import { getAllGenresForBook } from '../../services/bookgenres'

const BookDetails = () => {

    const { bookId } = useParams()

    const navigate = useNavigate()

    const {
        data: detailData,
        isLoading: detailIsLoading,
        isError: detailIsError,
        error: detailError
    } = useQuery(
        ["bookDetails", bookId], // Provide 'bookId' as part of the query key
        () => getBookDetails(bookId)
    );
    console.log('detailData:', detailData)

        // GENRE
        const {
            data: genreData,
            isLoading: genreIsLoading,
            isError: genreIsError,
            error: genreError,
        } = useQuery(
            ["genresForBook", bookId],
            () => getAllGenresForBook(bookId)
        )
        console.log('genreData:', genreData)

    if (detailIsLoading || genreIsLoading) {
        return <div>Loading...</div>
    }

    if (detailIsError || genreIsError) {
        return (
            <div>
                Error: {detailError?.message || genreError?.message}
            </div>
        ) 
    }

    return (
        <Layout>
            <section>
                <div>
                    <h2>{ detailData?.title }</h2>
                    <p>Author: { detailData?.author }</p>
                    <p>Pages: { detailData?.pages }</p>
                    <p>Published Date: { detailData?.publishedDate }</p>
                    <p>Language: { detailData?.language }</p>
                    <div>
                            <p>Genres: </p>
                            <ul>
                                {genreData.map((genre) => (
                                    <li key={genre._id}>{genre.genre.name}</li>
                                ))}
                            </ul>
                    </div>
                    
                    <p>ISBN: { detailData?.ISBN }</p>
                    <p>Description: { detailData?.description }</p>

                    {/* If the user is logged in and the book + user association exists show the readerstatus, readerstart, readerfinished */}
                </div>
                <div>
                    {/* Only show this button if the user if logged in + if no bookuser association exists */}
                    <button
                    >
                        Add Book To Library
                    </button>
                </div>
            </section>
        </Layout>
    )
}

export default BookDetails