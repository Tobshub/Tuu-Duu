import {
  Outlet,
  redirect,
  useLoaderData,
  Form,
  useNavigate,
  Params,
  useActionData,
  useLocation,
} from "react-router-dom";
import {
  deleteProject,
  editProject,
  getProject,
  getProjects,
} from "../../operations/projects";
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
import { useQuery } from "react-query";

export const loader = async ({ params }: { params: Params<string> }) => {
  const id = params.projectId;
  return id;
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
      case "edit_project":
        return redirect(`/projects/${id}/edit`);
      case "delete_project":
        return redirect(`/projects/${id}/delete`);
      case "new_task":
        return redirect(`/projects/${id}/tasks/new`);
      // case "revert_action":
      //   await restoreLastTask();
      // return;
      default:
        console.log("no action set for that");
        break;
    }
  } else if (formData.editTask) {
    const key = formData.editTask;
    return redirect(`/projects/${id}/tasks/${key}/edit`);
  }
  return;
};

const ProjectPage = () => {
  const project_id = useLoaderData().toString();
  const location = useLocation();

  const {
    data: projects,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: "projects",
    queryFn: () => getProjects(),
    enabled: false,
  });

  if (location.state && location.state.shouldRefetch) {
    refetch({ queryKey: "projects" });
    location.state = {};
  }

  const project = projects?.find((project) => project.id === project_id);

  if (!project) {
    refetch({ queryKey: "projects" });
  }

  const [isFav, setFav] = useState(project?.favorite ?? false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!showNotification) return () => { };
    const removeNotification = setTimeout(
      () => setShowNotification(false),
      5000
    );
    return () => {
      clearTimeout(removeNotification);
    };
  }, [project]);

  useMemo(() => {
    setFav(project?.favorite);
  }, [project?.id]);

  function deleteTask(index: number) {
    project.tasks.splice(index, 1);
    editProject(project);
  }

  if (error) throw new Error(error.toString());
  if (isLoading) return <>Loading...</>;

  return (
    <div className="project">
      <div className="project-title">
        <h2>{project?.name}</h2>
        <Form method="post">
          <ActionButton
            type="button"
            title={isFav ? "unfavorite project" : "favorite project"}
            value="toggle_favorite"
            className="set-fav-btn"
            onClick={async () => {
              setFav((state) => !state);
              project.favorite = !project.favorite;
              await editProject(project);
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
        {!!project && project.description && (
          <>
            Description: <br />
            {project.description.toString()}
          </>
        )}
      </p>
      <div>
        {!!project?.tasks && (
          <Tasks
            project={project}
            show_notification={() => setShowNotification(true)}
            deleteTask={(index: number) => deleteTask(index)}
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
  project,
  show_notification,
  deleteTask
}: {
  project: Project;
  show_notification: () => void;
  deleteTask: (index: number) => void
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
        {project.tasks && project.tasks.length ? (
          project.tasks.map((task, key) => (
            <TaskCard
              project={project}
              task={task}
              key={key}
              index={key}
              show_notification={show_notification}
              deleteFunction={() => deleteTask(key)}
            />
          ))
        ) : (
          <em>No tasks for this project.</em>
        )}
      </div>
    </div>
  );
};
