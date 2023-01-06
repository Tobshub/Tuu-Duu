import { generateId } from "@services/user";

export class Project {
  name: string;
  description: string;
  id: string;
  tasks: Task[];
  favorite: boolean;

  constructor({ name, description, id, favorite, tasks }: ProjectProps) {
    this.name = name;
    this.description = description ?? "";
    this.id = id ?? generateId();
    this.favorite = favorite ?? false;
    this.tasks = tasks ?? [];
  }
}
