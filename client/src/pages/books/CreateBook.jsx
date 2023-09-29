import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { createBook } from '../../services/book'
import { allGenres } from '../../services/genre'
import { createBookGenreAssociation } from '../../services/bookgenres'
import  { createGenre } from '../../services/genre'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import './css/createBook.css'

const CreateBook = () => {

    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [selectedGenres, setSelectedGenres] = useState([])
    const [isAddingGenre, setIsAddingGenre] = useState(false)
    const [newGenreName, setNewGenreName] = useState('')

    const {
        data: genresData,
        isLoading: isLoadingGenres,
    } = useQuery(['allGenres'], allGenres);

    const {
        mutate,
        isLoading: isLoadingCreatingBook
    } = useMutation({
        mutationFn: ({ title, author, pages, publishedDate, description, language, ISBN, slug, coverImage }) => {
            return createBook({ title, author, pages, publishedDate, description, language, ISBN, slug, coverImage })
        },
        onSuccess: async (data) => {
            toast.success("Successfylly created book")
            console.log(data)
            const bookId = data.book._id

            // Create association between book and selected genres
            await Promise.all(
                selectedGenres.map(async (genre) => {
                    await createBookGenreAssociation(bookId, genre._id)
                })
            )
            navigate(`/book/${bookId}`)
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
            // Reset input field
            setIsAddingGenre(false)
            setNewGenreName('')
            // Refetch genre data
            await queryClient.invalidateQueries('allGenres')
            // can select newly created genre
            setSelectedGenres([...selectedGenres, data])
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        }
    })

    const {register, handleSubmit, formState: {errors, isValid}, getValues } = useForm({
        defaultValues: {
            title: "",
            author: "",
            pages: 0,
            publishedDate: "",
            language: "",
            ISBN: "",
            description: "",
            genres: []
        },
        mode: "onChange"
    })

    const handleGenreChange = (e, genre) => {
        const isChecked = e.target.checked
        if (isChecked) {
            setSelectedGenres([...selectedGenres, genre]);
        } 
        else {
            setSelectedGenres(selectedGenres.filter((selectedGenre) => selectedGenre._id !== genre._id));
        }
    }
    if (isLoadingGenres) {
        return <div>Loading genres...</div>
    }

    const submitHandler = (data) => {
        const { title, author, pages, publishedDate, description, language, ISBN, slug, coverImage } = data
        const genreIds = selectedGenres.map((genre) => genre._id);
        mutate({ title, author, pages, publishedDate, description, language, ISBN, slug, coverImage, genres: genreIds })
    }

    return (
        <Layout>
            <section className='add-book-section'>
                <div>
                    <h1>Add Book</h1>
                    <form onSubmit={handleSubmit(submitHandler)}>
                        <div className='aB-form-group'>
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
                        <div className='aB-form-group'>
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
                        <div className='aB-form-group'>
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
                        <div className='aB-form-group'>
                            <label htmlFor="publishedDate">Published Year</label>
                            <input 
                                type='text'
                                id='publishedDate'
                                {...register("publishedDate", {
                                    required: {
                                        value: true,
                                        message: "Published Year is required"
                                    }
                                })}
                                placeholder='Enter Published Year'
                            />
                            {errors.publishedDate?.message && (
                                <p>{errors.publishedDate?.message}</p>
                            )}
                        </div>
                        <div className='aB-form-group'>
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
                        <div className='aB-form-group'>
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
                        <div className='aB-genre-selection-container'>
                            <div>
                                <label className='ab-genre-selection-label'>Select Genres:</label>
                                {/* Check if genresData exists before mapping */}
                                {genresData ? (
                                    genresData.map((genre) => (
                                        <div key={genre._id}>
                                            <input
                                                type="checkbox"
                                                id={genre._id}
                                                name="genres"
                                                value={genre._id}
                                                onChange={(e) => handleGenreChange(e, genre)}
                                                checked={selectedGenres.some(
                                                (selectedGenre) => selectedGenre._id === genre._id
                                                )}
                                            />
                                            <label htmlFor={genre._id}>{genre.name}</label>
                                        </div>
                                    ))
                                ) : (
                                    <div>Loading genres...</div>
                                )}
                            </div>
                        {/* Create Genre */}
                            <div className='aB-create-genre-container'>
                                {isAddingGenre ? (
                                    <div>
                                        <label>Create New Genre: </label>
                                        <input 
                                            type='text'
                                            name='newGenre'
                                            {...register('newGenreName')}
                                            value={newGenreName}
                                            onChange={(e) => setNewGenreName(e.target.value)}  // update state of input field
                                        />
                                        <button
                                            type='button'
                                            onClick={() => {
                                                const name = newGenreName.trim() // Remove leading/trailig spaces
                                                if(name) {
                                                    mutateCreateGenre({ name })
                                                }
                                            }}
                                        >
                                            Create Genre
                                        </button>
                                        <button
                                            type='button'
                                            onClick={() => setIsAddingGenre(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                    type='button'
                                    onClick={() => setIsAddingGenre(true)}
                                    className="add-genre-button"
                                >
                                    Add Genre
                                </button>
                                )}
                            </div>
                        </div>
                        <div className='aB-form-group'>
                            <label htmlFor="description">Description</label>
                            <textarea
                                id='description'
                                {...register("description", {
                                    required: {
                                        value: true,
                                        message: "Description is required"
                                    }
                                })}
                                placeholder='Enter description'
                            />
                            {errors.description?.message && (
                                <p>{errors.description?.message}</p>
                            )}
                        </div>
                        <button
                            type='submit'
                            disabled={!isValid}
                            className="aB-add-book-button"
                        >
                            Add Book
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    )
}

export default CreateBook