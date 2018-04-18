import dotenv from 'dotenv'
import User from '../app/models/user'

export default function (passport, Strategy) {
  dotenv.config()

  passport.use(new Strategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: process.env.CALLBACKURL,
    scope: ['read:user', 'repo', 'admin:org', 'admin:org_hook', 'delete_repo']
  }, async (accessToken, refreshToken, profile, cb) => {
    try {
      let user = await User.findOne({ 'login': profile.username })
      if (user) {
        await User.findOneAndUpdate({ login: profile.username }, { token: accessToken, lastLogin: Date.now() })
      } else {
        let newUser = new User({
          login: profile.username,
          id: profile.id,
          token: accessToken,
          lastLogin: Date.now()
        })
        await newUser.save()
      }

      return cb(null, profile)
    } catch (error) {
      console.log(error)
    }
  }))

  passport.serializeUser((user, cb) => {
    cb(null, user)
  })

  passport.deserializeUser((obj, cb) => {
    cb(null, obj)
  })
}
