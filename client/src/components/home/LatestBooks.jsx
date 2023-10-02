import React, {useState} from 'react'
import { getAllBooks } from '../../services/book'
import { useQuery } from '@tanstack/react-query'

const LatestBooks = () => {

    const [booksToShow, setBooksToShow] = useState(5)
    const [allBooks, setAllBooks] = useState([])

    const { data, isLoading } = useQuery(['allBooks'], getAllBooks)
    // console.log("All books: ", data.books)

    if (isLoading) {
        return <div>Loading...</div>
    }

    const books = data?.books || []

    if (!Array.isArray(books)) {
        return <div>No books available.</div>;
    }

    const sortedBooks = books
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, booksToShow)
    
    const loadMoreBooks = () => {
        setBooksToShow(booksToShow + 5)
    }

    return (
        <div>
            <h2>Latest Books</h2>
            <ul>
                {sortedBooks.map((book) => (
                    <li key={book._id}>
                        <div>Title: {book.title}</div>
                    </li>
                ))}
            </ul>
            {booksToShow < books.length && (
                <button onClick={loadMoreBooks}>Load More</button>
            )}
        </div>
    )
}

export default LatestBooks