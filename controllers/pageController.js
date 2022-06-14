exports.getHomePage = (req, res) => {
  console.log(req.session.userID)

  res.status(200).render('index', {
    page_name: 'index',
  }) // 200 başarılı statusunu yollar
}

exports.getAboutPage = (req, res) => {
  res.status(200).render('about', {
    page_name: 'about',
  })
}

exports.getRegisterPage = (req, res) => {
  res.status(200).render('register', {
    page_name: 'register',
  })
}

exports.getLoginPage = (req, res) => {
  res.status(200).render('login', {
    page_name: 'login',
  })
}
