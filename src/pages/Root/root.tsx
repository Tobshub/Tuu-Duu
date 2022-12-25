import { useState, useEffect, createContext } from "react";
import "@styles/root.css";
import {
  Outlet,
  redirect,
  useLoaderData,
  ActionFunctionArgs,
} from "react-router-dom";
import BurgerMenuSVG from "@images/BurgerMenu.svg";
import CloseSVG from "@images/Close.svg";
import SideBar from "@UIcomponents/sidebar";
import { getCurrentUser, setUser } from "@services/user";
import { QueryClient, QueryClientProvider } from "react-query";
import ActionButton from "@UIcomponents/action-button";
import SideBarProjectsList from "./root-sidebar";
import MinSideBarProjectList from "./min-root-sidebar";

export async function loader() {
  const user = await getCurrentUser();
  if (!user) return redirect("/login");
  return user;
}

export async function action({ request }: ActionFunctionArgs) {
  const res = await request.formData();
  const formData = Object.fromEntries(res);
  if (!formData) return;
  if (formData.new) {
    return redirect("/projects/new");
  }
}

export const UserContext = createContext(null);
const projectQuery = new QueryClient();

const Root = () => {
  const user = useLoaderData() as SavedUser;
  const [sideBarDisplay, setSideBarDisplay] = useState(true);
  const [user_credentials, setUserCredentials] = useState<UserCreds>({
    user_details: { ...user },
    setUserDetails: async (new_details: SavedUser) => {
      setUserCredentials(state => ({
        ...state,
        user_details: new_details,
      }));
      await setUser(new_details);
      return;
    },
  });

  const [isLoggedIn, setLoggedIn] = useState<boolean>(true);

  useEffect(() => {
    setLoggedIn(
      user_credentials.user_details && user_credentials.user_details._id
        ? true
        : false
    );
  }, [user_credentials.user_details]);

  // close the sidebar:
  const handleRedirectClick = () => {
    // when the screen-width is smaller 600px
    if (window.innerWidth > 600) return;
    setTimeout(() => {
      setSideBarDisplay(false);
    }, 100);
  };

  const toggleSideBar = () => {
    setTimeout(() => {
      setSideBarDisplay(state => !state);
    }, 100);
  };

  return (
    <QueryClientProvider client={projectQuery}>
      <div className="root-div">
        <SideBar
          isLoggedIn={isLoggedIn}
          sideBarDisplay={
            sideBarDisplay
              ? "show"
              : window.innerWidth > 600
              ? "min"
              : "hide"
          }
          handleRedirectClick={handleRedirectClick}
          toggle={toggleSideBar}
        >
          {sideBarDisplay ? (
            <SideBarProjectsList
              handleRedirectClick={handleRedirectClick}
            />
          ) : (
            <MinSideBarProjectList />
          )}
        </SideBar>
        <main>
          <UserContext.Provider value={user_credentials.user_details}>
            <Outlet />
          </UserContext.Provider>
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default Root;