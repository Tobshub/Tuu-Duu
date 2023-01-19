import { Link, Form } from "react-router-dom";
import BurgerMenuSVG from "@images/BurgerMenu.svg";
import CloseSVG from "@images/Close.svg";
import HomeSVG from "@images/Home.svg";
import LoginSVG from "@images/Login.svg";
import LogoutSVG from "@images/Logout.svg";
import SettingsSVG from "@images/Settings.svg";
import ActionButton from "./action-button";

const SideBar = ({
  isLoggedIn,
  sideBarDisplay,
  handleRedirectClick,
  toggle,
  children,
}: SideBarProps) => {
  if (sideBarDisplay === "min") {
    return (
      <MinSideBar
        isLoggedIn={isLoggedIn}
        toggle={toggle}
        sideBarDisplay={sideBarDisplay}
      >
        {children}
      </MinSideBar>
    );
  }
  return (
    <header
      style={
        sideBarDisplay === "hide"
          ? {
              width: "0",
            }
          : {}
      }
    >
      <div
        className="toggle-sidebar"
        style={{
          justifyContent: "flex-start",
        }}
      >
        <ActionButton
          title="close sidebar"
          className="lg"
          onClick={toggle}
          icon={sideBarDisplay === "show" ? CloseSVG : BurgerMenuSVG}
          icon_alt="Toggle sidebar"
        />
      </div>
      <h1>
        <Link to={`/`} onClick={handleRedirectClick}>
          Tuu-Duu
        </Link>
      </h1>
      {children}
      <div className="user-actions">
        <Form action="/settings">
          <button className="btn btn-primary">Settings</button>
        </Form>
        <Form action={isLoggedIn ? "/logout" : "/login"}>
          <button className="btn btn-danger" type="submit">
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </Form>
      </div>
    </header>
  );
};

const MinSideBar = ({
  children,
  isLoggedIn,
  toggle,
  sideBarDisplay,
}: SideBarProps) => {
  return (
    <header
      style={{
        width: "80px",
      }}
    >
      <div className="toggle-sidebar">
        <ActionButton
          title="close sidebar"
          className="lg"
          onClick={toggle}
          icon={sideBarDisplay === "show" ? CloseSVG : BurgerMenuSVG}
          icon_alt="Toggle sidebar"
        />
      </div>
      <Link to="/">
        <ActionButton
          className="lg"
          icon={HomeSVG}
          icon_alt="home"
          islazy={true}
          title="home"
        />
      </Link>
      {/* children */}
      {children}
      {/* actions */}
      <div className="user-actions-min">
        <Form action="/settings">
          <ActionButton
            className="lg"
            icon={SettingsSVG}
            icon_alt="settings"
            title="settings"
            islazy={true}
          />
        </Form>
        <Form action={isLoggedIn ? "/logout" : "/login"}>
          <ActionButton
            className="lg"
            icon={isLoggedIn ? LogoutSVG : LoginSVG}
            icon_alt={isLoggedIn ? "logout" : "login"}
            title={isLoggedIn ? "logout" : "login"}
          />
        </Form>
      </div>
    </header>
  );
};

export default SideBar;
