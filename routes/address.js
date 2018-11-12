const router = require('express').Router();

const {getAllDistrict, getWard} = require('../app/models/Address');

router.get('/districts', (req, res) => {
  let districts = getAllDistrict();
  return res.json(districts);
})

router.get('/ward', (req, res) => {
  let wards = getWard(req.query.d);
  return res.json(wards)
})



module.exports = router;