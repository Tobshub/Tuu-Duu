import { generateId } from "../operations/user";
import Project from "./project";
import { SavedUser } from "./user-context";


interface OrgClass {
  name: string;
  description: string;
  admins: SavedUser[];
  website_link?: string;
  projects?: OrgProject[];
  members?: SavedUser[];
}

export default class Org implements OrgClass {
  _id: string;
  org_id : string;
  name: string;
  description: string;
  admins: SavedUser[];
  website_link?: string;
  projects?: OrgProject[];
  members?: SavedUser[];
  
  constructor({name, description, admins, members, projects, website_link}: OrgClass) {
    this.org_id = generateId();
    this.name = name;
    this.description = description;
    this.admins = admins;
    this.members = members ?? [];
    this.projects = projects ?? [];
    this.website_link = website_link ?? "";
  }

  getOrgRef(): OrgRef {
    return {_id: this._id};
  }

  async addMember(user: SavedUser) {

  }

  async addAdmin(user: SavedUser) {

  }

  async removeMember(user: SavedUser) {

  }

  async removeAdmin(user: SavedUser) {

  }
}

export interface OrgProject extends Project {
  visibile_to: SavedUser[],
}

export interface OrgRef {
  _id: string,
}