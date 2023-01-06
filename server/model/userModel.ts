import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
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
    id: {type: String, required: true},
    tasks: Array,
    favorite: Boolean,
    last_save: Number,
  }],
  orgs: [{
    id: String,
  }]
});

const Users = mongoose.model("users", userSchema);
export default Users;
