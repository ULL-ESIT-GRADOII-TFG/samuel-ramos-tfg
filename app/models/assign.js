const mongoose = require('mongoose')
const Schema = mongoose.Schema

const assignSchema = new Schema({
  title: { type: String, unique: true, lowecase: true },
  ownerLogin: String,
  assignType: String,
  repoType: String,
  orgLogin: String,
  isActive: Boolean,
  travis: String,
  createDate: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('Assign', assignSchema)
