import React, { useContext, useEffect, useState } from "react";
import { Form, useLoaderData, Link } from "react-router-dom";
import { getProjects } from "../localDB";
import { Project } from "../types/project";
import { SavedUser } from "../types/user-context";
import { UserCredentails } from "./root";

export const loader = async () => {
  const projects = getProjects();
  return { projects };
};

const Index = () => {
  const { projects }: { projects: Project[] } = useLoaderData();
  const fav_projects =
    projects && projects.length
      ? projects.filter((project: Project) => project.favorite)
      : null;

  const { user_details } = useContext(UserCredentails) ?? {};
  return (
    <div className="index">
      {!!user_details && !!user_details._id ? (
        <LoggedInDisplay user_details={user_details} />
      ) : (
        <LoggedOutDisplay />
      )}
      {projects && projects.length ? (
        <em>Navigate to an existing Project from the sidebar</em>
      ) : (
        <em>You have no projects or Todos</em>
      )}

      <Form action="/projects/new">
        <button type="submit" className="btn btn-success btn-sm">
          New Project
        </button>
      </Form>
      <Form action="/orgs">
        <button type="submit" className="btn btn-sm btn-primary">
          Organizations
        </button>
      </Form>
      <div>
        <h4>{fav_projects && fav_projects.length ? "Favorites:" : null}</h4>
        <ul>
          {fav_projects && fav_projects.length
            ? fav_projects.map((project, key) => (
                <li key={key}>
                  <Link to={`/projects/${project.id}`}>{project.name}</Link>
                </li>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
};

export default Index;

function LoggedInDisplay({ user_details }: { user_details: SavedUser }) {
  const projects: Project[] = useLoaderData();
  const [dateTime, setDateTime] = useState(Date.now());
  // greeting the user with their username
  // show date and time
  useEffect(() => {
    const dateTime_interval = setTimeout(() => {
      setDateTime(Date.now());
    }, 100);
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
