import { Params, redirect, useLocation } from "react-router-dom";
import { addProject } from "@services/projects";
import NewForm from "@UIcomponents/new-form";
import { generateId } from "@services/user";

export class Project {
  name: string;
  description: string;
  id: string;
  tasks: Task[];
  favorite: boolean;

  constructor({ name, description, id, favorite, tasks }: ProjectProps) {
    this.name = name;
    this.description = description ?? "";
    this.id = id ?? generateId();
    this.favorite = favorite ?? false;
    this.tasks = tasks ?? [];
  }
}

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
  const location = useLocation();
  location.state = { shouldRefetch: true };

  return (
    <NewForm
      form_type={"Project"}
      backAction={() => {
        location.state = {};
      }}
    />
  );
};

export default NewProject;
