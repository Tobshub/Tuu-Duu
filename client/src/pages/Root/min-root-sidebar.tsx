import { useQuery } from "react-query";
import { Form, Link, NavLink } from "react-router-dom";
import AddSVG from "@images/Add.svg";
import ActionButton from "@UIcomponents/action-button";

const MinSideBarProjectList = () => {
  const { data: projects, error } = useQuery<Project[]>("projects");

  if (error) throw error;
  return (
    <nav className="nav-bar navbar navbar-default">
      <div
        className="nav-title"
        style={{
          justifyContent: "center",
          margin: "2rem 0",
        }}
      >
        <Link to="/projects/new">
          <ActionButton
            title="Create a new Project"
            className="lg new-project-btn new-project-btn-min"
            value={1}
            icon={AddSVG}
            icon_alt="New project"
          />
        </Link>
      </div>
      <ul
        className="nav navbar-nav nav-bar-list p-0 m-0"
        style={{
          scrollbarWidth: "thin",
        }}
      >
        {projects && projects.length
          ? projects.map((project: Project, key: number) => (
              <MinNavItem project={project} key={key} />
            ))
          : null}
      </ul>
    </nav>
  );
};

export default MinSideBarProjectList;

const MinNavItem = ({ project }: { project: Project }) => {
  return (
    <li
      className="nav-item-min"
      style={{
        border: "2px solid #fff",
        borderRadius: "50%",
        padding: "0",
        width: "30px",
        height: "30px",
        margin: ".3em 0",
      }}
      title={`Project: ${project.name}`}
    >
      <NavLink
        to={`projects/${project.id}`}
        className={({ isActive }) =>
          isActive ? "btn btn-primary" : "btn"
        }
        style={{
          padding: "0",
        }}
      >
        {project.name.slice(0, 2)}
      </NavLink>
    </li>
  );
};
