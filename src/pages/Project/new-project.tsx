import {
  Params,
  redirect,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { addProject } from "@services/projects";
import NewForm from "@UIcomponents/new-form";
import { Project } from "./project-types";
import { useMutation, useQueryClient } from "react-query";
import { useState } from "react";

export const action = async ({
  params,
  request,
}: {
  params: Params<string>;
  request: Request;
}) => {
  const formData = await request.formData();
  const { name, description } = Object.fromEntries(formData);

  const data = new Project({
    name: name ? name.toString() : "Untitled",
    description: description.toString(),
  });
  const success = await addProject(data);

  if (!success) throw new Error("could not create project");
  return redirect(`/projects/${data.id}`);
};

const NewProject = () => {
  const projectsQuery = useQueryClient();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
  });

  const newProjectMutation = useMutation(addProject, {
    onSuccess: data => {
      if (data) {
        projectsQuery.setQueryData("projects", data);
      }
    },
  });

  function nextAction() {
    const data = new Project({ ...formValues });
    newProjectMutation.mutateAsync(data).then(res => {
      if (res) {
        navigate(`/projects/${data.id}`);
      }
    });
  }

  return (
    <>
      <h1>Create a new Project</h1>
      <NewForm
        form_type={"Project"}
        handleChange={({ target }) => {
          setFormValues(state => ({
            ...state,
            [target.name]: target.value,
          }));
        }}
        formValues={formValues}
        nextAction={nextAction}
        required={{ name: true, description: false }}
      />
    </>
  );
};

export default NewProject;
