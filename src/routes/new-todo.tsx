import { useState } from "react";
import { Form, redirect, useNavigate } from "react-router-dom";
import { addTodos } from "../dummyDB";
import { ToDos, ToDoStatus } from "../types/project";

export const action = async ({ params, request }) => {
  const res = await request.formData();
  const { title, content, ...formData } = Object.fromEntries(res);
  const id = params.projectId;
  if (formData.cancel) {
    return redirect(`/projects/${id}`);
  }
  const data: ToDos = {
    title,
    content,
    status: ToDoStatus.IDLE,
  };
  await addTodos(id, data);
  return redirect(`/projects/${id}`);
};

const NewTodo = () => {
  const [title, setTitle] = useState("Title");
  const [content, setContent] = useState("ToDo task");

  return (
    <Form method="post" className="new-todo-form">
      <h4>A new todo for Project: </h4>
      <input
        name="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        name="content"
        placeholder="Todo Content: "
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div>
        <button
          type="submit"
          name="create"
          value={1}
          className="btn btn-success"
        >
          Create
        </button>
        <button
          type="submit"
          name="cancel"
          value={1}
          className="btn btn-danger"
        >
          Cancel
        </button>
      </div>
    </Form>
  );
};

export default NewTodo;
