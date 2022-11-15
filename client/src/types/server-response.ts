import { Projects } from "./project"

export interface LoginServerResponse {
  success: boolean,
  message: string,
  user: AppUser
}

export interface AppUser {
  _id: string,
  username: string,
  email: string,
  projects: Projects[],
}