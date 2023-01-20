import React, { useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import {
  Form,
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { editProject, getProjects } from "@services/projects";
import { Task } from "./task-types";

export async function loader({ params }: LoaderFunctionArgs) {
  const { projectId } = params;
  return projectId;
}

const NewTask = () => {
  const project_id = useLoaderData() as string;
  const {
    data: projects,
    error,
    isLoading,
  } = useQuery<Project[]>("projects");

  if (!projects) {
    throw new Error("this user has no projects");
  }

  const project = projects.find(project => project.id === project_id);

  const [task_content, setTaskContent] = useState({
    name: "",
    deadline: "",
  });
  const [form_errors, setFormError] = useState({
    name: false,
    deadline: false,
  });
  const [magicStyle, setMagicStyle] = useState("magictime swashIn");
  const navigate = useNavigate();
  const addBtnRef = useRef<HTMLButtonElement | null>(null);

  function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    setTaskContent(state => ({
      ...state,
      [target.name]: target.value,
    }));
    setFormError(state => ({
      ...state,
      [target.name]: false,
    }));
  }

  function checkFormErrors() {
    let valid = true;
    if (!validDate(new Date(task_content.deadline))) {
      setFormError(state => ({ ...state, deadline: true }));
      valid = false;
    }
    if (!task_content.name) {
      setFormError(state => ({ ...state, name: true }));
      valid = false;
    }
    return valid;
  }

  const projectQueryClient = useQueryClient();

  async function handleSubmit() {
    if (project) {
      const new_task = new Task({
        name: task_content.name,
        deadline: task_content.deadline
          ? new Date(task_content.deadline)
          : undefined,
      });
      project.tasks.push(new_task);
      await editProject(project).then(res => {
        if (res) {
          projectQueryClient.setQueryData("projects", res);
        }
      });
      return navigate("..", {
        relative: "route",
        // state: { shouldRefetch: true },
      });
    }
  }

  function navigatePrev() {
    setMagicStyle("magictime holeOut");
    setTimeout(() => {
      navigate("..");
    }, 200);
  }

  const formRef = useRef<HTMLFormElement | null>(null);
  const formContainerRef = useRef<HTMLDivElement | null>(null);

  function closeOnClick(e: React.MouseEvent<HTMLDivElement | MouseEvent>) {
    if (formRef.current && formContainerRef.current) {
      const bounds = formRef.current.getBoundingClientRect();
      if (
        e.clientX < bounds.left ||
        e.clientX > bounds.right ||
        e.clientY < bounds.top ||
        e.clientY > bounds.bottom
      ) {
        navigatePrev();
      }
    }
  }

  return (
    <div
      className="new-task"
      onClick={closeOnClick}
      ref={formContainerRef}
    >
      <Form
        ref={formRef}
        method="put"
        className={magicStyle}
        style={{
          animationDuration: "300ms",
        }}
        onSubmit={handleSubmit}
      >
        <label htmlFor="name">Task Name:</label>
        <input
          name="name"
          value={task_content.name}
          id="name"
          className="form-control"
          autoComplete="off"
          onChange={handleChange}
        />
        {form_errors.name && (
          <span className="invalid-date">Name cannot be blank</span>
        )}
        <label htmlFor="deadline">Task Deadline:</label>
        <input
          id="deadline"
          name="deadline"
          value={task_content.deadline}
          onChange={handleChange}
          className="form-control"
          type="date"
        />
        {form_errors.deadline && (
          <span className="invalid-date">Invalid deadline</span>
        )}
        <button
          type="submit"
          className="btn btn-success btn-sm"
          name="add"
          ref={addBtnRef}
          value={1}
          onClick={e => {
            const valid = checkFormErrors();
            if (!valid) return e.preventDefault();
            setMagicStyle("magictime holeOut");
            setTimeout(() => {
              addBtnRef.current
                ? (addBtnRef.current.disabled = true)
                : null;
            }, 50);
          }}
        >
          Add
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          name="cancel"
          onClick={navigatePrev}
        >
          Cancel
        </button>
      </Form>
    </div>
  );
};

export default NewTask;

export function validDate(date: Date) {
  if (new Date(date).getTime() < new Date().getTime()) {
    return false;
  } else {
    return true;
  }
}
