import React, { useEffect, useState } from "react";
import {
  Form,
  Params,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { addTodo, editTask, getTask } from "../../operations/tasks";
import { Task, Todo, TodoStatus } from "../../types/project";
import AddSVG from "../../images/Add_black.svg";
import { validDate } from "./new-task";

export async function loader({ params }: { params: Params<string> }) {
  const { projectId: id, taskIndex: index } = params;
  if (!id || !index) return;

  const task = await getTask(id, parseInt(index));
  if (!task) return redirect(`/projects/${id}/`);
  return task;
}

export async function action({
  params,
  request,
}: {
  params: Params<string>;
  request: Request;
}) {
  const res = await request.formData();
  const { projectId: id, taskIndex: index } = params;
  if (!id || !index) return;
  const { name, deadline, newTodo, ...formData } = Object.fromEntries(res);
  if (formData.save) {
    const task: Task = {
      name: name ? name.toString() : "Untitled",
      deadline: deadline ? new Date(deadline.toString()) : undefined,
    };
    await editTask(id, parseInt(index), task);
    return redirect(`/projects/${id}`);
  }
  if (formData.addTodo && newTodo) {
    const todo: Todo = {
      content: newTodo.toString(),
      status: TodoStatus.AWAITING,
    };
    await addTodo(id, parseInt(index), todo);
  }
}

const EditTask = () => {
  const task = useLoaderData();
  // if (typeof task === "object" && "name" in task && "deadline" in task)
  const [name, setName] = useState(
    typeof task === "object" && "name" in task ? task.name.toString() : ""
  );
  const [deadline, setDeadline] = useState(
    typeof task === "object" && "deadline" in task
      ? new Date(task.deadline.toString())
      : undefined
  );
  const [invalidDate, setInvalidDate] = useState(false);
  const [magicStyle, setMagicStyle] = useState("magictime swashIn");
  const navigate = useNavigate();
  const [todo, setTodo] = useState("");

  return (
    <div className="edit-task">
      <Form
        method="post"
        className={magicStyle}
        style={{
          animationDuration: "300ms",
        }}
      >
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          autoComplete="off"
          className="form-control"
          onChange={({ target }) => setName(target.value)}
        />
        <label htmlFor="deadline">Deadline:</label>
        <input
          type="datetime-local"
          id="deadline"
          name="deadline"
          className="form-control"
          value={
            !!deadline ? new Date(deadline).toISOString().slice(0, -1) : ""
          }
          onChange={({ target }) => {
            const { value } = target;
            setDeadline(value ? new Date(value) : undefined);
            setInvalidDate(false);
          }}
        />
        {invalidDate && (
          <span className="invalid-date">Deadline has passed</span>
        )}
        <div className="display-todos">
          {typeof task === "object" &&
          "todos" in task &&
          task.todos &&
          Array.isArray(task.todos) &&
          task.todos.length ? (
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
            <button
              type="submit"
              className="new-todo-btn"
              name="addTodo"
              value={1}
              onClick={() => {
                setTimeout(() => setTodo(""), 100);
              }}
            >
              <img src={AddSVG} alt="Add todo" loading="lazy" />
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-success"
          name="save"
          value={1}
          onClick={(e) => {
            if (deadline && !validDate(deadline)) {
              e.preventDefault();
              setInvalidDate(true);
              return;
            }
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
              navigate(-1);
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
