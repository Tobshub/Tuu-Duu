import  Org, { OrgRef } from "./orgs"
import Project from "./project"

export interface LoginServerResponse {
  readonly success: boolean,
  readonly message: string,
  user: AppUser
}

export interface AppUser {
  readonly _id: string,
  username: string,
  email: string,
  projects: Project[],
  orgs: OrgRef[]
}

export interface SyncServerResponse {
  readonly success: boolean,
  readonly message: string,
  projects: Project[],
}

export interface CreateOrgResponse extends Org {
  success: boolean,
  message: string,
}

export interface AddOrgToUserResponse {
  success: boolean,
  message: string,
  orgs: OrgRef[],
  _id: string,
}
