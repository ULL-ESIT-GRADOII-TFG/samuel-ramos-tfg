const mongoose = require('mongoose')
const Schema = mongoose.Schema

const assingSchema = new Schema({
  name: { type: String, unique: true, lowecase: true },
  ownerLogin: String,
  repoType: String,
  orgLogin: String,
  createDate: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('Assing', assingSchema)
