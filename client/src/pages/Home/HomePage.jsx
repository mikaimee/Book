import React from 'react'
import Layout from '../../components/Layout'
import { allGenres } from '../../services/genre'
import { useQuery } from '@tanstack/react-query'

import SearchBar from '../../components/home/SearchBar'
import LatestBooks from '../../components/home/LatestBooks'
import PopularBooks from '../../components/home/PopularBooks'
import BooksByGenre from '../../components/home/BooksByGenre'

const HomePage = () => {

    //Retrieve all genres
    const {
        data: genresData,
        isLoading: isLoadingGenres,
        isError: isErrorGenres,
        error: genresError
    } = useQuery(['allGenres'], allGenres)

    if (isLoadingGenres) {
        return <p>Loading genres...</p>
    }

    if (isErrorGenres) {
        return <p>Error: {genresError.message}</p>
    }

    return (
        <Layout> 
            <div>
                <SearchBar />
                <LatestBooks />
                <PopularBooks />
                <BooksByGenre genreName="fantasy" />
            </div>
        </Layout>
    )
}

export default HomePage