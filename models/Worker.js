const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PassportLocalMongoose = require("passport-local-mongoose");

const workerSchema = new Schema({
//_id: Schema.Types.ObjectId,
name:String,
lastname:String,
username:{
    type:String,
    required:true
    },
service:String,
profilePhoto:String,
bio:String,
city:String,
jobs:[{
  type:Schema.Types.ObjectId,
  ref:"Project",
  _id: Schema.Types.ObjectId
}],
street:String,
idDocuments:[String],
zipCode:Number,
coord:[Number],
role:{
      type:String,
      enum:["CLIENT", "WORKER"],
      default:"CLIENT"
        }
},
{
    timestamps:{
          createdAt:"created_at",
          updatedAt:"updated_at"
        }
});

userSchema.plugin(PassportLocalMongoose, {nameField:"username"})
module.exports = mongoose.model('Worker', userSchema)
