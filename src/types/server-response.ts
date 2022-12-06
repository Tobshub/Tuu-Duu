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

interface ServerResponse {
  readonly success: boolean,
  readonly message: string,
}

export interface GetProjectsServerResponse extends ServerResponse {
  projects: Project[]
}

export interface SyncServerResponse extends ServerResponse {
  projects: Project[],
}

export interface CreateOrgResponse extends ServerResponse {
  success: boolean,
  message: string,
  _id: string,
  org_id: string,
  org_name: string,
}

export interface AddOrgToUserResponse extends ServerResponse {
  success: boolean,
  message: string,
  orgs: OrgRef[],
  _id: string,
}

export interface GetOrgResponse extends ServerResponse {
  org: Org,
}
