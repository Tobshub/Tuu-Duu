const controller = require("../controller/userController")
const router = require("express").Router()

router
  .get('/', (req, res) => {
    res.send({
      message: "sent a get request."
    })
  })
  .post('/login', controller.getUserByEmail)
  .post('/sign_up', controller.addNewUser)
  .put('/sync_projects', controller.syncUserProjects)
// delete user
// update user-details

module.exports = router;