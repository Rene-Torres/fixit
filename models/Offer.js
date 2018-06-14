const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PassportLocalMongoose = require("passport-local-mongoose");
const moment = require('moment');

const offerSchema = new Schema({
  title:String,
  price: String,
  desc:String,
  completionDate: String,
  date: {type: Date, default: Date.now},
  projects:{
    type:Schema.Types.ObjectId,
    ref:"Project",
    _id: Schema.Types.ObjectId
  },
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



module.exports = mongoose.model('Offer', offerSchema)
