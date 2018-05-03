import dotenv from 'dotenv'
import User from '../app/models/user'

/**
* Funcion: function(passport, Strategy)
*
* Parámetros: passport, Strateg
*
* Descripción: Realiza la conexión oauth con Github
*/
export default function (passport, Strategy) {
  dotenv.config()

  // Se crea la conexión con oauth
  passport.use(new Strategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: process.env.CALLBACKURL,
    scope: ['read:user', 'repo', 'admin:org', 'admin:org_hook', 'delete_repo']
  }, async (accessToken, refreshToken, profile, cb) => {
    try {
      // Se busca el usuario
      let user = await User.findOne({ 'login': profile.username })
      // Si existe
      if (user) {
        // Modificamo su fecha de login
        await User.findOneAndUpdate({ login: profile.username }, { token: accessToken, lastLogin: Date.now() })
      } else {
        // Si no existe creamos el objeto
        let newUser = new User({
          login: profile.username,
          id: profile.id,
          token: accessToken,
          lastLogin: Date.now()
        })

        // lo guardamos en base de datos
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
