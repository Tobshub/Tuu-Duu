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
  editProject,
  getProject,
  setFavorite,
} from "../../dummyDB";
import { Projects, ToDos } from "../../types/project";
import EditSVG from "../../assets/Edit.svg";
import DeleteSVG from "../../assets/Delete.svg";
import FavSVG from "../../assets/Star_filled.svg";
import UnFavSVG from "../../assets/Star_blank.svg";
import { useState } from "react";

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
  if (formData.delete) {
    await deleteProject(id);
    return redirect("/");
  } else if (formData.fav) {
    if (!id) return;
    await setFavorite(id);
    return redirect(`/projects/${id}`);
  } else if (formData.edit) {
    return redirect(`/projects/${id}/edit`);
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
      <div className="project-todos">
        <Outlet />
      </div>
    </div>
  );
};

export default Project;
