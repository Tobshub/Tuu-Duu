import { Link, Form } from "react-router-dom";

const SideBar = ({
  isLoggedIn,
  sideBarDisplay,
  handleRedirectClick,
  itemListElement,
}: SideBarProps) => {
  return (
    <header
      style={{
        display: sideBarDisplay ? "flex" : "none",
      }}
    >
      <h1>
        <Link
          to={`/`}
          onClick={handleRedirectClick}
        >
          Tuu-Duu
        </Link>
      </h1>
      {itemListElement}
      <div className="user-actions">
        <Form action="/settings">
          <button className="btn btn-primary">Settings</button>
        </Form>
        <Form action={isLoggedIn ? "/logout" : "/login"}>
          <button
            className="btn btn-danger"
            type="submit"
          >
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </Form>
      </div>
    </header>
  );
};

export default SideBar;
