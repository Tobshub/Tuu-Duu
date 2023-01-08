import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import {
  Form,
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { editProject, getProjects } from "../../services/projects";
import { Project } from "./project-types";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.projectId;
  return id;
}

const EditProject = () => {
  const project_id = useLoaderData() as string;
  const {
    data: projects,
    error,
    isLoading,
  } = useQuery<Project[]>("projects");

  if (!projects) {
    throw new Error("this user has no projects");
  }

  const project = projects.find(project => project.id === project_id);

  if (!project) {
    throw new Error("invalid project id");
  }
  const [content, setContent] = useState({
    name: project.name,
    description: project.description,
  });
  const navigate = useNavigate();
  const projectsQuery = useQueryClient();
  function handleChange({
    target,
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setContent(state => ({
      ...state,
      [target.name]: target.value,
    }));
  }

  async function formSubmit() {
    if (project) {
      const edits = new Project({
        name: content.name,
        description: content.description,
        id: project.id,
        tasks: project.tasks,
        favorite: project.favorite,
      });
      if (JSON.stringify(edits) !== JSON.stringify(project)) {
        await editProject(edits).then(res => {
          if (res) {
            projectsQuery.setQueryData("projects", res);
          }
        });
      }
      return navigate("..", { relative: "path" });
    }
  }

  if (error) throw new Error(error.toString());
  if (isLoading) return <>Loading...</>;

  return (
    <Form
      className="edit-project"
      method="put"
      onSubmit={() => formSubmit()}
    >
      <input
        type="text"
        name="name"
        value={content.name}
        onChange={handleChange}
        placeholder="Project Name"
        id="usr"
        className="form-control np-name"
      />
      <textarea
        name="description"
        placeholder="Project Description"
        id="comment"
        className="form-control np-desc"
        value={content.description}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="btn btn-primary"
        name="edit"
        value={1}
      >
        Edit
      </button>
      <button
        type="button"
        className="btn btn-danger"
        name="cancel"
        value={1}
        onClick={() => navigate("..", { relative: "path" })}
      >
        Cancel
      </button>
    </Form>
  );
};

export default EditProject;
