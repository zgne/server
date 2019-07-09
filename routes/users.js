var express = require('express');
var router = express.Router();
var controllerUser = require('../controllers/index');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login',controllerUser.login);
router.post('/register',controllerUser.register);
router.get('/verify',controllerUser.verify);
router.get('/logout',controllerUser.logout);
router.get('/getUser',controllerUser.getUser);
router.post('/resetPassword',controllerUser.resetPassword);
module.exports = router;
