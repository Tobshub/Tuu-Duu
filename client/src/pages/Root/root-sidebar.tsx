import ActionButton from "@UIcomponents/action-button";
import { useState } from "react";
import { useQuery } from "react-query";
import { Form, Link, NavLink, useLocation } from "react-router-dom";
import AddSVG from "@images/Add.svg";
import InlineMenuSVG from "@images/inline-menu.svg";

const SideBarProjectsList = ({
  handleRedirectClick,
}: SideBarProjectsListProps) => {
  const [project_filter, setProjectFilter] = useState("");

  const { data: projects, error } = useQuery<Project[]>("projects");

  if (error) throw error;

  return (
    <nav className="nav-bar navbar navbar-default">
      <div className="nav-title">
        <h2>My Projects</h2>
        <Link to={"/projects/new"}>
          <ActionButton
            title="Create a new Project"
            className="new-project-btn"
            name="new"
            value={1}
            onClick={handleRedirectClick}
            icon={AddSVG}
            icon_alt="New project"
          />
        </Link>
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
          projects.map((project, key) => {
            if (
              project.name
                .toLowerCase()
                .includes(project_filter.toLowerCase())
            ) {
              return (
                <NavItem
                  project={project}
                  key={project.id}
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

export default SideBarProjectsList;

const NavItem = ({
  project,
  closeMenu,
}: {
  project: Project;
  closeMenu: () => void;
}) => {
  const [magicStyle, setMagicStyle] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  return (
    <li className={magicStyle}>
      <NavLink
        to={`projects/${project.id}`}
        className={({ isActive }) =>
          isActive ? "btn btn-primary" : "btn"
        }
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

      {showMenu && <Menu project={project} />}
    </li>
  );
};

const Menu = ({ project }: { project: Project }) => {
  return (
    <div
      className="nav-dropdown dropdown magictime swashIn"
      style={{
        animationDuration: "200ms",
      }}
    >
      <Form action={`projects/${project.id}/edit`}>
        <button
          className="btn btn-warning btn-sm"
          type="submit"
          title="edit project"
          name="edit"
        >
          Edit
        </button>
      </Form>
      <Form action={`projects/${project.id}/delete`}>
        <button
          type="submit"
          className="btn btn-danger btn-sm"
          title="delete project"
          name="delete"
        >
          Delete
        </button>
      </Form>
    </div>
  );
};
