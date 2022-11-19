import React, { useEffect, useState } from "react";
import { Form, useLoaderData, Link } from "react-router-dom";
import { getProjects } from "../localDB";
import { Projects } from "../types/project";

export const loader = async () => {
  const projects = getProjects();
  return { projects };
};

const Index = () => {
  const { projects }: { projects: Projects[] } = useLoaderData();
  const fav_projects =
    projects && projects.length
      ? projects.filter((project: Projects) => project.favorite)
      : null;

  return (
    <div className="index">
      {projects && projects.length ? (
        <em>Projects are on the left</em>
      ) : (
        <em>You have no projects or Todos</em>
      )}

      <Form action="/projects/new">
        <button type="submit" className="btn btn-success btn-sm">
          New Project
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
