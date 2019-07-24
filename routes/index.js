/*PÁGINAS DE LA WEB*/
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Travel Agency' });
});

router.get('/register', function(req, res, next) {/*JS5 */
  res.render('register', { title: 'Travel Agency' });
});/* ESM6 */  /*router.get('/register',(req,res)=>res.render('register.hbs')); */

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Travel Agency' });
});

router.get('/recovery', function(req, res, next) {
  res.render('recovery', { title: 'Travel Agency' });
});

router.get('/registro', function(req, res, next) {
  res.render('registro', { title: 'Travel Agency' });
});

router.get('/activo', function(req, res, next) {
  res.render('activo', { title: 'Travel Agency' });
});


module.exports = router;
