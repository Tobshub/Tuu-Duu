import localforage from "localforage";
import { Projects, ToDos } from "./types/project";


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
  if(index === null) return null;
  const removed = (projects && index !== null)? projects.splice(index, 1) : null;
  
  localforage.setItem('projects', projects);
  const switchToProjects = (index > 0)? projects[index - 1].id : projects[index + 1].id;
  return switchToProjects;
}

export const addTodos = async (id: (string | undefined), data: ToDos) => {
  if (!id) return;
  const projects = await getProjects();
  const index = await getProjectIndex(id, projects);
  if (!projects || !projects.length || index === null) return;
  if (projects[index].ToDos !== undefined) {
    projects[index].ToDos?.push(data);
  } else {
    projects[index].ToDos = [data];
  }
  await editProject(projects[index], id);
  return;
}

export const editTodo = async (id: string, key: number, data: ToDos) => {
  const projects = await getProjects();
  const index = await getProjectIndex(id, projects);
  if (!projects || index === null) return;
  const todos = projects[index].ToDos;
  todos? todos[key] = data : null;
  projects[index].ToDos = todos;
  await editProject(projects[index], id);
  return;
}

export const deleteTodo = async (id: (string), key: number) => {
  const projects = await getProjects();
  const index = await getProjectIndex(id, projects);
  if (!projects || index === null) return;
  const todosArr = projects[index].ToDos;
  todosArr?.splice(key, 1);
  projects[index].ToDos = todosArr;
  await editProject(projects[index], id);
  return;
}

export const getTodo = async (id: string, key: number): Promise<ToDos | undefined> =>  {
  const project = await getProject(id);
  const todos = project?.ToDos;
  if (!todos) return;
  return todos[key];
}