const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    default: "Anonymous_user",
    maxLength: "18"
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  projects: {
    type: Array
  }
});

const User = mongoose.model("users", userSchema);

module.exports = User;