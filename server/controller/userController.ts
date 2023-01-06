import { Request, Response } from "express";
import { MongooseError } from "mongoose";
import Users from "../model/userModel";
import { Project } from "../types/project";
const bcrypt = require("bcrypt");

// get user by email
export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { user_details } = await req.body;

    Users.findOne({ email: user_details.email })
      .then(doc => {
        if (!doc) {
          res.status(500).send({
            success: false,
            message: "email or password is wrong",
          });
          return;
        }
        const res_user = doc;

        const valid = bcrypt.compareSync(
          user_details.password,
          res_user.password
        );

        if (valid) {
          res.status(200).send({
            success: true,
            message: "user found & password is valid",
            user: res_user,
          });
        } else {
          res.status(500).send({
            success: false,
            message: "email or password is wrong",
          });
        }
      })
      .catch(e => {
        console.error(e);
        res.status(500).send({
          success: false,
          message: "email or password is wrong",
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

// add a new user
export const addNewUser = async (req: Request, res: Response) => {
  try {
    const { user_details } = await req.body;

    user_details.password = bcrypt.hashSync(user_details.password, 10);
    const new_user = new Users(user_details);
    new_user.save((err, doc) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "email is already in use",
          error: err.message,
        });
        return;
      }
      res.status(201).send({
        success: true,
        message: "user created",
        user: doc,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

// get user projects
export const getProjects = async (req: Request, res: Response) => {
  const { _id } = req.query;
  try {
    Users.findById(_id)
      .then(doc => {
        if (!doc) throw new Error("no user found");

        res.status(201).send({
          success: true,
          message: "projects found",
          projects: doc.projects,
        });
      })
      .catch(error => {
        console.error(error);
        res.status(404).send({
          success: false,
          message: "Cannot find user",
          error,
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

// add a new project
export const addProject = async (req: Request, res: Response) => {
  const { _id, project_data } = await req.body;
  try {
    Users.findById(_id)
      .then(doc => {
        if (!doc) throw new Error("no user found");

        doc.projects?.push(project_data);
        doc.save((err, doc) => {
          if (err || !doc) throw new Error(err?.message ?? "");

          res.status(200).send({
            success: true,
            message: "project added",
            projects: doc.projects,
          });
        });
      })
      .catch(error => {
        console.error(error);
        res.status(404).send({
          success: false,
          message: "Cannot find user",
          error,
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

// edit a user project
export const editProject = async (req: Request, res: Response) => {
  const { _id, project_data } = await req.body;
  try {
    Users.findById(_id)
      .then(doc => {
        if (!doc) throw new Error("no user found");
        const index = doc.projects.findIndex(
          project => project.id === project_data.id
        );
        doc.projects[index] = {
          ...doc.projects[index],
          ...project_data,
        };
        doc.save((err, doc) => {
          if (err || !doc) throw new Error(err?.message ?? "");

          res.status(200).send({
            success: true,
            message: "project editted",
            projects: doc.projects,
          });
        });
      })
      .catch(error => {
        console.error(error);
        res.status(404).send({
          success: false,
          message: "Cannot find user",
          error,
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

// delete a user project
export const deleteProject = async (req: Request, res: Response) => {
  const { _id, project_id } = req.query;
  try {
    Users.findById(_id)
      .then(doc => {
        if (!doc) throw new Error("no user found");

        const index = doc.projects.findIndex(
          project => project.id === project_id
        );

        doc.projects.splice(index, 1);
        doc.save((err, doc) => {
          if (err || !doc) throw new Error(err?.message ?? "");

          res.status(200).send({
            success: true,
            message: "project deleted",
            projects: doc.projects,
          });
        });
      })
      .catch(error => {
        console.error(error);
        res.status(404).send({
          success: false,
          message: "Cannot find user",
          error,
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

// update a user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { user_details } = await req.body;
    Users.findById(user_details._id)
      .then(doc => {
        if (!doc) {
          res.send({
            success: false,
            message: "no such document exists",
          });
          return;
        }

        doc.email = user_details.email;
        doc.username = user_details.username;

        res.status(200).send({
          success: true,
          message: "user updated",
          user: doc,
        });
        doc.save((err, doc) => console.log("user updated..."));
      })
      .catch(e => {
        res.send({
          success: false,
          message: "Internal server error",
          error: e,
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

// add org ref to user
export const addOrgToUser = async (req: Request, res: Response) => {
  try {
    const { org_ref, user_details } = await req.body;
    if (!org_ref || !user_details) {
      res.status(500).send({
        success: false,
        message: "No values provided",
      });
      return console.error("value missing", { org_ref, user_details });
    }
    await Users.findById(user_details._id)
      .then(doc => {
        if (!doc) {
          res.status(500).send({
            success: false,
            message: "no such document exists",
          });
          return;
        }
        doc.orgs ? doc.orgs.push(org_ref) : (doc.orgs = [org_ref]);
        res.status(201).send({
          success: true,
          message: "org ref added",
          orgs: doc.orgs,
          _id: doc._id,
        });
        doc.save();
      })
      .catch(e => {
        res.status(500).send({
          success: false,
          message: e,
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};
