import React from 'react'
import Layout from '../../components/Layout'
import { createBook } from '../../services/book'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'

const CreateBook = () => {

    const navigate = useNavigate()

    const {
        mutate,
        isLoading
    } = useMutation({
        mutationFn: ({ title, author, pages, publishedDate, description, language, ISBN, slug, coverImage, readerStatus, readerStarted, readerFinished }) => {
            return createBook({ title, author, pages, publishedDate, description, language, ISBN, slug, coverImage, readerStatus, readerStarted, readerFinished })
        },
        onSuccess: (data) => {
            toast.success("Successfylly created book")
            console.log(data)
            const bookId = data.book._id
            navigate(`/book/${bookId}`)
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        }
    })

    const {register, handleSubmit, formState: {errors, isValid} } = useForm({
        defaultValues: {
            title: "",
            author: "",
            pages: 0,
            publishedDate: "",
            language: "",
            ISBN: "",
            description: ""
        },
        mode: "onChange"
    })

    const submitHandler = (data) => {
        const { title, author, pages, publishedDate, description, language, ISBN, slug, coverImage, readerStatus, readerStarted, readerFinished } = data
        mutate({ title, author, pages, publishedDate, description, language, ISBN, slug, coverImage, readerStatus, readerStarted, readerFinished })
    }

    return (
        <Layout>
            <section>
                <div>
                    <h1>Add Book</h1>
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
                        <div>
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