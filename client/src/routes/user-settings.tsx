import { useEffect, useState } from "react";
import { getCurrentUser } from "../localDB";

const SettingsPage = () => {
  const [user_settings, setUserSettings] = useState({
    theme: "dark_mode",
    offline_mode: true,
    username: "",
    email: "",
  });

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user._id) {
        const { email, username } = user;
        setUserSettings((state) => ({ ...state, email, username }));
      }
    });
  }, []);

  return <>Settings Incoming...</>;
};

export default SettingsPage;
