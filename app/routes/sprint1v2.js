var express = require('express');
var router = new express.Router();
var moment = require('moment');

router.get('/', function (req, res) {
  res.redirect('start');
});

router.get('/start', function (req, res) {
  res.render('sprint1v2/start-page.html');
});

router.get('/eligibility', function (req, res) {
  var backLink = 'start';
  res.render('sprint1v2/eligibility.html', {backLink: backLink});
});

router.post('/eligibility', function (req, res) {
  if (req.body['still-married-select'] === 'No') {
    res.redirect('exit/relationship-status');
  } else if (req.body['last-twelve-months-select'] === 'No') {
    res.redirect('exit/date');
  } else if (req.body['lived-in-uk-select'] === 'No') {
    res.redirect('exit/did-you-live-in-the-uk');
  } else {
    res.redirect('details');
  }
});

router.get('/details', function (req, res) {
  var backLink = 'eligibility';
  res.render('sprint1v2/details.html', {backLink: backLink});
});

router.post('/details', function (req, res) {
  var dob = moment(req.body['dob-day'] + req.body['dob-month'] + req.body['dob-year'], 'DDMMYYYY');
  var dobDiff = dob.diff(moment(), 'years');

  if (dobDiff < -65) {
    res.redirect('exit/details');
  } else {
    res.redirect('details-partner');
  }
});

router.get('/details-partner', function (req, res) {
  var backLink = 'details';
  res.render('sprint1v2/details-partner.html', {backLink: backLink});
});

router.post('/details-partner', function (req, res) {
  var dod = moment(req.body['dod-day'] + req.body['dod-month'] + req.body['dod-year'], 'DDMMYYYY');
  var dodDiff = dod.diff(moment(), 'days');

  if (dodDiff < -395) {
    res.redirect('exit/details-partner');
  } else {
    res.redirect('child-benefit');
  }
});

router.get('/child-benefit', function (req, res) {
  var backLink = 'details-partner';
  res.render('sprint1v2/child-benefit.html', {backLink: backLink});
});

router.post('/child-benefit', function (req, res) {
  res.redirect('bank-details');
});

router.get('/bank-details', function (req, res) {
  var backLink = 'child-benefit';
  res.render('sprint1v2/bank-details.html', {backLink: backLink});
});

router.post('/bank-details', function (req, res) {
  res.redirect('contact');
});

router.get('/contact', function (req, res) {
  var backLink = 'bank-details';
  res.render('sprint1v2/contact.html', {backLink: backLink});
});

router.post('/contact', function (req, res) {
  res.redirect('declaration');
});

router.get('/declaration', function (req, res) {
  var backLink = 'contact';
  res.render('sprint1v2/declaration.html', {backLink: backLink});
});

router.post('/declaration', function (req, res) {
  res.redirect('end');
});

router.get('/end', function (req, res) {
  var completeDate = getTodaysDate();
  res.render('sprint1v2/end-page.html', {completeDate: completeDate});
});

router.get('/exit/:why', function (req, res) {
  var referrer = req.get('referrer') ? req.get('referrer').split('/').pop() : 'start';
  var why = req.params.why;

  res.render('sprint1/exit-page.html', {
    backLink: '/sprint1v2/' + referrer,
    date: why === 'date',
    location: why === 'did-you-live-in-the-uk',
    married: why === 'relationship-status',
    dateOfBirth: why === 'details',
    dateOfDeath: why === 'details-partner'
  });
});

module.exports = router;

// Get todays date and format it
function getTodaysDate() {
  var date = new Date();
  var monthNames = [
    'January', 'February', 'March',
    'April', 'May', 'June', 'July',
    'August', 'September', 'October',
    'November', 'December'
  ];
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  date = day + ' ' + monthNames[month] + ' ' + year;

  return date;
}
