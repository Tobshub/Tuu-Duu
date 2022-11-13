import {
  Outlet,
  redirect,
  useLoaderData,
  Form,
  useNavigate,
  Params,
  useActionData,
} from "react-router-dom";
import {
  deleteProject,
  deleteTask,
  editProject,
  editTask,
  getProject,
  markTodo,
  restoreTask,
  setFavorite,
} from "../../dummyDB";
import {
  Projects,
  Task,
  TaskStatus,
  Todo,
  TodoStatus,
} from "../../types/project";
import EditSVG from "../../images/Edit.svg";
import DeleteSVG from "../../images/Delete.svg";
import FavSVG from "../../images/Star_filled.svg";
import UnFavSVG from "../../images/Star_blank.svg";
import AddSVG from "../../images/Add.svg";
import DoneSVG from "../../images/Checkmark.svg";
import React, { useEffect, useState } from "react";
import "../task-routes/tasks.css";
import ActionNotifcation from "../app-notifications/action-notifcation";

export const loader = async ({ params }: { params: Params<string> }) => {
  const id = params.projectId;
  const project = await getProject(id);
  if (!project)
    throw new Error("Invalid project-ID or problem while retrieving Project");
  return { project };
};

export const action = async ({
  params,
  request,
}: {
  params: Params<string>;
  request: Request;
}) => {
  const res = await request.formData();
  const formData = Object.fromEntries(res);
  const id = params.projectId;
  if (!id) return;
  if (formData.action) {
    switch (formData.action) {
      case "toggle favorite":
        await setFavorite(id);
        break;
      case "edit project":
        return redirect(`/projects/${id}/edit`);
      case "delete project":
        await deleteProject(id);
        return redirect("/");
      case "new task":
        return redirect(`/projects/${id}/tasks/new`);
      default:
        console.log("no action set for that");
        break;
    }
  } else if (formData.editTask) {
    const key = formData.editTask;
    return redirect(`/projects/${id}/tasks/${key}/edit`);
  } else if (formData.deleteTask) {
    const key = parseInt(formData.deleteTask.toString());
    const removed_task = await deleteTask(id, key);
    return { removed_task, key };
  } else if (formData.markTodo) {
    const todoLocation = formData.markTodo.toString().split(",");
    const res = await markTodo(
      id,
      parseInt(todoLocation[0]),
      parseInt(todoLocation[1])
    );
  }
};

const Project = () => {
  const { project }: { project: Projects } = useLoaderData();
  const [isFav, setFav] = useState(project.favorite ? true : false);
  const [showNotification, setShowNotification] = useState(false);
  const {
    removed_task,
    key,
  }: { removed_task: Task | undefined; key: number | undefined } =
    useActionData() ?? {};
  const [deletedTasks, setDeletedTasks] = useState<
    { removed_task: Task; key: number }[]
  >([]);

  useEffect(() => {
    if (removed_task && key) {
      deletedTasks.push({ removed_task, key });
      setShowNotification(true);
    }
    const removeNotification = setTimeout(() => {
      setShowNotification(false);
    }, 5000);
    return () => {
      setShowNotification(false);
      clearTimeout(removeNotification);
    };
  }, [removed_task]);

  async function restoreLastDeletedTask(task: Task, index: number) {
    project.tasks.splice(index, 0, task);
    await editTask(project.id, index, task);
    setDeletedTasks((state) => {
      state.pop();
      return state;
    });
  }

  return (
    <div className="project">
      <div className="project-title">
        <h2>{project.name}</h2>
        <Form method="post">
          <button
            type="submit"
            title="mark as favorite"
            name="action"
            value="toggle favorite"
            className="set-fav-btn"
            onClick={() => {
              setFav(!isFav);
            }}
          >
            <img src={isFav ? FavSVG : UnFavSVG} />
          </button>
          <button
            type="submit"
            name="action"
            value="edit project"
            title="Change title or description"
            className="project-edit"
          >
            <img src={EditSVG} />
          </button>
          <button
            type="submit"
            name="action"
            value="delete project"
            title="Delete this project"
            className="project-delete"
          >
            <img src={DeleteSVG} />
          </button>
        </Form>
      </div>
      <p className="project-description">
        {project.description && (
          <>
            Description: <br />
            {project.description}
          </>
        )}
      </p>
      <div>
        <Tasks tasks={project.tasks} />
      </div>
      <Outlet />
      {showNotification && (
        <ActionNotifcation
          content={{ message: "Task Deleted" }}
          action={{
            name: "Undo",
            execute: () => {
              const { removed_task, key } = deletedTasks.splice(-1)[0];
              restoreLastDeletedTask(removed_task, key);
            },
          }}
        />
      )}
    </div>
  );
};

