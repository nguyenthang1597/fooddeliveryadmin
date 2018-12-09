const router = require("express").Router();
const { getAll,countNumberRestaurant, createRes, getById, updateResById, getMenuById } = require('../app/models/Restaurant');
const { createAddress , updateById} = require('../app/models/Address')
const {createMenu, getMenuIdOfRes} = require('../app/models/RestaurantMenu')
const {createFood} = require('../app/models/Food')
const {addFoodToMenu} = require('../app/models/MenuDetail')
//get danh sách nhà hàng
router.get('/list', async (req, res) => {
  let page = req.query.page || 1;
  let perpage = req.query.perpage || 10;
  let list = await getAll(page, perpage);
  let total = (await countNumberRestaurant()).rows[0].total;
  res.json({total: total, page: page, pages: total%perpage===0 ? Math.round(total/perpage) : Math.round(total/perpage) + 1, perpage:perpage, Restaurants: list.rows });
})

function checkValidateResData(payload) {
  const error = {};
  let isValid = true;
  if (!payload || typeof payload.Name !== 'string' || payload.Name.trim() === '' || payload.Name.length === 0) {
    isValid = false;
    error.Name = 'Xin kiểm tra lại tên nhà hàng';
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
    let resAddress = await createAddress(req.body.District, req.body.Ward, req.body.Street, req.body.Number);
    let AddressId = resAddress.rows[0].Id;

    let resRestaurant = await createRes(req.body.Name, req.body.OpenTime, req.body.CloseTime, req.body.PhotoUrl, AddressId);
    let ResId = resRestaurant.rows[0].Id;
    await createMenu(ResId);
    res.json({ Success: true })
  } catch (error) {
    console.log(error)
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
  if (payload.Number && (typeof payload.Number !== 'string' || payload.Number.length === 0)) {
    isValid = false;
    error.Number = 'Xin kiểm tra lại số nhà';
  }
  if(payload.OpenTime && (typeof payload.OpenTime !== 'string' || payload.OpenTime.length === 0)){
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
    let updateRes = await updateResById(restaurant.rows[0].Id, req.body.Name, req.body.OpenTime, req.body.CloseTime, req.body.PhotoUrl);
    let   updateAdd = await updateById(restaurant.rows[0].Address, req.body.District, req.body.Ward, req.body.Street, req.body.Number);
    res.json({ Success: true })

  } catch (error) {
    console.log(error)
    res.status(400).json({Success: false})
  }
})

router.get('/:id/menu', async (req, res) => {
  try {
    let result = await getMenuById(req.params.id);
    return res.json({Total: result.rowCount, Menu: result.rows});
  } catch (error) {
    return res.json([])
  }
})

//thêm món ăn

function checkFoodInfo(payload){
  let error = {};
  let isValid = true;
  console.log(payload)
  if(!payload || !payload.Name || payload.Name.trim() === '' || payload.Name.length === 0){
    isValid = false;
    error.Name = 'Vui lòng kiểm tra lại tên món ăn'
  }
  if(!payload || !payload.PhotoUrl || payload.PhotoUrl.trim() === '' || payload.PhotoUrl.length === 0){
    isValid = false;
    error.PhotoUrl = 'Vui lòng kiểm tra lại hình của món ăn'
  }
  if(!payload || !payload.Price){
    isValid = false;
    error.Price = 'Vui lòng kiểm tra lại giá món ăn'
  }

  return {
    success: isValid,
    error
  }
}

router.post('/:id/menu', async (req, res) => {
  let result = checkFoodInfo(req.body);

  if(!result.success){
    return res.status(400).json({
      Success: false,
      Error: result.error
    })
  }

  try {
    let menuId = (await getMenuIdOfRes(req.params.id)).rows[0].Menu;
    console.log('menuId', menuId)
    let foodId = (await createFood(req.body.Name, req.body.PhotoUrl, req.body.Price)).rows[0].Id;
    await addFoodToMenu(menuId, foodId);
    return res.json({
      Success: true
    })
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      Success:false
    })
  }
})

router.get('/count', async (req, res) => {
  let result = await countNumberRestaurant();
  return res.send({count: result.rows[0].total})
})


router.get('/:id', async (req, res) => {
  let result = await getById(req.params.id);
  return res.json({Restaurant: result.rows[0]})
})



module.exports = router;
