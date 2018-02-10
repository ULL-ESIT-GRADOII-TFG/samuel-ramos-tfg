const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

const UserSchema = new Schema({
  login: { type: String, unique: true, lowecase: true },
  id: String,
  token: String,
  signupDate: { type: Date, default: Date.now() },
  lastLogin: Date

});
