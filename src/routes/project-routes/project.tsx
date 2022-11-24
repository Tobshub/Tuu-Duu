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
  restoreLastTask,
  setFavorite,
} from "../../localDB";
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
      case "toggle_favorite":
        await setFavorite(id);
        break;
      case "edit_project":
        return redirect(`/projects/${id}/edit`);
      case "delete_project":
        await deleteProject(id);
        return redirect("/?sync_config=overwrite");
      case "new_task":
        return redirect(`/projects/${id}/tasks/new`);
      case "revert_action":
        await restoreLastTask();
        return;
      default:
        console.log("no action set for that");
        break;
    }
  } else if (formData.editTask) {
    const key = formData.editTask;
    return redirect(`/projects/${id}/tasks/${key}/edit`);
  } else if (formData.deleteTask) {
    const key = parseInt(formData.deleteTask.toString());
    await deleteTask(id, key);
  } else if (formData.markTodo) {
    const [task_index, todo_index] = formData.markTodo.toString().split(",");
    await markTodo(id, parseInt(task_index), parseInt(todo_index));
  }
};

const Project = () => {
  const { project }: { project: Projects } = useLoaderData();
  const [isFav, setFav] = useState(project.favorite ? true : false);
  const [showNotification, setShowNotification] = useState(false);
  const user_credentials = useContext<UserCreds>(UserCredentails);

  useEffect(() => {
    const removeNotification = setTimeout(
      () => setShowNotification(false),
      5000
    );
    return () => {
      clearTimeout(removeNotification);
    };
  }, [project]);

  return (
    <div className="project">
      <div className="project-title">
        <h2>{project.name}</h2>
        <Form method="post">
          <button
            type="submit"
            title="mark as favorite"
            name="action"
            value="toggle_favorite"
            className="set-fav-btn"
            onClick={() => {
              setFav(!isFav);
            }}
          >
            <img
              src={isFav ? FavSVG : UnFavSVG}
              alt="Toggle Favorite"
              loading="lazy"
            />
          </button>
          <button
            type="submit"
            name="action"
            value="edit_project"
            title="Change title or description"
            className="project-edit"
          >
            <img src={EditSVG} alt="Edit project" loading="lazy" />
          </button>
          <button
            type="submit"
            name="action"
            value="delete_project"
            title="Delete this project"
            className="project-delete"
          >
            <img src={DeleteSVG} alt="Delete project" loading="lazy" />
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
        <Tasks
          tasks={project.tasks}
          delete_action={() => setShowNotification(true)}
        />
      </div>
      <Outlet />
      {showNotification && (
        <ActionNotifcation
          content={{ message: "Task Deleted" }}
          action={{
            name: "Undo",
            target: "Task",
            execute: () => {
              setShowNotification(false);
            },
          }}
        />
      )}
    </div>
  );
};

export default Project;

const Tasks = ({
  tasks,
  delete_action,
}: {
  tasks: Task[] | undefined;
  delete_action: () => void;
}) => {
  return (
    <div className="task-container">
      <Form method="post">
        <button
          type="submit"
          name="action"
          value="new_task"
          className="new-task-btn"
          title="Add a task"
        >
          <img src={AddSVG} alt="New task" loading="lazy" />
        </button>
      </Form>
      <div className="project-tasks">
        {tasks && tasks.length ? (
          tasks.map((task, key) => (
            <TaskCard
              task={task}
              key={key}
              index={key}
              delete_action={delete_action}
            />
          ))
        ) : (
          <em>No tasks for this project.</em>
        )}
      </div>
    </div>
  );
};
