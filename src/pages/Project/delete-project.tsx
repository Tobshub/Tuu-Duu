import { useQuery } from "react-query";
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  Params,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { deleteProject, getProjects } from "@services/projects";

export async function loader({ params }: LoaderFunctionArgs) {
  const { projectId } = params;
  return projectId;
}

export async function action({ params, request }: ActionFunctionArgs) {
  const { projectId } = params;
  const res = await request.formData();
  const { action } = Object.fromEntries(res);

  if (action && action === "delete_project") {
    await deleteProject(projectId);
    return redirect("/");
  }
}

const DeleteProjectComponent = () => {
  const project_id = useLoaderData().toString();
  const { data: projects, error } = useQuery<Project[]>("projects");

  const project = projects.find(project => project.id === project_id);

  const navigate = useNavigate();

  if (error) throw new Error("error getting project");
  return (
    <div className="delete-project">
      <Form method="post">
        <h3>Are you sure you want to delete {project.name}?</h3>
        {!!project.favorite && <p>It's one of your favorites :(</p>}
        <button
          type="submit"
          className="btn btn-danger"
          name="action"
          value="delete_project"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={() => {
            navigate("..", { relative: "route" });
          }}
          className="btn btn-warning"
        >
          Back
        </button>
      </Form>
    </div>
  );
};

export default DeleteProjectComponent;
