import { Params } from "react-router-dom";
import { getCurrentUser } from "../../operations/user";
import Org from "../../types/orgs";
import NewForm from "../components/new-form";

export async function action({
  params,
  request,
}: {
  params: Params<string>;
  request: Request;
}) {
  const res = await request.formData();
  const { name, description, ...formData } = Object.fromEntries(res);
  switch (formData.action) {
    case "new":
      const new_org = new Org(name.toString(), description.toString(), [
        await getCurrentUser(),
      ]);
      console.log(new_org);
      break;
    default:
      console.log("no action set for that");
  }
}

const NewOrg = () => {
  return <NewForm form_type="Org" />;
};

export default NewOrg;
