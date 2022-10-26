import { Form, Params, redirect, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { addProject } from "../../dummyDB";
import { Projects } from "../../types/project";

export const action = async ({
  params,
  request,
}: {
  params: Params<string>;
  request: Request;
}) => {
  const formData = await request.formData();
  const { name, description } = Object.fromEntries(formData);
  const id = (Math.random() + 1).toString(36).substring(2);

  const data: Projects = {
    name: name.toString(),
    description: description.toString(),
    id,
  };

  await addProject(data);
  return redirect(`/projects/${data.id}`);
};

const NewProject = () => {
  const [title, setTitle] = useState("Project Title");
  const [description, setDesc] = useState("Project Description");
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
      <button type="submit" className="btn btn-primary">
        Create
      </button>
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => navigate(-1)}
      >
        Cancel
      </button>
    </Form>
  );
};

export default NewProject;
