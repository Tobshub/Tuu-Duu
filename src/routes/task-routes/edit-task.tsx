import React, { useEffect, useState } from "react";
import {
  Form,
  Params,
  redirect,
  To,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { addTodo, editTask, getTask } from "../../dummyDB";
import { Task, ToDo } from "../../types/project";
import AddSVG from "../../images/Add_black.svg";
import { validDate } from "./new-task";

export async function loader({ params }: { params: Params<string> }) {
  const { projectId: id, taskIndex: index } = params;
  if (!id || !index) return;

  const task = await getTask(id, parseInt(index));
  if (!task) return redirect(`/projects/${id}/`);
  return { task };
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
    const preEdit = await getTask(id, parseInt(index));
    if (!preEdit) return;
    const task: Task = {
      ...preEdit,
      name: name ? name.toString() : "Untitled",
      deadline: deadline ? new Date(deadline.toString()) : undefined,
    };
    await editTask(id, parseInt(index), task);
    return;
  }
  if (formData.addTodo && newTodo) {
    const todo: ToDo = {
      content: newTodo.toString(),
    };
    await addTodo(id, parseInt(index), todo);
  }
}

const EditTask = () => {
  const { task }: { task: Task } = useLoaderData();
  const [name, setName] = useState(task.name);
  const [deadline, setDeadline] = useState(task.deadline || null);
  const [invalidDate, setInvalidDate] = useState(false);
  const [magicStyle, setMagicStyle] = useState("magictime swashIn");
  const navigate = useNavigate();
  const [todo, setTodo] = useState("");

  return (
    <div className="edit-task">
      <Form method="post" className={magicStyle}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          autoComplete="off"
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="deadline">Deadline:</label>
        <input
          type="datetime-local"
          id="deadline"
          name="deadline"
          value={deadline?.toISOString().slice(0, -5)}
          onChange={(e) => {
            const { value } = e.target;
            setDeadline(new Date(value));
            setInvalidDate(false);
          }}
        />
        {invalidDate && <span className="invalid-date">Invalid Date</span>}
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
            onChange={(e) => {
              const { value } = e.target;
              setTodo(value);
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
              <img src={AddSVG} />
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
            setTimeout(() => {
              navigate(-1);
            }, 200);
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
