const router = require("express").Router();
const {count} = require('../app/models/Food')

router.get('/count', async (req, res) => {
  let result = await count();
  res.send({count: result.rows[0].Count})
})


module.exports = router;
