import React, { useState, useEffect, useMemo, memo } from 'react'
import { getAllBooksForUser } from '../../services/userbooks'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts'

const BooksReadCounter = () => {

    const [booksReadCount, setBooksReadCount] = useState(0)
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const userState = useSelector((state) => state.user)
    const [monthlyBookCount, setMonthlyBookCount] = useState([])
    const [graphData, setGraphData] = useState({booksReadCount: 0, monthlyBookCount: []})

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
    console.log('library data: ', libraryData)

    const memoizedGraphData = useMemo(() => {
        if (!libraryData || libraryData.length === 0) {
            return {
                booksReadCount: 0,
                monthlyBookCount: []
            }
        }

        // Filter books with completion data
        const booksWithCompletionDate = libraryData.filter((item) => item.readerFinished)
        // Filter books read in selected month and year
        const booksReadInMonthYear = booksWithCompletionDate.filter((item) => {
            const completionDate = new Date(item.readerFinished)
            return (
                completionDate.getMonth() + 1 === selectedMonth &&
                completionDate.getFullYear() === selectedYear
            )
        })

        // Calculate number of books read for each month
        const monthlyCounts = Array.from({ length: 12 }, (_, monthIndex) => {
            const booksReadInMonth = booksWithCompletionDate.filter((item) => {
                const completionDate = new Date(item.readerFinished)
                return (
                    completionDate.getMonth() === monthIndex &&
                    completionDate.getFullYear() === selectedYear
                )
            })
            return { month: monthIndex + 1, count: booksReadInMonth.length}
        })
        return {
            booksReadCount: booksReadInMonthYear.length,
            monthlyBookCount: monthlyCounts
        }
    }, [libraryData, selectedMonth, selectedYear])

    useEffect(() => {
        setGraphData(memoizedGraphData)
    }, [memoizedGraphData])

    // console.log("graphData: ",graphData)

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
            <p>You've read {graphData.booksReadCount} books</p>

            <div className='mL-chart-wrapper'>
                <LineChart width={300} height={200} data={graphData.monthlyBookCount}>
                    <XAxis dataKey="month"/>
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" name='Books Read' stroke='#8884d8'/>
                </LineChart>
            </div>
        </div>
    )
}

export default BooksReadCounter
