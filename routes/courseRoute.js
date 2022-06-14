const express = require('express')
const courseController = require('../controllers/courseController')
const roleMiddleware = require('../middlewares/roleMiddleware')
const router = express.Router()

router
  .route('/')
  .post(roleMiddleware(['instructor', 'admin']), courseController.createCourse) // http:localhost:3000/courses
// yetkin teacher veya admin ise yeni kurs oluşturabilirsin.
router.route('/').get(courseController.getAllCourses)
router.route('/:slug').get(courseController.getCourse)

module.exports = router
