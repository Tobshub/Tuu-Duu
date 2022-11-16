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
  getCurrentUser,
  getProject,
  getProjects,
  markTodo,
  restoreTask,
  setFavorite,
} from "../../dummyDB";
import { Projects, Task } from "../../types/project";
import EditSVG from "../../images/Edit.svg";
import DeleteSVG from "../../images/Delete.svg";
import FavSVG from "../../images/Star_filled.svg";
import UnFavSVG from "../../images/Star_blank.svg";
import AddSVG from "../../images/Add.svg";
import React, { useContext, useEffect, useState } from "react";
import "../task-routes/tasks.css";
import ActionNotifcation from "../app-notifications/action-notifcation";
import TaskCard from "../task-routes/task-card";
import { UserCreds } from "../../types/user-context";
import { UserCredentails } from "../root";

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
    await markTodo(id, parseInt(todoLocation[0]), parseInt(todoLocation[1]));
  }
};

const Project = () => {
  const { project }: { project: Projects } = useLoaderData();
  const [isFav, setFav] = useState(project.favorite ? true : false);
  const [showNotification, setShowNotification] = useState(false);
  const recent_delete: {
    removed_task: Task | undefined;
    key: number | undefined;
  } = useActionData() ?? {};
  const [deletedTasks, setDeletedTasks] = useState<
    { removed_task: Task; key: number }[]
  >([]);
  const user_credentials = useContext<UserCreds>(UserCredentails);

  useEffect(() => {
    if (recent_delete.removed_task) {
      deletedTasks.push(recent_delete);
      setShowNotification(true);
    }
    const removeNotification = setTimeout(() => {
      setShowNotification(false);
    }, 5000);
    return () => {
      setShowNotification(false);
      clearTimeout(removeNotification);
    };
  }, [recent_delete, deletedTasks]);

  async function restoreLastDeletedTask(task: Task, index: number) {
    project.tasks.splice(index, 0, task);
    await editTask(project.id, index, task);
    setDeletedTasks((state) => {
      state.pop();
      return state;
    });
    setShowNotification(false);
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
            name: "Undo delete",
            target: "Task",
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
