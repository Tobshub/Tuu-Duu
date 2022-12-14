import React, { useState } from "react";
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
    refetch,
  } = useQuery<Project[]>("projects");

  if (!projects) {
    throw new Error("this user has no projects");
  } else if (error) {
    throw error;
  }

  const project = projects.find(project => project.id === project_id);

  if (!project) {
    throw new Error("project does not exist");
  }

  const task = project.tasks.find(task => task.id === task_id);

  if (!task) throw new Error("no such task");

  const [task_content, setTaskContent] = useState({
    name: task.name,
    deadline: task.deadline ?? null,
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
    if (!task_content.name.length) {
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

  return (
    <div className="edit-task">
      <Form
        method="put"
        className={magicStyle}
        style={{
          animationDuration: "300ms",
        }}
        onSubmit={handleSave}
      >
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={task_content.name}
          autoComplete="off"
          className="form-control"
          onChange={handleChange}
        />
        <label htmlFor="deadline">Deadline:</label>
        <input
          type="datetime-local"
          id="deadline"
          name="deadline"
          className="form-control"
          onChange={handleChange}
        />
        {form_errors.deadline && (
          <span className="invalid-date">Deadline has passed</span>
        )}
        <div className="display-todos">
          {task.todos && task.todos.length ? (
            task.todos.map((todo, key) => (
              <input value={todo.content} key={key} disabled />
            ))
          ) : (
            <em>No todos for this task</em>
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
        <button
          type="submit"
          className="btn btn-success"
          name="save"
          value={1}
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
          className="btn btn-danger"
          onClick={() => {
            setMagicStyle("magictime holeOut");
            setTimeout(() => {
              navigate("..", { relative: "route" });
            }, 200);
          }}
        >
          Back
        </button>
      </Form>
    </div>
  );
};

export default EditTask;
