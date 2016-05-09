'use strict';

const express = require('express');
const router = new express.Router();
const moment = require('moment');

router.get('/', (req, res) => {
  res.redirect('start');
});

router.get('/start', (req, res) => {
  res.render('sprint1v2/start-page.html');
});

router.get('/eligibility', (req, res) => {
  const backLink = 'start';
  res.render('sprint1v2/eligibility.html', {backLink});
});

router.post('/eligibility', (req, res) => {
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

router.get('/details', (req, res) => {
  const backLink = 'eligibility';
  res.render('sprint1v2/details.html', {backLink});
});

router.post('/details', (req, res) => {
  const dob = moment(req.body['dob-day'] + req.body['dob-month'] + req.body['dob-year'], 'DDMMYYYY');
  const dobDiff = dob.diff(moment(), 'years');

  if (dobDiff < -65) {
    res.redirect('exit/details');
  } else {
    res.redirect('details-partner');
  }
});

router.get('/details-partner', (req, res) => {
  const backLink = 'details';
  res.render('sprint1v2/details-partner.html', {backLink});
});

router.post('/details-partner', (req, res) => {
  const dod = moment(req.body['dod-day'] + req.body['dod-month'] + req.body['dod-year'], 'DDMMYYYY');
  const dodDiff = dod.diff(moment(), 'days');

  if (dodDiff < -395) {
    res.redirect('exit/details-partner');
  } else {
    res.redirect('child-benefit');
  }
});

router.get('/child-benefit', (req, res) => {
  const backLink = 'details-partner';
  res.render('sprint1v2/child-benefit.html', {backLink});
});

router.post('/child-benefit', (req, res) => {
  res.redirect('bank-details');
});

router.get('/bank-details', (req, res) => {
  const backLink = 'child-benefit';
  res.render('sprint1v2/bank-details.html', {backLink});
});

router.post('/bank-details', (req, res) => {
  res.redirect('contact');
});

router.get('/contact', (req, res) => {
  const backLink = 'bank-details';
  res.render('sprint1v2/contact.html', {backLink});
});

router.post('/contact', (req, res) => {
  res.redirect('declaration');
});

router.get('/declaration', (req, res) => {
  const backLink = 'contact';
  res.render('sprint1v2/declaration.html', {backLink});
});

router.post('/declaration', (req, res) => {
  res.redirect('end');
});

router.get('/end', (req, res) => {
  const completeDate = moment().format('DD MMMM YYYY');
  res.render('sprint1v2/end-page.html', {completeDate});
});

router.get('/exit/:why', (req, res) => {
  const referrer = req.get('referrer') ? req.get('referrer').split('/').pop() : 'start';
  const why = req.params.why;

  res.render('sprint1v2/exit-page.html', {
    backLink: `/sprint1v2/${referrer}`,
    date: why === 'date',
    location: why === 'did-you-live-in-the-uk',
    married: why === 'relationship-status',
    dateOfBirth: why === 'details',
    dateOfDeath: why === 'details-partner'
  });
});

module.exports = router;
