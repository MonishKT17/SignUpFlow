import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName : {
    type:String,
    required:true,
    trim:true,
  },
  email : {
    type:String,
    required: true,
    trim: true,
  },
  password:{
    type:String,
    required:true,
  },
  mobileNumber:{
    type:Number,
    required:true,
  },
  panCardDetails:{
    type:String,
    required:true,
  },
  AadharNumber:{
    type:String,
    required:true,
  }
})

module.exports = mongoose.model("User",userSchema);