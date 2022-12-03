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
  getProject,
  setFavorite,
} from "../../operations/projects";
import { deleteTask, markTodo, restoreLastTask } from "../../operations/tasks";
import Project, { Task } from "../../types/project";
import EditSVG from "../../images/Edit.svg";
import DeleteSVG from "../../images/Delete.svg";
import FavSVG from "../../images/Star_filled.svg";
import UnFavSVG from "../../images/Star_blank.svg";
import AddSVG from "../../images/Add.svg";
import React, { useContext, useEffect, useMemo, useState } from "react";
import "../task-routes/tasks.css";
import ActionNotifcation from "../app-notifications/action-notifcation";
import TaskCard from "../task-routes/task-card";
import { UserCreds } from "../../types/user-context";
import { OrgProject } from "../../types/orgs";
import ActionButton from "../components/action-button";

export const loader = async ({ params }: { params: Params<string> }) => {
  const id = params.projectId;
  const project = await getProject(id);
  if (!project)
    throw new Error("Invalid project-ID or problem while retrieving Project");
  return project;
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
  return;
};

const ProjectPage = ({
  load_project,
}: {
  load_project?: Project | OrgProject;
}) => {
  const project = load_project ?? useLoaderData();
  const [isFav, setFav] = useState(
    typeof project === "object" && "favorite" in project
      ? project.favorite
      : false
  );
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!showNotification) return () => {};
    const removeNotification = setTimeout(
      () => setShowNotification(false),
      5000
    );
    return () => {
      clearTimeout(removeNotification);
    };
  }, [project]);

  useMemo(() => {
    setFav(
      typeof project === "object" && "favorite" in project && project.favorite
        ? true
        : false
    );
  }, [project]);

  return (
    <div className="project">
      <div className="project-title">
        <h2>
          {typeof project === "object" && "name" in project
            ? project.name.toString()
            : ""}
        </h2>
        <Form method="post">
          <ActionButton
            title={isFav ? "unfavorite project" : "favorite project"}
            value="toggle_favorite"
            className="set-fav-btn"
            onClick={() => {
              setFav(!isFav);
            }}
            icon={isFav ? FavSVG : UnFavSVG}
            icon_alt="Toggle Favorite"
          />
          <ActionButton
            value="edit_project"
            title="Change title or description"
            className="project-edit"
            icon={EditSVG}
            icon_alt="Edit Project"
            islazy={true}
          />
          <ActionButton
            value="delete_project"
            title="Delete this project"
            className="project-delete"
            icon={DeleteSVG}
            icon_alt="Delete project"
            islazy={true}
          />
        </Form>
      </div>
      <p className="project-description">
        {typeof project === "object" &&
          "description" in project &&
          project.description && (
            <>
              Description: <br />
              {project.description.toString()}
            </>
          )}
      </p>
      <div>
        {typeof project === "object" &&
          "tasks" in project &&
          Array.isArray(project.tasks) && (
            <Tasks
              tasks={project.tasks}
              delete_action={() => setShowNotification(true)}
            />
          )}
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

export default ProjectPage;

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
        <ActionButton
          value="new_task"
          className="new-task-btn"
          title="Add a task"
          icon={AddSVG}
          icon_alt="New task"
          islazy={true}
        />
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
