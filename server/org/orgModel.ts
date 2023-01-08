import mongoose from "mongoose";

const orgSchema = new mongoose.Schema({
  name: {type: String, required: true},
  org_id: {type: String, required: true},
  description: String,
  admins: [{ _id: String, email: String, username: String }],
  members: [{ _id: String, email: String, username: String }],
  projects: [{
    name: String,
    description: String,
    id: String,
    tasks: Array,
    favorite: Boolean,
    last_save: Number,
    visible_to: [{ _id: String, email: String, username: String }]
  }],
  website_link: String,
  sync_url: String,
})

const Org = mongoose.model("orgs", orgSchema);
export default Org;