const router = require("express").Router();
const {count, updateFood, deleteFood} = require('../app/models/Food')

router.get('/count', async (req, res) => {
  let result = await count();
  res.send({count: result.rows[0].Count})
})

router.put('/:id', async (req, res) => {
  try {
      let result = await updateFood(req.params.id, req.body.PhotoUrl, req.body.Price, req.body.Name);
      res.json({
        Success: true
      })
  } catch (e) {
    res.status(400).json({
      Success: false
    })
  } finally {

  }
})

router.delete('/:id', async (req, res) => {
  try {
    await deleteFood(req.params.id);
    res.json({
      Success: true
    })
  } catch (e) {
    res.status(400).json({
      Success: false
    })
  } finally {

  }
})


module.exports = router;
