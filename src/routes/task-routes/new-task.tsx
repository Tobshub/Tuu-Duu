import React, { FormEvent, useState } from "react";
import { Form, Params, redirect, useNavigate } from "react-router-dom";
import { addTask, getProject } from "../../dummyDB";
import { Task, TaskStatus } from "../../types/project";

export async function action({
  params,
  request,
}: {
  params: Params<string>;
  request: Request;
}) {
  const res = await request.formData();
  const { name, deadline, ...formData } = Object.fromEntries(res);
  const id = params.projectId;
  if (formData.add && id) {
    const task: Task = {
      name: name ? name.toString() : "Untitled",
      deadline: deadline ? new Date(deadline.toString()) : undefined,
      status: TaskStatus.IDLE,
      todos: [],
    };
    await addTask(id, task);
    return redirect(`/projects/${id}`);
  }
}

const NewTask = () => {
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [invalidDate, setInvalidDate] = useState(false);
  const [magicStyle, setMagicStyle] = useState("magictime swashIn");
  const navigate = useNavigate();
  return (
    <div className="new-task">
      <Form method="post" className={magicStyle}>
        <label htmlFor="name">Task Name:</label>
        <input
          name="name"
          value={name}
          id="name"
          className="form-control"
          autoComplete="off"
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="deadline">Task Deadline:</label>
        <input
          id="deadline"
          name="deadline"
          value={deadline}
          onChange={(e) => {
            setDeadline(e.target.value);
            setInvalidDate(false);
          }}
          className="form-control"
          type="datetime-local"
        />
        {invalidDate && <span className="invalid-date">Invalid deadline</span>}
        <button
          type="submit"
          className="btn btn-success btn-sm"
          name="add"
          value={1}
          onClick={(e) => {
            if (!validDate(new Date(deadline))) {
              e.preventDefault();
              setInvalidDate(true);
              return;
            }
            setMagicStyle("magictime holeOut");
          }}
        >
          Add
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          name="cancel"
          value={1}
          onClick={() => {
            setMagicStyle("magictime holeOut");
            setTimeout(() => {
              navigate(-1);
            }, 200);
          }}
        >
          Cancel
        </button>
      </Form>
    </div>
  );
};

export default NewTask;

export function validDate(date: Date) {
  if (date.getTime() < new Date().getTime()) {
    return false;
  } else {
    return true;
  }
}
