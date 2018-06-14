const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PassportLocalMongoose = require("passport-local-mongoose");
const moment = require('moment');

const projectSchema = new Schema({
  title:String,
  price: String,
  desc:String,
  longDesc:String,
  photos:[String],
  availability: Boolean,
  date: {type: Date, default: Date.now},
  offers:[{
    type:Schema.Types.ObjectId,
    ref:"Offer",
    _id: Schema.Types.ObjectId
  }],
  user:{
    type:Schema.Types.ObjectId,
    ref:"User",
    _id: Schema.Types.ObjectId
}}, {
    timestamps:{
      createdAt:"created_at",
      updatedAt:"updated_at"
  }
  })



module.exports = mongoose.model('Project', projectSchema)
