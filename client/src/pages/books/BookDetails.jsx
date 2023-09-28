import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getBookDetails } from '../../services/book'
import { getAllGenresForBook } from '../../services/bookgenres'
import { getAllBooksForUser, createUserBookAssociation, getLibraryDetails } from '../../services/userbooks'
import { getUserProfile } from '../../services/user'
import ReviewContainer from '../../components/reviews/ReviewContainer'
import toast from 'react-hot-toast'

const BookDetails = () => {

    const { bookId } = useParams()
    const userState = useSelector((state) => state.user);

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    // GET DETAILS OF BOOK
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
    // console.log('genreData:', genreData)

    // USER INFORMATION TO OBTAIN ASSOCIATION ID
    const {
        data: profileData
    } = useQuery({
        queryFn: () => {
            return getUserProfile({ token: userState?.userInfo?.token })
        },
        queryKey: ["profile"]
    })
    console.log('profileData:', profileData)

    const matchingLibraryEntry = profileData?.library.find(
        (libraryEntry) => libraryEntry.book === bookId
    )

    const {
        data: libraryData,
        isLoading: libraryIsLoading,
        isError: libraryIsError,
        error: libraryError
    } = useQuery({
        queryFn: () => {
            return getLibraryDetails({ token: userState?.userInfo?.token, associationId: matchingLibraryEntry._id })
        },
        queryKey: ["library"]
    })
    console.log("Library Data: ", libraryData)

    const userAssociation = libraryData
    const renderAddLibraryButton = !userAssociation && userState?.userInfo?.token


    // CREATE USER/BOOK ASSICOATION
    const {
        mutate: userBookMutate,
        isLoading: userBookIsLoading
    } = useMutation({
        mutationFn: ({ bookId, readerStatus, readerStarted, readerFinished }) => {
            return createUserBookAssociation({ bookId, token: userState?.userInfo?.token, readerStatus, readerStarted, readerFinished })
        },
        onSuccess: (
        ) => {
            toast.success("Suucessfully added to your library")
            queryClient.invalidateQueries(["library", { token: userState?.userInfo?.token }])
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        }
    })

    const handleAddLibrary = () =>{
        userBookMutate({ bookId })
    }

    const formatDate = (dateString) => {
        if (!dateString) {
            return "No date available"
        }
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    if (detailIsLoading || genreIsLoading || userBookIsLoading || libraryIsLoading ) {
        return <div>Loading...</div>
    }

    if (detailIsError || genreIsError || libraryIsError) {
        return (
            <div>
                Error: {detailError?.message || genreError?.message || libraryError?.message}
            </div>
        ) 
    }

    return (
        <Layout>
            <section>
                <div>
                    <button
                        type='button'
                        onClick={() => navigate(`/book/${detailData?._id}/edit`)}
                    >
                        Edit
                    </button>
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
                </div>
                {userAssociation && (
                    <div>
                        <p>Reader Status: {libraryData?.association?.readerStatus}</p>
                        <p>Start Date: {formatDate(libraryData?.association?.readerStarted)}</p>
                        <p>Finish Date: {formatDate(libraryData?.association?.readerFinished)}</p>
                    </div>
                )}
                <div>
                    {!userAssociation && renderAddLibraryButton && (
                        <button
                            onClick={handleAddLibrary}
                        >
                            Add Book To Library
                        </button>
                    )}
                </div>
                <ReviewContainer 
                    reviews={detailData?.reviews}
                    loginUserId={userState?.userInfo?._id}
                    bookId={bookId}
                />
            </section>
        </Layout>
    )
}

export default BookDetails