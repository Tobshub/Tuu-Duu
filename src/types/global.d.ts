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
    sideBarDisplay: boolean;
    handleRedirectClick?: () => void;
    itemListElement: JSX.Element;
  }

  interface SideBarProjectsListProps {
    handleRedirectClick?: () => void;
    projects?: Project[];
  }

  interface SideBarOrgsListProps {
    handleRedirectClick?: () => void;
    orgs: OrgDetails[];
  }

  // user objects
  interface UserCreds {
    user_details: SavedUser;
    setUserDetails: (new_details: SavedUser) => Promise<void>;
  }

  interface SavedUser {
    readonly _id: string;
    email: string;
    username: string;
    org_refs?: OrgRef[];
  }

  // project types
  type ProjectProps = {
    name: string;
    description?: string;
    id?: string;
    tasks?: Task[];
    favorite?: boolean;
  };

  class Project {
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

  interface TaskProps {
    name: string;
    status?: "idle" | "in progess" | "completed";
    todos?: Todo[];
    deadline?: Date;
  }

  class Task {
    name: string;
    status: "idle" | "in progess" | "completed";
    todos: Todo[];
    deadline?: Date;
    constructor({ name, status, todos, deadline }: TaskProps) {
      this.name = name ?? "Untitled";
      this.status = status ?? "idle";
      this.todos = todos ?? [];
      this.deadline = deadline;
    }
  }

  interface TodoProps {
    content: string;
    status?: "awaiting";
  }

  class Todo {
    content: string;
    status: "awaiting" | "completed";
    constructor({ content, status }: TodoProps) {
      this.content = content;
      this.status = status ?? "awaiting";
    }
  }

  interface DeletedTask {
    project_id: string;
    task_content: Task;
    original_index: number;
  }

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

  interface NotificationContent {
    title?: string;
    message?: string;
  }

  interface NotificationAction {
    name: string;
    target: string;
    execute: (...args: any) => void;
  }

  // component props
  interface NewFormProps {
    form_type: string;
    required?: { name: boolean; description: boolean };
    nextAction?: () => void;
    backAction?: () => void;
  }

  // component props
  type ActionButtonProps = {
    icon: string;
    value?: any;
    onClick?: () => void;
    icon_alt: string;
    title: string;
    style?: {};
    islazy?: boolean;
    name?: string;
    className: string;
    type?: "button" | "submit" | "reset";
  };
}
