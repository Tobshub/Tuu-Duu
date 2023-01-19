import { Request, Response } from "express";
import Users from "../userModel";

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
