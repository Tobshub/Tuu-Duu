import {
  Form,
  Params,
  redirect,
  useActionData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { addProject, getProjects } from "../../operations/projects";
import Project from "../../types/project";
import NewForm from "../components/new-form";

export const action = async ({
  params,
  request,
}: {
  params: Params<string>;
  request: Request;
}) => {
  const formData = await request.formData();
  const { name, description } = Object.fromEntries(formData);

  const data: Project = new Project({
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
