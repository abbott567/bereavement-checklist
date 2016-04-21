'use strict';

const express = require('express');
const router = new express.Router();
const moment = require('moment');

router.get('/', function (req, res) {
  res.redirect('start');
});

router.get('/start', function (req, res) {
  res.render('sprint1v1/start-page.html');
});

router.get('/relationship-status', function (req, res) {
  const backLink = 'start';
  res.render('sprint1v1/relationship-status.html', {backLink: backLink});
});

router.post('/relationship-status', function (req, res) {
  if (req.body['still-married-select'] === 'No') {
    res.redirect('exit');
  } else {
    res.redirect('date');
  }
});

router.get('/date', function (req, res) {
  const backLink = 'relationship-status';
  res.render('sprint1v1/what-date-did-they-die.html', {backLink: backLink});
});

router.post('/date', function (req, res) {
  if (req.body['last-twelve-months-select'] === 'No') {
    res.redirect('exit');
  } else {
    res.redirect('did-you-live-in-the-uk');
  }
});

router.get('/did-you-live-in-the-uk', function (req, res) {
  const backLink = 'date';
  res.render('sprint1v1/did-you-live-in-the-uk.html', {backLink: backLink});
});

router.post('/did-you-live-in-the-uk', function (req, res) {
  if (req.body['lived-in-uk-select'] === 'No') {
    res.redirect('exit');
  } else {
    res.redirect('details');
  }
});

router.get('/details', function (req, res) {
  const backLink = 'did-you-live-in-the-uk';
  res.render('sprint1v1/details.html', {backLink: backLink});
});

router.post('/details', function (req, res) {
  const dob = moment(req.body['dob-day'] + req.body['dob-month'] + req.body['dob-year'], 'DDMMYYYY');
  const dobDiff = dob.diff(moment(), 'years');

  if (dobDiff < -65) {
    res.redirect('exit');
  } else {
    res.redirect('details-partner');
  }
});

router.get('/details-partner', function (req, res) {
  const backLink = 'details';
  res.render('sprint1v1/details-partner.html', {backLink: backLink});
});

router.post('/details-partner', function (req, res) {
  const dod = moment(req.body['dod-day'] + req.body['dod-month'] + req.body['dod-year'], 'DDMMYYYY');
  const dodDiff = dod.diff(moment(), 'days');

  if (dodDiff < -395) {
    res.redirect('exit');
  } else {
    res.redirect('dependent-children');
  }
});

router.get('/dependent-children', function (req, res) {
  const backLink = 'details-partner';
  res.render('sprint1v1/dependent-children.html', {backLink: backLink});
});

router.post('/dependent-children', function (req, res) {
  if (req.body['do-you-have-children-select'] === 'Yes') {
    res.redirect('child-benefit');
  } else {
    res.redirect('bank-details');
  }
});

router.get('/child-benefit', function (req, res) {
  const backLink = 'dependent-children';
  res.render('sprint1v1/child-benefit.html', {backLink: backLink});
});

router.post('/child-benefit', function (req, res) {
  res.redirect('bank-details');
});

router.get('/bank-details', function (req, res) {
  const backLink = 'child-benefit';
  res.render('sprint1v1/bank-details.html', {backLink: backLink});
});

router.post('/bank-details', function (req, res) {
  res.redirect('contact');
});

router.get('/contact', function (req, res) {
  const backLink = 'bank-details';
  res.render('sprint1v1/contact.html', {backLink: backLink});
});

router.post('/contact', function (req, res) {
  res.redirect('declaration');
});

router.get('/declaration', function (req, res) {
  const backLink = 'contact';
  res.render('sprint1v1/declaration.html', {backLink: backLink});
});

router.post('/declaration', function (req, res) {
  res.redirect('end');
});

router.get('/end', function (req, res) {
  const completeDate = moment().format('DD MMMM YYYY');
  res.render('sprint1v1/end-page.html', {completeDate: completeDate});
});

router.get('/exit', function (req, res) {
  const referrer = req.get('referrer') ? req.get('referrer').split('/').pop() : 'start';

  res.render('sprint1v1/exit-page.html', {
    backLink: referrer,
    date: referrer === 'date',
    location: referrer === 'did-you-live-in-the-uk',
    married: referrer === 'relationship-status',
    dateOfBirth: referrer === 'details',
    dateOfDeath: referrer === 'details-partner'
  });
});

module.exports = router;
