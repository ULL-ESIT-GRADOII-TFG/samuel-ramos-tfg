module.exports = (passport, Strategy) => {
  passport.use(new Strategy({
    clientID: 'Iv1.33a27bab270b42a0',
    clientSecret: 'd409520ca36ce44f7e4faab4bdcc9d22d1fe6b0d',
    callbackURL: 'http://localhost:3000/login/github/return'
  },
  function (accessToken, refreshToken, profile, cb) {
    return cb(null, profile)
  }))

  passport.serializeUser(function (user, cb) {
    cb(null, user)
  })

  passport.deserializeUser(function (obj, cb) {
    cb(null, obj)
  })
}
