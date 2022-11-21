import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "magic.css/dist/magic.css";
import ReactDOM from "react-dom/client";
import Root, {
  loader as rootLoader,
  action as rootAction,
  UserCredentails,
} from "./routes/root";
import "./main.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import LoginPage, { action as loginAction } from "./routes/user-routes/login";
import "./routes/user-routes/login.css";
import RootErrorElement from "./routes/root-error";
import ProjectErrorElement from "./routes/project-routes/project-error";
import SettingsPage from "./routes/user-settings";
import { SavedUser, UserCreds } from "./types/user-context";
import { getCurrentUser, setUser, syncProjects } from "./localDB";
import LogoutPage, {
  action as logoutAction,
} from "./routes/user-routes/logout";

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

const Main = () => {
  const [user_credentials, setUserCredentials] = useState<UserCreds>({
    user_details: {
      _id: "",
      username: "",
      email: "",
    },
    setUserDetails: async (new_details: SavedUser) => {
      setUserCredentials((state) => ({ ...state, user_details: new_details }));
      await setUser(new_details);
      return;
    },
  });

  useEffect(() => {
    getCurrentUser()
      .then(async (user) => {
        if (!user) {
          setUserCredentials((state) => ({
            ...state,
            user_details: {
              _id: "",
              username: "",
              email: "",
            },
          }));
        } else {
          await user_credentials.setUserDetails(user);
        }
      })
      .catch((e) => console.error(e.message));
  }, []);

  return (
    <React.StrictMode>
      <UserCredentails.Provider value={user_credentials}>
        <RouterProvider router={router} />
      </UserCredentails.Provider>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<Main />);
