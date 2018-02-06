module.exports = (passport, Strategy) => {
  require('dotenv').config()

  passport.use(new Strategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: process.env.CALLBACKURL,
    scope: ['read:user', 'repo', 'admin:org', 'admin:org_hook', 'delete_repo']
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
