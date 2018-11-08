const router = require("express").Router();
const { getAll, createRes, getById, updateResById } = require('../app/models/Restaurant');
const { createAddress , updateById} = require('../app/models/Address')


//get danh sách nhà hàng
router.get('/list', async (req, res) => {
  let list = await getAll();
  console.log(list)
  res.json({ Restaurants: list.rows });
})

function checkValidateResData(payload) {
  const error = {};
  let isValid = true;
  if (!payload || typeof payload.Name !== 'string' || payload.Name.trim() === '' || payload.Name.length === 0) {
    isValid = false;
    error.Name = 'Xin kiểm tra lại tên nhà hàng';
  }
  if (!payload || typeof payload.Province !== 'string' || payload.Province.length === 0) {
    isValid = false;
    error.Province = 'Xin kiểm tra lại địa chỉ: Tỉnh/Thành phố';
  }
  if (!payload || typeof payload.District !== 'string' || payload.District.length === 0) {
    isValid = false;
    error.District = 'Xin kiểm tra lại địa chỉ: Quận/Huyện';
  }
  if (!payload || typeof payload.Ward !== 'string' || payload.Ward.length === 0) {
    isValid = false;
    error.Ward = 'Xin kiểm tra lại địa chỉ: Phường/Xã';
  }
  if (payload.Street && typeof payload.Street !== 'string') {
    isValid = false;
    error.Street = 'Xin kiểm tra lại tên đường';
  }
  if (payload.Number && typeof payload.Number !== 'string') {
    isValid = false;
    error.Number = 'Xin kiểm tra lại số nhà';
  }

  return {
    success: isValid,
    error: error
  }
}


//tạo nhà hàng mới
router.post('/', async (req, res) => {
  const result = checkValidateResData(req.body);
  if (!result.success) {
    return res.status(400).json({
      Success: false,
      Error: result.error
    })
  }
  try {
    let resAddress = await createAddress(req.body.Province, req.body.District, req.body.Ward, req.body.Street, req.body.Number);
    let AddressId = resAddress.rows[0].Id;

    let resRestaurant = await createRes(req.body.Name, req.body.OpenTime, req.body.CloseTime, req.body.photoUrl, AddressId);
    res.json({ Success: true })
  } catch (error) {
    res.json({ Success: false })
  }
})
//cập nhật nhà hàng
/*
  Cập nhật:
    + tên
    + giờ mở/đóng cửa
    + Địa chỉ: tỉnh. huyện , xã, đường, số nhà
    + hình
*/

function checkValidWhenUpdate(payload) {
  const error = {};
  let isValid = true;
  if (payload.Name && ( typeof payload.Name !== 'string' || payload.Name.trim() === '' || payload.Name.length === 0)) {
    isValid = false;
    error.Name = 'Xin kiểm tra lại tên nhà hàng';
  }
  if (payload.Province &&(typeof payload.Province !== 'string' || payload.Province.length === 0)) {
    isValid = false;
    error.Province = 'Xin kiểm tra lại địa chỉ: Tỉnh/Thành phố';
  }
  if (payload.District && (typeof payload.District !== 'string' || payload.District.length === 0)) {
    isValid = false;
    error.District = 'Xin kiểm tra lại địa chỉ: Quận/Huyện';
  }
  if (payload.Ward && (typeof payload.Ward !== 'string' || payload.Ward.length === 0)) {
    isValid = false;
    error.Ward = 'Xin kiểm tra lại địa chỉ: Phường/Xã';
  }
  if (payload.Street && (typeof payload.Street !== 'string' || payload.Street.length === 0)) {
    isValid = false;
    error.Street = 'Xin kiểm tra lại tên đường';
  }
  if (payload.Number && (typeof payload.Number !== 'string' || payload.Street.length === 0)) {
    isValid = false;
    error.Number = 'Xin kiểm tra lại số nhà';
  }
  if(payload.OpenTime && (typeof payload.OpenTime !== 'string' || payload.Street.length === 0)){
    isValid = false;
    error.OpenTime = 'Xin kiểm tra lại thời gian mở cửa';
  }
  if(payload.CloseTime && (typeof payload.CloseTime !== 'string' || payload.CloseTime.length === 0)){
    isValid = false;
    error.OpenTime = 'Xin kiểm tra lại thời gian đóng cửa';
  }

  return {
    success: isValid,
    error: error
  }
}

router.put('/:id', async (req, res) => {
  const result = checkValidWhenUpdate(req.body);
  if (!result.success) {
    return res.status(400).json({
      Success: false,
      Error: result.error
    })
  }
  
  try {
    let restaurant = await getById(req.params.id);
    if(!restaurant.rows[0]){
      return res.json({Success: false, Message: `Không tìm thấy nhà hàng có Id = ${req.params.id}`})
    }
    let updateRes = await updateResById(restaurant.rows[0].Id, req.body.Name, req.body.OpenTime, req.body.CloseTime);
    let   updateAdd = await updateById(restaurant.rows[0].Address, req.body.Province, req.body.District, req.body.Ward, req.body.Street, req.body.Number);
    res.json({ Success: true })
    
  } catch (error) {
    console.log(error)
    res.json({Success: false})
  }
})


module.exports = router;