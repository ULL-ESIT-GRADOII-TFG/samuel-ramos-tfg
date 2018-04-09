const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StudentSchema = new Schema({
  name: String,
  surname: String,
  email: { type: String, index: true, unique: true },
  idGithub: String,
  orgName: String,
  signupDate: { type: Date, default: Date.now() }
})
StudentSchema.index({ 'email': 1, 'orgNAme': 1 }, { 'unique': true })
module.exports = mongoose.model('Student', StudentSchema)
