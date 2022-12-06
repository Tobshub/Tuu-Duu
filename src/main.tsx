import React, { lazy, Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "magic.css/dist/magic.css";
import ReactDOM from "react-dom/client";
import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./routes/root";
import "./main.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./routes";
import NewProject, {
  action as newProjectAction,
} from "./routes/project-routes/new-project";
const ProjectPage = lazy(() => import("./routes/project-routes/project"));
import {
  loader as projectLoader,
  action as projectAction,
} from "./routes/project-routes/project";
import EditProject, {
  loader as editProjectLoader,
} from "./routes/project-routes/edit-projects";
import NewTask, {
  action as newTaskAction,
} from "./routes/task-routes/new-task";
import EditTask, {
  loader as editTaskLoader,
  action as editTaskAction,
} from "./routes/task-routes/edit-task";
const LoginPage = lazy(() => import("./routes/user-routes/login"));
import { action as loginAction } from "./routes/user-routes/login";
import "./routes/user-routes/login.css";
const RootErrorElement = lazy(() => import("./routes/root-error"));
const ProjectErrorElement = lazy(
  () => import("./routes/project-routes/project-error")
);
const SettingsPage = lazy(() => import("./routes/user-settings"));
const LogoutPage = lazy(() => import("./routes/user-routes/logout"));
import { action as logoutAction } from "./routes/user-routes/logout";
import SuspensePage from "./suspense-page";
const OrgsRoot = lazy(() => import("./routes/org-routes/orgs-page"));
import {
  loader as orgsLoader,
  action as orgsAction,
  OrgsIndexPage,
} from "./routes/org-routes/orgs-page";
import NewOrg, { action as newOrgAction } from "./routes/org-routes/new-org";
import OrgPage, {
  loader as orgLoader,
  action as orgAction,
} from "./routes/org-routes/org";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    action: rootAction,
    errorElement: <RootErrorElement />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "/projects",
        errorElement: <ProjectErrorElement />,
        children: [
          {
            path: "/projects/new",
            element: <NewProject />,
            action: newProjectAction,
          },
          {
            path: "/projects/:projectId/edit",
            element: <EditProject />,
            loader: editProjectLoader,
          },
          {
            path: "/projects/:projectId",
            element: <ProjectPage />,
            loader: projectLoader,
            action: projectAction,
            children: [
              {
                path: "/projects/:projectId/tasks/new",
                element: <NewTask />,
                action: newTaskAction,
              },
              {
                path: "/projects/:projectId/tasks/:taskIndex/edit",
                element: <EditTask />,
                loader: editTaskLoader,
                action: editTaskAction,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/orgs",
    element: <OrgsRoot />,
    loader: orgsLoader,
    action: orgsAction,
    children: [
      {
        index: true,
        element: <OrgsIndexPage />,
      },
      {
        path: "/orgs/new",
        element: <NewOrg />,
        action: newOrgAction,
      },
      {
        path: "/orgs/:orgId",
        element: <OrgPage />,
        loader: orgLoader,
        action: orgAction,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    action: loginAction,
  },
  {
    path: "/logout",
    element: <LogoutPage />,
    action: logoutAction,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
]);

let app_root = null;

document.addEventListener("DOMContentLoaded", (event) => {
  if (!app_root) {
    app_root = document.getElementById("root") as HTMLElement;
    try {
      const root = ReactDOM.createRoot(app_root);
      root.render(
        <React.StrictMode>
          <Suspense fallback={<SuspensePage />}>
            <RouterProvider router={router} />
          </Suspense>
        </React.StrictMode>
      );
    } catch (e) {
      console.error(e);
    }
  }
});
