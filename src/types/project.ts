import { generateId } from "../operations/user";

export default class Project {
  name: string;
  description: string;
  id: string;
  tasks: Task[];
  favorite: boolean;
  last_save: number;

  constructor(name: string, description: string, id?: string, tasks?: Task[], favorite?: boolean) {
    this.name = name;
    this.description = description;
    this.id = id ?? generateId();
    this.favorite = favorite ?? false;
    this.tasks = tasks ?? [];
    this.last_save = new Date().getTime();
  }
}

export interface Task {
  name: string,
  status?: TaskStatus,
  todos?: Todo[],
  deadline?: Date;
}

export enum TaskStatus {
  IDLE = 'idle',
  IN_PROGRESS = 'in progess',
  COMPLETE = 'completed',
}

export interface Todo {
  content: string,
  status?: TodoStatus
}


export enum TodoStatus {
  AWAITING = "awaiting",
  DONE = "completed"
}

export interface DeletedTask {
  project_id: string,
  task_content: Task,
  original_index: number
}