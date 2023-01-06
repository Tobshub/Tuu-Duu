export interface Project {
  id: string;
  tasks: any[];
  name: string;
  description?: string | undefined;
  favorite?: boolean | undefined;
  last_save: number;
}