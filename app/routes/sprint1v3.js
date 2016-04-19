var express = require('express');
var router = new express.Router();
var moment = require('moment');

router.get('/', function (req, res) {
  res.redirect('start');
});

router.get('/start', function (req, res) {
  res.render('sprint1v3/start-page.html');
});

router.get('/eligibility', function (req, res) {
  var backLink = 'start';
  res.render('sprint1v3/eligibility.html', {backLink: backLink});
});

router.post('/eligibility', function (req, res) {
  var qString = '?';
  for (var field in req.body) {
    if (req.body[field] === 'No') {
      qString += field + '=no&';
    }
  }
  qString = qString.slice(0, -1);

  if (qString.length > 0) {
    res.redirect('exit' + qString);
  } else {
    res.redirect('details');
  }
});

router.get('/details', function (req, res) {
  var backLink = 'eligibility';
  res.render('sprint1v3/details.html', {backLink: backLink});
});

router.post('/details', function (req, res) {
  var dob = moment(req.body['dob-day'] + req.body['dob-month'] + req.body['dob-year'], 'DDMMYYYY');
  var dobDiff = dob.diff(moment(), 'years');

  if (dobDiff < -65) {
    res.redirect('exit?details=no');
  } else {
    res.redirect('details-partner');
  }
});

router.get('/details-partner', function (req, res) {
  var backLink = 'details';
  res.render('sprint1v3/details-partner.html', {backLink: backLink});
});

router.post('/details-partner', function (req, res) {
  var dod = moment(req.body['dod-day'] + req.body['dod-month'] + req.body['dod-year'], 'DDMMYYYY');
  var dodDiff = dod.diff(moment(), 'days');

  if (dodDiff < -395) {
    res.redirect('exit?details-partner=no');
  } else {
    res.redirect('child-benefit');
  }
});

router.get('/child-benefit', function (req, res) {
  var backLink = 'details-partner';
  res.render('sprint1v3/child-benefit.html', {backLink: backLink});
});

router.post('/child-benefit', function (req, res) {
  res.redirect('bank-details');
});

router.get('/bank-details', function (req, res) {
  var backLink = 'child-benefit';
  res.render('sprint1v3/bank-details.html', {backLink: backLink});
});

router.post('/bank-details', function (req, res) {
  res.redirect('contact');
});

router.get('/contact', function (req, res) {
  var backLink = 'bank-details';
  res.render('sprint1v3/contact.html', {backLink: backLink});
});

router.post('/contact', function (req, res) {
  res.redirect('declaration');
});

router.get('/declaration', function (req, res) {
  var backLink = 'contact';
  res.render('sprint1v3/declaration.html', {backLink: backLink});
});

router.post('/declaration', function (req, res) {
  res.redirect('end');
});

router.get('/end', function (req, res) {
  var completeDate = moment().format('DD MMMM YYYY');
  res.render('sprint1v3/end-page.html', {completeDate: completeDate});
});

router.get('/exit', function (req, res) {
  var referrer = req.get('referrer') ? req.get('referrer').split('/').pop() : 'start';

  res.render('sprint1v3/exit-page.html', {
    backLink: '/sprint1v3/' + referrer,
    date: req.query['last-twelve-months-select'],
    location: req.query['lived-in-uk-select'],
    married: req.query['still-married-select'],
    dateOfBirth: req.query.details,
    dateOfDeath: req.query['details-partner']
  });
});

router.post('/exit', function (req, res) {
  if (req.body['exit-continue-select'] === 'Yes') {
    res.redirect('details');
  } else {
    res.redirect('/');
  }
});

module.exports = router;
