import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getBookDetails } from '../../services/book'
import { getAllGenresForBook } from '../../services/bookgenres'
import { createUserBookAssociation, getLibraryDetails, updateUserBook } from '../../services/userbooks'
import ReviewContainer from '../../components/reviews/ReviewContainer'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'

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
    // console.log('detailData:', detailData)

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

    const { userInfo } = userState
    const { library } = userInfo

    const matchingLibraryEntry = library.find(
        (libraryEntry) => libraryEntry?.book === bookId
    )

    const {
        data: libraryData,
        isLoading: libraryIsLoading,
        isError: libraryIsError,
        error: libraryError
    } = useQuery({
        queryFn: () => {
            return getLibraryDetails({ token: userInfo?.token, associationId: matchingLibraryEntry?._id })
        },
        queryKey: ["library", userInfo?.token, matchingLibraryEntry._id]
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

    // UPDAT USER/BOOK ASSOCIATION (AKA: READER STATUS)
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

    // UPDATE START/FINISH DATES
    // const readerStatus = watch('readerStatus')
    // const [readerStarted, setReaderStarted] = useState(null)
    // const [readerFinished, setReaderFinished] = useState(null)
    // // update 'readerStartDate' based on readerStatus
    // useEffect(() => {
    //     if (readerStatus === 'In Progress') {
    //         // Set 'readerStarted' to the current date when 'In Progress' is selected
    //         setReaderStarted(new Date())
    //     } 
    //     else if (readerStatus === 'Yet to Start') {
    //         // Reset 'readerStarted' to null when 'Yet to Start' is selected
    //         setReaderStarted(null)
    //     }
    //     console.log('readerStarted:', readerStarted)
    //     }, [readerStatus]
    // )
    // // update 'readerStartDate' based on readerStatus
    // useEffect(() => {
    //     if (readerStatus === 'Complete') {
    //         // Set 'readerStarted' to the current date when 'In Progress' is selected
    //         setReaderFinished(new Date())
    //     } 
    //     else {
    //         // Reset 'readerFinished' to null 
    //         setReaderFinished(null)
    //     }
    //     console.log('readerFinshed:', readerFinished)
    //     }, [readerStatus]
    // )

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