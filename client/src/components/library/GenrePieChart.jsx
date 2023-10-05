import React, { useState } from 'react'
import { getAllBooksForUser } from '../../services/userbooks'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts'

const GenrePieChart = () => {

    const userState = useSelector((state) => state.user)
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#8884D8', '#0088FE', '#00C49F', '#FFBB28', '#FF8042']

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

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error: {error.message}</div>
    }

    // Calculate genre percentage
    const genreCount = {}

    libraryData.forEach((item) => {
        const genres = item.book.genres
        genres.forEach((genre) => {
            const genreName = genre.genre.name
            if(!genreCount[genreName]) {
                genreCount[genreName] = 1
            }
            else {
                genreCount[genreName]++
            }
        })
    })

    const totalGenres = Object.values(genreCount).reduce((total, count) => total + count, 0)

    const genrePercentages = Object.entries(genreCount).map(([genre, count]) => ({
        genre,
        percentage: (count / totalGenres) *100 
    }))

    return (
        <div className='mL-book-counter'>
            <h4>Your favorite genres</h4>
            <div className='mL-chart-wrapper'>
                <PieChart width={300} height={260}>
                    <Pie
                        data={genrePercentages}
                        dataKey="percentage"
                        isAnimationActive={false}
                        cx={150}
                        cy={100}
                        outerRadius={60}
                        fill='#8884d8'
                        label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                    >
                        {genrePercentages.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                                name={entry.genre}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>
        </div>
    )
}

export default GenrePieChart