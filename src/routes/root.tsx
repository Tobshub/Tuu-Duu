import React, { useState, useEffect } from "react";
import "./root.css";
import {
  Outlet,
  useLoaderData,
  Link,
  Form,
  NavLink,
  useNavigate,
  redirect,
} from "react-router-dom";
import { getProjects, deleteProject } from "../dummyDB";
import { Projects } from "../types/project";
import AddSVG from "../assets/Add.svg";

export async function loader() {
  const projects = await getProjects();
  return { projects };
}

const Root = () => {
  const { projects }: { projects: Projects[] } = useLoaderData();

  return (
    <div className="root-div">
      <header>
        <h1>
          <Link to={`/`}>Tuu-Duu</Link>
        </h1>
        <nav className="nav-bar navbar navbar-default">
          <div className="nav-title">
            <h2 className="navbar-brand">My Projects</h2>
            <Form action="/projects/new">
              <button type="submit" className="new-project-btn">
                <img src={AddSVG} />
              </button>
            </Form>
          </div>
          <ul className="nav navbar-nav nav-bar">
            {projects && projects.length ? (
              projects.map((project: Projects, key: number) => (
                <li key={key}>
                  <NavLink
                    to={`projects/${project.id}`}
                    className={({ isActive }) =>
                      isActive ? "btn btn-primary" : "btn"
                    }
                  >
                    {project.name}
                  </NavLink>
                </li>
              ))
            ) : (
              <em>No projects yet.</em>
            )}
          </ul>
        </nav>
        <div className="user-actions">
          <button className="btn btn-primary">Settings</button>
          <button className="btn btn-danger">Logout</button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Root;
