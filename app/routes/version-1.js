'use strict';

const express = require('express');
const router = new express.Router();
const moment = require('moment');

router.get('/', (req, res) => {
  res.redirect('/version-1/start');
});

router.get('/start', (req, res) => {
  const date = {};
  date.twoWeeks = moment().day(14).format('D MMMM YYYY');
  date.threeMonths = moment().add(3, 'months').format('D MMMM YYYY');
  date.sixMonths = moment().add(6, 'months').format('D MMMM YYYY');

  res.render('version-1/start-page.html', {date});
});

module.exports = router;
