const controller = require("../controller/userController")
const router = require("express").Router()

router
  .get('/', (req, res) => {
    res.send({
      message: "sent a get request."
    })
  })
  .post('/', controller.getUserByEmail)
  .post('/new', controller.addNewUser)
  .put('/sync_projects', controller.syncUserProjects)


module.exports = router;