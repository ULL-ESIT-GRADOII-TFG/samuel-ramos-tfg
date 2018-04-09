const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StudentSchema = new Schema({
  name: { type: String, unique: true },
  surname: String,
  email: String,
  idGithub: String,
  orgName: { type: String, unique: true },
  signupDate: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('Student', StudentSchema)
