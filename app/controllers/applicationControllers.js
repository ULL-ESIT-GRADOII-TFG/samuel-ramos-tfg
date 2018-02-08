
function home (req, res) {
  res.render('static_pages/home', { titulo: 'Home', usuario: req.user })
}

function logout (req, res) {
  req.logout()
  res.redirect('/')
}

function redirectHome (req, res) {
  res.redirect('/')
}

function profiles (req, res) {
  console.log(req)
  res.render('static_pages/profile', { titulo: 'Profile', usuario: req.user, foto: req.user.photos[0].value, perfilUrl: req.user.profileUrl, mail: req.user.emails[0].value })
}

module.exports = {
  home,
  logout,
  redirectHome,
  profiles
}
