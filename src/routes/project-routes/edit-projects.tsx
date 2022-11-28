import React, { useState } from "react";
import { NavItem } from "react-bootstrap";
import {
  Form,
  Params,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { editProject, getProject } from "../../operations/projects";
import Project from "../../types/project";

export async function loader({ params }: { params: Params<string> }) {
  const id = params.projectId;
  const project = await getProject(id);
  if (!project)
    throw new Error("Invalid project-ID or problem while retrieving Project");
  return project;
}

export async function action({
  params,
  request,
}: {
  params: Params<string>;
  request: Request;
}) {
  const res = await request.formData();
  const { name, description, ...formData } = Object.fromEntries(res);
  const id = params.projectId;
  if (!id) return;
  const project = await getProject(id);
  if (!project) return;

  const data = new Project(
    name.toString(),
    description.toString(),
    project.id,
    project.tasks,
    project.favorite
  );
  if (formData.edit) {
    await editProject(data, id);
    return redirect(`/projects/${id}`);
  }
}

const EditProject = () => {
  const project = useLoaderData();
  const [title, setTitle] = useState(
    typeof project === "object" && "name" in project
      ? project.name.toString()
      : ""
  );
  const [description, setDesc] = useState(
    typeof project === "object" && "desc" in project
      ? project.desc.toString()
      : ""
  );
  const navigate = useNavigate();

  return (
    <Form className="edit-project" method="post">
      <input
        type="text"
        name="name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Project Name"
        id="usr"
        className="form-control np-name"
      />
      <textarea
        name="description"
        placeholder="Project Description"
        id="comment"
        className="form-control np-desc"
        value={description}
        onChange={(e) => setDesc(e.target.value)}
      />
      <button type="submit" className="btn btn-primary" name="edit" value={1}>
        Edit
      </button>
      <button
        type="button"
        className="btn btn-danger"
        name="cancel"
        value={1}
        onClick={() => navigate(-1)}
      >
        Cancel
      </button>
    </Form>
  );
};

export default EditProject;
