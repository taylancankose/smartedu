const bcrypt = require('bcrypt')
const User = require('../models/User')
const Category = require('../models/categorySchema')

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body)

    res.status(201).redirect('/login')
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    })
  }
}

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body // body'den email ve password alıyoruz
    const user = await User.findOne({ email }) // email'i buluyoruz
    if (user) {
      bcrypt.compare(password, user.password, (err, same) => {
        // bodyden gelen password ile db'deki passwordü karşılaştırıyoruz
        // eğer aynıysa
        if (same) {
          req.session.userID = user._id // session'a userID atıyoruz
          res.status(200).redirect('/users/dashboard') // dashboard sayfasına yönlendiriyoruz
        }
      })
    }
    // email'inden kullanıcıyı buluyoruz
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    })
  }
}

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.status(200).redirect('/') // home sayfasına yönlendiriyoruz
  }) // session'ı siler
}

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID }) // session'daki userID'si _id'ye eşit olanı buluyoruz
  const categories = await Category.find() // kategorileri buluyoruz
  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
  })
}
