import React from "react";

export {};

declare global {
  // api response types
  interface LoginServerResponse {
    readonly success: boolean;
    readonly message: string;
    user: AppUser;
  }

  interface AppUser {
    readonly _id: string;
    username: string;
    email: string;
    projects: Project[];
    orgs: OrgRef[];
  }

  interface ServerResponse {
    readonly success: boolean;
    readonly message: string;
  }

  interface GetProjectsServerResponse extends ServerResponse {
    projects: Project[];
  }

  interface CreateOrgResponse extends ServerResponse {
    success: boolean;
    message: string;
    _id: string;
    org_id: string;
    org_name: string;
  }

  interface AddOrgToUserResponse extends ServerResponse {
    success: boolean;
    message: string;
    orgs: OrgRef[];
    _id: string;
  }

  interface GetOrgResponse extends ServerResponse {
    org: Org;
  }

  // components

  interface SideBarProps {
    isLoggedIn: boolean;
    sideBarDisplay: "show" | "hide" | "min";
    handleRedirectClick?: () => void;
    open: () => void;
    close: () => void;
    children: JSX.Element;
  }

  interface SideBarProjectsListProps {
    handleRedirectClick: () => void;
    projects?: Project[];
  }

  interface SideBarOrgsListProps {
    handleRedirectClick?: () => void;
    orgs: OrgDetails[];
  }

  // user objects
  type UserCreds = {
    user_details: SavedUser;
    setUserDetails: (new_details: SavedUser) => Promise<void>;
  };

  type SavedUser = {
    readonly _id: string;
    email: string;
    username: string;
    org_refs?: OrgRef[];
  };

  // project types
  interface ProjectProps {
    name: string;
    description?: string;
    id?: string;
    tasks?: Task[];
    favorite?: boolean;
  }

  type Project = ProjectProps & {
    description: string;
    id: string;
    tasks: Task[];
    favorite: boolean;
  };

  interface TaskProps {
    id?: string;
    name: string;
    status?: "idle" | "in progess" | "completed";
    todos?: Todo[];
    deadline?: Date | null;
  }

  type Task = TaskProps & {
    id: string;
    status: "idle" | "in progess" | "completed";
    todos: Todo[];
  };

  interface TodoProps {
    content: string;
    status?: "awaiting" | "completed";
  }

  type Todo = TodoProps & {
    status: "awaiting" | "completed";
  };

  type DeletedTask = {
    project_id: string;
    task_content: Task;
    original_index: number;
  };

  // Org types
  interface CreateOrgClass {
    name: string | unknown;
    admins: SavedUser[] | unknown;
    org_id?: string | unknown;
    description?: string;
    website_link?: string;
    projects?: OrgProject[];
    members?: SavedUser[];
    _id?: string;
  }

  // TODO:  remove this class
  class Org implements CreateOrgClass {
    #_id: string;
    org_id: string;
    name: string;
    description?: string;
    admins: SavedUser[];
    website_link?: string;
    projects: OrgProject[];
    members: SavedUser[];
    #sync_url: string;

    constructor({
      name,
      description,
      admins,
      members,
      projects,
      website_link,
      _id,
      org_id,
    }: CreateOrgClass) {
      this.#_id = _id ?? null;
      this.org_id = org_id.toString() ?? generateId();
      this.name = name.toString();
      this.description = description;
      this.admins = Array.isArray(admins) ? admins : [];
      this.members = members ?? [];
      this.projects = projects ?? [];
      this.website_link = website_link ?? "";
      this.#sync_url = `${env.REACT_APP_TUU_DUU_API}/org/${this.#_id}`;
    }

    getOrgRef(): OrgRef {
      return { _id: this.#_id, org_id: this.org_id };
    }

    async addMember(user: SavedUser) {
      this.members.push(user);
      return await this.syncOrg();
    }

    async addAdmin(user: SavedUser) {}

    async removeMember(user: SavedUser) {}

    async removeAdmin(user: SavedUser) {}

    async syncOrg() {
      const sync_resources = {
        _id: this.#_id,
        org: this,
      };

      const sync_request = await axios
        .post(this.#sync_url, sync_resources, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json; encoding=utf-8",
          },
          method: "cors",
          timeout: 2000,
        })
        .then(value => value.data)
        .then(res => res);
      return sync_request;
    }
  }

  interface OrgProject extends Project {
    visibile_to: SavedUser[];
  }

  interface OrgRef {
    _id: string;
    org_id: string;
  }

  interface OrgDetails extends OrgRef {
    name: string;
  }

  // component props

  interface NotificationArgs {
    content?: NotificationContent;
    action?: NotificationAction;
  }

  type NotificationContent = {
    title?: string;
    message: string;
  };

  type NotificationAction = {
    name: string;
    target: string;
    execute: (...args: any) => Promise<void>;
    nextAction: (e: React.FormEvent<HTMLFormElement>) => void;
  };

  // component props
  interface NewFormProps {
    form_type: string;
    required?: { name: boolean; description: boolean };
    formValues: {
      name: string;
      description: string;
    };
    handleChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    nextAction?: () => void;
    backAction?: () => void;
  }

  // component props
  type ActionButtonProps = {
    icon: string;
    value?: any;
    onClick?: (
      e?: React.MouseEvent<HTMLButtonElement | MouseEvent>
    ) => void;
    icon_alt: string;
    title: string;
    style?: React.HTMLAttributes.style;
    islazy?: boolean;
    name?: string;
    className?: string;
    type?: "button" | "submit" | "reset";
  };
}
