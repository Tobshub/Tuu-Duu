import { getProjects } from "@services/projects";
import { useQuery } from "react-query";
import { Form, Link, NavLink } from "react-router-dom";
import AddSVG from "@images/Add.svg";
import ActionButton from "@UIcomponents/action-button";

const MinSideBarProjectList = () => {
  const { data: projects, error } = useQuery({
    queryKey: "projects",
    queryFn: () => getProjects(),
    enabled: true,
  });

  if (error) throw error;
  return (
    <nav className="nav-bar navbar navbar-default">
      <div
        className="nav-title"
        style={{ justifyContent: "center", margin: "2rem 0" }}
      >
        <Link to="/projects/new">
          <ActionButton
            title="Create a new Project"
            className="new-project-btn new-project-btn-min"
            value={1}
            icon={AddSVG}
            icon_alt="New project"
          />
        </Link>
      </div>
      <ul
        className="nav navbar-nav nav-bar nav-bar-list"
        style={{
          scrollbarWidth: "thin",
        }}
      >
        {projects && projects.length
          ? projects.map((project: Project, key: number) => (
              <MinNavItem
                project={project}
                key={key}
              />
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
        display: "grid",
        placeItems: "center",
        padding: "0",
        width: "40px",
        margin: ".3rem 0",
      }}
    >
      <NavLink
        to={`projects/${project.id}`}
        className={({ isActive }) =>
          isActive ? "btn btn-primary" : "btn"
        }
      >
        {project.name.substring(0, 2)}
      </NavLink>
    </li>
  );
};
