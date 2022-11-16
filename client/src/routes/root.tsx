import React, { useState, useEffect, useContext } from "react";
import "./root.css";
import {
  Outlet,
  Link,
  Form,
  NavLink,
  useNavigate,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { getProjects, deleteProject, getProject, setUser } from "../dummyDB";
import { Projects } from "../types/project";
import AddSVG from "../images/Add.svg";
import DeleteSVG from "../images/Delete.svg";
import InlineMenuSVG from "../images/inline-menu.svg";
import { Nav } from "react-bootstrap";
import "react-notifications/lib/notifications.css";
import { UserCreds } from "../types/user-context";

export const UserCredentails = React.createContext(null);

export async function loader() {
  const projects = await getProjects();
  return { projects };
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const res = Object.fromEntries(formData);
  if (!res) return;
  if (res.new) {
    return redirect("/projects/new");
  } else if (res.delete) {
    const id = res.delete ? res.delete.toString() : undefined;
    await deleteProject(id);
    return redirect("/");
  }
}

const Root = () => {
  const { projects }: { projects: Projects[] } = useLoaderData();
  const user_credentials = useContext<UserCreds>(UserCredentails);

  const [isLoggedIn, setLoggedIn] = useState<boolean>(
    user_credentials.user_details && user_credentials.user_details.email
      ? true
      : false
  );

  useEffect(() => {
    if (user_credentials.user_details && user_credentials.user_details.email) {
      setLoggedIn(true);
      setUser(user_credentials.user_details);
    }
  }, [user_credentials.user_details]);

  return (
    <div className="root-div">
      <header>
        <h1>
          <Link to={`/`}>Tuu-Duu</Link>
        </h1>
        <nav className="nav-bar navbar navbar-default">
          <div className="nav-title">
            <h2>My Projects</h2>
            <Form method="post">
              <button
                type="submit"
                className="new-project-btn"
                name="new"
                value={1}
              >
                <img src={AddSVG} />
              </button>
            </Form>
          </div>
          <ul className="nav navbar-nav nav-bar">
            {projects && projects.length ? (
              projects.map((project: Projects, key: number) => (
                <NavItem project={project} index={key} key={key} />
              ))
            ) : (
              <em>No projects yet.</em>
            )}
          </ul>
        </nav>
        <div className="user-actions">
          <Form action="/settings">
            <button className="btn btn-primary">Settings</button>
          </Form>
          <Form action={isLoggedIn ? "/logout" : "/login"}>
            <button className="btn btn-danger">
              {isLoggedIn ? "Logout" : "Login"}
            </button>
          </Form>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Root;

const NavItem = ({ project, index }: { project: Projects; index: number }) => {
  const [magicStyle, setMagicStyle] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  return (
    <li key={index} className={magicStyle}>
      <NavLink
        to={`projects/${project.id}`}
        className={({ isActive }) => (isActive ? "btn btn-primary" : "btn")}
      >
        {project.name}
      </NavLink>
      <button
        onClick={() => setShowMenu(!showMenu)}
        onBlur={() => {
          setTimeout(() => setShowMenu(false), 100);
        }}
        className="dropdown-toggle"
        data-toggle="dropdown"
      >
        <img src={InlineMenuSVG} alt="inline menu" />
      </button>

      {showMenu && <Menu project={project} setMagicStyle={setMagicStyle} />}
    </li>
  );
};

const Menu = ({
  project,
  setMagicStyle,
}: {
  project: Projects;
  setMagicStyle: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="nav-dropdown dropdown magictime swashIn">
      <Form action={`projects/${project.id}/edit`}>
        <button className="btn btn-warning btn-sm" type="submit">
          Edit
        </button>
      </Form>
      <Form method="post">
        <button
          className="btn btn-danger btn-sm"
          name="delete"
          value={project.id}
          onClick={() => {
            setMagicStyle("magictime holeOut");
            setTimeout(() => {
              setMagicStyle("magictime");
            }, 250);
          }}
        >
          Delete
        </button>
      </Form>
    </div>
  );
};
