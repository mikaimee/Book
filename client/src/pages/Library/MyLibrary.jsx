import React, {useState} from 'react'
import Layout from '../../components/Layout'

import FilterButton from '../../components/library/FilterButton'
import BookList from '../../components/library/BookList'
import BooksReadCounter from '../../components/library/BooksReadCounter'
import GenrePieChart from '../../components/library/GenrePieChart'

const MyLibrary = () => {

    const [selectedStatus, setSelectedStatus] = useState('All')

    return (
        <Layout>
            <section>
                <h2 className='mL-pagetitle'>My Library</h2>
                <div className='bD-section-container'>
                    <div className='mL-container-left'>
                        <div className='mL-container-scroll'>
                            <FilterButton setSelectedStatus={setSelectedStatus}/>
                            <BookList selectedStatus={selectedStatus}/>
                        </div>
                    </div>
                    <div className='mL-container-right'>
                        <div className='mL-container-scroll'>
                            <h3>Check out your progress here</h3>
                            <hr/>
                            <BooksReadCounter />
                            <hr />
                            <GenrePieChart />
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default MyLibrary