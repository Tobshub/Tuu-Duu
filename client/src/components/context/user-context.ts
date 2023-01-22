import { createContext } from "react";

type UserSettings = {
  Theme: string;
  Notifications: "email" | "off";
};

export const defaultContext: {
  settings: UserSettings;
  user: SavedUser | null;
} = {
  settings: {
    Theme: "dark",
    Notifications: "email",
  },
  user: null,
};

const UserContext = createContext<typeof defaultContext>(defaultContext);

export default UserContext;
