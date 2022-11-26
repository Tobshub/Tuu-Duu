import  Org, { OrgRef } from "./orgs"
import Project from "./project"

export interface LoginServerResponse {
  success: boolean,
  message: string,
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
  success: boolean,
  message: string,
  projects: Project[],
  orgs: OrgRef[]
}

export interface CreateOrgResponse extends Org {
  readonly _id: string,
}