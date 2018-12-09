const router = require("express").Router();
const {getAll,getDetail,countOrder, countOrderByState} = require('../app/models/Order')

router.get('/list',async (req, res) => {
  let page = req.query.page || 1;
  let perpage = req.query.perpage || 10;
  let result = await getAll(page, perpage);
  let total = (await countOrder()).rows[0].Total;
  let respone = {
    total,
    page,
    perpage,
    pages: total%perpage===0 ? Math.round(total/perpage) : Math.round(total/perpage) + 1,
    data: result.rows
  }
  return res.send(respone)
})

router.get('/detail', async (req, res) => {
  if(req.query.id){
    let result = await getDetail(req.query.id);
    return res.send(result.rows);
  }
  else
    return res.send([]);
})

router.get('/count', async (req, res) => {
  let count = (await countOrder()).rows[0].Total;
  res.send({count})
})

router.get('/countbystate', async (req, res) => {
  let result = await countOrderByState();
  res.send(res.rows)
})

module.exports = router;
