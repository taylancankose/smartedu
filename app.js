const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo') // session'ı mongostore'a kaydedip sunucu durduğunda bir değişiklik olduğunda bile logged in kalmamıza yarıyor
const flash = require('connect-flash')
const methodOverride = require('method-override')
const pageRoute = require('./routes/pageRoute')
const courseRoute = require('./routes/courseRoute')
const categoryRoute = require('./routes/categoryRoute')
const userRoute = require('./routes/userRoute')

const app = express()

// Connect to MongoDB
mongoose
  .connect(
    'mongodb+srv://teco:teco@cluster0.2jqvs.mongodb.net/smartedu-db?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
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
    store: MongoStore.create({
      mongoUrl:
        'mongodb+srv://teco:teco@cluster0.2jqvs.mongodb.net/smartedu-db?retryWrites=true&w=majority',
    }), // session'ın kaydedileceği yer
  })
)
app.use(flash())
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash()
  next()
})
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
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

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`SmartEdu app listening on port ${port}!`))
