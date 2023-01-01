import {
  useState,
  useEffect,
  createContext,
  useRef,
  Suspense,
} from "react";
import "@styles/root.css";
import {
  Outlet,
  redirect,
  useLoaderData,
  ActionFunctionArgs,
} from "react-router-dom";
import BurgerMenuSVG from "@images/BurgerMenu.svg";
import CloseSVG from "@images/Close.svg";
import SprinkleBgSVG from "@images/sprinkle-bg.svg";
import SideBar from "@UIcomponents/sidebar";
import { getCurrentUser, setUser } from "@services/user";
import { QueryClient, QueryClientProvider } from "react-query";
import ActionButton from "@UIcomponents/action-button";
import SideBarProjectsList from "./root-sidebar";
import MinSideBarProjectList from "./min-root-sidebar";
import debounce from "@utils/debounce";
import SuspensePage from "pages/suspense-page";
import UserContext from "@context/user-context";
import { getProjects } from "@services/projects";

// get the user on the first load
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

const projectQueryClient = new QueryClient({
  defaultOptions: {
    // set default query to get all projects
    queries: {
      queryKey: "projects",
      queryFn: () => getProjects(),
      staleTime: 5 * 60 * 1000 /* 5 minutes of stale time */,
    },
  },
});

const Root = () => {
  const loaderData = useLoaderData();
  const [user] = useState(loaderData as SavedUser);
  const [sideBarDisplay, setSideBarDisplay] = useState(true);

  const [isLoggedIn, setLoggedIn] = useState<boolean>(true);

  useEffect(() => {
    setLoggedIn(user && user._id ? true : false);
  }, [user]);

  // close the sidebar:
  const handleRedirectClick = () => {
    // when the screen-width is smaller 600px
    if (window.innerWidth > 600) return;
    setTimeout(() => {
      setSideBarDisplay(false);
    }, 100);
  };

  const toggleSideBar = () => {
    setSideBarDisplay(state => !state);
  };

  // re open the sidebar on window resize
  // to catch cases where the side bar is supposed to resize
  let prevWidth = window.innerWidth;
  window.addEventListener(
    "resize",
    // use debounce function to reduce the number of re-renders
    debounce(() => {
      if (prevWidth === window.innerWidth) return;
      prevWidth = window.innerWidth;
      setSideBarDisplay(true);
    }, 500)
  );

  return (
    <QueryClientProvider client={projectQueryClient}>
      <div className="root-div">
        <div
          className="open-sidebar"
          style={{
            zIndex: "100",
            justifyContent: "flex-start",
          }}
        >
          <ActionButton
            title="open sidebar"
            style={{
              width: "30px",
            }}
            onClick={toggleSideBar}
            icon={BurgerMenuSVG}
            icon_alt="Toggle sidebar"
          />
        </div>
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
        <main style={{ backgroundImage: `url(${SprinkleBgSVG})` }}>
          <UserContext.Provider value={user}>
            <Suspense fallback={<SuspensePage />}>
              <Outlet />
            </Suspense>
          </UserContext.Provider>
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default Root;
