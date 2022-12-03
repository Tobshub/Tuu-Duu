import axios from "axios";
import env from "../../env.json"
import { getCurrentUser } from "./user";
import Project from "../types/project";
import { SyncServerResponse } from "../types/server-response";

export const syncProjects = async (config? : string) => {
  try {
    const user = await getCurrentUser();
      if (!user || !user._id) return getProjects();
      const sync_resources = {
        user_projects: getProjects(),
        user_id: user._id,
        config,
      };
  
    const sync_url = `${env.REACT_APP_TUU_DUU_API}/user/sync_projects`;

    const sync_results = await axios.put(sync_url, sync_resources, {
      headers: {
        "Content-Type": "application/json; encoding=utf-8",
        "Access-Control-Allow-Origin": "*"
      },
      method: "cors",
      timeout: 2000, // use timeout config incase the server is spun down
    }).then(data => data.data).then((res: SyncServerResponse) => res).catch((e) => console.error(e));
  
    // console.log({sync_results}) 

    if (!sync_results) return sync_resources.user_projects;

    sessionStorage.setItem("projects", JSON.stringify(sync_results.projects));
    return sync_results.projects;
  } catch (error) {
   console.error(error);
   return null;
  }
}



export const addProject = async (project: Project) => {
  let projects: Project[] = JSON.parse(sessionStorage.getItem('projects'));
  projects ? projects.push(project) : projects = [project];
  sessionStorage.setItem('projects', JSON.stringify(projects));
}

export const getProjects = (): Project[] | null => {
  try {
    const projects: (Project[] | null) = JSON.parse(sessionStorage.getItem("projects"));
    return (projects && projects.length)? projects : [];  
  } catch (error) {
    return null;
  }
}

const getProjectIndex = async (id: string, db?: (Project[] | null)): Promise<number | null> => {
  const projects = (db)? db : getProjects();
  if ( projects && projects.length) {
    for(let i = 0; i < projects.length; i++) {
      if (projects[i].id === id) {
        return i;
      }
    }
  }
  return null;
}

export const getProject = async (id: (string | undefined)): Promise<Project | null> => {
  if (!id) return null;
  const projects = getProjects();
  const index = await getProjectIndex(id, projects);
  const project = (projects && index !== null)? projects[index] : null;
  return project;
}

export const editProject = async (data: Project, id: string) => {
  const projects = getProjects();
  const index = await getProjectIndex(id, projects);
  data.last_save = new Date().getTime();
  (projects && index !== null)? projects[index] = data : null;
  sessionStorage.setItem('projects', JSON.stringify(projects));
  return projects[index];
}

export const setFavorite = async (id: string) => {
  const projects = getProjects();
  const index = await getProjectIndex(id, projects);
  if (!projects || index === null) return null;

  (projects[index].favorite)? projects[index].favorite = false : projects[index].favorite = true;
  projects[index].last_save = new Date().getTime();
  sessionStorage.setItem('projects', JSON.stringify(projects))
  return projects[index].favorite;
}

export const deleteProject = async (id: (string | undefined)) => {
  if(!id) return null;
  const projects = getProjects();
  if(!projects || !projects.length) return null;
  const index = await getProjectIndex(id, projects);
  if(index === null) return null;
  projects.splice(index, 1);
  sessionStorage.setItem('projects', JSON.stringify(projects));
}