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
  res.redirect('whats-been-done');
});

router.get('/whats-been-done', (req, res) => {
  res.render('version-2/whats-been-done.html');
});

router.post('/whats-been-done', (req, res) => {
  res.redirect('have-you-registered');
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
  res.redirect('apply-for-sffp');
});

module.exports = router;
