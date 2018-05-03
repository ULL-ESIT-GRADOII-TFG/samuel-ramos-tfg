import mongoose from 'mongoose'
const Schema = mongoose.Schema

// Se define el modelo
const UserSchema = new Schema({
  login: { type: String, unique: true, lowecase: true },
  id: String,
  token: String,
  signupDate: { type: Date, default: Date.now() },
  lastLogin: Date
})

// Se crea el modelo
let userModel = mongoose.model('User', UserSchema)

export default userModel
