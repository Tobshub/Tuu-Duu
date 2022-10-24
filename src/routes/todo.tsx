import { redirect, useLoaderData, Form } from "react-router-dom";
import { deleteTodo, getProject } from "../dummyDB";
import { ToDos } from "../types/project";
import Project from "./project";
import DeletSVG from "../assets/Delete-2.svg";
import EditSVG from "../assets/Edit.svg";
import AddSVG from "../assets/Add.svg";

export async function loader({ params }) {
  const id = params.projectId;
  const project = await getProject(id);
  const todos = project?.ToDos;
  return { todos };
}

export async function action({ params, request }) {
  const res = await request.formData();
  const formData = Object.fromEntries(res);
  const id = params.projectId;
  if (formData.new) {
    return redirect(`/projects/${id}/todos/new`);
  } else if (formData.delete) {
    const key = formData.delete;
    await deleteTodo(id, key);
  }
}

const Todos = () => {
  const { todos }: { todos: ToDos[] } = useLoaderData();
  return (
    <div>
      <Form method="post">
        <button type="submit" name="new" value={1} className="new-todo-btn">
          <img src={AddSVG} />
        </button>
      </Form>
      <ul>
        {todos && todos.length ? (
          todos.map((todo, key) => (
            <li key={key}>
              <div className="todo-el">
                <h4>{todo.title}</h4>
                <p>{todo.content}</p>
                <Form method="post" className="delete-todo">
                  <button name="edit" value={key} className="todo-edit">
                    <img src={EditSVG} />
                  </button>
                  <button name="delete" value={key} className="delete-todo-btn">
                    <img src={DeletSVG} />
                  </button>
                </Form>
              </div>
            </li>
          ))
        ) : (
          <em>No ToDos for this project</em>
        )}
      </ul>
    </div>
  );
};

export default Todos;
