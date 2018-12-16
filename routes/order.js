const router = require("express").Router();
const {getAll,getDetail,countOrder, countOrderByState, addNew, addOrderDetail, getWaitingOrder, accept, getDeliver, getMyOrder} = require('../app/models/Order')
const firebase = require('firebase');
const authCheck = require('../app/middleware/checkAuth');
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
  res.send(result.rows)
})

router.get('/waiting', async(req, res) => {
  let result = await getWaitingOrder();
  res.send({Data: result.rows})
})


router.post('/', async (req, res) => {
  let order = {
    Name: req.body.Name,
    District: req.body.District,
    Ward: req.body.Ward,
    Street: req.body.Street,
    Number: req.body.Number
  }
  let list = req.body.List;
  try {
    let id = await addNew(order.Name, order.District, order.Ward, order.Street, order.Number);
    let listPromise = list.map(i => addOrderDetail(id.rows[0].Id, i.Id, i.Quantity, i.Note))
    Promise.all(listPromise)
    .then(result => {
      firebase.database().ref(`/order/${id.rows[0].Id}`).set({
        Id: id.rows[0].Id,
        ...order,
        Deliver: ''
      })
      res.status(200).send({Success: true});
    })
    .catch(err => {
      console.log(err);
      res.status(400).send({Success: false})
    })
  } catch (e) {
    console.log(e);
    res.status(400).send({Success: false});
  }
})

router.get('/accept',authCheck, async (req, res) => {
  let id = req.query.id;

  if(!id){
    return res.status(400).send();
  }

  try {
    let result = await getDeliver(id);
    if(!result.rows[0].Deliver){
      await accept(id, req.Id);
      firebase.database().ref(`/order/${id}`).set(null)
      return res.send({Success: true})
    }
    return res.status(400).send();
  } catch (e) {
    console.log(e);
    return res.status(400).send();
  }
})

router.get('/myorder', authCheck, async(req, res) => {
  let id = req.query.id;

  if(!id){
    return res.status(400).send();
  }
  try {
    let result = await getMyOrder(id);
    res.json({
      Data: result.rows
    })
  } catch (e) {
    
  } finally {

  }
})

module.exports = router;
