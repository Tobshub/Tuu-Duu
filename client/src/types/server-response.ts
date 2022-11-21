import { Projects } from "./project"

export interface LoginServerResponse {
  success: boolean,
  message: string,
  user: AppUser
}

export interface AppUser {
  readonly _id: string,
  username: string,
  email: string,
  projects: Projects[],
}

export interface SyncServerResponse {
  success: boolean,
  message: string,
  projects: Projects[],
}
