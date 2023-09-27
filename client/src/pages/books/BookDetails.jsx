import React from 'react'
import Layout from '../../components/Layout'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getBookDetails } from '../../services/book'
import { getAllGenresForBook } from '../../services/bookgenres'
import { getAllBooksForUser, createUserBookAssociation } from '../../services/userbooks'
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

    // GET USER ASSOCIATION
    const {
        data: libraryData,
        isLoading: libraryisLoading,
        isError: libaryIsError,
        error: libraryError
    } = useQuery({
        queryFn: () => {
            return getAllBooksForUser({ token: userState?.userInfo?.token })
        },
        queryKey: ["library"]
    })
    console.log('Library: ', libraryData)

    // Find userAssociation based on bookId
    const userAssociation = libraryData?.find(association => association.book._id === bookId)
    const renderAddLibraryButton = !userAssociation && userState?.userInfo?.token

    // CREATE USER/BOOK ASSICOATION
    const {
        mutate: userBookMutate,
        isLoading: userBookIsLoading
    } = useMutation({
        mutationFn: ({ bookId }) => {
            return createUserBookAssociation({ bookId, token: userState?.userInfo?.token })
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

    if (detailIsLoading || genreIsLoading || userBookIsLoading || libraryisLoading) {
        return <div>Loading...</div>
    }

    if (detailIsError || genreIsError || libaryIsError) {
        return (
            <div>
                Error: {detailError?.message || genreError?.message|| libraryError?.message}
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

                    {/* If the user is logged in and the book + user association exists show the readerstatus, readerstart, readerfinished */}
                    {userAssociation && (
                        <div>
                            <p>Status: {detailData?.readerStatus}</p>
                            <p>Start Date: {detailData?.readerStarted || "No date available"}</p>
                            <p>Finish Date: {detailData?.readerFinished || "No date available"}</p>
                        </div>
                    )}
                </div>
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