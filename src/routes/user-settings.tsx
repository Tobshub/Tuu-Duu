import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../localDB";

const SettingsPage = () => {
  const [user_settings, setUserSettings] = useState({
    theme: "dark_mode",
    username: "",
    email: "",
    send_notifications: "email",
  });

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user && user._id) {
        const { email, username } = user;
        setUserSettings((state) => ({ ...state, email, username }));
        console.log("set user");
      }
    });
  }, []);

  return (
    <div className="root-div">
      <header>
        <h1>
          <Link to={`/`}>Tuu-Duu</Link>
        </h1>
      </header>
      <main>
        <div>
          <h2>Settings</h2>
          <p>Settings incoming...</p>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
