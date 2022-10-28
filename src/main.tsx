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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    action: rootAction,
    errorElement: <>404 Not found</>,
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
          },
          {
            path: "/projects/:projectId",
            element: <Project />,
            loader: projectLoader,
            action: projectAction,
            errorElement: <>Error displaying this :(</>,
            children: [
              {
                path: "/projects/:projectId/tasks/new",
                element: <NewTask />,
                action: newTaskAction,
              },
              {
                path: "/projects/:projectId/tasks/edit",
                element: <>Edit task or add Todos</>,
              },
            ],
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
