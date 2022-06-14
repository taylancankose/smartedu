const User = require('../models/User')

module.exports = (req, res, next) => {
  User.findById(req.session.userID, (err, user) => {
    if (err || !user) return res.redirect('/login')
    // hata varsa veya giriş yapmış bir kullanıcı yoksa
    // login sayfasına yönlendir
    next()
  })
}
