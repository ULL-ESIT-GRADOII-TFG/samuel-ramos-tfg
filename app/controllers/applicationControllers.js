
function home (req, res) {
  console.log(req.user)
  res.render('static_pages/home', { titulo: 'Home', usuario: req.user })
}

function login (req, res) {
  res.render('static_pages/login', { titulo: 'Log in' })
}

function redirectHome (req, res) {
  res.redirect('/')
}

function profiles (req, res) {
  res.render('static_pages/profile', { titulo: 'Profile', usuario: req.user })
}

module.exports = {
  home,
  login,
  redirectHome,
  profiles
}
