import Org from "../orgModel.js";
import { Request, Response } from "express";

// create org
export const createOrg = async (req: Request, res: Response) => {
  const { org_details } = await req.body;
  const org = new Org({ ...org_details });

  org.save((err, doc) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }
    res.status(200).send({
      success: true,
      message: "org created...",
      _id: doc._id,
      org_id: doc.org_id,
      org_name: doc.name,
    });
  });
};

// bulk get orgs
export const bulkRetrieve = async (req: Request, res: Response) => {
  try {
    const { org_refs }: { org_refs: [] } = await req.body;

    const org_details = org_refs.map((org: { _id: string }) => {
      return Org.findById(org._id)
        .then(doc => {
          if (!doc) return null;
          return { org_id: doc.org_id, name: doc.name, _id: doc._id };
        })
        .catch(e => null);
    });
    const resolved_orgs = await Promise.all([...org_details]);

    if (org_details.length) {
      res.status(202).send({
        success: true,
        message: "orgs found",
        orgs: resolved_orgs,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "orgs not found",
        orgs: [],
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

// get all the info on one org
export const getOrgData = async (req: Request, res: Response) => {
  try {
    const { _id } = await req.query;

    await Org.findById(_id)
      .then(doc => {
        if (!doc) {
          res.status(404).send({
            success: false,
            message: "no org found",
          });
        }
        res.status(200).send({
          success: true,
          message: "org found",
          org: doc,
        });
      })
      .catch(e => {
        res.status(404).send({
          success: false,
          message: "error find org",
          error: e,
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

// add members to org
export const orgAddMembers = async (req: Request, res: Response) => {
  res.send({ message: "adding members..." });
};
// add admins to org
export const orgAddAdmins = async (req: Request, res: Response) => {
  res.send({ message: "adding admins..." });
};
// update org
export const updateOrg = async (req: Request, res: Response) => {
  res.send({ message: "updating org..." });
};
// delete org
export const deleteOrg = async (req: Request, res: Response) => {
  res.send({ message: "deleting org..." });
};
