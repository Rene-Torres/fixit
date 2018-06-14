const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const reviewSchema = new Schema ({

  title: String,
  body: String,
  user:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  project:[{
    type:Schema.Types.ObjectId,
    ref:"Project"
  }]}, {
  timestamps:{
            createdAt:"created_at",
            updatedAt:"updated_at"
          }  }
)


module.exports = mongoose.model('Review', reviewSchema)
