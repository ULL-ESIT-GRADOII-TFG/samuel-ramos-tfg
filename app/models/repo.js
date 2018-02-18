const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RepoSchema = new Schema({
  name: { type: String, unique: true, lowecase: true },
  assignName: String,
  StudentLogin: String,
  ownerLogin: String,
  orgLogin: String,
  createDate: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('Repo', RepoSchema)
