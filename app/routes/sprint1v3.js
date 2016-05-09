'use strict';

const express = require('express');
const router = new express.Router();
const moment = require('moment');

router.get('/', (req, res) => {
  res.redirect('start');
});

router.get('/start', (req, res) => {
  res.render('sprint1v3/start-page.html');
});

router.get('/eligibility', (req, res) => {
  const backLink = 'start';
  res.render('sprint1v3/eligibility.html', {backLink});
});

router.post('/eligibility', (req, res) => {
  let qString = '?';
  for (const field in req.body) {
    if (req.body[field] === 'No') {
      qString += `${field}=No&`;
    }

    if (field === 'last-twelve-months-select' && req.body[field] === 'No') {
      qString += 'bb1&';
    }
  }
  qString = qString.slice(0, -1);

  if (qString.length > 0) {
    res.redirect(`exit${qString}`);
  } else {
    res.redirect('details');
  }
});

router.get('/details', (req, res) => {
  const backLink = 'eligibility';
  res.render('sprint1v3/details.html', {backLink});
});

router.post('/details', (req, res) => {
  const dob = moment(req.body['dob-day'] + req.body['dob-month'] + req.body['dob-year'], 'DDMMYYYY');
  const dobDiff = dob.diff(moment(), 'years');

  if (dobDiff < -65) {
    res.redirect('exit?details=no');
  } else {
    res.redirect('details-partner');
  }
});

router.get('/details-partner', (req, res) => {
  const backLink = 'details';
  res.render('sprint1v3/details-partner.html', {backLink});
});

router.post('/details-partner', (req, res) => {
  const dod = moment(req.body['dod-day'] + req.body['dod-month'] + req.body['dod-year'], 'DDMMYYYY');
  const dodDiff = dod.diff(moment(), 'days');
  const beforeAprSvth = dod.isBefore(moment('07042016', "DDMMYYYY"));

  if (dodDiff < -395 || beforeAprSvth) {
    res.redirect('exit?details-partner=no');
  } else {
    res.redirect('dependent-children');
  }
});

router.get('/dependent-children', (req, res) => {
  const backLink = 'details-partner';
  res.render('sprint1v3/dependent-children.html', {backLink});
});

router.post('/dependent-children', (req, res) => {
  if (req.body['do-you-have-children-select'] === "Yes") {
    res.redirect('child-benefit');
  } else {
    res.redirect('bank-details');
  }
});

router.get('/child-benefit', (req, res) => {
  const backLink = 'dependent-children';
  res.render('sprint1v3/child-benefit.html', {backLink});
});

router.post('/child-benefit', (req, res) => {
  res.redirect('bank-details');
});

router.get('/bank-details', (req, res) => {
  const referrer = req.get('referrer') ? req.get('referrer').split('/').pop() : 'child-benefit';
  res.render('sprint1v3/bank-details.html', {backLink: referrer});
});

router.post('/bank-details', (req, res) => {
  res.redirect('declaration');
});

router.get('/declaration', (req, res) => {
  const backLink = 'bank-details';
  res.render('sprint1v3/declaration.html', {backLink});
});

router.post('/declaration', (req, res) => {
  res.redirect('end');
});

router.get('/end', (req, res) => {
  const completeDate = moment().format('DD MMMM YYYY');
  res.render('sprint1v3/end-page.html', {completeDate});
});

router.get('/exit', (req, res) => {
  const referrer = req.get('referrer') ? req.get('referrer').split('/').pop() : 'start';
  let buttonLink;

  if (referrer === 'eligibility') {
    buttonLink = 'details';
  } else if (referrer === 'details') {
    buttonLink = 'details-partner';
  } else if (referrer === 'details-partner') {
    buttonLink = 'dependent-children';
  } else {
    buttonLink = '/';
  }

  res.render('sprint1v3/exit-page.html', {
    buttonLink,
    backLink: `/sprint1v3/${referrer}`,
    date: req.query['last-twelve-months-select'] || req.query['details-partner'],
    location: req.query['lived-in-uk-select'],
    married: req.query['still-married-select'],
    dateOfBirth: req.query.details
  });
});

module.exports = router;
