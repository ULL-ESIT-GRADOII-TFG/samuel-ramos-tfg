module.exports = (passport, Strategy) => {
  require('dotenv').config()

  passport.use(new Strategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: process.env.CALLBACKURL,
    scope: ['user', 'repo', 'admin:org', 'admin:public_key', 'admin:repo_hook', 'admin:org_hook', 'gist', 'notifications', 'delete_repo', 'admin:gpg_key']
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
