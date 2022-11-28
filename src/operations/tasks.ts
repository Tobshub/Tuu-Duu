import { Task, DeletedTask, Todo, TodoStatus } from "../types/project";
import { getProject, editProject } from "./projects";


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
