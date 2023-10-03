import React, {useState} from 'react'
import Layout from '../../components/Layout'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getAllBooksForUser } from '../../services/userbooks'
import CoverImage from '../../components/book/CoverImage'

import FilterButton from '../../components/library/FilterButton'
import BookList from '../../components/library/BookList'

const MyLibrary = () => {

    const [selectedStatus, setSelectedStatus] = useState('All')

    return (
        <Layout>
            <section>
                <h2 className='mL-pagetitle'>My Library</h2>
                <div className='bD-section-container'>
                    <div className='mL-container-left'>
                        <FilterButton setSelectedStatus={setSelectedStatus}/>
                        <BookList selectedStatus={selectedStatus}/>
                    </div>
                    <div className='mL-container-right'>
                        Where progress will eventually go
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default MyLibrary