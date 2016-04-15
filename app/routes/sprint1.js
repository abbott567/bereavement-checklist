var express = require('express');
var router = new express.Router();

router.get('/start', function (req, res) {
  res.render('sprint1/start-page.html');
});

router.get('/preq-relationship-status', function (req, res) {
  res.render('sprint1/relationship-status.html');
});

router.post('/preq-relationship-status', function (req, res) {
  res.redirect('preq-date');
});

router.get('/preq-date', function (req, res) {
  res.render('sprint1/what-date-did-they-die.html');
});

router.post('/preq-date', function (req, res) {
  res.redirect('preq-did-you-live-in-the-uk');
});

router.get('/preq-did-you-live-in-the-uk', function (req, res) {
  res.render('sprint1/did-you-live-in-the-uk.html');
});

router.post('/preq-did-you-live-in-the-uk', function (req, res) {
  res.redirect('details');
});

router.get('/details', function (req, res) {
  res.render('sprint1/details.html');
});

router.post('/details', function (req, res) {
  res.redirect('details-partner');
});

router.get('/details-partner', function (req, res) {
  res.render('sprint1/details-partner.html');
});

router.post('/details-partner', function (req, res) {
  res.redirect('dependant-children');
});

router.get('/dependant-children', function (req, res) {
  res.render('sprint1/dependant-children.html');
});

router.post('/dependant-children', function (req, res) {
  res.redirect('bank-details');
});

// child benefit?

router.get('/bank-details', function (req, res) {
  res.render('sprint1/bank-details.html');
});

router.post('/bank-details', function (req, res) {
  res.redirect('contact');
});

router.get('/contact', function (req, res) {
  res.render('sprint1/contact.html');
});

router.post('/contact', function (req, res) {
  res.redirect('end');
});

router.get('/end', function (req, res) {
  res.render('sprint1/end-page.html');
});

router.get('/exit', function (req, res) {
  res.render('sprint1/exit-page.html');
});

module.exports = router;
