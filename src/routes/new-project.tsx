import { Form, redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import { addProject } from "../dummyDB";
import { Projects } from "../types/project";

export const action = async ({ params, request }) => {
  const formData = await request.formData();
  const data: Projects = Object.fromEntries(formData);
  let id = (Math.random() + 1).toString(36).substring(2);
  data.id = id;
  await addProject(data);
  return redirect(`/projects/${data.id}`);
};

const NewProject = () => {
  const [title, setTitle] = useState("Project Title");
  const [description, setDesc] = useState("Project Description");

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
        onClick={(e) => e.target.select()}
      />
      <button type="submit" className="btn btn-primary">
        Create
      </button>
    </Form>
  );
};

export default NewProject;
