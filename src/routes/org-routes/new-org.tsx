import { Params, redirect } from "react-router-dom";
import { createOrg } from "../../operations/orgs";
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
      const new_org = new Org({
        name: name.toString(),
        description: description.toString(),
        admins: [await getCurrentUser()],
      });
      await createOrg(new_org);
      return redirect("/orgs");
      break;
    default:
      console.log("no action set for that");
  }
}

const NewOrg = () => {
  return (
    <NewForm form_type="Org" required={{ name: true, description: false }} />
  );
};

export default NewOrg;
