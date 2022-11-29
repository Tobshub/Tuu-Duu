import { generateId } from "../operations/user";
import env from "../../env.json";
import axios from "axios";
import Project from "./project";
import { SavedUser } from "./user-context";


interface CreateOrgClass {
  name: string;
  description: string;
  admins: SavedUser[];
  website_link?: string;
  projects?: OrgProject[];
  members?: SavedUser[];
  _id?: string,
}

export default class Org implements CreateOrgClass {
  #_id: string;
  org_id : string;
  name: string;
  description: string;
  admins: SavedUser[];
  website_link?: string;
  projects: OrgProject[];
  members: SavedUser[];
  #sync_url: string;
  
  constructor({name, description, admins, members, projects, website_link, _id}: CreateOrgClass) {
    this.#_id = _id ?? null;
    this.org_id = generateId();
    this.name = name;
    this.description = description;
    this.admins = admins;
    this.members = members ?? [];
    this.projects = projects ?? [];
    this.website_link = website_link ?? "";
    this.#sync_url = `${env.REACT_APP_TUU_DUU_API}/org/${this.#_id}`;
  }

  getOrgRef(): OrgRef {
    return {_id: this.#_id};
  }

  async addMember(user: SavedUser) {
    this.members.push(user);
    return await this.syncOrg();
  }

  async addAdmin(user: SavedUser) {

  }

  async removeMember(user: SavedUser) {

  }

  async removeAdmin(user: SavedUser) {

  }

  async syncOrg() {
    const sync_resources = {
      _id: this.#_id,
      org: this,
    };

    const sync_request = await axios.post(this.#sync_url, sync_resources, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json; encoding=utf-8",
      },
      method: "cors",
      timeout: 2000
    }).then(value => value.data).then(res => res)
    return sync_request;
  }

}

export interface OrgProject extends Project {
  visibile_to: SavedUser[],
}

export interface OrgRef {
  _id: string,
}

export interface OrgDetails extends OrgRef {
  id: string,
  name: string,
}