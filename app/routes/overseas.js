'use strict';

const express = require('express');
const router = new express.Router();
const moment = require('moment');
const getCountries = require('../views/overseas/scripts/countries.js');

router.get('/', (req, res) => {
  res.redirect('start');
});

router.get('/start', (req, res) => {
  res.render('overseas/start-page.html');
});

router.get('/eligibility', (req, res) => {
  const backLink = 'start';
  res.render('overseas/eligibility.html', {backLink});
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
    res.redirect('details-partner');
  }
});

router.get('/details-partner', (req, res) => {
  const backLink = 'eligibility';
  res.render('overseas/details-partner.html', {backLink});
});

router.post('/details-partner', (req, res) => {
  const dod = moment(req.body['dod-day'] + req.body['dod-month'] + req.body['dod-year'], 'DDMMYYYY');
  const dodDiff = dod.diff(moment(), 'days');
  const beforeAprSvth = dod.isBefore(moment('07042016', 'DDMMYYYY'));

  if (dodDiff < -395 || beforeAprSvth) {
    res.redirect('exit?details-partner=no');
  } else if (req.body['outside-uk-select'] === 'Yes') {
    res.redirect('what-countries-have-they-worked-in');
  } else {
    res.redirect('details');
  }
});

router.get('/what-countries-have-they-worked-in', (req, res) => {
  res.render('overseas/what-countries-have-they-worked-in');
});

router.post('/what-countries-have-they-worked-in', (req, res) => {
  const countries = [];

  for (const country in req.body) {
    if (req.body.hasOwnProperty(country)) {
      countries.push(req.body[country].toLowerCase());
    }
  }

  const cookie = {
    'c-worked-count': countries.length,
    'c-worked-list': countries,
    'c-worked-all': countries,
    'c-worked-step': 1
  };

  res.cookie('countries', JSON.stringify(cookie));
  res.redirect('tell-us-about-worked');
});

router.get('/tell-us-about-worked', (req, res) => {
  const countries = JSON.parse(req.cookies.countries);
  const allCountries = countries['c-worked-all'];
  const resident = getCountries.resident();
  const insurance = getCountries.insurance();

  if (countries['c-worked-list'].length === 0) {
    res.redirect('what-countries-have-they-worked-in');
  } else {
    for (const c in allCountries) {
      if (resident.indexOf(allCountries[c]) < 0 && insurance.indexOf(allCountries[c]) < 0) {
        delete allCountries[c];
      }
    }

    const step = {on: countries['c-worked-step'], of: Object.keys(allCountries).length};

    let country = '';
    if (countries !== undefined) {
      country = countries['c-worked-list'].shift();
    }

    countries['c-worked-count'] = countries['c-worked-list'].length;
    res.cookie('countries', JSON.stringify(countries));
    const countryType = getCountries.type(country);

    if (countryType.insurance) {
      res.render('overseas/tell-us-about-worked', {country, step});
    } else if (countries['c-worked-list'].length > 0) {
      res.redirect('tell-us-about-worked');
    } else {
      res.redirect('details');
    }
  }
});

router.post('/tell-us-about-worked', (req, res) => {
  const cookie = JSON.parse(req.cookies.countries);
  const countries = cookie['c-worked-list'];
  let step = cookie['c-worked-step'];
  step++;

  cookie['c-worked-count'] = countries.length;
  cookie['c-worked-list'] = countries;
  cookie['c-worked-step'] = step;

  res.cookie('countries', JSON.stringify(cookie));

  if (countries.length > 0) {
    res.redirect('tell-us-about-worked');
  } else {
    res.redirect('details');
  }
});

router.get('/details', (req, res) => {
  const backLink = 'details-partner';
  res.render('overseas/details.html', {backLink});
});

router.post('/details', (req, res) => {
  const dob = moment(req.body['dob-day'] + req.body['dob-month'] + req.body['dob-year'], 'DDMMYYYY');
  const dobDiff = dob.diff(moment(), 'years');

  if (dobDiff < -65) {
    res.redirect('exit?details=no');
  } else {
    res.redirect('contact-details');
  }
});

router.get('/contact-details', (req, res) => {
  const backLink = 'details';
  res.render('overseas/contact-details.html', {backLink});
});

router.post('/contact-details', (req, res) => {
  res.redirect('dependent-children');
});

router.get('/dependent-children', (req, res) => {
  const backLink = 'details-partner';
  res.render('overseas/dependent-children.html', {backLink});
});

router.post('/dependent-children', (req, res) => {
  res.redirect('bank-details');
});

router.get('/bank-details', (req, res) => {
  const referrer = req.get('referrer') ? req.get('referrer').split('/').pop() : 'dependent-children';
  res.render('overseas/bank-details.html', {backLink: referrer});
});

router.post('/bank-details', (req, res) => {
  res.redirect('declaration');
});

router.get('/declaration', (req, res) => {
  const backLink = 'bank-details';
  res.render('overseas/declaration.html', {backLink});
});

router.post('/declaration', (req, res) => {
  res.redirect('end');
});

router.get('/end', (req, res) => {
  const completeDate = moment().format('DD MMMM YYYY');
  res.render('overseas/end-page.html', {completeDate});
});

router.get('/exit', (req, res) => {
  const referrer = req.get('referrer') ? req.get('referrer').split('/').pop() : 'start';
  let buttonLink;

  if (referrer === 'eligibility') {
    buttonLink = 'details-partner';
  } else if (referrer === 'details') {
    buttonLink = 'contact-details';
  } else if (referrer === 'details-partner') {
    buttonLink = 'details';
  } else {
    buttonLink = '/';
  }

  res.render('overseas/exit-page.html', {
    buttonLink,
    backLink: `/overseas/${referrer}`,
    date: req.query['last-twelve-months-select'] || req.query['details-partner'],
    location: req.query['lived-in-uk-select'],
    married: req.query['still-married-select'],
    dateOfBirth: req.query.details
  });
});

router.get('/download', (req, res) => {
  res.download('./public/downloads/download.pdf', 'download.pdf');
});

module.exports = router;
