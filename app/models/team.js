const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TeamSchema = new Schema({
  name: { type: String, unique: true, lowecase: true },
  id: String,
  members: [String],
  org: String,
  signupDate: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('Team', TeamSchema)
