module.exports = (req, res, next) => {
  if (req.session.userID) {
    return res.redirect('/')
  }
  next()
}

// /login veya /register sayfalarına loggedIn olduğumda gitmeye çalışırsam
// browser üzerinden beni ana sayfaya yönlendiriyor.
