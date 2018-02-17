const mongoose = require('mongoose')
const Schema = mongoose.Schema

const assignSchema = new Schema({
  titulo: { type: String, unique: true, lowecase: true },
  ownerLogin: String,
  repoType: String,
  userAdmin: String,
  orgLogin: String,
  createDate: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('Assign', assignSchema)
