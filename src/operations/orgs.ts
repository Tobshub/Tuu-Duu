import Org, { OrgRef } from "../types/orgs";
import env from "../../env.json"
import axios from "axios";

export const createOrg = async (org: Org): Promise<OrgRef> => {
  const req_url = `${env.REACT_APP_TUU_DUU_API}/org/new`;
  const req_body = {
    org_details: org
  }
  
  const req_result = await axios.post(req_url, req_body, {
    headers: {
      "Content-Type": "application/json; encoding=utf-8",
      "Access-Control-Allow-Origin": "*"
    },
    method: "cors",
    timeout: 2000
  }).then(value => value.data).then((res: OrgRef) => res).catch(e => console.error(e))
  return req_result? (await addToUserOrg(req_result)) : null;
}


export const addToUserOrg = async (org: OrgRef): Promise<OrgRef> => {
  return null;
}