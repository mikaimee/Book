require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const path = require('path')
const { logger } = require('./middleware/logger')
const errorLogger = require('./middleware/errLogger')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')

const mongoose = require('mongoose')
const PORT = 8000
console.log(process.env.NODE_ENV)
require('./config/dbConnection')

//LOGGER
app.use(logger)

// Handle options credentials check before CORS
app.use(credentials)

// CORS
app.use(cors(corsOptions))

// Handle urlencoded form data
app.use(express.urlencoded({ extended: false }))

// middleware for json
app.use(express.json())

// middleware for cookies
app.use(cookieParser())

// Static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// Routes
app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/books', require('./routes/bookRoutes'))
app.use('/genres', require('./routes/genreRoutes'))
app.use('/bookGenres', require('./routes/bookGenreRoutes'))
app.use('/reviews', require('./routes/reviewRoutes'))
app.use('/userBooks', require('./routes/userBookRoutes'))

// Custom 404 Error Page 
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'public', '404.html'))
    }
    else if (req.accepts('json')) {
        res.json({message: '404 not found'})
    }
    else {
        res.type('txt').send('404 not found')
    }
})

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})