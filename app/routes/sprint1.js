var express = require('express');
var router = new express.Router();

router.get('/start', function (req, res) {
  res.render('sprint1/start-page.html');
});

router.get('/preq-date', function (req, res) {
  res.render('sprint1/what-date-did-they-die.html');
});

router.get('/preq-marriage', function (req, res) {
  res.render('sprint1/were-you-still-married.html');
});

router.get('/preq-location', function (req, res) {
  res.render('sprint1/did-you-live-in-the-uk.html');
});

router.get('/details', function (req, res) {
  res.render('sprint1/details.html');
});

router.get('/dependant-children', function (req, res) {
  res.render('sprint1/dependant-children.html');
});

// child benefit?

router.get('/bank-details', function (req, res) {
  res.render('sprint1/bank-details.html');
});

router.get('/contact', function (req, res) {
  res.render('sprint1/contact.html');
});

router.get('/end', function (req, res) {
  res.render('sprint1/end-page.html');
});

router.get('/exit', function (req, res) {
  res.render('sprint1/exit-page.html');
});

module.exports = router;
