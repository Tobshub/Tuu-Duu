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
import Index, { loader as indexLoader } from "./routes";
import NewProject, {
  action as newProjectAction,
} from "./routes/project-routes/new-project";
const Project = lazy(() => import("./routes/project-routes/project"));
import {
  loader as projectLoader,
  action as projectAction,
} from "./routes/project-routes/project";
import EditProject, {
  loader as editProjectLoader,
  action as editProjectAction,
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
        loader: indexLoader,
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
            action: editProjectAction,
          },
          {
            path: "/projects/:projectId",
            element: <Project />,
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

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<SuspensePage />}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>
);
