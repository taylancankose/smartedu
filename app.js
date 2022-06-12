const express = require('express')

const app = express()

// Template engine
app.set('view engine', 'ejs')

// Middleware
app.use(express.static('public'))

// ROUTES

// Home
app.get('/', (req, res) => {
  res.status(200).render('index', {
    page_name: 'index',
  }) // 200 başarılı statusunu yollar
})
// About
app.get('/about', (req, res) => {
  res.status(200).render('about', {
    page_name: 'about',
  })
})

const port = 3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
