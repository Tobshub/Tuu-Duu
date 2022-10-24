import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom/client";
import Root, { loader as rootLoader } from "./routes/root";
import "./main.css";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Index, { loader as indexLoader } from "./routes";
import NewProject, { action as newProjectAction } from "./routes/new-project";
import Project, {
  loader as projectLoader,
  action as projectAction,
} from "./routes/project";
import Todos, {
  loader as todosLoader,
  action as todosAction,
} from "./routes/todo";
import NewTodo, { action as newTodoAction } from "./routes/new-todo";
import EditProject, {
  loader as editProjectLoader,
  action as editProjectAction,
} from "./edit.projects";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
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
            path: "/projects/:projectId",
            element: <Project />,
            loader: projectLoader,
            action: projectAction,
            children: [
              {
                index: true,
                element: <Todos />,
                loader: todosLoader,
                action: todosAction,
              },
              {
                path: "/projects/:projectId/todos/new",
                element: <NewTodo />,
                action: newTodoAction,
                errorElement: <>Can't create todos now</>,
              },
            ],
          },
          {
            path: "/projects/:projectId/edit",
            element: <EditProject />,
            loader: editProjectLoader,
            action: editProjectAction,
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
