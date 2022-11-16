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
  projects: [{
    name: String,
    description: String,
    id: String,
    tasks: Array,
    favorite: Boolean,
    last_save: Number,
  }]
});

const User = mongoose.model("users", userSchema);

module.exports = User;