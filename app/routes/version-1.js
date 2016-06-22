'use strict';

const express = require('express');
const router = new express.Router();

router.get('/', (req, res) => {
  res.redirect('/version-1/start');
});

router.get('/start', (req, res) => {
  res.render('version-1/start-page.html');
});

module.exports = router;
