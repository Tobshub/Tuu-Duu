export async function loader({ params }: { params: Params<string> }) {
  const { org_id } = await params;
  const org = getOrg(orgId);
  return org;
}

export async function action({
  params,
  request,
}: {
  params: Params<string>;
  requset: Request;
}) {
  const { org_id } = await params;
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
