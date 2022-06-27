const Course = require('../models/Course')
const User = require('../models/User')
const Category = require('../models/categorySchema')

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID, // artık kurs oluşturduğumuzda user bilgisine de ulaşıyoruz
    })
    req.flash('success', `${course.name} Created Successfully! :)`)
    res.status(201).redirect('/courses')
  } catch (error) {
    req.flash('fail', `Course Couldn't Created! :(`)
    res.status(400).redirect('/courses')
  }
}

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories // ?categories=web-development deki query değerini = web-development'ı alıyoruz
    const query = req.query.search // input alanı search olan yerden gelecek
    const category = await Category.findOne({ slug: categorySlug }) // slug'ı categorySlug olan categoryi buluyoruz

    let filter = {} // filter değişkeni oluşturuyoruz

    if (categorySlug) {
      // eğer categorySlug değeri varsa
      filter = { category: category._id } // category'nin id'si  _id'ye eşitse filtreliyoruz
    }

    if (query) {
      filter = { name: query }
    }

    if (!query && !categorySlug) {
      ;(filter.name = ''), (filter.category = null)
    }

    const courses = await Course.find({
      $or: [
        { name: { $regex: '.*' + filter.name + '.*', $options: 'i' } },
        { category: filter.category },
      ],
    })
      .sort('-createdAt')
      .populate('user') // filter'e göre course'ları buluyoruz ve createdAt'ı descending olarak sıralıyoruz
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
    const user = await User.findById(req.session.userID)
    const categories = await Category.find()
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      'user'
    )

    res.status(200).render('course', {
      course,
      page_name: 'courses',
      user,
      categories,
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    })
  }
}

exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID)
    await user.courses.push({ _id: req.body.course_id })
    await user.save()

    res.status(200).redirect('/users/dashboard')
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    })
  }
}

exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID)
    await user.courses.pull({ _id: req.body.course_id })
    await user.save()

    res.status(200).redirect('/users/dashboard')
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    })
  }
}

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndRemove({ slug: req.params.slug })
    req.flash('error', `${course.name} has been removed successfully`)
    res.status(200).redirect('/users/dashboard')
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    })
  }
}

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
    course.name = req.body.name
    course.description = req.body.description
    course.category = req.body.category
    course.save()

    res.status(200).redirect('/users/dashboard')
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    })
  }
}
