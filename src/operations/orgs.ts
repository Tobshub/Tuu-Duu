import Org, { OrgDetails, OrgRef } from "../types/orgs";
import env from "../../env.json"
import axios from "axios";
import { CreateOrgResponse, GetOrgResponse } from "../types/server-response";
import { getCurrentUser, setUser } from "./user";

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
  }).then(value => value.data).then((res: CreateOrgResponse) => {
    console.log({res})
    return "_id" in res? ({_id: res._id}) : null
  }).catch(e => console.error(e))
  return req_result? (await addOrgToUser(req_result)) : null;
}


export const addOrgToUser = async (org: OrgRef): Promise<OrgRef> => {
  const user = await getCurrentUser();
  user.org_refs? user.org_refs.push(org) : user.org_refs = [org];
  setUser(user);
  return org;
}

export const getOrgsNames = async (): Promise<OrgDetails[]> => {
  // bulk get orgs from api
  const {org_refs} = await getCurrentUser();
  if (!org_refs || !org_refs.length) return;
  const api_url = `${env.REACT_APP_TUU_DUU_API}/org/bulk`;
  const org_details = await axios.post(api_url, {org_refs}, {
    headers: {
      "Content-Type": "application/json; encoding=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    method: "cors",
    timeout: 2500,
  }).then(value => value.data).then(res => {
    return ("orgs" in res)? res.orgs : null
  }).then((res: OrgDetails[]) => res).catch(e => console.error(e));
  return org_details? org_details : null;
}

export const getOrg = async (org_ref: OrgRef): Promise<Org> => {
  // all orgs data held remotely and gotten from the server each time
  const get_url = `${env.REACT_APP_TUU_DUU_API}/${org_ref._id}`;
  const org = await axios.get(get_url, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json; encoding=utf-8",
    },
    method: "cors",
    timeout: 2500,
  }).then(value => value.data).then((res: GetOrgResponse) => {
    const req_org = new Org({...res.org});
    return req_org;
  }).catch(e => console.error(e));
  return org? org : null;
}

