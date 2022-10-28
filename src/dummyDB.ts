import localforage from "localforage";
import { Projects, Task } from "./types/project";


export const addProject = async (project: Projects) => {
  await 
    localforage.getItem(
      'projects',
      (error, value: (Projects[] | null)) => {
        value? value.push(project) : value = [project];
        localforage.setItem('projects', value);
      }  
    )

    return 0;
}


export const getProjects = async (): Promise<Projects[] | null> => {
  let projects: (Projects[] | null) = await localforage.getItem('projects');
  return projects;
}

const getProjectIndex = async (id: string, db?: (Projects[] | null)): Promise<number | null> => {
  let projects = (db)? db : await getProjects();
  if ( projects && projects.length) {
    for(let i = 0; i < projects.length; i++) {
      if (projects[i].id === id) {
        return i;
      }
    }
  }
  return null;
}

export const getProject = async (id: (string | undefined)): Promise<Projects | null> => {
  if (!id) return null;
  const projects = await getProjects();
  const index = await getProjectIndex(id, projects);
  const project = (projects && index !== null)? projects[index] : null;
  return project;
}

export const editProject = async (data: Projects, id: string) => {
  const projects = await getProjects();
  const index = await getProjectIndex(id, projects);
  (projects && index !== null)? projects[index] = data : null;
  localforage.setItem('projects', projects);
}

export const setFavorite = async (id: string) => {
  const projects = await getProjects();
  const index = await getProjectIndex(id, projects);
  if (projects && index !== null) {
    (projects[index].favorite)? projects[index].favorite = false : projects[index].favorite = true;
    localforage.setItem('projects', projects)
    return projects[index].favorite;
  } 
  return null;
}

export const deleteProject = async (id: (string | undefined)) => {
  if(!id) return null;
  const projects = await getProjects();
  if(!projects || !projects.length) return null;
  const index = await getProjectIndex(id, projects);
  if(index === null) {
    console.log('project does not exists in database')
    return null};
  const removed = (projects && index !== null)? projects.splice(index, 1) : null;
  
  localforage.setItem('projects', projects);
}

export const addTask = async (id: string, task: Task) => {
  const project = await getProject(id);
  project?.tasks?.push(task);
  if (!project) return;
  await editProject(project, id);
  return;
}