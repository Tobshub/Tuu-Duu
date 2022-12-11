import { Task, Todo, TodoStatus, TaskStatus } from "../types/project";


export const setTaskStatus = (task: Task) => {
  const [awaitingTodos, completedTodos] = filterTodos(task.todos);
  task.status = (awaitingTodos.length && completedTodos.length) ? TaskStatus.IN_PROGRESS : (completedTodos.length) ? TaskStatus.COMPLETE : TaskStatus.IDLE;
  return task.status;
}

function filterTodos(todos: Todo[]): Todo[][] {
  const awaitingTodos = [];
  const completedTodos = [];

  for (let todo of todos) {
    if (todo.status === TodoStatus.AWAITING) awaitingTodos.push(todo);
    else if (todo.status === TodoStatus.DONE) completedTodos.push(todo);
  }

  return [awaitingTodos, completedTodos];
};
