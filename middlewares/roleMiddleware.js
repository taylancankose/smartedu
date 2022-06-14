module.exports = (roles) => {
  // önce rolü görmem lazım
  return (req, res, next) => {
    const userRole = req.body.role // kullanıcı rolünü aldık
    if (roles.includes(userRole)) {
      // eğer kullanıcı rolünün yetkileri içeriyorsa
      next()
    } else {
      return res.status(401).send('You are not authorized') // eğer kullanıcı rolünün yetkileri içermezse
    }
  }
}
