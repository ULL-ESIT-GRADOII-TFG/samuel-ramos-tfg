import mongoose from 'mongoose'
const Schema = mongoose.Schema

const StudentSchema = new Schema({
  name: String,
  surname: String,
  email: { type: String, index: true, unique: true },
  idGithub: String,
  orgName: String,
  signupDate: { type: Date, default: Date.now() }
})
StudentSchema.index({ 'email': 1, 'orgNAme': 1 }, { 'unique': true })

let studentModel = mongoose.model('Student', StudentSchema)

export default studentModel
