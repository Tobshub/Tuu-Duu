import { AppUser } from "./server-response";

export interface UserCreds {
  user_details: AppUser,
  setUserDetails: React.Dispatch<React.SetStateAction<{
    user_details: AppUser;
    setUserDetails: (new_details: any) => void;
  }>>
}