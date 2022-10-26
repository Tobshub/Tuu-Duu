import { useState } from "react";
import {
  Form,
  Params,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { editTodo, getProject, getTodo } from "../../dummyDB";
import { Projects, ToDos, ToDoStatus } from "../../types/project";

export async function loader({ params }: { params: Params<string> }) {
  const id = params.projectId;
  const key = params.todoIndex ? parseInt(params.todoIndex) : undefined;
  if (!id || key === undefined) return;
  const todo = await getTodo(id, key);
  const project = await getProject(id);
  return { project, todo, key };
}

export async function action({
  params,
  request,
}: {
  params: Params<string>;
  request: Request;
}) {
  const res = await request.formData();
  const { title, content } = Object.fromEntries(res);
  const id = params.projectId;
  const key = params.todoIndex ? parseInt(params.todoIndex) : undefined;
  if (!id || key === undefined) return;

  const todo = await getTodo(id, key).then((data) =>
    data ? data : { status: ToDoStatus.IDLE }
  );

  const data: ToDos = {
    ...todo,
    title: title.toString(),
    content: content.toString(),
  };
  await editTodo(id, key, data);
  return redirect(`/projects/${id}`);
}

const EditTodo = () => {
  const {
    project,
    todo,
    key,
  }: { project: Projects; todo: ToDos; key: number } = useLoaderData();
  const [title, setTitle] = useState(todo.title);
  const [content, setContent] = useState(todo.content);
  const navigate = useNavigate();

  return (
    <Form method="post" className="new-todo-form">
      <h4>
        Edit #{key + 1} todo for Project {project.name}:{" "}
      </h4>
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
        <button type="submit" name="edit" value={1} className="btn btn-success">
          Edit
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

export default EditTodo;
