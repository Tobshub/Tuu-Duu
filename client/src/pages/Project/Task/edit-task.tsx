import React, { useRef, useState } from "react";
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import AddSVG from "@images/Add.svg";
import { validDate } from "./new-task";
import { useQuery } from "react-query";
import { editProject, getProjects } from "@services/projects";
import ActionButton from "@UIcomponents/action-button";
import { setTaskStatus } from "@services/tasks";
import { Task, Todo } from "./task-types";

export async function loader({ params }: LoaderFunctionArgs) {
  const { projectId: id, taskId: task_id } = params;
  return { id, task_id };
}

const EditTask = () => {
  const { id: project_id, task_id } = useLoaderData() as {
    id: string;
    task_id: string;
  };

  const {
    data: projects,
    error,
    isLoading,
  } = useQuery<Project[]>("projects");

  if (!projects && !isLoading) {
    throw new Error("this user has no projects");
  } else if (error) {
    throw error;
  }

  const project = projects?.find(project => project.id === project_id);

  if (!project && !isLoading) {
    throw new Error("project does not exist");
  }

  const task = project?.tasks.find(task => task.id === task_id);

  if (!task && !isLoading) {
    throw new Error("that task no longer exists");
  }

  const [task_content, setTaskContent] = useState({
    name: task?.name ?? "",
    deadline: task?.deadline ?? null,
  });
  const [form_errors, setFormError] = useState({
    name: false,
    deadline: false,
  });
  const [magicStyle, setMagicStyle] = useState("magictime swashIn");
  const navigate = useNavigate();
  const [todo, setTodo] = useState("");

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

  function addTodo() {
    if (task) {
      task.todos.push(new Todo({ content: todo }));
      setTodo("");
    }
  }

  function checkFormErrors(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    let valid = true;
    if (task_content.deadline && !validDate(task_content.deadline)) {
      e.preventDefault();
      setFormError(state => ({ ...state, deadline: true }));
      valid = false;
    }
    if (!task_content.name?.length) {
      e.preventDefault();
      setFormError(state => ({ ...state, name: true }));
      valid = false;
    }
    return valid;
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (project && task) {
      project.tasks[project.tasks.indexOf(task)] = new Task({
        ...project.tasks[project.tasks.indexOf(task)],
        name: task_content.name,
        deadline: task_content.deadline ?? undefined,
        status: setTaskStatus(task),
      });
      await editProject(project);
      return navigate("..", {
        relative: "route",
        state: { shouldRefetch: true },
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
      // close the modal if outside of it is clicked
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
      className="edit-task"
      ref={formContainerRef}
      onClick={closeOnClick}
    >
      <Form
        ref={formRef}
        method="put"
        className={magicStyle}
        style={{
          animationDuration: "300ms",
        }}
        onSubmit={handleSave}
      >
        <fieldset
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <label htmlFor="name">
            Name:
            <input
              type="text"
              id="name"
              name="name"
              value={task_content.name}
              autoComplete="off"
              className="form-control"
              onChange={handleChange}
            />
          </label>
          <label htmlFor="deadline">
            Deadline:
            <input
              type="date"
              id="deadline"
              name="deadline"
              className="form-control"
              onChange={handleChange}
            />
            {form_errors.deadline && (
              <span className="alert alert-danger m-0 p-0 text-2">
                Deadline has passed
              </span>
            )}
          </label>
        </fieldset>
        <fieldset>
          <div className="display-todos mb-3">
            {task && task.todos && task.todos.length ? (
              <>
                <label>Todos: </label>
                {task.todos.map((todo, key) => (
                  <input
                    value={todo.content}
                    key={key}
                    readOnly={true}
                    className={
                      "form-control form-control-sm" /** TODO: make existing todos looks better */
                    }
                  />
                ))}
              </>
            ) : (
              <em>No todos yet...</em>
            )}
          </div>
          <div className="input-group">
            <input
              name="newTodo"
              value={todo}
              id="new-todo"
              className="form-control"
              placeholder="New todo"
              onChange={({ target }) => {
                setTodo(target.value);
              }}
            />
            <div className="input-group-btn">
              <ActionButton
                type={"button"}
                className="new-todo-btn"
                name="addTodo"
                icon={AddSVG}
                icon_alt="Add todo"
                islazy={true}
                value={1}
                title="Add a todo"
                onClick={() => {
                  if (!todo.length) {
                    return;
                  }
                  addTodo();
                }}
              />
            </div>
          </div>
        </fieldset>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            // justifyContent: "space-around",
            alignItems: "center",
            gap: ".5rem",
          }}
        >
          <button
            type="submit"
            className="btn btn-outline-success w-100"
            name="save"
            onClick={async e => {
              const valid = checkFormErrors(e);
              if (!valid) return;
              setMagicStyle("magictime holeOut");
            }}
          >
            Save
          </button>
          <button
            type="button"
            className="btn btn-outline-danger w-100"
            onClick={navigatePrev}
          >
            Back
          </button>
        </div>
      </Form>
    </div>
  );
};

export default EditTask;
