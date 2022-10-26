import { redirect, useLoaderData, Form, Params } from "react-router-dom";
import { deleteTodo, getProject } from "../../dummyDB";
import { ToDos, ToDoStatus } from "../../types/project";
import DeletSVG from "../../assets/Delete-2.svg";
import EditSVG from "../../assets/Edit.svg";
import AddSVG from "../../assets/Add.svg";

export async function loader({ params }: { params: Params<string> }) {
  const id = params.projectId;
  const project = await getProject(id);
  const todos = project?.ToDos;
  return { todos };
}

export async function action({
  params,
  request,
}: {
  params: Params<string>;
  request: Request;
}) {
  const res = await request.formData();
  const formData = Object.fromEntries(res);
  const id = params.projectId;
  const key = formData.delete
    ? parseInt(formData.delete.toString())
    : formData.edit
    ? parseInt(formData.edit.toString())
    : 2;
  if (!id || key === undefined) return;
  if (formData.new) {
    return redirect(`/projects/${id}/todos/new`);
  } else if (formData.delete) {
    await deleteTodo(id, key);
  } else if (formData.edit) {
    return redirect(`/projects/${id}/todos/${key}/edit`);
  }
}

const Todos = () => {
  const { todos }: { todos: ToDos[] } = useLoaderData();
  const idleTodos = todos.filter((todos) => todos.status === ToDoStatus.IDLE);
  return (
    <div>
      <Form method="post">
        <button type="submit" name="new" value={1} className="new-todo-btn">
          <img src={AddSVG} />
        </button>
      </Form>
      <ul>
        {idleTodos && idleTodos.length ? (
          todos.map((todo, key) => (
            <li key={key}>
              <div className="todo-el">
                <h4>{todo.title}</h4>
                <p>{todo.content}</p>
                <Form method="post" className="todo-actions">
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
