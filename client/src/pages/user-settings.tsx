import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { getCurrentUser } from "@services/user";

export async function loader() {
  const user = await getCurrentUser();
  return user;
}

const SettingsPage = () => {
  const user_details = useLoaderData() as SavedUser;
  const [user_settings, setUserSettings] = useState({
    theme: "dark_mode",
    username: "",
    email: "",
    send_notifications: "email",
  });

  useEffect(() => {
    getCurrentUser().then(user => {
      if (user && user._id) {
        const { email, username } = user;
        setUserSettings(state => ({ ...state, email, username }));
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
