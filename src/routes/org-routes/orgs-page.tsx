import { useState } from "react";
import {
  NavLink,
  Outlet,
  Params,
  redirect,
  useLoaderData,
} from "react-router-dom";
import AddSVG from "../../images/Add.svg";
import DeleteSVG from "../../images/Delete.svg";
import InlineMenuSVG from "../../images/inline-menu.svg";
import BurgerMenuSVG from "../../images/BurgerMenu.svg";
import CloseSVG from "../../images/Close.svg";
import { SideBarOrgsListProps } from "../../types/sidebar";
import { Form } from "react-router-dom";
import Org, { OrgDetails, OrgProject } from "../../types/orgs";
import SideBar from "../components/sidebar";
import { getCurrentUser } from "../../operations/user";
import { getOrgsNames } from "../../operations/orgs";
import { Link } from "react-router-dom";

export async function loader() {
  const user = await getCurrentUser();
  if (!user) return redirect("/login");
  const orgs = await getOrgsNames();
  return orgs;
}

export async function action({
  params,
  request,
}: {
  params: Params<string>;
  request: Request;
}) {
  const res = await request.formData();
  const formData = Object.fromEntries(res);
  switch (formData.action) {
    case "new":
      return redirect("/orgs/new");
  }
}

const OrgsRoot = () => {
  const orgs = useLoaderData();
  const [sideBarDisplay, setSideBarDisplay] = useState(true);

  const handleRedirectClick = () => {
    // when the screen-width is smaller 600px
    if (window.innerWidth > 600) return;
    setTimeout(() => {
      setSideBarDisplay(false);
    }, 100);
  };

  return (
    <div className="root-div">
      <div className="toggle-sidebar">
        <button
          className="new-project-btn"
          style={{
            width: "30px",
          }}
          onClick={() => setSideBarDisplay((state) => !state)}
        >
          <img
            src={!sideBarDisplay ? BurgerMenuSVG : CloseSVG}
            alt="Toggle sidebar"
            loading="lazy"
          />
        </button>
      </div>
      <SideBar
        isLoggedIn={true}
        sideBarDisplay={sideBarDisplay}
        handleRedirectClick={handleRedirectClick}
        itemListElement={
          <SideBarOrgsList
            orgs={typeof orgs === "object" && Array.isArray(orgs) ? orgs : null}
            handleRedirectClick={handleRedirectClick}
          />
        }
      />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default OrgsRoot;

const SideBarOrgsList = ({
  handleRedirectClick,
  orgs,
}: SideBarOrgsListProps) => {
  const [search_query, setSearchQuery] = useState("");
  return (
    <nav className="nav-bar navbar navbar-default">
      <div className="nav-title">
        <Link to={"/orgs"}>
          <h2>My Orgs</h2>
        </Link>
        <Form method="post">
          <button
            type="submit"
            className="new-project-btn"
            name="action"
            value="new"
            title="New Org"
            onClick={handleRedirectClick}
          >
            <img src={AddSVG} alt="New org" />
          </button>
        </Form>
      </div>
      <div className="input-group">
        <input
          placeholder="Search"
          type="search"
          name="search_project"
          className="form-control search-project"
          value={search_query}
          onChange={({ target }) => setSearchQuery(target.value)}
        />
      </div>
      <ul className="nav navbar-nav nav-bar">
        {orgs && orgs.length ? (
          orgs.map((org: OrgDetails, key: number) => {
            if (
              "name" in org &&
              org.name.toLowerCase().includes(search_query.toLowerCase())
            ) {
              return (
                <NavItem
                  org={org}
                  key={key}
                  index={key}
                  closeMenu={handleRedirectClick}
                />
              );
            }
          })
        ) : (
          <em>No Orgs yet.</em>
        )}
      </ul>
    </nav>
  );
};

const NavItem = ({
  org,
  index,
  closeMenu,
}: {
  org: OrgDetails;
  index: number;
  closeMenu: () => void;
}) => {
  const [magicStyle, setMagicStyle] = useState("");

  return (
    <li key={index} className={magicStyle}>
      <NavLink
        to={`/orgs/${org.id}`}
        className={({ isActive }) => (isActive ? "btn btn-primary" : "btn")}
        onClick={closeMenu}
      >
        {org.name}
      </NavLink>
    </li>
  );
};

export const OrgsIndexPage = () => {
  return (
    <>
      <h1>Organizations</h1>
      <em>Coming soon...</em>
    </>
  );
};
