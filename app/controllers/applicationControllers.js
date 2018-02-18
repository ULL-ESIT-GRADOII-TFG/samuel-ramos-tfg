
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
  res.render('static_pages/profile', { titulo: 'Profile', usuario: req.user, foto: req.user.photos[0].value, perfilUrl: req.user.profileUrl, mail: req.user.emails[0].value })
}

function err (req, res) {
  res.render('static_pages/error', { titulo: 'Error: Página no encontrada', usuario: req.user })
}

module.exports = {
  home,
  logout,
  redirectHome,
  profiles,
  err
}
