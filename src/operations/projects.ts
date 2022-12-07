import axios from "axios";
import env from "../../env.json"
import { getCurrentUser } from "./user";
import Project from "../types/project";
import { GetProjectsServerResponse, SyncServerResponse } from "../types/server-response";

const axiosConfig = {
  headers: {
    "Content-Type": "application/json; encoding=utf-8",
    "Access-Control-Allow-Origin": "*"
  },
  method: "cors",
  timeout: 3000, // use timeout config incase the server is spun down
}

export const syncProjects = async (projects: Project[], config? : string) => {
  if (!projects) return;
  try {
    const user = await getCurrentUser();
      if (!user || !user._id) return
      const sync_resources = {
        user_projects: projects,
        user_id: user._id,
        config,
      };
  
    const sync_url = `${env.REACT_APP_TUU_DUU_API}/user/sync_projects`;

    const sync_results = await axios.put(sync_url, sync_resources, axiosConfig).then(data => data.data).then((res: SyncServerResponse) => res).catch((e) => console.error(e));
  
    // console.log({sync_results}) 

    if (!sync_results) return sync_resources.user_projects;
    return sync_results.projects;
  } catch (error) {
   console.error(error);
   return;
  }
}

export const addProject = async (project: Project) => {
  const {_id } = await getCurrentUser();
  if (!_id) return;
  try {
    const req_url = `${env.REACT_APP_TUU_DUU_API}/user/projects`;
    const req_body = {
      _id,
      project_data: project,
    }
    const response = await axios.post(req_url, req_body, axiosConfig).then(value => value.data).then((res: GetProjectsServerResponse) => res).catch(e => console.error(e));

    return response && response.success
  } catch (error) {
    console.error(error);
    return;
  }
}

export const getProjects = async () => {
  const _id = await getCurrentUser().then(user => user? user._id : false);
  if (!_id ) return;
  try {
    const req_url = `${env.REACT_APP_TUU_DUU_API}/user/projects?_id=${_id}`;
    const projects = await axios.get(req_url, axiosConfig).then(value => value.data)
    .then((res: GetProjectsServerResponse) => res.projects).catch(e => console.error(e))
    
    return (projects && projects.length)? projects : [];  
  } catch (error) {
    console.error(error);
    return;
  }
}

export const getProject = async (project_id: string) => {
  const {_id} = await getCurrentUser();
  try {
    const req_url = `${env.REACT_APP_TUU_DUU_API}/user/projects/${project_id}?_id=${_id}`;
    const project = await axios.get(req_url, axiosConfig)
    .then(value => value.data).then((res: GetProjectsServerResponse) => res.projects).catch(e => console.error(e));

    return (project && project.length)? project[0] : null;
  } catch (error) {
    console.error(error);
    return;
  }
}

export const editProject = async (data: Project) => {
  const {_id } = await getCurrentUser();
  try {
    const req_url = `${env.REACT_APP_TUU_DUU_API}/user/projects`;
    const req_body = {
      _id,
      project_data: data,
    }
    const request = await axios.put(req_url, req_body, axiosConfig).then(value => value.data).then((res: GetProjectsServerResponse) => res).catch(e => console.error(e));

    return request && request.success;
  } catch (error) {
    console.error(error);
    return;
  }
}

export const deleteProject = async (project_id: Project["id"]) => {
  const {_id } = await getCurrentUser();
  try {
    const req_url = `${env.REACT_APP_TUU_DUU_API}/user/projects?_id=${_id}&project_id=${project_id}`;
    const response = await  axios.delete(req_url, axiosConfig).then(value => value.data).then((res: GetProjectsServerResponse) => res.projects).catch(e => console.error(e));

    return (response && response.length)? response : [];
  } catch (error) {
    console.error(error);
    return;
  }
}
