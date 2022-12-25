export const setTaskStatus = (task: Task) => {
  const [awaitingTodos, completedTodos] = filterTodos(task.todos);
  task.status =
    awaitingTodos.length && completedTodos.length
      ? "in progess"
      : completedTodos.length
      ? "completed"
      : "idle";
  return task.status;
};

function filterTodos(todos: Todo[]): Todo[][] {
  const awaitingTodos = [];
  const completedTodos = [];

  for (let todo of todos) {
    if (todo.status === "awaiting") awaitingTodos.push(todo);
    else if (todo.status === "completed") completedTodos.push(todo);
  }

  return [awaitingTodos, completedTodos];
}
