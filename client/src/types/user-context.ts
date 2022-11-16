import { AppUser } from "./server-response";

export interface UserCreds {
  user_details: SavedUser,
  setUserDetails: (new_details: SavedUser) => void
}

export interface SavedUser {
  _id: string,
  email: string,
  username: string,
}