import mongoose from 'mongoose'
const Schema = mongoose.Schema

const RepoSchema = new Schema({
  name: { type: String, unique: true, lowecase: true },
  assignName: String,
  StudentLogin: String,
  ownerLogin: String,
  orgLogin: String,
  createDate: { type: Date, default: Date.now() }
})

let repoModel = mongoose.model('Repo', RepoSchema)

export default repoModel
