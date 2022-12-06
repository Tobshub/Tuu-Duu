import { generateId } from "../operations/user";

type ProjectProps = {
  name: string;
  description?: string;
  id?: string;
  tasks?: Task[];
  favorite?: boolean;
}

export default class Project {
  name: string;
  description: string;
  id: string;
  tasks: Task[];
  favorite: boolean;

  constructor({name, description, id, favorite, tasks}: ProjectProps) {
    this.name = name;
    this.description = description ?? '';
    this.id = id ?? generateId();
    this.favorite = favorite ?? false;
    this.tasks = tasks ?? [];
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