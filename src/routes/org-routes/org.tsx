import { Params, useLoaderData } from "react-router";
import { getOrg } from "../../operations/orgs";
import { OrgRef } from "../../types/orgs";

export async function loader({ params }: { params: Params<string> }) {
  const orgId = await params.orgId;
  const org = getOrg({ _id: orgId });
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
  const org = useLoaderData();
  /* 
  display projects as task cards
  click open => shows project page
  sidebar should still shows orgs
  on the project page side bar should show other projects in the same organization 
  */
  return <>Hello, world</>;
};

export default OrgPage;
