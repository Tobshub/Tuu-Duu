import { generateId } from "../localDB";
import Project from "./project";
import { SavedUser } from "./user-context";


export default class Org {
  id : string;
  name: string;
  description: string;
  admins: SavedUser[];
  website_link?: string;
  projects?: OrgProject[];
  members?: SavedUser[];
  
  constructor(name: string, description: string, admins: SavedUser[], members?: SavedUser[], projects?: OrgProject[], website_link?: string,) {
    this.id = generateId();
    this.name = name;
    this.description = description;
    this.admins = admins;
    this.members = members ?? [];
    this.projects = projects ?? [];
    this.website_link = website_link ?? "";
  }
}

export interface OrgProject extends Project {
  visibile_to: SavedUser[],
}