import React, {useState} from 'react'
import Layout from '../../components/Layout'

import FilterButton from '../../components/library/FilterButton'
import BookList from '../../components/library/BookList'
import BooksReadCounter from '../../components/library/BooksReadCounter'

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
                        <h3>Check out your progress here</h3>
                        <hr/>
                        <BooksReadCounter />
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default MyLibrary