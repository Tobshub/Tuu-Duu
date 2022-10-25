import { useState } from "react";
import { Form, redirect, useLoaderData } from "react-router-dom";
import { editProject, getProject } from "./dummyDB";
import { Projects } from "./types/project";

export async function loader({ params }) {
  const id = params.projectId;
  const project = await getProject(id);
  return project;
}

export async function action({ params, request }) {
  const res = await request.formData();
  const formData = Object.fromEntries(res);
  const id = params.projectId;
  if (formData.cancel) {
    return redirect(`/projects/${id}`);
  }
  const project = await getProject(id);
  const projectData: Projects = {
    ...project,
    name: formData.name,
    description: formData.description,
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

  return (
    <Form className="new-project" method="post">
      <input
        type="text"
        name="name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onClick={(e) => e.target.select()}
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
      <button type="submit" className="btn btn-danger" name="cancel" value={1}>
        Cancel
      </button>
    </Form>
  );
};

export default EditProject;
