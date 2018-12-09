const router = require("express").Router();
const {getAll, countByCategory} = require('../app/models/Category')


router.get('/list',async (req, res) => {
  let result = await getAll();
  return res.send(result.rows)
})

router.get('/countbycategory', async (req, res) => {
  let result = await countByCategory();
  return res.send(result.rows)
})

module.exports = router;
