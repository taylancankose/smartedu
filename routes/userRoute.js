const express = require('express')
const { body } = require('express-validator')
const authController = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')
const User = require('../models/User')

const router = express.Router()

router.route('/signup').post(
  [
    body('name').not().isEmpty().withMessage('Please enter your name'),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((userEmail) => {
        return User.findOne({ email: userEmail }).then((user) => {
          if (user) {
            return Promise.reject('Email is already exists')
          }
        })
      }), // burasını ben yaptım böyle bir email var mı varsa kullanıcı var
    body('name').not().isEmpty().withMessage('Please enter a password'),
  ],
  authController.createUser
) // http:localhost:3000/users/signup
router.route('/login').post(authController.loginUser) // http:localhost:3000/users/login
router.route('/logout').get(authController.logoutUser) // http:localhost:3000/users/logout
router.route('/dashboard').get(authMiddleware, authController.getDashboardPage) // http:localhost:3000/users/dashboard
// dashboard'a bir istek geldiğinde önce authMiddleware'yi kontrol et
router.route('/:id').delete(authController.deleteUser)

module.exports = router
