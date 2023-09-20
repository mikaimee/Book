const Genre = require('../models/Genre')

const createGenre = async (req, res, next) => {
    try {
        const {name} = req.body
        
        const existingGenre = await Genre.findOne({ name })
        if (existingGenre) {
            return res.status(400).json({error: "Genre already exists"})
        }

        const genre = new Genre({ name })
        await genre.save()
        res.status(201).json({ message: "Genre created", genre })
    }
    catch (error) {
        res.status(500).json({error: "An error occured while creating genre"})
    }
}

const allGenres = async (req, res) => {
    try{
        const genres = await Genre.find()
        res.status(200).json({ genres })
    }
    catch (error) {
        res.status(500).json({error: "An error occured while retrieving all genres"})
    }
}

module.exports = { createGenre, allGenres }