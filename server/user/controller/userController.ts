import { Request, Response } from "express";
import Users from "../userModel";
import bcrypt from "bcrypt";

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
        const res_user = doc.toObject();

        const valid = bcrypt.compareSync(
          user_details.password,
          res_user.password
        );

        if (valid) {
          res.status(200).send({
            success: true,
            message: "user found & password is valid",
            user: {
              _id: res_user._id.toString(),
              email: res_user.email,
              username: res_user.username,
              projects: res_user.projects,
              orgs: res_user.orgs,
            },
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
      const res_user = doc.toObject();
      res.status(201).send({
        success: true,
        message: "user created",
        user: {
          _id: res_user._id,
          email: res_user.email,
          orgs: res_user.orgs,
          projects: res_user.projects,
          username: res_user.username,
        },
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

        doc.save((err, doc) => {
          if (err) {
            res.status(500).send({
              success: false,
              message: "email is already in use",
              error: err.message,
            });
            return;
          }
          console.log("user updated...");
          const res_user = doc.toObject();
          res.status(200).send({
            success: true,
            message: "user updated",
            user: {
              _id: res_user._id,
              email: res_user.email,
              orgs: res_user.orgs,
              projects: res_user.projects,
              username: res_user.username,
            },
          });
        });
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
