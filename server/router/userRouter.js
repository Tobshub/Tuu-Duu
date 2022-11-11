const router = require("express").Router()

router
  .get('/', (req, res) => {
    res.send({
      message: "sent a get request."
    })
  })
  .post('/', async (req, res) => {
    const { user_details } = await req.body;

    res.send({
      success: true,
      message: "post request",
      user: user_details
    })
  })


module.exports = router;