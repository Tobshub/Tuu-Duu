import Org, { OrgRef } from "../types/orgs";
import env from "../../env.json"
import axios from "axios";
import { CreateOrgResponse } from "../types/server-response";

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
  }).then(value => value.data).then((res: CreateOrgResponse) => ({_id: res._id})).catch(e => console.error(e))
  return req_result? (await addOrgToUser(req_result)) : null;
}


export const addOrgToUser = async (org: OrgRef): Promise<OrgRef> => {

  return null;
}

export const getOrgs = async (org_ref: OrgRef[]): Promise<Org[]> => {
  // bulk get orgs from api
  return null;
}

export const getOrg = async (org_ref: OrgRef): Org => {
  // use session storage to store and retrieve orgs locally
}