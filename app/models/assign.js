import mongoose from 'mongoose'
const Schema = mongoose.Schema

// Se define el modelo
const assignSchema = new Schema({
  title: { type: String, unique: true, lowecase: true },
  ownerLogin: String,
  assignType: String,
  repoType: Boolean,
  userAdmin: String,
  orgLogin: String,
  isActive: Boolean,
  createDate: { type: Date, default: Date.now() }
})

// Se crea el modelo
let assignModel = mongoose.model('Assign', assignSchema)

export default assignModel
