var express = require('express');
var router = new express.Router();

router.get('/start', function (req, res) {
  res.render('sprint1/start-page.html');
});

router.get('/relationship-status', function (req, res) {
  var backLink = 'start';
  res.render('sprint1/relationship-status.html', {backLink: backLink});
});

router.post('/relationship-status', function (req, res) {
  res.redirect('date');
});

router.get('/date', function (req, res) {
  var backLink = 'relationship-status';
  res.render('sprint1/what-date-did-they-die.html', {backLink: backLink});
});

router.post('/date', function (req, res) {
  res.redirect('did-you-live-in-the-uk');
});

router.get('/did-you-live-in-the-uk', function (req, res) {
  var backLink = 'date';
  res.render('sprint1/did-you-live-in-the-uk.html', {backLink: backLink});
});

router.post('/did-you-live-in-the-uk', function (req, res) {
  res.redirect('details');
});

router.get('/details', function (req, res) {
  var backLink = 'did-you-live-in-the-uk';
  res.render('sprint1/details.html', {backLink: backLink});
});

router.post('/details', function (req, res) {
  res.redirect('details-partner');
});

router.get('/details-partner', function (req, res) {
  var backLink = 'details';
  res.render('sprint1/details-partner.html', {backLink: backLink});
});

router.post('/details-partner', function (req, res) {
  res.redirect('dependant-children');
});

router.get('/dependant-children', function (req, res) {
  var backLink = 'details-partner';
  res.render('sprint1/dependant-children.html', {backLink: backLink});
});

router.post('/dependant-children', function (req, res) {
  res.redirect('bank-details');
});

// child benefit?

router.get('/bank-details', function (req, res) {
  var backLink = 'dependant-children';
  res.render('sprint1/bank-details.html', {backLink: backLink});
});

router.post('/bank-details', function (req, res) {
  res.redirect('contact');
});

router.get('/contact', function (req, res) {
  var backLink = 'bank-details';
  res.render('sprint1/contact.html', {backLink: backLink});
});

router.post('/contact', function (req, res) {
  res.redirect('declaration');
});

router.get('/declaration', function (req, res) {
  var backLink = 'bank-details';
  res.render('sprint1/declaration.html', {backLink: backLink});
});

router.post('/declaration', function (req, res) {
  res.redirect('end');
});

router.get('/end', function (req, res) {
  var completeDate = getTodaysDate();
  res.render('sprint1/end-page.html', {completeDate: completeDate});
});

router.get('/exit', function (req, res) {
  var referrer = req.get('referrer') || 'start';

  res.render('sprint1/exit-page.html', {
    backLink: referrer,
    date: referrer === 'date',
    location: referrer === 'did-you-live-in-the-uk',
    married: referrer === 'relationship-status'
  });
});

module.exports = router;

// Get todays date and format it
function getTodaysDate() {
  var date = new Date();
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  date = day + ' ' + monthNames[month] + ' ' + year;

  return date;
}
