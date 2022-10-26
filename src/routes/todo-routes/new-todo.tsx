import { useState } from "react";
import {
  Form,
  Params,
  redirect,
  URLSearchParamsInit,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { addTodos, getProject } from "../../dummyDB";
import { ToDos, ToDoStatus } from "../../types/project";

export const action = async ({
  params,
  request,
}: {
  params: Params<string>;
  request: Request;
}) => {
  const res = await request.formData();
  const { title, content, ...formData } = Object.fromEntries(res);
  const id = params.projectId;
  if (formData.cancel) {
    return redirect(`/projects/${id}`);
  }
  const data: ToDos = {
    title: title.toString(),
    content: content.toString(),
    status: ToDoStatus.IDLE,
  };
  await addTodos(id, data);
  return redirect(`/projects/${id}`);
};

export async function loader({ params }: { params: Params<string> }) {
  const id = params.projectId;
  const project = await getProject(id);
  return { project };
}

const NewTodo = () => {
  const [title, setTitle] = useState("Title");
  const [content, setContent] = useState("ToDo task");
  const { project } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Form method="post" className="new-todo-form">
      <h4>A new todo for {project.name}: </h4>
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
          type="button"
          name="cancel"
          value={1}
          className="btn btn-danger"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
    </Form>
  );
};

export default NewTodo;
