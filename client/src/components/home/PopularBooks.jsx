import React, { useState , useRef, useEffect } from 'react'
import { getAllBooks } from '../../services/book'
import { useQuery } from '@tanstack/react-query'
import Rating from 'react-rating'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-regular-svg-icons'
import { Link } from 'react-router-dom'
import CoverImage from '../book/CoverImage'


const PopularBooks = () => {

    const { data, isLoading } = useQuery(['allBooks'], getAllBooks)

    // CSS
    const containerRef = useRef(null)
    const [startIndex, setStartIndex] = useState(0)
    const minItemsPerPage = 1
    const [itemsPerPage, setItemsPerPage] = useState(3)

    const calculateItemsPerPage = () => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const itemWidth = 350
            const newItemsPerPage = Math.floor(containerWidth / itemWidth);
            setItemsPerPage(Math.max(minItemsPerPage, newItemsPerPage));
        }
    }

    useEffect(() => {
        calculateItemsPerPage();
        window.addEventListener('resize', calculateItemsPerPage);
        return () => {
            window.removeEventListener('resize', calculateItemsPerPage);
        };
    }, [])

    const books = data?.books || []
    const booksWithAverageRating = books.map((book) => ({
        ...book,
        averageRating: calculateAverageRating(book.ratings)
    }))

    const sortedBooks = [...booksWithAverageRating].sort((a, b) => {
        if (b.averageRating === a.averageRating) {
            return b.ratings.lengh - a.ratings.length
        }
        return b.averageRating - a.averageRating
    })

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!Array.isArray(books)) {
        return <div>No books available.</div>;
    }

    const scrollLeft = () => {
        if (startIndex > 0) {
            setStartIndex(Math.max(0, startIndex - itemsPerPage));
        }
    }
    const scrollRight = () => {
        if (startIndex + itemsPerPage < sortedBooks.length) {
            setStartIndex(startIndex + itemsPerPage)
        }
    }

    // Calculate the visible books based on the current startIndex
    const visibleBooksSlice = sortedBooks.slice(
        startIndex,
        startIndex + itemsPerPage
    )

    return (
        <div className='hS-wrap'>
            <h2 className='hS-title'>Popular books</h2>
            <div className='hS-item-container' ref={containerRef}>
                <ul>
                    {visibleBooksSlice.map((book, index) => (
                        <li key={index} className='hS-item'>
                            <div>
                                <CoverImage 
                                    bookId={book?._id}
                                    coverImage={book?.coverImage}
                                    isEditable={false}
                                />
                            </div>
                            <Link to={`/book/${book._id}`}>
                                <h2 className='hS-title'> {book.title}</h2>
                            </Link>
                            <div>
                                <Rating
                                    initialRating={book.averageRating}
                                    emptySymbol={<FontAwesomeIcon icon={faStar} className='rating-empty-star' />}
                                    fullSymbol={<FontAwesomeIcon icon={fasStar} className='rating-full-star' />}
                                    readonly={true}
                                />
                                <p className='hS-information'>Average: {book.averageRating}</p>
                            </div>
                            <p className='hS-information'>Rated by {book.ratings.length} people</p>
                        </li>
                    ))}
                </ul>
            </div>
            {startIndex > 0 && (
                <div className='hS-scroll-button left' onClick={scrollLeft}>
                    &lt;
                </div>
            )}
            {startIndex + itemsPerPage < sortedBooks.length && (
                <div className='hS-scroll-button right' onClick={scrollRight}>
                    &gt;
                </div>
            )}
        </div>
    )
}

const calculateAverageRating = (ratings) => {
    if (!Array.isArray(ratings) || ratings.length === 0) {
        return 0
    }
    const sum = ratings.reduce((total, rating) => {
        const numericRating = parseFloat(rating.rating)
        if (!isNaN(numericRating)) {
            return total + numericRating
        }
        return total
    }, 0)
    return sum / ratings.length
}

export default PopularBooks