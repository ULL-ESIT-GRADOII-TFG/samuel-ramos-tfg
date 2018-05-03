import mongoose from 'mongoose'
const Schema = mongoose.Schema

// Se define el modelo
const TeamSchema = new Schema({
  name: { type: String, unique: true, lowecase: true },
  id: String,
  members: [String],
  org: String,
  signupDate: { type: Date, default: Date.now() }
})

// Se crea el modelo
let teamModel = mongoose.model('Team', TeamSchema)

export default teamModel
