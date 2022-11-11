export interface LoginServerResponse {
  success: boolean,
  message: string,
  user: AppUser
}

export interface AppUser {
  username: string,
  email: string,
}