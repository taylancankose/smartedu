const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo') // session'ı mongostore'a kaydedip sunucu durduğunda bir değişiklik olduğunda bile logged in kalmamıza yarıyor
const pageRoute = require('./routes/pageRoute')
const courseRoute = require('./routes/courseRoute')
const categoryRoute = require('./routes/categoryRoute')
const userRoute = require('./routes/userRoute')

const app = express()

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost/smartedu-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected')
  })

// Template engine
app.set('view engine', 'ejs')

// Global Variable
global.userIN = null

// Middleware
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: 'my_keyboard_cat', // benim özel secretım
    resave: false, // herhangi bir değişiklik yapılmadığında bile otomatik olarak session'ı kaydetme
    saveUninitialized: true, // session'ın başlangıç değerini kaydetme
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/smartedu-db' }), // session'ın kaydedileceği yer
  })
)

// ROUTES
app.use('*', (req, res, next) => {
  userIN = req.session.userID
  next()
})
app.use('/', pageRoute)
app.use('/courses', courseRoute)
app.use('/categories', categoryRoute)
app.use('/users', userRoute)

const port = 3000
app.listen(port, () => console.log(`SmartEdu app listening on port ${port}!`))
