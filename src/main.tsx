import "bootstrap/dist/css/bootstrap.min.css";
import "magic.css/dist/magic.css";
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import "./main.css";
import { action as newOrgAction } from "./pages/Org/new-org";
import { action as orgAction, loader as orgLoader } from "./pages/Org/org";
import {
  OrgsIndexPage,
  action as orgsAction,
  loader as orgsLoader,
} from "./pages/Org/orgs-page";
import { loader as editTaskLoader } from "./pages/Project/Task/edit-task";
import { loader as newTaskLoader } from "./pages/Project/Task/new-task";
import {
  action as deleteProjectAction,
  loader as deleteProjectLoader,
} from "./pages/Project/delete-project";
import { loader as editProjectLoader } from "./pages/Project/edit-projects";
import NewProject, {
  action as newProjectAction,
} from "./pages/Project/new-project";
import {
  action as projectAction,
  loader as projectLoader,
} from "./pages/Project/project";
import Root, {
  action as rootAction,
  loader as rootLoader,
} from "./pages/Root/root";
import { action as loginAction } from "./pages/User/login";
import "./pages/User/login.css";
import { action as logoutAction } from "./pages/User/logout";
import SuspensePage from "./pages/suspense-page";
import Index from "./pages/index";
const ProjectPage = lazy(() => import("./pages/Project/project"));
const EditProject = lazy(() => import("./pages/Project/edit-projects"));
const NewTask = lazy(() => import("./pages/Project/Task/new-task"));
const EditTask = lazy(() => import("./pages/Project/Task/edit-task"));
const LoginPage = lazy(() => import("./pages/User/login"));
const RootErrorElement = lazy(() => import("./pages/Root/root-error"));
const ProjectErrorElement = lazy(
  () => import("./pages/Project/project-error")
);
const SettingsPage = lazy(() => import("./pages/user-settings"));
const LogoutPage = lazy(() => import("./pages/User/logout"));
const OrgsRoot = lazy(() => import("./pages/Org/orgs-page"));
const NewOrg = lazy(() => import("./pages/Org/new-org"));
const OrgPage = lazy(() => import("./pages/Org/org"));
const DeleteProjectComponent = lazy(
  () => import("./pages/Project/delete-project")
);

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
        loader: () => redirect("/"),
        errorElement: <ProjectErrorElement />,
        children: [
          {
            path: "/projects/new",
            element: <NewProject />,
            action: async () => null,
          },
          {
            path: "/projects/:projectId/edit",
            element: <EditProject />,
            loader: editProjectLoader,
            action: async () => null /* catch form actions */,
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
                loader: newTaskLoader,
                action: async () => null /* catch form actions */,
              },
              {
                path: "/projects/:projectId/tasks/:taskId/edit",
                element: <EditTask />,
                loader: editTaskLoader,
                action: async () => null /* catch form actions */,
              },
              {
                path: "/projects/:projectId/delete",
                element: <DeleteProjectComponent />,
                loader: deleteProjectLoader,
                action: deleteProjectAction,
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

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <React.StrictMode>
//     <Suspense fallback={<SuspensePage />}>
//       <RouterProvider router={router} />
//     </Suspense>
//   </React.StrictMode>
// );

let app_root = null;

document.addEventListener("DOMContentLoaded", event => {
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
