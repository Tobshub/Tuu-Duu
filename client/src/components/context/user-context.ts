import { createContext } from "react";

const UserContext = createContext<SavedUser | null>(null);

export default UserContext;
