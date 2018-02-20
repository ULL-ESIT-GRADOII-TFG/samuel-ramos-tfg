const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GroupSchema = new Schema({
  name: { type: String, unique: true, lowecase: true },
  assignName: String,
  team: String,
  idTeam: String,
  ownerLogin: String,
  orgLogin: String,
  createDate: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('Group', GroupSchema)
