import React, {
  useState,
  useEffect,
  useContext,
  MouseEvent,
  Context,
  useRef,
} from "react";
import "./root.css";
import {
  Outlet,
  Link,
  Form,
  NavLink,
  useNavigate,
  redirect,
  useLoaderData,
  Params,
} from "react-router-dom";
import {
  getProjects,
  deleteProject,
  getProject,
  setUser,
  removeUser,
  syncProjects,
  getCurrentUser,
} from "../localDB";
import { Projects } from "../types/project";
import AddSVG from "../images/Add.svg";
import DeleteSVG from "../images/Delete.svg";
import InlineMenuSVG from "../images/inline-menu.svg";
import BurgerMenuSVG from "../images/BurgerMenu.svg";
import CloseSVG from "../images/Close.svg";
import "react-notifications/lib/notifications.css";
import { SavedUser, UserCreds } from "../types/user-context";
import { useLocation } from "react-router";

export const UserCredentails: Context<UserCreds> = React.createContext(null);

export async function loader() {
  const projects = getProjects();
  return projects;
}

export async function action({ request }: { request: Request }) {
  const res = await request.formData();
  const formData = Object.fromEntries(res);
  if (!formData) return;
  if (formData.new) {
    return redirect("/projects/new");
  } else if (formData.delete) {
    const id = formData.delete.toString();
    await deleteProject(id);
    return redirect("/?sync_config=overwrite");
  }
}

const Root = () => {
  const [projects, setProjects] = useState<Projects[]>(useLoaderData());
  const navigate = useNavigate();
  const [sideBarDisplay, setSideBarDisplay] = useState(true);
  const [user_credentials, setUserCredentials] = useState<UserCreds>({
    user_details: {
      _id: "",
      username: "",
      email: "",
    },
    setUserDetails: async (new_details: SavedUser) => {
      setUserCredentials((state) => ({ ...state, user_details: new_details }));
      await setUser(new_details);
      return;
    },
  });

  useEffect(() => {
    getCurrentUser()
      .then(async (user) => {
        if (!user) {
          setUserCredentials((state) => ({
            ...state,
            user_details: {
              _id: "",
              username: "",
              email: "",
            },
          }));
        } else {
          await user_credentials.setUserDetails(user);
        }
      })
      .catch((e) => console.error(e.message));
  }, []);

  const [isLoggedIn, setLoggedIn] = useState<boolean>(
    user_credentials.user_details && user_credentials.user_details.email
      ? true
      : false
  );

  useEffect(() => {
    setLoggedIn(
      user_credentials.user_details && user_credentials.user_details._id
        ? true
        : false
    );
  }, [user_credentials.user_details]);

  // close the sidebar:
  const handleRedirectClick = () => {
    // when the screen-width is smaller 600px
    if (window.innerWidth > 600) return;
    setTimeout(() => {
      setSideBarDisplay(false);
    }, 100);
  };

  // trigger re-render and sync when projects are added/deleted
  const { search } = useLocation();

  useEffect(() => {
    const sync_config = new URLSearchParams(search).get("sync_config");

    syncProjects(sync_config ?? "").then((res) =>
      res && JSON.stringify(res) !== JSON.stringify(projects)
        ? setProjects(res)
        : null
    );
    if (sync_config === "overwrite") navigate("/");
  }, [projects, useLoaderData()]);

  const [search_project, setSearchQuery] = useState("");

  return (
    <div className="root-div">
      <div className="toggle-sidebar">
        <button
          className="new-project-btn"
          style={{
            width: "30px",
          }}
          onClick={() => setSideBarDisplay((state) => !state)}
        >
          <img
            src={!sideBarDisplay ? BurgerMenuSVG : CloseSVG}
            alt="Toggle sidebar"
            loading="lazy"
          />
        </button>
      </div>
      <header
        style={{
          display: sideBarDisplay ? "flex" : "none",
        }}
      >
        <h1>
          <Link to={`/`} onClick={handleRedirectClick}>
            Tuu-Duu
          </Link>
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
                onClick={handleRedirectClick}
              >
                <img src={AddSVG} alt="New project" />
              </button>
            </Form>
          </div>
          <div className="input-group">
            <input
              placeholder="Search"
              type="search"
              name="search_project"
              className="form-control search-project"
              value={search_project}
              onChange={({ target }) => setSearchQuery(target.value)}
            />
          </div>
          <ul className="nav navbar-nav nav-bar">
            {projects && projects.length ? (
              projects.map((project: Projects, key: number) => {
                if (
                  project.name
                    .toLowerCase()
                    .includes(search_project.toLowerCase())
                ) {
                  return (
                    <NavItem
                      project={project}
                      index={key}
                      key={key}
                      closeMenu={handleRedirectClick}
                    />
                  );
                }
              })
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
        <UserCredentails.Provider value={user_credentials}>
          <Outlet />
        </UserCredentails.Provider>
      </main>
    </div>
  );
};

export default Root;

const NavItem = ({
  project,
  index,
  closeMenu,
}: {
  project: Projects;
  index: number;
  closeMenu: () => void;
}) => {
  const [magicStyle, setMagicStyle] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  return (
    <li key={index} className={magicStyle}>
      <NavLink
        to={`projects/${project.id}`}
        className={({ isActive }) => (isActive ? "btn btn-primary" : "btn")}
        onClick={closeMenu}
      >
        {project.name}
      </NavLink>
      <button
        onClick={() => setShowMenu(!showMenu)}
        onBlur={() => {
          setTimeout(() => setShowMenu(false), 200);
        }}
        className="dropdown-toggle"
        data-toggle="dropdown"
      >
        <img src={InlineMenuSVG} alt="inline menu" />
      </button>

      {showMenu && (
        <Menu project={project} setMagicStyle={setMagicStyle} key={index} />
      )}
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
    <div
      className="nav-dropdown dropdown magictime swashIn"
      style={{
        animationDuration: "200ms",
      }}
    >
      <Form action={`projects/${project.id}/edit`}>
        <button className="btn btn-warning btn-sm" type="submit">
          Edit
        </button>
      </Form>
      <Form method="post">
        <button
          type="submit"
          className="btn btn-danger btn-sm"
          title="delete project"
          name="delete"
          value={project.id}
          onClick={() => {
            console.log("delete from menu");
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
