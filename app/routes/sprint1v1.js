'use strict';

const express = require('express');
const router = new express.Router();
const moment = require('moment');

router.get('/', (req, res) => {
  res.redirect('start');
});

router.get('/start', (req, res) => {
  res.render('sprint1v1/start-page.html');
});

router.get('/relationship-status', (req, res) => {
  const backLink = 'start';
  res.render('sprint1v1/relationship-status.html', {backLink});
});

router.post('/relationship-status', (req, res) => {
  if (req.body['still-married-select'] === 'No') {
    res.redirect('exit');
  } else {
    res.redirect('date');
  }
});

router.get('/date', (req, res) => {
  const backLink = 'relationship-status';
  res.render('sprint1v1/what-date-did-they-die.html', {backLink});
});

router.post('/date', (req, res) => {
  if (req.body['last-twelve-months-select'] === 'No') {
    res.redirect('exit');
  } else {
    res.redirect('did-you-live-in-the-uk');
  }
});

router.get('/did-you-live-in-the-uk', (req, res) => {
  const backLink = 'date';
  res.render('sprint1v1/did-you-live-in-the-uk.html', {backLink});
});

router.post('/did-you-live-in-the-uk', (req, res) => {
  if (req.body['lived-in-uk-select'] === 'No') {
    res.redirect('exit');
  } else {
    res.redirect('details');
  }
});

router.get('/details', (req, res) => {
  const backLink = 'did-you-live-in-the-uk';
  res.render('sprint1v1/details.html', {backLink});
});

router.post('/details', (req, res) => {
  const dob = moment(req.body['dob-day'] + req.body['dob-month'] + req.body['dob-year'], 'DDMMYYYY');
  const dobDiff = dob.diff(moment(), 'years');

  if (dobDiff < -65) {
    res.redirect('exit');
  } else {
    res.redirect('details-partner');
  }
});

router.get('/details-partner', (req, res) => {
  const backLink = 'details';
  res.render('sprint1v1/details-partner.html', {backLink});
});

router.post('/details-partner', (req, res) => {
  const dod = moment(req.body['dod-day'] + req.body['dod-month'] + req.body['dod-year'], 'DDMMYYYY');
  const dodDiff = dod.diff(moment(), 'days');

  if (dodDiff < -395) {
    res.redirect('exit');
  } else {
    res.redirect('dependent-children');
  }
});

router.get('/dependent-children', (req, res) => {
  const backLink = 'details-partner';
  res.render('sprint1v1/dependent-children.html', {backLink});
});

router.post('/dependent-children', (req, res) => {
  if (req.body['do-you-have-children-select'] === 'Yes') {
    res.redirect('child-benefit');
  } else {
    res.redirect('bank-details');
  }
});

router.get('/child-benefit', (req, res) => {
  const backLink = 'dependent-children';
  res.render('sprint1v1/child-benefit.html', {backLink});
});

router.post('/child-benefit', (req, res) => {
  res.redirect('bank-details');
});

router.get('/bank-details', (req, res) => {
  const backLink = 'child-benefit';
  res.render('sprint1v1/bank-details.html', {backLink});
});

router.post('/bank-details', (req, res) => {
  res.redirect('contact');
});

router.get('/contact', (req, res) => {
  const backLink = 'bank-details';
  res.render('sprint1v1/contact.html', {backLink});
});

router.post('/contact', (req, res) => {
  res.redirect('declaration');
});

router.get('/declaration', (req, res) => {
  const backLink = 'contact';
  res.render('sprint1v1/declaration.html', {backLink});
});

router.post('/declaration', (req, res) => {
  res.redirect('end');
});

router.get('/end', (req, res) => {
  const completeDate = moment().format('DD MMMM YYYY');
  res.render('sprint1v1/end-page.html', {completeDate});
});

router.get('/exit', (req, res) => {
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