export default Project;

const Tasks = ({ tasks }: { tasks: Task[] | undefined }) => {
  return (
    <div className="task-container">
      <Form method="post">
        <button
          type="submit"
          name="action"
          value="new task"
          className="new-task-btn"
          title="Add a task"
        >
          <img src={AddSVG} />
        </button>
      </Form>
      <div className="project-tasks">
        {tasks && tasks.length ? (
          tasks.map((task, key) => (
            <TaskCard task={task} key={key} index={key} />
          ))
        ) : (
          <em>No tasks for this project.</em>
        )}
      </div>
    </div>
  );
};

const TaskCard = ({ task, index }: { task: Task; index: number }) => {
  const [magicStyle, setMagicStyle] = useState("magictime swashIn");
  const [gridRow, setGridRow] = useState("");
  const [hasCompletedTodos, setHasCompletedTodos] = useState(false);
  // change the span of task cards depending on their length
  useEffect(() => {
    const this_card = document.querySelectorAll(".task-card")[index];
    const height = parseInt(getComputedStyle(this_card).height);
    const span_ratio = parseInt((height / 100).toString());
    setGridRow(`span ${span_ratio > 2 ? span_ratio - 1 : span_ratio}`);
  }, [task, index]);

  useEffect(() => {
    let completed_todos = task.todos.filter(
      (todo) => todo.status === TodoStatus.DONE
    );
    completed_todos.length
      ? setHasCompletedTodos(true)
      : setHasCompletedTodos(false);
  }, [task.todos]);

  return (
    <div
      className={`task-card ${magicStyle}`}
      key={index}
      style={{
        gridRow: gridRow,
      }}
    >
      <h2>{task.name}</h2>
      <div>{task.deadline?.toLocaleString()}</div>
      <ul className="todos">
        {task.todos && task.todos.length ? (
          task.todos.map((todo, key) => {
            if (todo.status === TodoStatus.AWAITING) {
              return (
                <TodoComponent
                  todo={todo}
                  key={key}
                  index={key}
                  parent={index}
                />
              );
            }
          })
        ) : (
          <em>No awaiting Todos.</em>
        )}

        {hasCompletedTodos && <h5>Completed Todos: </h5>}
        {task.todos && task.todos.length ? (
          task.todos.map((todo, key) => {
            if (todo.status === TodoStatus.DONE) {
              return (
                <TodoComponent
                  todo={todo}
                  key={key}
                  index={key}
                  parent={index}
                />
              );
            }
            return null;
          })
        ) : (
          <></>
        )}
      </ul>
      <Form method="post" className="task-actions">
        <button
          type="submit"
          name="editTask"
          value={index}
          className="edit-task-btn"
        >
          <img src={EditSVG} />
        </button>
        <button
          type="submit"
          name="deleteTask"
          value={index}
          className="delete-task-btn"
          onClick={() => {
            setMagicStyle("magictime holeOut");
            setTimeout(() => {
              setMagicStyle("magictime");
            }, 200);
          }}
        >
          <img src={DeleteSVG} />
        </button>
      </Form>
    </div>
  );
};

const TodoComponent = ({
  todo,
  index,
  parent,
}: {
  todo: Todo;
  index: number;
  parent: number;
}) => {
  return (
    <li>
      <span>{todo.content}</span>
      <span>
        {todo.status === TodoStatus.AWAITING ? (
          <Form method="post">
            <button
              type="submit"
              name="markTodo"
              title="Mark as done"
              value={[parent.toString(), index.toString()]}
              className="mark-todo-done-btn"
            >
              <img src={DoneSVG} />
            </button>
          </Form>
        ) : null}
      </span>
    </li>
  );
};
