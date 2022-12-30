import {
  Outlet,
  redirect,
  useLoaderData,
  Form,
  Params,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { editProject, getProjects } from "@services/projects";
import EditSVG from "@images/Edit.svg";
import DeleteSVG from "@images/Delete.svg";
import FavSVG from "@images/Star_filled.svg";
import UnFavSVG from "@images/Star_blank.svg";
import AddSVG from "@images/Add.svg";
import { useEffect, useMemo, useState } from "react";
import "@styles/tasks.css";
import ActionNotifcation from "@UIcomponents/action-notifcation";
import TaskCard from "./Task/task-card";
import ActionButton from "@UIcomponents/action-button";
import { useMutation, useQuery, useQueryClient } from "react-query";

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
      default:
        console.log("no action set for that");
        break;
    }
  } else if (formData.editTask) {
    const task_id = formData.editTask;
    return redirect(`/projects/${id}/tasks/${task_id}/edit`);
  }
  return;
};

const ProjectPage = () => {
  const project_id = useLoaderData().toString();

  const {
    data: projects,
    error,
    isLoading,
    refetch,
  } = useQuery<Project[]>("projects");

  const project = projects?.find(project => project.id === project_id);

  if (!project && !error) {
    refetch({ queryKey: "projects" });
  }

  const [isFav, setFav] = useState(project?.favorite ?? false);
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
    setFav(project?.favorite);
  }, [project?.id]);

  const projectQueryClient = useQueryClient();
  const deleteTaskMutation = useMutation(editProject, {
    onSuccess: data => {
      if (data) {
        projectQueryClient.setQueryData("projects", data);
      }
    },
  });
  function deleteTask(task_id: string) {
    project.tasks.splice(
      project.tasks.findIndex(task => task.id === task_id),
      1
    );
    deleteTaskMutation.mutateAsync(project).then(res => {
      if (res) {
        setShowNotification(true);
      }
    });
    return;
  }

  const navigate = useNavigate();

  if (error) throw error;
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
              setFav(state => !state);
              project.favorite = !project.favorite;
              await editProject(project);
            }}
            icon={isFav ? FavSVG : UnFavSVG}
            icon_alt="Toggle Favorite"
          />
          <ActionButton
            type="button"
            title="Change title or description"
            className="project-edit"
            icon={EditSVG}
            icon_alt="Edit Project"
            islazy={true}
            onClick={() => navigate("./edit")}
          />
          <ActionButton
            type="button"
            title="Delete this project"
            className="project-delete"
            icon={DeleteSVG}
            icon_alt="Delete project"
            islazy={true}
            onClick={() => navigate("./delete")}
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
            deleteTask={(task_id: string) => deleteTask(task_id)}
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
            execute: async () => {
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
  deleteTask,
}: {
  project: Project;
  deleteTask: (task_id: string) => void;
}) => {
  const [tasks, setTasks] = useState(project.tasks);

  useMemo(() => {
    setTasks(project.tasks);
  }, [project.tasks]);

  return (
    <div className="task-container">
      <Form action="./tasks/new">
        <ActionButton
          name=""
          className="new-task-btn"
          title="Add a task"
          icon={AddSVG}
          icon_alt="New task"
          islazy={true}
        />
      </Form>
      <div className="project-tasks">
        {tasks && tasks.length ? (
          tasks.map(task => (
            <TaskCard
              project={project}
              task={task}
              key={task.id}
              deleteFunction={() => deleteTask(task.id)}
            />
          ))
        ) : (
          <em>No tasks for this project.</em>
        )}
      </div>
    </div>
  );
};
