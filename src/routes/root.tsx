import React, {
  useState,
  useEffect,
  useContext,
  Context,
  useRef,
  useMemo,
  createContext,
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
  syncProjects,
} from "../operations/projects";
import Project from "../types/project";
import AddSVG from "../images/Add.svg";
import DeleteSVG from "../images/Delete.svg";
import InlineMenuSVG from "../images/inline-menu.svg";
import BurgerMenuSVG from "../images/BurgerMenu.svg";
import CloseSVG from "../images/Close.svg";
import { SavedUser, UserCreds } from "../types/user-context";
import { useLocation } from "react-router";
import { SideBarProjectsListProps, SideBarProps } from "../types/sidebar";
import SideBar from "./components/sidebar";
import { getCurrentUser, setUser } from "../operations/user";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

export async function loader() {
  const user = await getCurrentUser();
  if (!user) return redirect("/login");
  return user;
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

export const UserContext = createContext(null);
const projectQuery = new QueryClient();

const Root = () => {
  const user = useLoaderData() as SavedUser;
  const navigate = useNavigate();
  const [sideBarDisplay, setSideBarDisplay] = useState(true);
  const [user_credentials, setUserCredentials] = useState<UserCreds>({
    user_details: { ...user },
    setUserDetails: async (new_details: SavedUser) => {
      setUserCredentials((state) => ({ ...state, user_details: new_details }));
      await setUser(new_details);
      return;
    },
  });

  const [isLoggedIn, setLoggedIn] = useState<boolean>(
    user_credentials.user_details && user_credentials.user_details._id
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

  return (
    <QueryClientProvider client={projectQuery}>
      <div className="root-div">
        <div className="toggle-sidebar">
          <button
            className="new-project-btn"
            title="New Project"
            style={{
              width: "30px",
            }}
            onClick={() => setSideBarDisplay((state) => !state)}
          >
            <img
              src={!sideBarDisplay ? BurgerMenuSVG : CloseSVG}
              alt="Toggle sidebar"
            />
          </button>
        </div>
        <SideBar
          isLoggedIn={isLoggedIn}
          sideBarDisplay={sideBarDisplay}
          handleRedirectClick={handleRedirectClick}
          itemListElement={
            <SideBarProjectsList handleRedirectClick={handleRedirectClick} />
          }
        />
        <main>
          <UserContext.Provider value={user_credentials.user_details}>
            <Outlet />
          </UserContext.Provider>
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default Root;

const SideBarProjectsList = ({
  handleRedirectClick,
}: SideBarProjectsListProps) => {
  const [project_filter, setProjectFilter] = useState("");

  const {
    data: projects,
    error,
    isLoading,
  } = useQuery({
    queryKey: "projects",
    queryFn: () => getProjects(),
    enabled: true,
  });

  return (
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
          value={project_filter}
          onChange={({ target }) => setProjectFilter(target.value)}
        />
      </div>
      <ul className="nav navbar-nav nav-bar">
        {projects && projects.length ? (
          projects.map((project: Project, key: number) => {
            if (
              project.name.toLowerCase().includes(project_filter.toLowerCase())
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
  );
};

const NavItem = ({
  project,
  index,
  closeMenu,
}: {
  project: Project;
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
        className="dropdown-toggler"
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
  project: Project;
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
