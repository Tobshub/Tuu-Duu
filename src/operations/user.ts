import localforage from "localforage";
import { SavedUser } from "../types/user-context";


export const setUser = async ({_id, username, email, org_refs}: SavedUser) => {
  if (!_id || !username || !email) return;

  const res = await localforage.setItem("user_details", {_id, username, email, org_refs}, (err, value) => {
    if (err) {
      console.error(err);
      return false;
    }
    return value;
  })
  return res;
}

export const removeUser = async () => {
  const res = await localforage.removeItem("user_details", (err) => {
    if (err) {
      console.error(err);
      return false;
    }
    return true;
  })
  return res;
}

export const getCurrentUser = async () => {
  const user_details = await localforage.getItem("user_details", (err, value: SavedUser) => {
    if (err || !value || (value && !value._id)) {
      err ? console.error(err) : null;
      return false;
    }
    return value;
  })
  return user_details; 
}

export const generateId = () => {
  return (Math.random() + 1).toString(36).substring(2);
}


