const router = require("express").Router();
const {getAll,getDetail} = require('../app/models/Order')

router.get('/getAll',async (req, res) => {
  let result = await getAll();
  return res.send(result.rows)
})

router.get('/detail', async (req, res) => {
  if(req.query.id){
    let result = await getDetail(req.query.id);
    return res.send(result.rows);
  }
  else
    return res.send([]);
})


module.exports = router;
