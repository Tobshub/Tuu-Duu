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
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import SuspensePage from "pages/suspense-page";

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
  const project_id = useLoaderData() as string;

  const {
    data: projects,
    error,
    isLoading,
  } = useQuery<Project[]>("projects");

  if (!projects && !isLoading) {
    throw new Error("This user may have no projects");
  }

  const project = projects?.find(project => project.id === project_id);

  if (!project && !isLoading) {
    throw new Error("This project may no longer exists");
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
    if (project) {
      setFav(project.favorite);
    }
  }, [project?.id]);

  const projectQueryClient = useQueryClient();
  const editProjectMutation = useMutation(editProject, {
    onSuccess: data => {
      if (data) {
        projectQueryClient.setQueryData("projects", data);
      }
    },
  });

  function deleteTask(task_id: string) {
    if (project) {
      const original_index = project.tasks.findIndex(
        task => task.id === task_id
      );
      const deleted_task_content = project.tasks.splice(
        original_index,
        1
      )[0];
      const deleted_task: DeletedTask = {
        project_id: project.id,
        original_index: original_index,
        task_content: deleted_task_content,
      };

      editProjectMutation.mutateAsync(project).then(res => {
        if (res) {
          projectQueryClient.setQueryData("deleted_task", deleted_task);
          setShowNotification(true);
        }
      });
      return deleted_task;
    }
  }

  const { data: last_deleted_task } = useQuery<DeletedTask>({
    queryKey: "deleted_task",
  });

  async function restoreDeletedTask() {
    if (project && last_deleted_task) {
      project.tasks.splice(
        last_deleted_task.original_index,
        0,
        last_deleted_task.task_content
      );
      await editProjectMutation.mutateAsync(project).then(res => {
        if (res) {
          projectQueryClient.setQueryData("deleted_task", undefined);
        }
      });
    }
  }

  const navigate = useNavigate();

  if (error) {
    throw error;
  }
  if (isLoading) {
    return <SuspensePage />;
  }

  return (
    <div className="project">
      <div className="project-title">
        <h1 className="display-5 m-1">{project?.name}</h1>
        <Form method="post">
          <ActionButton
            type="button"
            title={isFav ? "unfavorite project" : "favorite project"}
            value="toggle_favorite"
            className="set-fav-btn"
            onClick={async () => {
              setFav(state => !state);
              if (project) {
                project.favorite = !project.favorite;
                await editProject(project);
              }
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
          <Tasks project={project} deleteTask={deleteTask} />
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
              restoreDeletedTask().then(() => setShowNotification(false));
            },
            nextAction: e => {
              e.preventDefault();
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
        {project.tasks && project.tasks.length ? (
          project.tasks.map(task => (
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
