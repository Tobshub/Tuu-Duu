import React, { useContext, useEffect, useState } from "react";
import {
  Form,
  useLoaderData,
  Link,
  useNavigate,
  NavLink,
} from "react-router-dom";
import { getProjects } from "../operations/projects";
import { getCurrentUser } from "../operations/user";
import Project from "../types/project";
import { SavedUser } from "../types/user-context";
import { UserContext } from "./root";

export const loader = async () => {
  const projects = getProjects();
  return projects;
};

const Index = () => {
  const projects = useLoaderData();
  const fav_projects: Project[] =
    projects && Array.isArray(projects) && projects.length
      ? projects.filter((project: Project) => project.favorite)
      : null;

  const user_details = useContext<SavedUser>(UserContext);

  return (
    <div className="index">
      {user_details && user_details._id ? (
        <LoggedInDisplay user_details={user_details} />
      ) : (
        <LoggedOutDisplay />
      )}
      <div style={{ display: "block" }}>
        {projects && Array.isArray(projects) && projects.length ? (
          <em>Navigate to an existing Project from the sidebar or </em>
        ) : (
          <em>You have no projects or Todos, you</em>
        )}
        <em>create a</em> <Link to="/projects/new">New Project</Link>
      </div>

      <Form action="/orgs">
        <button type="submit" className="btn btn-sm btn-primary">
          Organizations
        </button>
      </Form>
      <div>
        <h4 style={{ textAlign: "center" }}>
          {!!fav_projects && fav_projects.length && "Favorites:"}
        </h4>
        <ul className="favorites-display">
          {fav_projects && fav_projects.length
            ? fav_projects.map((project: Project, key: number) => (
                <ProjectBox project={project} key={key} />
              ))
            : null}
        </ul>
      </div>
    </div>
  );
};

export default Index;

function LoggedInDisplay({ user_details }: { user_details: SavedUser }) {
  const [dateTime, setDateTime] = useState(Date.now());
  // greeting the user with their username
  // show date and time
  useEffect(() => {
    const dateTime_interval = setInterval(() => {
      setDateTime(Date.now());
    }, 500);
    return () => clearInterval(dateTime_interval);
  }, []);
  // show tasks that are about to reach their deadline
  return (
    <div>
      <h1>Welcome back, {user_details.username}</h1>
      <h3>
        {new Date(dateTime).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </h3>
    </div>
  );
}

function LoggedOutDisplay() {
  // login to experience full features,
  // explain what Tuu-duu is
  return (
    <div>
      <h2>Login/Sign-up to experience Tuu-Duu's full features</h2>
      <p>
        Tuu-Duu is a project planner application, tailored to help you plan to
        the smallest details.
        {<br />}
        Whether its your large scale money maker, your start up baby, or for
        personal use, Tuu-Duu is right for everyone.
      </p>
    </div>
  );
}

function ProjectBox({ project }: { project: Project }) {
  const navigate = useNavigate();
  return (
    <NavLink to={`/projects/${project.id}`}>
      <div style={{ minWidth: "200px" }} className="project-box">
        <em>{project.name}</em>
        <em style={{ fontSize: "14px" }}>{project.description}</em>
      </div>
    </NavLink>
  );
}
