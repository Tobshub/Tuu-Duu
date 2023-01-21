import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, NavLink, redirect } from "react-router-dom";
import UserContext from "@context/user-context";

const Index = () => {
  const { data: projects, error } = useQuery<Project[]>("projects");
  const fav_projects =
    projects && Array.isArray(projects) && projects.length
      ? projects.filter((project: Project) => project.favorite)
      : null;

  const { user } = useContext(UserContext);

  if (!user) {
    redirect("/login");
    throw new Error("no user");
  }

  return (
    <div className="index">
      {user && user._id ? (
        <LoggedInDisplay user={user} />
      ) : (
        <LoggedOutDisplay />
      )}
      <div style={{ display: "block" }}>
        {projects && Array.isArray(projects) && projects.length ? (
          <em>Navigate to an existing Project from the sidebar or </em>
        ) : (
          <em>You have no projects or Todos, you can </em>
        )}
        <em>create a</em> <Link to="/projects/new">New Project</Link>.
      </div>

      {/* <Form action="/orgs">
        <button type="submit" className="btn btn-sm btn-primary">
          Organizations
        </button>
      </Form> */}
      <div>
        {fav_projects && fav_projects.length ? (
          <>
            <h4 style={{ textAlign: "center" }}>Favorites:</h4>
            <ul className="favorites-display">
              {fav_projects.map((project: Project, key: number) => (
                <ProjectBox project={project} key={key} />
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Index;

function LoggedInDisplay({ user }: { user: SavedUser }) {
  const [dateTime, setDateTime] = useState(Date.now());
  // greet the user with their username
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
      <h1>Hi, {user.username}</h1>
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
        Tuu-Duu is a project planner application, tailored to help you plan
        to the smallest details.
        {<br />}
        Whether its your large scale money maker, your start up baby, or
        for personal use, Tuu-Duu is right for everyone.
      </p>
    </div>
  );
}

function ProjectBox({ project }: { project: Project }) {
  return (
    <NavLink to={`/projects/${project.id}`}>
      <div className="project-box">
        <em>{project.name}</em>
        <em
          style={{
            fontSize: "14px",
          }}
        >
          {project.description}
        </em>
      </div>
    </NavLink>
  );
}
