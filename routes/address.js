const router = require('express').Router();

const { getAllDistrict, getWard, getWardByDistrictName } = require('../app/models/Address');

router.get('/districts', (req, res) => {
  let districts = getAllDistrict();
  return res.json(districts);
})

router.get('/ward', async (req, res) => {
  let d = req.query.d;
  let wards = []
  console.log(typeof d)
  if (typeof d === 'string' && !isNaN(d)){
    console.log(Number.parseInt(d, 10))
    wards = await getWard(Number.parseInt(d, 10));
  }
    
  else {
    if (typeof d === 'string')
      wards = await getWardByDistrictName(d)
  }
  return res.json(wards)
})



module.exports = router;