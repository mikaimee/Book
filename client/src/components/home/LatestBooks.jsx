import React, {useState, useRef, useEffect } from 'react'
import { getAllBooks } from '../../services/book'
import { useQuery } from '@tanstack/react-query'
import CoverImage from '../book/CoverImage'
import { Link } from 'react-router-dom'
import ResizeObserver from 'resize-observer-polyfill'

const LatestBooks = () => {

    const { data, isLoading } = useQuery(['allBooks'], getAllBooks)
    // console.log("All books: ", data.books)

    // CSS
    const containerRef = useRef(null)
    const [startIndex, setStartIndex] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(3)
    const minItemsPerPage = 1

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

    // Define and sort sortedBooks
    const books = data?.books || []
    const sortedBooks = books
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    //Loading state
    if (isLoading) {
        return <div>Loading...</div>
    }

    // Check is book not array 
    if (!Array.isArray(books)) {
        return <div>No books available.</div>;
    }

    const scrollLeft = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - itemsPerPage)
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

    // Date Formatting 
    const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString(undefined, options);
    }

    return (
        <div className='hS-wrap'>
            <h2 className='hS-title'>Latest Books</h2>
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
                            <Link to={`/book/${book?._id}`}>
                                <h2 className='hS-title'>{book?.title}</h2>
                            </Link>
                            <p className='hS-information'>{book?.author}</p>
                            <p className='hS-information'>Added on {formatDate(book?.createdAt)}</p>
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

export default LatestBooks