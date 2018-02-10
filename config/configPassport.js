module.exports = (passport, Strategy) => {
  const User = require('../app/models/user')
  require('dotenv').config()

  passport.use(new Strategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: process.env.CALLBACKURL,
    scope: ['read:user', 'repo', 'admin:org', 'admin:org_hook', 'delete_repo']
  }, (accessToken, refreshToken, profile, cb) => {
    User.findOne({ 'login': profile.username }, (err, user) => {
      if (err) console.log(err)

      if (user) {
        User.findOneAndUpdate({ login: profile.username }, { token: accessToken, lastLogin: Date.now() }, (err) => {
          if (err) console.log(err)
        })
      } else {
        let newUser = new User({
          login: profile.username,
          id: profile.id,
          token: accessToken,
          lastLogin: Date.now()
        })

        newUser.save((err) => {
          if (err) console.log(err)
        })
      }
    })

    return cb(null, profile)
  }))

  passport.serializeUser((user, cb) => {
    cb(null, user)
  })

  passport.deserializeUser((obj, cb) => {
    cb(null, obj)
  })
}
