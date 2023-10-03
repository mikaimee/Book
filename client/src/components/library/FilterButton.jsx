import React from 'react'

const FilterButton = ({ setSelectedStatus }) => {

    const handleFilterChange = (e) => {
        setSelectedStatus(e.target.value)
    }

    return (
        <div className='mL-form-selection-container'>
            <label htmlFor='filterSelect'>Filter by Status: </label>
            <select id='filterSelect' onChange={handleFilterChange} className='uB-selections'>
                <option value="All">All</option>
                <option value="Yet to Start">Yet to start</option>
                <option value="In Progress">In Progress</option>
                <option value="Complete">Completed</option>
            </select>
        </div>    
    )
}

export default FilterButton