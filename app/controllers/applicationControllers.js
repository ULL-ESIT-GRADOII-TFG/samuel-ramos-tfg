
function home(req, res) {
  res.render('home', { user: req.user });
}

function login(req, res){
  res.render('login');
}

function redirectHome(req, res) {
  res.redirect('/');
}

function profile(req, res){
  res.render('profile', { user: req.user });
}
