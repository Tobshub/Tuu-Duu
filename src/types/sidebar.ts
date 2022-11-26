import Org from "./orgs";
import Project from "./project";

export interface SideBarProps {
  isLoggedIn: boolean,
  sideBarDisplay: boolean,
  handleRedirectClick?: () => void,
  itemListElement: JSX.Element, 
}

export interface SideBarProjectsListProps {
  handleRedirectClick?: () => void,
  projects: Project[],
}

export interface SideBarOrgsListProps {
  handleRedirectClick?: () => void,
  orgs: Org[],
}