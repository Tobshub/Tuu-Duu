import useApi from "@utils/axios";
import { getCurrentUser } from "./user";
import { is, cast } from "ts-safe-cast";
import { AxiosError } from "axios";

export const addProject = async (project: Project) => {
  const { _id } = (await getCurrentUser()) ?? {};
  try {
    if (!_id) {
      throw new Error("no user id found");
    }
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

    return response && response.success ? response.projects : false;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getProjects = async () => {
  const { _id } = (await getCurrentUser()) ?? {};
  try {
    if (!_id) {
      throw new Error("no user id found");
    }
    const req_url = "/user/projects";
    const projects = await useApi
      .get(req_url, {
        params: {
          _id,
        },
      })
      .then(value => value.data)
      .then((res: GetProjectsServerResponse) => {
        interface T extends Project {
          _id: string;
        }
        if (!is<T[]>(res.projects)) {
          console.warn("Invalid data structure", res.projects);
          return res.projects;
        }
        return res.projects;
      })
      .catch((e: AxiosError) => {
        console.error(e);
        return null;
      });

    return projects && projects.length ? projects : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const editProject = async (data: Project) => {
  const { _id } = (await getCurrentUser()) ?? {};
  try {
    if (!_id) {
      throw new Error("no user id found");
    }
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

    return request && request.success ? request.projects : false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const deleteProject = async (project_id: Project["id"]) => {
  const { _id } = (await getCurrentUser()) ?? {};
  try {
    if (!_id) {
      throw new Error("no user id found");
    }
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
