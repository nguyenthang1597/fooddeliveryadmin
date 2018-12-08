const router = require("express").Router();
const {getAll} = require('../app/models/Category')
router.get('/getAll',async (req, res) => {
  let result = await getAll();
  return res.send(result.rows)
})

module.exports = router;
