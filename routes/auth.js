const router = require("express").Router();
const passport = require('passport');
const authCheck = require('../app/middleware/checkAuth');
const {getInfoById, updateInfoById} = require('../app/models/Account');

function validationLoginData(payload) {
    const error = {};
    let isValid = true;

    if (!payload || typeof payload.Username !== 'string' || payload.Username.trim() === 0 || payload.Username.length === 0) {
        isValid = false;
        error.Username = 'Xin kiểm tra lại tài khoản';
    }
    if (!payload || typeof payload.Password !== 'string' || payload.Password.trim() === 0 || payload.Password.length === 0) {
        isValid = false;
        error.Password = 'Xin kiểm tra lại mật khẩu';
    }
    return {
        success: isValid,
        error: error
    }
}

function validationRegisterData(payload) {
    const error = {};
    let isValid = true;

    if (!payload || typeof payload.Username !== 'string' || payload.Username.trim() === 0 || payload.Username.length === 0) {
        isValid = false;
        error.Username = 'Xin kiểm tra lại tài khoản';
    }
    if (!payload || typeof payload.Password !== 'string' || payload.Password.trim() === 0 || payload.Password.length === 0) {
        isValid = false;
        error.Password = 'Xin kiểm tra lại mật khẩu';
    }
    if (!payload || (payload.Role && (typeof payload.Role !== 'string' || isNaN(payload.Role)))) {
        isValid = false;
        error.Role = 'Xin kiểm tra lại loại tài khoản';
    }
    return {
        success: isValid,
        error: error
    }
}

function validationInfoData(payload){
    const error = {};
    let isValid = true;
    let regex = /^[+](09|03|849|843)+([0-9]{8})\b/g
    if (!payload || typeof payload.FullName !== 'string' || (payload.FullName && !/[a-zA-Z^ ]/.test(payload.FullName.trim()))) {
        isValid = false;
        error.Username = 'Xin kiểm tra lại Họ tên';
    }
    if (!payload || (payload.Address && typeof payload.Address !== 'string')) {
        isValid = false;
        error.Password = 'Xin kiểm tra lại Địa chỉ';
    }
    if (!payload ||(payload.Phone && typeof payload.Phone !== 'string' && !regex.test(payload.Phone) )) {
        isValid = false;
        error.Password = 'Xin kiểm tra lại Số điện thoại';
    }
    return {
        success: isValid,
        error: error
    }
}

router.post('/login', (req, res, next) => {
    const result = validationLoginData(req.body);
    if (!result.success) {
        return res.status(401).json({
            Success: false,
            Error: result.error
        })
    }
    return passport.authenticate('login', (err, token) => {
        if (err) {
            let error = {};
            error[err.name] = err.message;
            return res.status(401).json({
                Success: false,
                Error: error
            })
        }
        return res.json({
            Success: true,
            Token: token
        })
    })(req, res, next);

})

router.post('/register', (req, res, next) => {
    const result = validationRegisterData(req.body);
    if (!result.success) {
        return res.status(401).json({
            Success: false,
            Error: result.error
        })
    }
    return passport.authenticate('register', err => {
        if (err) {
            let error = {};
            error[err.name] = err.message;
            return res.status(401).json({
                Success: false,
                Error: error
            })
        }
        return res.json({
            Success: true,
            Message: "Tạo tài khoản thành công!"
        })
    })(req, res, next);
})

router.get('/info', authCheck, async (req, res, next) => {
    let result = await getInfoById(req.Id);
    res.json(result.rows[0]);
})

router.get('/info/:id', authCheck, async (req, res, next) => {
    let result = await getInfoById(req.params.id);
    res.json(result.rows[0]);
})

router.put('/info', authCheck, async (req, res, next) => {
    let result = validationInfoData(req.body);
    if (!result.success) {
        return res.status(417).json({
            Success: false,
            Error: result.error
        })
    }
    try {
        result = await updateInfoById(req.Id, req.body.FullName ? req.body.FullName : undefined, req.body.Address ? req.body.Address : undefined, req.body.Phone ? req.body.Phone : undefined);
        return res.json({
            Success: true,
            Message: 'Cập nhật thông tin thành công!'
        })
    } catch (error) {
        return res.status(417).json({
            Success: false,
            Message: 'Cập nhật thông tin thất bại'
        })
    }
})

module.exports = router;
