import mongoose from 'mongoose'
const Schema = mongoose.Schema

// Se define el modelo
const GroupSchema = new Schema({
  name: { type: String, unique: true, lowecase: true },
  assignName: String,
  team: String,
  idTeam: String,
  ownerLogin: String,
  orgLogin: String,
  createDate: { type: Date, default: Date.now() }
})

// Se crea el modelo
let groupModel = mongoose.model('Group', GroupSchema)

export default groupModel
