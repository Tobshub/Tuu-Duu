import localforage from "localforage";
import { Projects, Task, Todo, TodoStatus } from "./types/project";


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
  const delay = setTimeout(()=>{}, 200);
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

export const getTask = async (id: string, index: number) => {
  const project = await getProject(id);
  const task = project?.tasks? project.tasks[index] : null;
  return task;
}

export const editTask = async (id: string, index: number, data: Task) => {
  const project = await getProject(id);
  if (!project) return;
  const preEdit = project.tasks[index];
  const postEdit = {
    ...preEdit,
    ...data
  }
  project.tasks[index] = postEdit;
  await editProject(project, id);
  return;
}

export const deleteTask = async (id: string, index: number) => {
  const project = await getProject(id);
  if (!project) return;
  const taskList = project.tasks;
  if (!taskList) return;
  const task = taskList.splice(index, 1);
  project.tasks = taskList;
  await editProject(project, id);
  return task[0];
}

export const restoreTask = async (id: string, index: number, task: Task) => {
  const project = await getProject(id)
  if (!project) return;
  const taskList = project.tasks ?? [];
  taskList.splice(taskList.length >= index? index : taskList.length - 1, 0, task)
  project.tasks = taskList;
  await editProject(project, id);
}

export const addTodo = async (id: string, index: number, todo: Todo) => {
  const task = await getTask(id, index);
  if (!task) return;
  todo.status = TodoStatus.AWAITING;
  task.todos? task.todos.push(todo) : task.todos = [todo];
  await editTask(id, index, task);
  return;
}

export const markTodo = async (id: string, task_index: number, todo_index: number) => {
  const task = await getTask(id, task_index);
  if (!task) return;
  task.todos? task.todos[todo_index].status = TodoStatus.DONE : null;
  await editTask(id, task_index, task);
}