const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserBookSchema = new Schema({
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
    }
}, {timestamps: true})

module.exports = mongoose.model('UserBook', UserBookSchema);