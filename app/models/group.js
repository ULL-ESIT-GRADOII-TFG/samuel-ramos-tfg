import mongoose from 'mongoose'
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

let groupModel = mongoose.model('Group', GroupSchema)

export default groupModel
