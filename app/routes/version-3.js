'use strict';
const express = require('express');
const moment = require('moment');

const router = new express.Router();

router.get('/', (req, res) => {
  res.redirect('/version-3/start');
});

router.get('/start', (req, res) => {
  res.render('version-3/start-page.html');
});

router.post('/start', (req, res) => {
  res.redirect('details-partner');
});

router.get('/details-partner', (req, res) => {
  res.render('version-3/details-partner.html');
});

router.post('/details-partner', (req, res) => {
  res.cookie('name', req.body['full-name']);
  res.redirect('details-yours');
});

router.get('/details-yours', (req, res) => {
  const name = req.cookies.name;
  res.render('version-3/details-yours.html', {name});
});

router.post('/details-yours', (req, res) => {
  res.cookie('relationship', req.body['relationship-to-select']);
  const age = `${req.body['dob-day']}${req.body['dob-month']}${req.body['dob-year']}`;
  res.cookie('age', age);
  if (req.body['next-of-kin-select'] === 'Yes') {
    res.redirect('details-contact');
  } else {
    res.redirect('details-next-of-kin');
  }
});

router.get('/details-contact', (req, res) => {
  res.render('version-3/details-contact.html');
});

router.post('/details-contact', (req, res) => {
  res.redirect('whats-been-done');
});

router.get('/details-next-of-kin', (req, res) => {
  res.render('version-3/details-next-of-kin.html');
});

router.post('/details-next-of-kin', (req, res) => {
  res.redirect('whats-been-done');
});

router.get('/whats-been-done', (req, res) => {
  res.render('version-3/whats-been-done.html');
});

router.post('/whats-been-done', (req, res) => {
  res.redirect('start-page-next');
});

router.get('/start-page-next', (req, res) => {
  res.render('version-3/start-page-next.html');
});

router.post('/start-page-next', (req, res) => {
  res.redirect('have-you-registered');
});

router.get('/have-you-registered', (req, res) => {
  res.render('version-3/have-you-registered.html');
});

router.post('/have-you-registered', (req, res) => {
  if (req.body['registered-death-select'] === 'Yes') {
    res.redirect('have-you-arranged-funeral');
  } else {
    res.redirect('how-to-register-death');
  }
});

router.get('/how-to-register-death', (req, res) => {
  res.render('version-3/how-to-register-death.html');
});

router.post('/how-to-register-death', (req, res) => {
  res.redirect('have-you-arranged-funeral');
});

router.get('/have-you-arranged-funeral', (req, res) => {
  res.render('version-3/have-you-arranged-funeral.html');
});

router.post('/have-you-arranged-funeral', (req, res) => {
  if (req.body['arranged-funeral-select'] === 'Yes') {
    res.redirect('funeral-date');
  } else {
    res.redirect('funeral-no');
  }
});

router.get('/funeral-no', (req, res) => {
  res.render('version-3/funeral-no.html');
});

router.post('/funeral-no', (req, res) => {
  res.redirect('apply-for-sffp');
});

router.get('/funeral-date', (req, res) => {
  res.render('version-3/funeral-date.html');
});

router.post('/funeral-date', (req, res) => {
  res.redirect('apply-for-sffp');
});

router.get('/apply-for-sffp', (req, res) => {
  res.render('version-3/apply-for-sffp.html');
});

router.post('/apply-for-sffp', (req, res) => {
  res.redirect('apply-for-bsp');
});

router.get('/help-with-funeral', (req, res) => {
  res.render('version-3/help-with-funeral.html');
});

router.post('/help-with-funeral', (req, res) => {
  res.redirect('apply-for-bsp');
});

router.get('/apply-for-bsp', (req, res) => {
  const now = moment();
  const dob = moment(req.cookies.age, 'DDMMYYYY');
  const age = now.diff(dob, 'years');

  if (req.cookies.relationship === 'Spouse' && age < 62) {
    res.render('version-3/apply-for-bsp.html');
  } else {
    res.redirect('dashboard');
  }
});

router.post('/apply-for-bsp', (req, res) => {
  if (req.body['bsp-select'] === 'Yes') {
    res.redirect('bsp-eligibility');
  } else {
    res.redirect('dashboard');
  }
});

router.get('/bsp-eligibility', (req, res) => {
  res.render('version-3/bsp-eligibility.html');
});

router.post('/bsp-eligibility', (req, res) => {
  if (req.body['lived-in-uk-select'] === 'Yes') {
    res.redirect('bsp-dependent-children');
  } else {
    res.redirect('bsp-exit');
  }
});

router.get('/bsp-exit', (req, res) => {
  const backLink = 'bsp-eligibility';
  res.render('version-3/bsp-exit-page.html', {backLink});
});

router.get('/bsp-dependent-children', (req, res) => {
  const backLink = 'bsp-eligibility';
  res.render('version-3/bsp-dependent-children.html', {backLink});
});

router.post('/bsp-dependent-children', (req, res) => {
  res.redirect('bsp-bank-details');
});

router.get('/bsp-bank-details', (req, res) => {
  const backLink = 'bsp-dependent-children';
  res.render('version-3/bsp-bank-details.html', {backLink});
});

router.post('/bsp-bank-details', (req, res) => {
  res.redirect('bsp-declaration');
});

router.get('/bsp-declaration', (req, res) => {
  const backLink = 'bsp-bank-details';
  res.render('version-3/bsp-declaration.html', {backLink});
});

router.post('/bsp-declaration', (req, res) => {
  res.redirect('bsp-end');
});

router.get('/bsp-end', (req, res) => {
  const completeDate = moment().format('DD MMMM YYYY');
  res.render('version-3/bsp-end-page.html', {completeDate});
});

module.exports = router;
