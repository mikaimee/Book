const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RatingSchema = new Schema ({
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }
}, {timestamps: true})

module.exports = mongoose.model('Rating', RatingSchema)