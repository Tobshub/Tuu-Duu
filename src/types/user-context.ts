import { AppUser } from "./server-response";

export interface UserCreds {
  user_details: SavedUser,
  setUserDetails: (new_details: SavedUser) => Promise<void>
}

export interface SavedUser {
  readonly _id: string,
  email: string,
  username: string,
}