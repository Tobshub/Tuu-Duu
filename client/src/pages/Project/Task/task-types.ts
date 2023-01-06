import { generateId } from "@services/user";

export class Task {
  id: string;
  name: string;
  status: "idle" | "in progess" | "completed";
  todos: Todo[];
  deadline?: Date;
  constructor({ id, name, status, todos, deadline }: TaskProps) {
    this.id = id ?? generateId();
    this.name = name ?? "Untitled";
    this.status = status ?? "idle";
    this.todos = todos ?? [];
    this.deadline = deadline;
  }
}

export class Todo implements TodoProps {
  content: string;
  status: "awaiting" | "completed";
  constructor({ content, status }: TodoProps) {
    this.content = content;
    this.status = status ?? "awaiting";
  }
}
