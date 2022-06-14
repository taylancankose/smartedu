const Course = require('../models/courseSchema')
const Category = require('../models/categorySchema')

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body)

    res.status(201).redirect('/courses')
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    })
  }
}

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories // ?categories=web-development deki query değerini = web-development'ı alıyoruz

    const category = await Category.findOne({ slug: categorySlug }) // slug'ı categorySlug olan categoryi buluyoruz

    let filter = {} // filter değişkeni oluşturuyoruz

    if (categorySlug) {
      // eğer categorySlug değeri varsa
      filter = { category: category._id } // category'nin id'si  _id'ye eşitse filtreliyoruz
    }

    const courses = await Course.find(filter).sort('-createdAt') // filter'e göre course'ları buluyoruz ve createdAt'ı descending olarak sıralıyoruz
    const categories = await Category.find()

    res.status(200).render('courses', {
      courses,
      categories,
      page_name: 'courses',
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    })
  }
}

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })

    res.status(200).render('course', {
      course,
      page_name: 'courses',
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    })
  }
}
