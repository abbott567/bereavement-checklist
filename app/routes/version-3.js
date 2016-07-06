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
  res.session.set('deceasedName', req.body['full-name']);
  res.redirect('details-yours');
});

router.get('/details-yours', (req, res) => {
  res.render('version-3/details-yours.html', req.session.get());
});

router.post('/details-yours', (req, res) => {
  res.session.set('relationship', req.body['relationship-to-select']);
  res.session.set('yourAge', `${req.body['dob-day']}${req.body['dob-month']}${req.body['dob-year']}`);

  if (!req.body['next-of-kin-select'] || req.body['next-of-kin-select'] === 'Yes') {
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
  res.render('version-3/whats-been-done.html', req.session.get());
});

router.post('/whats-been-done', (req, res) => {
  res.redirect('start-page-next');
});

router.get('/start-page-next', (req, res) => {
  const data = req.session.get();
  data.backLink = 'whats-been-done';
  res.render('version-3/start-page-next.html', data);
});

router.post('/start-page-next', (req, res) => {
  res.redirect('have-you-registered');
});

router.get('/have-you-registered', (req, res) => {
  const backLink = 'start-page-next';
  res.render('version-3/have-you-registered.html', {backLink});
});

router.post('/have-you-registered', (req, res) => {
  if (req.body['registered-death-select'] === 'Yes') {
    res.session.set('registered', 'Yes');
  } else {
    res.session.set('notDone', true);
  }
  res.redirect('do-you-need-to-arrange-funeral');
});

router.get('/do-you-need-to-arrange-funeral', (req, res) => {
  const backLink = req.get('referrer').indexOf('how-to-register-death') > -1 ? 'how-to-register-death' : 'have-you-registered';
  res.render('version-3/do-you-need-to-arrange-funeral.html', {backLink});
});

router.post('/do-you-need-to-arrange-funeral', (req, res) => {
  if (req.body['arranged-funeral-select'] === 'Yes') {
    res.session.set('funeral', 'Yes');
    res.session.set('notDone', true);
    res.redirect('find-a-funeral-director');
  } else {
    res.redirect('help-with-funeral');
  }
});

router.get('/help-with-funeral', (req, res) => {
  const backLink = 'do-you-need-to-arrange-funeral';
  res.render('version-3/help-with-funeral.html', {backLink});
});

router.post('/help-with-funeral', (req, res) => {
  if (req.body['help-with-funeral-select'] === 'Yes') {
    res.session.set('sffp', 'Yes');
    res.redirect('apply-for-sffp');
  } else {
    res.redirect('apply-for-bsp');
  }
});

router.get('/find-a-funeral-director', (req, res) => {
  const backLink = 'have-you-arranged-funeral';
  res.render('version-3/find-a-funeral-director.html', {backLink});
});

router.post('/find-a-funeral-director', (req, res) => {
  res.redirect('help-with-funeral');
});

router.get('/apply-for-sffp', (req, res) => {
  const backLink = req.get('referrer').indexOf('funeral-no') > -1 ? 'funeral-no' : 'funeral-date';
  res.render('version-3/apply-for-sffp.html', {backLink});
});

router.post('/apply-for-sffp', (req, res) => {
  res.redirect('apply-for-bsp');
});

router.get('/apply-for-bsp', (req, res) => {
  const now = moment();
  const dob = moment(req.session.get('yourAge'), 'DDMMYYYY');
  const age = now.diff(dob, 'years');

  if (req.session.get('relationship') === 'spouse' && age < 62) {
    res.session.set('bspElig', true);
  }

  if (req.session.get('bspElig')) {
    res.render('version-3/apply-for-bsp.html');
  } else {
    res.redirect('dashboard');
  }
});

router.post('/apply-for-bsp', (req, res) => {
  if (req.body['bsp-select'] === 'Yes') {
    res.redirect('bsp-eligibility');
  } else {
    res.session.set('notDone', true);
    res.redirect('dashboard');
  }
});

router.get('/bsp-eligibility', (req, res) => {
  const backLink = 'apply-for-bsp';
  res.render('version-3/bsp-eligibility.html', {backLink});
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
  res.session.set('bsp', 'Yes');
  const completeDate = moment().format('DD MMMM YYYY');
  res.render('version-3/bsp-end-page.html', {completeDate});
});

router.get('/dashboard', (req, res) => {
  if (req.session.get('sffp') === 'Yes') {
    res.session.set('notDone', true);
  }

  const data = req.session.get();
  data.backLink = req.get('referrer');
  data.funeralDateFormatted = moment(data.funeralDate, 'DDMMYYYY').format('DD MMMM YYYY');

  res.render('version-3/dashboard.html', data);
});

module.exports = router;
