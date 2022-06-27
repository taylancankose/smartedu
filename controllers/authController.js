const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const User = require('../models/User')
const Category = require('../models/categorySchema')
const Course = require('../models/Course')

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body)

    res.status(201).redirect('/login')
  } catch (error) {
    const errors = validationResult(req)
    console.log(errors)
    console.log(errors.array()[0].msg)
    for (let i = 0; i < errors.array().length; i++) {
      req.flash('fail', ` ${errors.array()[i].msg}`)
    }
    res.status(400).redirect('/register')
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
        } else {
          req.flash('fail', `Your password is not correct`)
          res.status(400).redirect('/login')
        }
      })
    } else {
      req.flash('fail', `User does not exists`)
      res.status(400).redirect('/login')
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
  const users = await User.find()
  const user = await User.findOne({ _id: req.session.userID }).populate(
    'courses'
  )
  // session'daki userID'si _id'ye eşit olanı buluyoruz
  const categories = await Category.find() // kategorileri buluyoruz
  const courses = await Course.find({ user: req.session.userID }) // userID'si _id'ye eşit olan kursları buluyoruz
  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
    courses,
    users,
  })
}

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id)
    await Course.deleteMany({ user: req.params.id })
    res.status(200).redirect('/users/dashboard')
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    })
  }
}
