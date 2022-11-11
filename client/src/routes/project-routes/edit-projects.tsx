import React, { useState } from "react";
import { NavItem } from "react-bootstrap";
import {
  Form,
  Params,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { editProject, getProject } from "../../dummyDB";
import { Projects } from "../../types/project";

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
  const projectData: Projects = {
    ...project,
    name: name.toString(),
    description: description.toString(),
  };
  if (formData.edit) {
    await editProject(projectData, id);
    return redirect(`/projects/${id}`);
  }
}

const EditProject = () => {
  const { name, description: desc } = useLoaderData();
  const [title, setTitle] = useState(name);
  const [description, setDesc] = useState(desc);
  const navigate = useNavigate();

  return (
    <Form className="new-project" method="post">
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
