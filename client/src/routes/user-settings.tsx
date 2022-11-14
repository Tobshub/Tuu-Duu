import { useState } from "react";

const SettingsPage = () => {
  const [user_settings, setUserSettings] = useState({
    theme: "dark_mode",
    offline_mode: true,
    username: "",
    email: "",
  });
  return <>Settings Incoming...</>;
};

export default SettingsPage;
