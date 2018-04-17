import mongoose from 'mongoose'
const Schema = mongoose.Schema

const UserSchema = new Schema({
  login: { type: String, unique: true, lowecase: true },
  id: String,
  token: String,
  signupDate: { type: Date, default: Date.now() },
  lastLogin: Date
})

let userModel = mongoose.model('User', UserSchema)

export default userModel
