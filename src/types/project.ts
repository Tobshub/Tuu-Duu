export interface Projects {
  name: string,
  description: string,
  id: string,
  tasks: Task[],
  favorite?: boolean,
  last_save?: number,
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