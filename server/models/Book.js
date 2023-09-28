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
    }
}, {timestamps: true, toJSON: { virtuals: true }})

// defines a virtual field named "reviews" on 'BookSchema'
BookSchema.virtual("reviews", {
    ref: "Review",  // specifies that virtual field 'reviews' is related to "Review" model
    localField: "_id", // '_id' field of the 'Book' model is used as the local field to establish relationship
    foreignField: "book"  // 'Book' model's '_id' will be compared with 'book' field in 'Review' model to retrieve related reviews
})

module.exports = mongoose.model('Book', BookSchema)