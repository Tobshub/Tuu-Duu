import { useEffect, useMemo, useState } from "react";
import { Params, useLoaderData } from "react-router";
import { getOrg } from "../../operations/orgs";
import { getCurrentUser } from "../../operations/user";
import Org, { OrgRef } from "../../types/orgs";

export async function loader({ params }: { params: Params<string> }) {
  // TODO: make org refs now have _id and id, pass id through the url, use _id to get the required data
  const org_id = await params.orgId;
  const org = await getOrg(org_id);
  return org;
}

export async function action({
  params,
  request,
}: {
  params: Params<string>;
  request: Request;
}) {
  const { orgId } = await params;
  // open project
  // make project
  // etc
}

const OrgPage = () => {
  const loader_data = useLoaderData();
  const [org, setOrg] = useState<Org>(null);
  useEffect(() => {
    if (
      typeof loader_data === "object" &&
      "org_id" in loader_data &&
      "name" in loader_data &&
      "admins" in loader_data
    ) {
      setOrg(new Org(loader_data));
    } else {
      throw new Error("error getting org");
    }
  }, [loader_data]);

  if (!org) return;

  return <>{org.name}</>;
  /* 
  display projects as task cards
  click open => shows project page
  sidebar should still shows orgs
  on the project page side bar should show other projects in the same organization 
  */
};

export default OrgPage;
