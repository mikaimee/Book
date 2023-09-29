import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../../components/Layout'
import { useSelector } from 'react-redux'
import { getBookDetails, editBook } from '../../services/book'
import { getAllGenresForBook, createBookGenreAssociation, removeBookGenreAssociation } from '../../services/bookgenres'
import { allGenres, createGenre } from '../../services/genre'
import { getLibraryDetails, updateUserBook } from '../../services/userbooks'
import { getUserProfile } from '../../services/user'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'

const EditBook = () => {

    const { bookId } = useParams()

    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const userState = useSelector((state) => state.user)
    const [newGenreName, setNewGenreName] = useState('')
    const [isAddingGenre, setIsAddingGenre] = useState(false)
    
    // GET BOOK DETAILS
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

    // GET ALL GENRES
    const {
        data: allGenresData,
        isLoading: isLoadingGenres,
    } = useQuery(['allGenres'], allGenres);

    // GET ALL GENRES FOR BOOK
    const {
        data: genreBookData,
        isLoading: genreBookIsLoading,
        isError: genreBookIsError,
        error: genreBookError,
    } = useQuery(
        ["genresForBook", bookId],
        () => getAllGenresForBook(bookId)
    )
    // console.log('genreBookData:', genreBookData)

    // Creating the selectedGenres array
    const [selectedGenres, setSelectedGenres] = useState([])
    const [unassociatedGenres, setUnassociatedGenres] = useState([])

    useEffect(() => {
        if (allGenresData) {
            // Extract genre IDs from genreBookData
            const genreIds = genreBookData?.map((genre) => genre.genre._id) || [];
    
            // Filter unassociatedGenres based on genreIds
            const unassociated = allGenresData.filter((genre) => (
                !genreIds.includes(genre._id)
            ));
            
            setSelectedGenres(genreIds);
            setUnassociatedGenres(unassociated);
        }
    }, [allGenresData, genreBookData])

    // EDIT BOOK
    const {
        mutate: editBookMutate,
        isLoading: editBookIsLoading,
    } = useMutation({
        mutationFn: ({ title, author, pages, publishedDate, description, language, ISBN, slug, coverImage }) => {
            return editBook({
                bookData: { title, author, pages, publishedDate, description, language, ISBN, slug, coverImage },
                bookId: detailData._id
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['detailData'])
            toast.success("Successful update")
            navigate(`/book/${detailData._id}`)
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        }
    })

    // CREATE GENRE
    const {
        mutate: mutateCreateGenre,
        isLoading: isLoadingCreateGenre
    } = useMutation({
        mutationFn: ({ name }) => {
            return createGenre({ name })
        },
        onSuccess: async (data) => {
            toast.success("Successfully created genre")
            console.log(data)
            setIsAddingGenre(false)
            setNewGenreName('')
            await queryClient.invalidateQueries('allGenres')
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        }
    })

    // USEFORM
    // Book Model
    const {register: registerBook, handleSubmit: handleSubmitBook, formState: { errors: errorsBook, isValid }} = useForm({
        defaultValues: {
            title: "",
            author: "",
            pages: 0,
            publishedDate: "",
            language: "",
            ISBN: "",
            description: "",
            genres: selectedGenres
        },
        values: useMemo(() => {
            return {
                title: detailIsLoading ? "" : detailData.title,
                author: detailIsLoading ? "" : detailData.author,
                pages: detailIsLoading ? "" : detailData.pages,
                publishedDate: detailIsLoading ? "" : detailData.publishedDate,
                language: detailIsLoading ? "" : detailData.language,
                ISBN: detailIsLoading ? "" : detailData.ISBN,
                description: detailIsLoading ? "" : detailData.description,
                genres: detailIsLoading ? [] : detailData.genres
            }
        }, [detailData, detailIsLoading]),
        mode: 'onChange'
    })

    // Handles Creating the association by adding it to the selectedGenres array 
    const handleAssociationClick = async (genre) => {
        try {
            const genreId = genre._id
            // Check if genre is associated with book
            if (!selectedGenres.some((selectedGenre) => selectedGenre._id === genreId)) {
                // Select genre
                setSelectedGenres((prevSelectedGenres) => [...prevSelectedGenres, genre])
                // Filter out genre from unassociated genres
                setUnassociatedGenres((prevUnassociatedGenres) =>
                    prevUnassociatedGenres.filter((unassociatedGenre) => unassociatedGenre._id !== genreId)
                )
                // Add association to database
                await createBookGenreAssociation(bookId, genreId)
            }
        }
        catch (error) {
            console.error('Error in handleAssociationClick: ', error)
        }
    }

    // Handles Removing the association between book and genre + moves to unassociated array
    const handleRemoveGenreClick = async (genre) => {
        try {
            const genreId = genre._id
            // Find association ID basedon genre being unselected
            const association = genreBookData.find((association) => association.genre._id === genreId)
            if (association) {
                const associationId = association._id
                // Remove the association from the database
                await removeBookGenreAssociation(associationId)
                // Deselect genre
                setSelectedGenres((prevSelectedGenres) =>
                    prevSelectedGenres.filter((selectedGenre) => selectedGenre._id !== genreId)
                )
                // Add genre back to unassociated genres
                setUnassociatedGenres((prevUnassociatedGenres) => [...prevUnassociatedGenres, genre])
            }
        }
        catch (error) {
            console.error('Error in handleRemoveGenreClick: ', error)
        }
    }

    const submitBookHandler = (data) => {
        const { title, author, pages, publishedDate, description, language, ISBN, slug, coverImage } = data
        editBookMutate(data, {genres: selectedGenres})
    }

    if(detailIsLoading || isLoadingGenres) {
        return <p>Loading...</p>
    }

    if(detailIsError || genreBookIsError) {
        return <p>Error loading book details</p>
    }

    return (
        <Layout>
            <section>
                <div>
                    <h1>Edit Book</h1>
                    <form onSubmit={handleSubmitBook(submitBookHandler)}>
                        <div>
                            <label htmlFor="title">Title</label>
                            <input 
                                type='text'
                                id='title'
                                {...registerBook("title", {
                                    required: {
                                        value: true,
                                        message: "Title is required"
                                    }
                                })}
                                placeholder='Enter title'
                            />
                            {errorsBook.title?.message && (
                                <p>{errorsBook.title?.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="author">Author</label>
                            <input 
                                type='text'
                                id='author'
                                {...registerBook("author", {
                                    required: {
                                        value: true,
                                        message: "Author is required"
                                    }
                                })}
                                placeholder='Enter author'
                            />
                            {errorsBook.author?.message && (
                                <p>{errorsBook.author?.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="pages">Pages</label>
                            <input 
                                type='number'
                                id='pages'
                                {...registerBook("pages", {
                                    required: {
                                        value: true,
                                        message: "Pages is required"
                                    }
                                })}
                                placeholder='Enter pages'
                            />
                            {errorsBook.pages?.message && (
                                <p>{errorsBook.pages?.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="publishedDate">PublishedDate</label>
                            <input 
                                type='text'
                                id='publishedDate'
                                {...registerBook("publishedDate", {
                                    required: {
                                        value: true,
                                        message: "PublishedDate is required"
                                    }
                                })}
                                placeholder='Enter publishedDate'
                            />
                            {errorsBook.publishedDate?.message && (
                                <p>{errorsBook.publishedDate?.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="language">Language</label>
                            <input 
                                type='text'
                                id='language'
                                {...registerBook("language", {
                                    required: {
                                        value: true,
                                        message: "Language is required"
                                    }
                                })}
                                placeholder='Enter language'
                            />
                            {errorsBook.language?.message && (
                                <p>{errorsBook.language?.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="ISBN">ISBN</label>
                            <input 
                                type='text'
                                id='ISBN'
                                {...registerBook("ISBN", {
                                    required: {
                                        value: true,
                                        message: "ISBN is required"
                                    }
                                })}
                                placeholder='Enter ISBN'
                            />
                            {errorsBook.ISBN?.message && (
                                <p>{errorsBook.ISBN?.message}</p>
                            )}
                        </div>
                        <div>
                            <div>
                                <h3>Genres: </h3>
                                {selectedGenres.map((genreId) => {
                                    // Find the corresponding genre in allGenresData
                                    const genre = allGenresData.find((genre) => genre._id === genreId);
                                    return (
                                        <div key={genreId}>
                                            {genre ? (
                                                <span>{genre.name}</span>
                                            ): (
                                                <span>Genre not found</span>
                                            )}
                                            <button
                                                type='button'
                                                onClick={() => handleRemoveGenreClick(genre)}
                                            >
                                                X
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            <div>
                                <h3>Other Genres: </h3>
                                {allGenresData ? (
                                    unassociatedGenres.map((genre) => (
                                        <div
                                            key={genre._id}
                                            onClick={() => handleAssociationClick(genre)}
                                        >
                                            {genre.name}
                                        </div>
                                    ))
                                ) : (
                                    <p>Loading genres...</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <button
                            type="button"
                            onClick={() => setIsAddingGenre(!isAddingGenre)}
                            >
                                {isAddingGenre ? 'Cancel' : '+'}
                            </button>
                            {isAddingGenre && (
                                <div>
                                    <label>Create New Genre: </label>
                                    <input
                                        type='text'
                                        name='newGenreName'
                                        {...registerBook('newGenreName')}
                                        value={newGenreName}
                                        onChange={(e) => setNewGenreName(e.target.value)}
                                    />
                                <button 
                                    type='button' 
                                    onClick={() => {
                                        const name = newGenreName.trim()
                                        if (name) {
                                            mutateCreateGenre({ name })
                                        }
                                    }}
                                >
                                    Create Genre
                                </button>
                            </div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="description">Description</label>
                            <textarea
                                id='description'
                                {...registerBook("description", {
                                    required: {
                                        value: true,
                                        message: "Description is required"
                                    }
                                })}
                                placeholder='Enter description'
                            />
                            {errorsBook.description?.message && (
                                <p>{errorsBook.description?.message}</p>
                            )}
                        </div>
                        {/* {userAssociation && (
                            <div>
                                <label htmlFor='readerStatus'>Status: </label>
                                <Controller
                                    name='readerStatus'
                                    control={control}
                                    defaultValue={detailData?.readerStatus}
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
                            </div>
                        )} */}
                        <div>
                            <button type="submit" disabled={!isValid || editBookIsLoading}>
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </Layout>
    )
}

export default EditBook