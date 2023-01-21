import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserContext, { defaultContext } from "@context/user-context";

const SettingsPage = () => {
  const { user, settings } = useContext(UserContext);

  return (
    <div>
      <h2>Settings</h2>
      <p>Settings incoming...</p>
      <ThemeSettingsSection currentSettings={settings.Theme} />
      <NotificationsSettingsSection
        currentSettings={settings.Notifications}
      />
    </div>
  );
};

export default SettingsPage;

const ThemeSettingsSection = ({
  currentSettings,
}: {
  currentSettings: typeof defaultContext.settings.Theme;
}) => {
  return (
    <div>
      <h3>Theme</h3>
    </div>
  );
};

const NotificationsSettingsSection = ({
  currentSettings,
}: {
  currentSettings: typeof defaultContext.settings.Notifications;
}) => {
  return (
    <div>
      <h3>Notifications</h3>
    </div>
  );
};
