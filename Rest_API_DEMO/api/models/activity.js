const mongoose = require("mongoose");

const activity = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userid: {type: String, required:true},
  set: { type: Number, default: 1 },
  activityName: {type: String, required:true}
});
module.exports = mongoose.model("Activity", activity);
