import React, { useState, useEffect } from "react";
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
import { getProjects, deleteProject } from "../dummyDB";
import { Projects } from "../types/project";
import AddSVG from "../images/Add.svg";
import DeleteSVG from "../images/Delete.svg";
import { Nav } from "react-bootstrap";

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
  const [isLogin, setLogin] = useState(false);

  return (
    <div className="root-div">
      <header>
        <h1>
          <Link to={`/`}>Tuu-Duu</Link>
        </h1>
        <nav className="nav-bar navbar navbar-default">
          <div className="nav-title">
            <h2 className="navbar-brand">My Projects</h2>
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
          <button className="btn btn-primary">Settings</button>
          <Form action="/login">
            <button className="btn btn-danger">
              {isLogin ? "Logout" : "Login"}
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
  return (
    <li key={index} className={magicStyle}>
      <NavLink
        to={`projects/${project.id}`}
        className={({ isActive }) => (isActive ? "btn btn-primary" : "btn")}
      >
        {project.name}
      </NavLink>
      <Form method="post">
        <button
          type="submit"
          className="project-delete"
          name="delete"
          value={project.id}
          onClick={() => {
            setMagicStyle("magictime holeOut");
            setTimeout(() => {
              setMagicStyle("magictime");
            }, 250);
          }}
        >
          <img src={DeleteSVG} alt="delete project" />
        </button>
      </Form>
    </li>
  );
};
