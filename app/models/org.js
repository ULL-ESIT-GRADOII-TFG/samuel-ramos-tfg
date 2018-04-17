import mongoose from 'mongoose'
const Schema = mongoose.Schema

const OrgSchema = new Schema({
  login: { type: String, unique: true, lowecase: true },
  id: String,
  avatarUrl: String,
  ownerId: String,
  ownerLogin: String,
  isActive: Boolean,
  createDate: { type: Date, default: Date.now() }
})

let orgModel = mongoose.model('Org', OrgSchema)

export default orgModel
