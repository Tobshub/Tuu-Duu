import {
  Outlet,
  redirect,
  useLoaderData,
  Form,
  useNavigate,
  Params,
} from "react-router-dom";
import {
  deleteProject,
  deleteTask,
  editProject,
  getProject,
  setFavorite,
} from "../../dummyDB";
import { Projects, Task } from "../../types/project";
import EditSVG from "../../images/Edit.svg";
import DeleteSVG from "../../images/Delete.svg";
import FavSVG from "../../images/Star_filled.svg";
import UnFavSVG from "../../images/Star_blank.svg";
import AddSVG from "../../images/Add.svg";
import { useEffect, useState } from "react";
import "../task-routes/tasks.css";

export const loader = async ({ params }: { params: Params<string> }) => {
  const id = params.projectId;
  const project = await getProject(id);
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
  if (formData.delete) {
    await deleteProject(id);
    return redirect("/");
  } else if (formData.fav) {
    await setFavorite(id);
    return redirect(`/projects/${id}`);
  } else if (formData.edit) {
    return redirect(`/projects/${id}/edit`);
  } else if (formData.new) {
    return redirect(`/projects/${id}/tasks/new`);
  } else if (formData.editTask) {
    const key = formData.editTask;
    return redirect(`/projects/${id}/tasks/${key}/edit`);
  } else if (formData.deleteTask) {
    const key = parseInt(formData.deleteTask.toString());
    await deleteTask(id, key);
  }
};

const Project = () => {
  const { project }: { project: Projects } = useLoaderData();
  const [isFav, setFav] = useState(project.favorite ? true : false);

  return (
    <div className="project">
      <div className="project-title">
        <h2>{project.name}</h2>
        <Form method="post">
          <button
            type="submit"
            name="fav"
            value={1}
            className="set-fav-btn"
            onClick={() => {
              setFav(!isFav);
            }}
          >
            <img src={isFav ? FavSVG : UnFavSVG} />
          </button>
          <button type="submit" name="edit" value={1} className="project-edit">
            <img src={EditSVG} />
          </button>
          <button
            type="submit"
            name="delete"
            value={1}
            className="project-delete"
          >
            <img src={DeleteSVG} />
          </button>
        </Form>
      </div>
      <p className="project-description">
        Description:
        <br /> {project.description}
      </p>
      <div className="task-container">
        <Tasks tasks={project.tasks} />
      </div>
      <Outlet />
    </div>
  );
};

export default Project;

const Tasks = ({ tasks }: { tasks: Task[] | undefined }) => {
  return (
    <div className="task-container">
      <Form method="post">
        <button type="submit" name="new" value={1} className="new-task-btn">
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

  return (
    <div className={"task-card" + " " + magicStyle} key={index}>
      <h2>{task.name}</h2>
      <div>{task.deadline?.toLocaleString()}</div>
      <ul className="todos">
        {task.todos && task.todos.length ? (
          task.todos.map((todo, key) => <li key={key}>{todo.content}</li>)
        ) : (
          <em>No todos yet.</em>
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
          onClick={(e) => {
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
