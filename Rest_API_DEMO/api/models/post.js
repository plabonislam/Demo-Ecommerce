const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
title: { type: String, required: true },
body:{type:String, required:true},
image:{type:String,required:true},
likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
postedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // role: { type: Boolean, default: false },
  // phone: {type:String, required:true},
  // gender: {type:String, required:true}
});

module.exports = mongoose.model("Post", PostSchema);
