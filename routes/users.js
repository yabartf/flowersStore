var express = require('express');
var router = express.Router();

/* GET users listing. */
console.log("users router!");
router.get('/', function(req, res, next) {
  //console.log("contact event!");
  res.send('respond with a resource');
});
router.get('/contact', (req, res) => {
  console.log("contact event!");
  res.send('respond with a resource');
});

module.exports = router;
