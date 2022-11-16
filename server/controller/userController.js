const Users = require("../model/userModel");


// get user by email
exports.getUserByEmail = async (req, res) => {
  try {
    const { user_details } = await req.body;

    const user = Users.find({ email: user_details.email, password: user_details.password }, (err, doc) => {
      if (err) return console.error(err);

      if (doc.length) {
        res.status(200).send({
          success: true,
          message: "user found",
          user: doc[0],
        })
      } else {
        res.status(500).send({
          success: false,
          message: "email or password is wrong"
        })
      }
    }).catch(e => {
      console.error(e.message);
    });

  } catch (error) {
    console.error(error)
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }

}

// add a new user
exports.addNewUser = async (req, res) => {
  try {
    const { user_details } = await req.body;

    const new_user = new Users(user_details);
    new_user.save((err, doc) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: "an error occured",
          error: err.message,
        })
        return console.error(err)
      };
      res.status(201).send({
        success: true,
        message: "user created",
        user: doc,
      })
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// sync user projects
exports.syncUserProjects = async (req, res) => {
  const { user_projects, user_id, config } = await req.body;

  Users.findById(user_id, (err, doc) => {
    if (err) {
      res.send({
        success: false,
        message: err,
      })
      return console.error(err);
    }
    if (config === "overwrite") {
      doc.projects = user_projects;
    } else {
      user_projects?.forEach((local_project) => {
        const db_index = doc.projects.findIndex(db_project => db_project.id === local_project.id);
        if (db_index === -1) {
          doc.projects.push(local_project);
        } else {
          const db_project = doc.projects[db_index];
          if (!db_project.last_save || local_project.last_save > db_project.last_save) {
            doc.projects[db_index] = local_project
          }
        }
      })
    }

    res.status(200).send({
      success: true,
      message: "projects successfully synced",
      projects: doc.projects,
    })
    doc.save();
  })
}

// update a user


// delete user


