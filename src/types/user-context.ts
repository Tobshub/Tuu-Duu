import Org, { OrgRef } from "./orgs";

export interface UserCreds {
  user_details: SavedUser,
  setUserDetails: (new_details: SavedUser) => Promise<void>
}

export interface SavedUser {
  readonly _id: string,
  email: string,
  username: string,
  org_refs?: OrgRef[],
}