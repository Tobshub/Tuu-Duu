import useApi from "@utils/axios";
import { getCurrentUser } from "./user";

export const addProject = async (project: Project) => {
  const { _id } = await getCurrentUser();
  if (!_id) return;
  try {
    const req_url = "/user/projects";
    const req_body = {
      _id,
      project_data: project,
    };
    const response = await useApi
      .post(req_url, req_body)
      .then(value => value.data)
      .then((res: GetProjectsServerResponse) => res)
      .catch(e => console.error(e));

    return response && response.success;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getProjects = async () => {
  const _id = await getCurrentUser().then(user =>
    user ? user._id : false
  );
  if (!_id) return;
  try {
    const req_url = "/user/projects";
    const projects = await useApi
      .get(req_url, {
        params: {
          _id,
        },
      })
      .then(value => value.data)
      .then((res: GetProjectsServerResponse) => res.projects)
      .catch(e => console.error(e));

    return projects && projects.length ? projects : [];
  } catch (error) {
    console.error(error);
    return;
  }
};

export const editProject = async (data: Project) => {
  const { _id } = await getCurrentUser();
  try {
    const req_url = `/user/projects`;
    const req_body = {
      _id,
      project_data: data,
    };
    const request = await useApi
      .put(req_url, req_body)
      .then(value => value.data)
      .then((res: GetProjectsServerResponse) => res)
      .catch(e => console.error(e));

    return request && request.success;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const deleteProject = async (project_id: Project["id"]) => {
  const { _id } = await getCurrentUser();
  try {
    const req_url = "/user/projects";
    const response = await useApi
      .delete(req_url, {
        params: {
          _id,
          project_id,
        },
      })
      .then(value => value.data)
      .then((res: GetProjectsServerResponse) => res.projects)
      .catch(e => console.error(e));

    return response && response.length ? response : [];
  } catch (error) {
    console.error(error);
    return false;
  }
};
