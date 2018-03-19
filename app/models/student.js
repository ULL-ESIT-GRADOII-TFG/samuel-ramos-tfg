const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StudentSchema = new Schema({
  name: String,
  surname: String,
  email: String,
  idGithub: String,
  orgName: String,
  signupDate: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('Student', StudentSchema)
