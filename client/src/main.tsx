import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom/client";
import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./routes/root";
import "./main.css";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Index, { loader as indexLoader } from "./routes";
import NewProject, {
  action as newProjectAction,
} from "./routes/project-routes/new-project";
import Project, {
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
import Login, { action as loginAction } from "./routes/login-routes/login";
import "./routes/login-routes/login.css";
import RootErrorElement from "./routes/root-error";
import ProjectErrorElement from "./routes/project-routes/project-error";
import SettingsPage from "./routes/user-settings";

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
        errorElement: <>Could not display that now.</>,
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
            errorElement: <ProjectErrorElement />,
          },
          {
            path: "/projects/:projectId",
            element: <Project />,
            loader: projectLoader,
            action: projectAction,
            errorElement: <ProjectErrorElement />,
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
    element: <Login />,
    action: loginAction,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
