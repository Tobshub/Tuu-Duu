import React, { useState } from "react";
import { NavItem } from "react-bootstrap";
import { useQuery } from "react-query";
import {
  Form,
  Params,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import {
  editProject,
  getProject,
  getProjects,
} from "../../operations/projects";
import Project from "../../types/project";

export async function loader({ params }: { params: Params<string> }) {
  const id = params.projectId;
  return id;
}

const EditProject = () => {
  const project_id = useLoaderData().toString();
  const {
    data: projects,
    error,
    isLoading,
  } = useQuery({
    queryKey: "projects",
    queryFn: () => getProjects(),
    enabled: false,
  });
  const project = projects?.find((project) => project.id === project_id);
  const [content, setContent] = useState({
    name: project.name,
    description: project.description,
  });
  const navigate = useNavigate();

  function handleChange({
    target,
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setContent((state) => ({
      ...state,
      [target.name]: target.value,
    }));
  }

  async function formSubmit() {
    const edits = new Project(
      content.name,
      content.description,
      project.id,
      project.tasks,
      project.favorite
    );
    let success = false;
    if (JSON.stringify(edits) !== JSON.stringify(project)) {
      success = await editProject(edits);
    }
    return navigate("..", {
      state: { shouldRefetch: success },
      relative: "path",
    });
  }

  if (error) throw new Error(error.toString());
  if (isLoading) return <>Loading...</>;

  return (
    <Form className="edit-project" method="put" onSubmit={() => formSubmit()}>
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
      <button type="submit" className="btn btn-primary" name="edit" value={1}>
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
