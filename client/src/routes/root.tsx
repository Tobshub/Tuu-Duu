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

export const UserCredentails: Context<UserCreds> = React.createContext(null);

export async function loader() {
  const projects = await getCurrentUser()
    .then(async (user) => {
      if (!user) {
        return getProjects();
      }
      // promise.race in case the server is experiencing downtime
      const db_synced = await Promise.race([
        syncProjects(),
        (async () => {
          let local_projects: Projects[];
          setTimeout(() => (local_projects = getProjects()), 3000);
          return local_projects;
        })(),
      ]);
      return db_synced;
    })
    .then((res) => ("projects" in res ? res.projects : res))
    .catch((e) => getProjects());

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
    console.log("delete", id);
    await deleteProject(id);
    return redirect("/");
  }
}

const Root = () => {
  const projects: Projects[] = useLoaderData();
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
          user_credentials.setUserDetails({
            _id: "",
            username: "",
            email: "",
          });
        } else {
          await user_credentials.setUserDetails(user);
        }
      })
      .catch((e) => console.error(e.message));
  }, []);

  const sideBar = useRef<HTMLElement>();
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
      sideBar.current ? (sideBar.current.style.display = "none") : null;
    }, 100);
  };

  return (
    <div className="root-div">
      <div className="toggle-sidebar">
        <button
          className="new-project-btn"
          style={{
            width: "30px",
          }}
          onClick={() => {
            if (sideBar.current) {
              sideBar.current.style.display =
                getComputedStyle(sideBar.current).display === "none"
                  ? "flex"
                  : "none";
            }
          }}
        >
          <img src={BurgerMenuSVG} alt="Toggle sidebar" />
        </button>
      </div>
      <header ref={sideBar}>
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
          <ul className="nav navbar-nav nav-bar">
            {projects && projects.length ? (
              projects.map((project: Projects, key: number) => (
                <NavItem
                  project={project}
                  index={key}
                  key={key}
                  closeMenu={handleRedirectClick}
                />
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
      {/* <button
        onClick={() => setShowMenu(!showMenu)}
        onBlur={() => {
          setTimeout(() => setShowMenu(false), 100);
        }}
        className="dropdown-toggle"
        data-toggle="dropdown"
      >
        <img src={InlineMenuSVG} alt="inline menu" />
      </button> */}

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
  const navigate = useNavigate();
  return (
    <div className="nav-dropdown dropdown magictime swashIn">
      <Form>
        <button
          className="btn btn-warning btn-sm"
          type="button"
          onClick={(e: MouseEvent) => {
            e.preventDefault();
            console.log("edit from menu");
            return navigate(`projects/${project.id}/edit`);
          }}
        >
          Edit
        </button>
      </Form>
      <Form method="post">
        <button
          type="submit"
          className="btn btn-danger btn-sm"
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
