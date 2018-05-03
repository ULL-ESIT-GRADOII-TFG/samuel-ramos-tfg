import mongoose from 'mongoose'
const Schema = mongoose.Schema

// Se define el modelo
const RepoSchema = new Schema({
  name: { type: String, unique: true, lowecase: true },
  assignName: String,
  StudentLogin: String,
  ownerLogin: String,
  orgLogin: String,
  createDate: { type: Date, default: Date.now() }
})

// Se crea el modelo
let repoModel = mongoose.model('Repo', RepoSchema)

export default repoModel
