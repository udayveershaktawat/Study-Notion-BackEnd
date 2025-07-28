const mongoose = require("mongoose");
const User = require("../models/User");

const profileSchema = new mongoose.Schema({
  // User:{
  //     type:mongoose.Schema.Types.ObjectId,
  //     ref:'User'
  // },

  gender: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  about: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: Number,
    trim: true,
  },
});

module.exports = mongoose.model("Profile", profileSchema);
