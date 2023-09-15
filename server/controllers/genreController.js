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

module.exports = { createGenre }