import localforage from "localforage";
import axios from "axios";
import { DeletedTask, Projects, Task, Todo, TodoStatus } from "./types/project";
import { AppUser, LoginServerResponse, SyncServerResponse } from "./types/server-response";
import { SavedUser } from "./types/user-context";


export const setUser = async ({_id, username, email}: SavedUser) => {
  if (!_id || !username || !email) return;

  const res = await localforage.setItem("user_details", {_id, username, email}, (err, value) => {
    if (err) {
      console.error(err);
      return false;
    }
    return value;
  })
  return res;
}

export const removeUser = async () => {
  const res = await localforage.removeItem("user_details", (err) => {
    if (err) {
      console.error(err);
      return false;
    }
    return true;
  })
  return res;
}

export const getCurrentUser = async () => {
  const user_details = await localforage.getItem("user_details", (err, value: SavedUser) => {
    if (err || !value || (value && !value._id)) {
      err ? console.error(err) : null;
      return false;
    }
    return value;
  })
  return user_details; 
}


export const addProject = async (project: Projects) => {
  let projects: Projects[] = JSON.parse(sessionStorage.getItem('projects'));
  project.last_save = new Date().getTime();
  projects ? projects.push(project) : projects = [project];

  sessionStorage.setItem('projects', JSON.stringify(projects));
}


export const getProjects = (): Projects[] | null => {
  try {
    const projects: (Projects[] | null) = JSON.parse(sessionStorage.getItem("projects"));
    return (projects && projects.length)? projects : [];  
  } catch (error) {
    return null;
  }
}

const getProjectIndex = async (id: string, db?: (Projects[] | null)): Promise<number | null> => {
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

export const getProject = async (id: (string | undefined)): Promise<Projects | null> => {
  if (!id) return null;
  const projects = getProjects();
  const index = await getProjectIndex(id, projects);
  const project = (projects && index !== null)? projects[index] : null;
  return project;
}

export const editProject = async (data: Projects, id: string) => {
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

export const getDeletedTasks = async () : Promise<DeletedTask[]> => {
  const task_store = sessionStorage.getItem("deleted_tasks");
  if (!task_store) return;
  return JSON.parse(task_store);
}

export const setDeletedTasks = async (deleted_tasks: DeletedTask[]) => {
  sessionStorage.setItem("deleted_tasks", JSON.stringify(deleted_tasks))
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
  const [task] = taskList.splice(index, 1);
  project.tasks = taskList;
  await editProject(project, id);
  await addToDeletedTasks(id, task, index);
  return task;
}

export const addToDeletedTasks = async (id: string, task: Task, original_index: number) => {
  const deleted_task: DeletedTask = {project_id: id, task_content: task, original_index};
  const deleted_tasks = await getDeletedTasks() ?? [];
  
  deleted_tasks.push(deleted_task);
  setDeletedTasks(deleted_tasks)
  
  return;
}


export const restoreLastTask = async () => {
  const deleted_tasks = await getDeletedTasks();
  const [last_deleted] = deleted_tasks.splice(-1);
  const project = await getProject(last_deleted.project_id);
  if (!project) return;
  project.tasks.splice(last_deleted.original_index, 0, last_deleted.task_content);
  editProject(project, last_deleted.project_id)
  setDeletedTasks(deleted_tasks)
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


export const syncProjects = async (config? : string) => {
  const user = await getCurrentUser();
  if (!user || !user._id) return getProjects();
  const sync_resources = {
      user_projects: getProjects(),
      user_id: user._id,
      config,
  };
  
  const sync_url = "https://tuu-duu-api.onrender.com/api/user/sync_projects";

  const sync_results = await axios.put(sync_url, sync_resources, {
    headers: {
      "Content-Type": "application/json; encoding=utf-8",
      "Access-Control-Allow-Origin": "*"
    },
    method: "cors",
    timeout: 1500, // use timeout config incase the server is spun down
  }).then(data => data.data).then((res: SyncServerResponse) => res).catch((e) => console.error(e));
  
  // console.log({sync_results}) 

  if (!sync_results) return sync_resources.user_projects;

  sessionStorage.setItem("projects", JSON.stringify(sync_results.projects));
  return sync_results.projects;
}