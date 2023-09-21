import React, { useMemo, useState } from 'react'
import Layout from '../../components/Layout'
import { getBookDetails, editBook } from '../../services/book'
import { getAllGenresForBook, createBookGenreAssociation, removeBookGenreAssociation } from '../../services/bookgenres'
import { allGenres, createGenre } from '../../services/genre'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'

const EditBook = () => {

    // Still Needs work on the genres

    const { bookId } = useParams()

    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [newGenreName, setNewGenreName] = useState('')
    const [isAddingGenre, setIsAddingGenre] = useState(false)
    const [associatedGenres, setAssociatedGenres] = useState([]);
    const [unassociatedGenres, setUnassociatedGenres] = useState([]);
    
    // Retrieve book details
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

    // Retrieve all Genres
    const {
        data: allGenresData,
        isLoading: isLoadingGenres,
    } = useQuery(['allGenres'], allGenres);

    // Retrieve all genres for book
    const {
        data: genreBookData,
        isLoading: genreBookIsLoading,
        isError: genreBookIsError,
        error: genreBookError,
    } = useQuery(
        ["genresForBook", bookId],
        () => getAllGenresForBook(bookId)
    )
    console.log('genreBookData:', genreBookData)

    
    // state to track selected genres
    const [selectedGenres, setSelectedGenres] = useState(
        genreBookData?.map((genre) => genre._id || []) || []
    )

    const {
        mutate: editBookMutate,
        isLoading: editBookIsLoading,
    } = useMutation({
        mutationFn: ({ title, author, pages, publishedDate, description, language, ISBN, slug, coverImage, readerStatus, readerStarted, readerFinished }) => {
            return editBook({
                bookData: { title, author, pages, publishedDate, description, language, ISBN, slug, coverImage, readerStatus, readerStarted, readerFinished },
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

    const {register, handleSubmit, formState: { errors, isValid }} = useForm({
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
                genres: detailIsLoading ? [] : detailData.genres,
            }
        }, [detailData, detailIsLoading]),
        mode: 'onChange'
    })

    // const handleGenreChange = (genreId) => {
    //     if (selectedGenres.includes(genreId)) {
    //         setSelectedGenres((prevSelectedGenres) =>
    //             prevSelectedGenres.filter((id) => id !== genreId)
    //         )
    //         removeBookGenreAssociation(bookId, genreId)
    //     }
    //     else {
    //         setSelectedGenres((prevSelectedGenres) => [...prevSelectedGenres, genreId])
    //         createBookGenreAssociation(bookId, genreId)
    //     }
    // }

    const handleGenreClick = (genre) => {
        // Check if the genre is associated with the book
        const genreId = genre._id
        if (selectedGenres.some((selectedGenre) => selectedGenre._id === genreId)) {
            setSelectedGenres((prevSelectedGenres) =>
                prevSelectedGenres.filter((selectedGenre) => selectedGenre._id !== genreId)
            );
            removeBookGenreAssociation(bookId, genreId);
        } else {
            setSelectedGenres((prevSelectedGenres) => [...prevSelectedGenres, genre]);
            createBookGenreAssociation(bookId, genreId);
        }
        // setUnassociatedGenres((prevUnassociatedGenres) =>
        //     prevUnassociatedGenres.filter((genreId) => genreId !== genreId)
        // );
    }

    const handleCreateNewGenre = async () => {
        try{
            const name = newGenreName.trim()
            if (name) {
                const response = await createGenre({ name })
                if (response) {
                    setSelectedGenres([...selectedGenres, response])
                    setNewGenreName('')
                    setIsAddingGenre(false)
                }
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    const submitHandler = (data) => {
        const { title, author, pages, publishedDate, description, language, ISBN, slug, coverImage, readerStatus, readerStarted, readerFinished } = data
        editBookMutate({ title, author, pages, publishedDate, description, language, ISBN, slug, coverImage, readerStatus, readerStarted, readerFinished, genres: selectedGenres })
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
                    <form onSubmit={handleSubmit(submitHandler)}>
                        <div>
                            <label htmlFor="title">Title</label>
                            <input 
                                type='text'
                                id='title'
                                {...register("title", {
                                    required: {
                                        value: true,
                                        message: "Title is required"
                                    }
                                })}
                                placeholder='Enter title'
                            />
                            {errors.title?.message && (
                                <p>{errors.title?.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="author">Author</label>
                            <input 
                                type='text'
                                id='author'
                                {...register("author", {
                                    required: {
                                        value: true,
                                        message: "Author is required"
                                    }
                                })}
                                placeholder='Enter author'
                            />
                            {errors.author?.message && (
                                <p>{errors.author?.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="pages">Pages</label>
                            <input 
                                type='number'
                                id='pages'
                                {...register("pages", {
                                    required: {
                                        value: true,
                                        message: "Pages is required"
                                    }
                                })}
                                placeholder='Enter pages'
                            />
                            {errors.pages?.message && (
                                <p>{errors.pages?.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="publishedDate">PublishedDate</label>
                            <input 
                                type='text'
                                id='publishedDate'
                                {...register("publishedDate", {
                                    required: {
                                        value: true,
                                        message: "PublishedDate is required"
                                    }
                                })}
                                placeholder='Enter publishedDate'
                            />
                            {errors.publishedDate?.message && (
                                <p>{errors.publishedDate?.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="language">Language</label>
                            <input 
                                type='text'
                                id='language'
                                {...register("language", {
                                    required: {
                                        value: true,
                                        message: "Language is required"
                                    }
                                })}
                                placeholder='Enter language'
                            />
                            {errors.language?.message && (
                                <p>{errors.language?.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="ISBN">ISBN</label>
                            <input 
                                type='text'
                                id='ISBN'
                                {...register("ISBN", {
                                    required: {
                                        value: true,
                                        message: "ISBN is required"
                                    }
                                })}
                                placeholder='Enter ISBN'
                            />
                            {errors.ISBN?.message && (
                                <p>{errors.ISBN?.message}</p>
                            )}
                        </div>
                        {/* <div>
                            {allGenresData ? (
                                allGenresData.map((genre) => (
                                <div key={genre._id}>
                                    <input
                                        type='checkbox'
                                        name='genres'
                                        id={genre._id}
                                        value={genre._id}
                                        checked={selectedGenres.includes(genre._id)}
                                        onChange={() => handleGenreChange(genre._id)}
                                    />
                                    <label htmlFor={genre._id}>{genre.name}</label>
                                </div>
                            ))
                            ) : (
                                <div>Loading genres...</div>
                            )}
                        </div> */}
                        <div>
                            <h2>Genres: </h2>
                            <div>
                                <h3>The book's genres: </h3>
                                {genreBookData.map((genre) => (
                                <div 
                                    key={genre._id}
                                    onClick={() => handleGenreClick(genre.genre)}
                                >
                                    {genre.genre.name}
                                </div>
                            ))}
                            </div>
                            <div>
                                <h3>Other genres to choose from: </h3>
                                {unassociatedGenres.map((genreId) => {
                                    const genre = allGenresData.find((genre) => genre._id === genreId)
                                    return (
                                        <div 
                                            key={genre._id}
                                            onClick={() => handleGenreClick(genre)}
                                        >
                                            {genre.name}
                                        </div>
                                    )
                                })}
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
                                        {...register('newGenreName')}
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