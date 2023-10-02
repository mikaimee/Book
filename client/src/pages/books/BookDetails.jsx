import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getBookDetails } from '../../services/book'
import { getAllGenresForBook } from '../../services/bookgenres'
import { createUserBookAssociation, getLibraryDetails, updateUserBook } from '../../services/userbooks'
import ReviewContainer from '../../components/reviews/ReviewContainer'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { userActions} from '../../store/userReducer'
import CoverImage from '../../components/book/CoverImage'
import Rating from 'react-rating'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-regular-svg-icons'

import CreateRating from '../../components/rating/CreateRating'
import UpdateRating from '../../components/rating/UpdateRating'

const BookDetails = () => {

    const { bookId } = useParams()
    const userState = useSelector((state) => state.user);

    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const dispatch = useDispatch()

    // GET DETAILS OF BOOK
    const {
        data: detailData,
        isLoading: detailIsLoading,
        isError: detailIsError,
        error: detailError
    } = useQuery(
        ["bookDetails", bookId], // Provide 'bookId' as part of the query key
        () => getBookDetails(bookId)
    )
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

    // USER INFORMATION TO OBTAIN ASSOCIATION ID//
    const { userInfo } = userState || {}
    const library = userInfo?.library || []
    // initialize
    let matchingLibraryEntry = null
    if (Array.isArray(library)) {
        // only set matchingLibraryEntry if library is defined
        matchingLibraryEntry = library.find(
            (libraryEntry) => libraryEntry?.book === bookId
        )
    }

    const {
        data: libraryData,
        isLoading: libraryIsLoading,
        isError: libraryIsError,
        error: libraryError
    } = useQuery({
        queryFn: () => {
            if (matchingLibraryEntry) {
                return getLibraryDetails({ token: userInfo?.token, associationId: matchingLibraryEntry?._id })
            }
            return null
        },
        queryKey: ["library", userInfo?.token, matchingLibraryEntry?._id],
        fallbackData: null
    })
    console.log("Library Data: ", libraryData)

    const userAssociation = libraryData
    const renderAddLibraryButton = !userAssociation && userState?.userInfo?.token


    // CREATE ASSOCIATION
    const {
        mutate: userBookMutate,
        isLoading: userBookIsLoading
    } = useMutation({
        mutationFn: async ({ bookId, readerStatus, readerStarted, readerFinished }) => {
            try {
                const data = await createUserBookAssociation({ bookId, token: userState?.userInfo?.token, readerStatus, readerStarted, readerFinished })
                dispatch(userActions.updateUserLibrary({ updatedLibraryData: data.userBook }))
                toast.success("Suucessfully added to your library")
                queryClient.invalidateQueries(["library", { token: userState?.userInfo?.token }])
            }
            catch (error) {
                toast.error(error.message)
            }
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        }
    })

    const handleAddLibrary = () =>{
        userBookMutate({ bookId })
    }
    // UPDATE USER/BOOK ASSOCIATION (AKA: READER STATUS)
    const {
        mutate: editUserBookMutate,
        isLoading: editUserBookIsLoading,
    } = useMutation({
        mutationFn: ({ readerStatus, readerStarted, readerFinished }) => {
            return updateUserBook({
                token: userState?.userInfo?.token,
                associationData: { readerStatus, readerStarted, readerFinished },
                associationId: matchingLibraryEntry?._id
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['library'])
            toast.success("Successful update of reader status")
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        }
    })

    const { handleSubmit, register, formState: { errors, isValid }, control, setValue, watch} = useForm({
        defaultValues: {
            readerStatus: 'Yet to Start'
        },
        mode: 'onChange'
    })
    useEffect(() => {
        if (!libraryIsLoading && libraryData?.association?.readerStatus) {
            setValue('readerStatus', libraryData?.association?.readerStatus)
        }
    }, [libraryData, libraryIsLoading, setValue])

    // Handle drop-down menu
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    }
    const cancelEdit = () => {
        setIsDropdownVisible(false)
    }

    // submit Handler 
    const submitHandler = (data) => {
        const {readerStatus, readerStarted, readerFinished} = data
        let updatedReaderStarted = null
        let updatedReaderFinished = null
        if (readerStatus === 'In Progress') {
            updatedReaderStarted = new Date().toISOString()
        }
        else if (readerStatus === 'Complete') {
            updatedReaderFinished = new Date().toISOString()
        }
        const updatedData = {
            ...data,
            readerStarted: updatedReaderStarted,
            readerFinished: updatedReaderFinished,
        }
        editUserBookMutate (updatedData)
        queryClient.invalidateQueries(['library'])
        setIsDropdownVisible(false)
    }

    const formatDate = (dateString) => {
        if (!dateString) {
            return "No date available"
        }
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Calculate Average Rating
    const [averageRating, setAverageRating] = useState(0)
    const [numRatings, setNumRatings] = useState(0)

    useEffect(() => {
        if (detailData && detailData?.ratings && detailData?.ratings.length > 0) {
            const totalRating = detailData?.ratings.reduce((sum, rating) => sum + rating.rating, 0)
            const avgRating = totalRating / detailData?.ratings.length
            setAverageRating(avgRating)
            setNumRatings(detailData?.ratings.length)
        } 
    }, [detailData])

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

    // If user has rated book
    let hasUserRated = null
    if(detailData && detailData?.ratings && detailData?.ratings.length > 0) {
        hasUserRated = detailData?.ratings.some((rating) => rating?.user === userState?.userInfo?._id)
    }

    let ratingId = null
    if (hasUserRated) {
        const matchingRating = detailData.ratings.find((rating) => rating?.user === userState?.userInfo?._id)
        if (matchingRating) {
            ratingId = matchingRating?._id
        }
        console.log("Matching: ",matchingRating)
    }

    return (
        <Layout>
            <section className='bD-section-container'>
                <div className='bD-top-section'>
                    <div className='bD-section-left'>
                        <CoverImage
                            bookId={detailData?._id}
                            coverImage={detailData?.coverImage}
                            isEditable={false}
                        />
                    </div>
                    <div className='bD-section-right'>
                        <button
                            type='button'
                            onClick={() => navigate(`/book/${detailData?._id}/edit`)}
                        >
                            Edit
                        </button>
                        <h2>{ detailData?.title }</h2>
                        <div>
                            <p>Rating:</p>
                            <Rating
                                initialRating={averageRating.toFixed(2)}
                                emptySymbol={<FontAwesomeIcon icon={faStar} />}
                                fullSymbol={<FontAwesomeIcon icon={fasStar} />}
                                readonly={true}
                            />
                            <p>{averageRating.toFixed(2)}</p>
                            {numRatings > 1 ? (
                                <p>{numRatings} ratings</p>
                            ) : (
                                <p>{numRatings} rating</p>
                            )}
                        </div>
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
                        {userState?.userInfo ? (
                            hasUserRated ? (
                                <UpdateRating ratingId={ratingId} />
                            ) : (
                                <CreateRating bookId={detailData?._id} />
                            )
                        ) : (
                            <p>Please log in to rate</p>
                        )}
                        {userAssociation && (
                            <div>
                                <div>
                                    {!isDropdownVisible ? (
                                        <div>
                                            <p>Status: {libraryData?.association?.readerStatus}</p>
                                            <button onClick={toggleDropdown}>Update Status</button>
                                        </div>
                                    ) : (
                                        <button onClick={cancelEdit}>Cancel</button>
                                    )}
                                    {isDropdownVisible && (
                                        <form onSubmit={handleSubmit(submitHandler)}>
                                            <div>
                                                <label htmlFor='readerStatus'>Status:</label>
                                                <Controller
                                                    name='readerStatus'
                                                    control={control}
                                                    defaultValue={libraryData?.association?.readerStatus}
                                                    render={({ field }) => (
                                                        <div>
                                                            <select {...field}>
                                                                <option value='Yet to Start'>Yet to Start</option>
                                                                <option value='In Progress'>In Progress</option>
                                                                <option value='Complete'>Complete</option>
                                                            </select>
                                                        </div>
                                                    )}
                                                />
                                                {errors.readerStatus?.message && (
                                                    <p>{errors.readerStatus?.message}</p>
                                                )}
                                                <button type='submit'>Update Status</button>
                                            </div>
                                        </form>
                                    )}
                                    <p>Start Date: {formatDate(libraryData?.association?.readerStarted)}</p>
                                    <p>Finish Date: {formatDate(libraryData?.association?.readerFinished)}</p>
                                </div>
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
                    </div>
                </div>
                <div className='dB-review-section'>
                    {userState?.userInfo ? (
                        <ReviewContainer 
                            reviews={detailData?.reviews}
                            loginUserId={userState?.userInfo?._id}
                            bookId={bookId}
                        />
                    ) : (
                        <p>Log in to leave a review</p>
                    )}
                </div>
            </section>
        </Layout>
    )
}

export default BookDetails