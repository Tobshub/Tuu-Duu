import { Link, Form, useNavigate } from "react-router-dom";
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
  open,
  close,
  showActions = true,
  children,
}: SideBarProps) => {
  if (sideBarDisplay === "min") {
    return (
      <MinSideBar
        isLoggedIn={isLoggedIn}
        open={open}
        close={close}
        sideBarDisplay={sideBarDisplay}
      >
        {children}
      </MinSideBar>
    );
  }
  return (
    <>
      <div
        className="open-sidebar"
        style={{
          zIndex: "100",
          justifyContent: "flex-start",
        }}
      >
        <ActionButton
          title="open sidebar"
          style={{
            width: "30px",
          }}
          onClick={open}
          icon={BurgerMenuSVG}
          icon_alt="Toggle sidebar"
        />
      </div>
      <header
        style={{
          width: sideBarDisplay === "show" ? "" : 0,
          padding: sideBarDisplay === "hide" ? "0" : "",
        }}
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
            onClick={close}
            icon={sideBarDisplay === "show" ? CloseSVG : BurgerMenuSVG}
            icon_alt="Toggle sidebar"
          />
        </div>
        <h1>
          <Link to={`/`} onClick={handleRedirectClick}>
            Tuu-Duu
          </Link>
        </h1>
        {/* render children */}
        {children}
        {showActions ? (
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
        ) : null}
      </header>
    </>
  );
};

const MinSideBar = ({ children, isLoggedIn, open }: SideBarProps) => {
  return (
    <header
      style={{
        width: "80px",
      }}
    >
      <div className="toggle-sidebar">
        <ActionButton
          title="maximize sidebar"
          className="lg"
          onClick={open}
          icon={BurgerMenuSVG}
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
            name=""
            className="lg"
            icon={SettingsSVG}
            icon_alt="settings"
            title="settings"
            islazy={true}
          />
        </Form>
        <Form action={isLoggedIn ? "/logout" : "/login"}>
          <ActionButton
            name=""
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
