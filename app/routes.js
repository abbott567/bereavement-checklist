var express = require('express');
var router = new express.Router();

router.get('/', function (req, res) {
  res.render('index');
});

module.exports = router;
