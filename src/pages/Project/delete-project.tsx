import { useMutation, useQuery, useQueryClient } from "react-query";
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
}

const DeleteProjectComponent = () => {
  const project_id = useLoaderData().toString();
  const { data: projects, error } = useQuery<Project[]>("projects");

  const project = projects.find(project => project.id === project_id);

  const navigate = useNavigate();
  const projectsQuery = useQueryClient();

  const deleteProjectMutation = useMutation(deleteProject, {
    onSuccess: data => {
      if (data) {
        projectsQuery.setQueryData("projects", data);
      }
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    deleteProjectMutation.mutate(project_id);
    navigate("/");
  }

  if (error) throw new Error("error getting project");
  return (
    <div className="delete-project">
      <Form
        method="post"
        onSubmit={handleSubmit}
      >
        <h3>Are you sure you want to delete {project.name}?</h3>
        {!!project.favorite && <p>It's one of your favorites :(</p>}
        <div
          className="alert alert-danger"
          style={{ padding: ".1rem .2rem" }}
        >
          Deleted projects are lost forever!
        </div>
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
