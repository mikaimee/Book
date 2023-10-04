import React, { useState, useEffect } from 'react'
import { getAllBooksForUser } from '../../services/userbooks'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'

const BooksReadCounter = () => {

    const [booksReadCount, setBooksReadCount] = useState(0)
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const userState = useSelector((state) => state.user)

    const {
        data: libraryData,
        isLoading,
        isError,
        error
    } = useQuery({
        queryFn: () => {
            return getAllBooksForUser({ token: userState?.userInfo?.token })
        },
        queryKey: ["library"]
    })
    // console.log('library data: ', libraryData)

    useEffect(() => {
        if (libraryData && libraryData.length > 0) {
            // filter books that are read 
            const readBooks = libraryData.filter(item => item.readerFinished)
            // filter books that have completion date
            const booksWithCompletionDate = readBooks.filter(item => item.readerFinished)
            // filter books read in selected month and year
            const booksReadInMonthYear = booksWithCompletionDate.filter(item => {
                const completionDate = new Date(item.readerFinshed)
                return (
                    completionDate.getMonth() + 1 === selectedMonth && completionDate.getFullYear() === selectedYear
                )
            })
            setBooksReadCount(booksReadInMonthYear.length)
        }
    }, [libraryData, selectedMonth, selectedYear])

    const handlePrevMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12)
            setSelectedYear(selectedYear - 1)
        }
        else {
            setSelectedMonth(selectedMonth - 1)
        }
    }

    const handleNextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1)
            setSelectedYear(selectedYear + 1)
        }
        else {
            setSelectedMonth(selectedMonth + 1)
        }
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error: {error.message}</div>
    }

    return (
        <div className='mL-book-counter'>
            <h4>Books Read in 
                <button onClick={handlePrevMonth}>&lt;</button>
                    {selectedMonth}/{selectedYear}
                {!(selectedMonth === new Date().getMonth() + 1 && selectedYear === new Date().getFullYear()) && (
                    <button onClick={handleNextMonth}>&gt;</button>
                )}
            </h4>
            <p>You've read {booksReadCount} books</p>
        </div>
    )
}

export default BooksReadCounter
