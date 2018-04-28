import mongoose from 'mongoose'
const Schema = mongoose.Schema

const assignSchema = new Schema({
  title: { type: String, unique: true, lowecase: true },
  ownerLogin: String,
  assignType: String,
  repoType: Boolean,
  orgLogin: String,
  isActive: Boolean,
  createDate: { type: Date, default: Date.now() }
})

let assignModel = mongoose.model('Assign', assignSchema)

export default assignModel
