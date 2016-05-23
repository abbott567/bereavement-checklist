'use strict';

const express = require('express');
const router = new express.Router();

router.get('/start', (req, res) => {
  res.render('marriage-certs/start');
});

router.post('/start', (req, res) => {
  if (req.body['marriage-verified-select'] === 'Yes') {
    res.redirect('end');
  } else {
    res.redirect('we-need-your-marriage-certificate');
  }
});

router.get('/we-need-your-marriage-certificate', (req, res) => {
  res.render('marriage-certs/we-need-your-marriage-certificate');
});

router.post('/we-need-your-marriage-certificate', (req, res) => {
  const how = req.body['how-select'];
  let url = '';

  if (how === 'uploadIt') {
    url = 'upload';
  } else if (how === 'postIt') {
    url = 'post';
  } else if (how === 'jobCentre') {
    url = 'job-centre';
  } else if (how === 'dontHaveIt') {
    url = 'dont-have-marriage-cert';
  }

  res.redirect(url);
});

router.get('/upload', (req, res) => {
  res.render('marriage-certs/upload');
});

router.get('/end', (req, res) => {
  res.render('marriage-certs/end');
});

module.exports = router;
