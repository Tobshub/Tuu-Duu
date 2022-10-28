export interface Projects {
  name: string,
  description: string,
  id?: string,
  favorite?: boolean,
  tasks?: Task[],
}

export interface Task {
  name: string,
  todos?: ToDo[],
  status: TaskStatus,
  deadline?: Date;
}

export interface ToDo {
  content: string,
}

export enum TaskStatus {
  IDLE = 'idle',
  IN_PROGRESS = 'in progess',
  COMPLETE = 'completed',
}