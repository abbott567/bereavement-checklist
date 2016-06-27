'use strict';
const express = require('express');

const router = new express.Router();

router.get('/', (req, res) => {
  res.redirect('/version-2/start');
});

router.get('/start', (req, res) => {
  res.render('version-2/start-page.html');
});

router.post('/start', (req, res) => {
  res.redirect('details-partner');
});

router.get('/details-partner', (req, res) => {
  res.render('version-2/details-partner.html');
});

router.post('/details-partner', (req, res) => {
  res.redirect('details-yours');
});

router.get('/details-yours', (req, res) => {
  res.render('version-2/details-yours.html');
});

router.post('/details-yours', (req, res) => {
  if (req.body['next-of-kin-select'] === 'Yes') {
    res.redirect('details-contact');
  } else {
    res.redirect('details-next-of-kin');
  }
});

router.get('/details-contact', (req, res) => {
  res.render('version-2/details-contact.html');
});

router.post('/details-contact', (req, res) => {
  res.redirect('whats-been-done');
});

router.get('/details-next-of-kin', (req, res) => {
  res.render('version-2/details-next-of-kin.html');
});

router.post('/details-next-of-kin', (req, res) => {
  res.redirect('whats-been-done');
});

router.get('/whats-been-done', (req, res) => {
  res.render('version-2/whats-been-done.html');
});

router.post('/whats-been-done', (req, res) => {
  res.redirect('start-page-next');
});

router.get('/have-you-registered', (req, res) => {
  res.render('version-2/have-you-registered.html');
});

router.post('/have-you-registered', (req, res) => {
  if (req.body['registered-death-select'] === 'Yes') {
    res.redirect('have-you-arranged-funeral');
  } else {
    res.redirect('how-to-register-death');
  }
});

router.get('/have-you-arranged-funeral', (req, res) => {
  res.render('version-2/have-you-arranged-funeral.html');
});

router.post('/have-you-arranged-funeral', (req, res) => {
  if (req.body['arranged-funeral-select'] === 'Yes') {
    res.redirect('funeral-date');
  } else {
    res.redirect('funeral-no');
  }
});

router.get('/funeral-date', (req, res) => {
  res.render('version-2/funeral-date.html');
});

router.post('/funeral-date', (req, res) => {
  res.redirect('apply-for-sffp');
});

router.get('/apply-for-sffp', (req, res) => {
  res.render('version-2/apply-for-sffp.html');
});

router.post('/apply-for-sffp', (req, res) => {
  if (req.body['sffp-select'] === 'Yes') {
    res.redirect('https://www.gov.uk/funeral-payments/how-to-claim');
  } else {
    res.redirect('apply-for-bsp');
  }
});

router.get('/apply-for-bsp', (req, res) => {
  res.render('version-2/apply-for-bsp.html');
});

router.post('/apply-for-bsp', (req, res) => {
  if (req.body['bsp-select'] === 'Yes') {
    res.redirect('http://bereavement.herokuapp.com');
  } else {
    res.redirect('dashboard');
  }
});

module.exports = router;
