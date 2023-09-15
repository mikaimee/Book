const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    publishedDate: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    genres: [
        {
            type: Schema.Types.ObjectId,
            ref: 'BookGenre'
        }
    ],
    ISBN: {
        type: String,
        required: true,
        unqiue: true
    },
    description: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unqiue: true
    },
    coverImage: {
        type: String
    },
    readerStatus: {
        type: String,
        enum: ['Yet to Start', 'In Progress', 'Complete'],
        default: 'Yet to Start'
    },
    readerStarted: {
        type: Date,
        default: null
    },
    readerFinished: {
        type: Date,
        default: null
    },
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, {timestamps: true})

module.exports = mongoose.model('Book', BookSchema)