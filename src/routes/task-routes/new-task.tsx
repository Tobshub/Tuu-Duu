import { FormEvent, useState } from "react";
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
  const navigate = useNavigate();
  return (
    <div className="new-task">
      <Form method="post">
        <label htmlFor="name">Task Name:</label>
        <input
          name="name"
          value={name}
          id="name"
          className="form-control"
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="deadline">Task Deadline:</label>
        <input
          id="deadline"
          name="deadline"
          className="form-control"
          type="date"
        />
        <button
          type="submit"
          className="btn btn-success btn-sm"
          name="add"
          value={1}
        >
          Add
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          name="cancel"
          value={1}
          onClick={() => {
            return navigate(-1);
          }}
        >
          Cancel
        </button>
      </Form>
    </div>
  );
};

export default NewTask;
