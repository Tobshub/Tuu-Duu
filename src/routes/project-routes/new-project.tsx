import { Form, Params, redirect, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { addProject, generateId } from "../../localDB";
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

  const data: Project = new Project(
    name ? name.toString() : "Untitled",
    description.toString(),
    [],
    false
  );

  await addProject(data);
  return redirect(`/projects/${data.id}`);
};

const NewProject = () => {
  return <NewForm form_type={"Project"} />;
};

export default NewProject;
