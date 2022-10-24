export interface Projects {
  name: string,
  description: string,
  id?: string,
  favorite?: boolean,
  ToDos?: ToDos[],
}

export interface ToDos {
  title: string,
  content: string,
  status: ToDoStatus,
}

export enum ToDoStatus {
  IDLE = 'idle',
  IN_PROGRESS = 'in progess',
  COMPLETE = 'completed',
}