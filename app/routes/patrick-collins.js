'use strict';
const express = require('express');
const moment = require('moment');

const router = new express.Router();

// Redirect to start page
router.get('/', (req, res) => {
  res.redirect('/patrick-collins/start');
});

// Start page
router.get('/start', (req, res) => {
  res.cookie('checklist', {
    bsp: 'No',
    sffp: 'No',
    ihtax: 'No'
  });
  res.render('patrick-collins/start-page.html');
});

router.post('/start', (req, res) => {
  res.redirect('details-partner');
});

// About the deceased person
router.get('/details-partner', (req, res) => {
  res.render('patrick-collins/details-partner.html');
});

router.post('/details-partner', (req, res) => {
  res.cookie('deceasedName', req.body['full-name']);
  res.redirect('details-yours');
});

// About you
router.get('/details-yours', (req, res) => {
  const name = req.cookies.deceasedName;
  res.render('patrick-collins/details-yours.html', {name});
});

router.post('/details-yours', (req, res) => {
  const yourAge = `${req.body['dob-day']}${req.body['dob-month']}${req.body['dob-year']}`;
  const now = moment();
  const dob = moment(yourAge, 'DDMMYYYY');
  const age = now.diff(dob, 'years');

  if (req.body['married-select'] === 'Yes' && age < 62) {
    res.cookie('bspElig', true);
  }

  res.cookie('yourAge', yourAge);

  if (req.body['next-of-kin-select'] === 'No') {
    res.cookie('married', 'no');
    res.redirect('details-next-of-kin');
  } else {
    if (req.body['married-select'] === 'Yes') {
      res.cookie('married', 'yes');
    }

    res.redirect('details-contact');
  }
});

// Your contact details
router.get('/details-contact', (req, res) => {
  res.render('patrick-collins/details-contact.html');
});

router.post('/details-contact', (req, res) => {
  res.redirect('inform-organisations');
});

// Next of kin details
router.get('/details-next-of-kin', (req, res) => {
  const name = req.cookies.deceasedName;
  res.render('patrick-collins/details-next-of-kin.html', {name});
});

router.post('/details-next-of-kin', (req, res) => {
  res.redirect('inform-organisations');
});

// Inform organisations about the death
router.get('/inform-organisations', (req, res) => {
  const name = req.cookies.deceasedName;
  res.render('patrick-collins/inform-organisations.html', {name});
});

router.post('/inform-organisations', (req, res) => {
  res.redirect('whats-been-done');
});

// Whats been done
router.get('/whats-been-done', (req, res) => {
  const checklist = req.cookies.checklist;
  const date = moment().add(3, 'months').format('DD MMMM YYYY');
  const bspElig = req.cookies.bspElig;
  res.render('patrick-collins/whats-been-done.html', {date, bspElig, checklist});
});

router.post('/whats-been-done', (req, res) => {
  res.redirect('things-to-think-about');
});

// Checklist
router.get('/things-to-think-about', (req, res) => {
  const completeDate = moment().format('DD MMMM YYYY');
  const bspElig = req.cookies.bspElig;
  const backLink = 'whats-been-done';
  const randomDates = [];
  const checklist = req.cookies.checklist;

  for (let i = 0; i < 10; i++) {
    randomDates.push(moment().add(randomNum(14, 30), 'days').format('DD MMMM YYYY'));
  }

  res.render('patrick-collins/things-to-think-about.html', {bspElig, completeDate, randomDates, backLink, checklist});
});

router.get('/find-a-funeral-director', (req, res) => {
  const backLink = 'have-you-arranged-funeral';
  res.render('patrick-collins/find-a-funeral-director.html', {backLink});
});

router.post('/find-a-funeral-director', (req, res) => {
  res.redirect('things-to-think-about');
});

router.get('/apply-for-sffp', (req, res) => {
  const backLink = 'whats-been-done';
  res.render('patrick-collins/apply-for-sffp.html', {backLink});
});

router.post('/apply-for-sffp', (req, res) => {
  res.redirect('apply-for-sffp-holding-page');
});

router.get('/apply-for-sffp-holding-page', (req, res) => {
  const backLink = 'apply-for-sffp';
  res.render('patrick-collins/apply-for-sffp-holding-page.html', {backLink});
});

router.post('/apply-for-sffp-holding-page', (req, res) => {
  const checklist = req.cookies.checklist;
  checklist.sffp = 'Yes';
  res.cookie('checklist', checklist);
  res.redirect('whats-been-done');
});

router.get('/inheritance-tax', (req, res) => {
  const backLink = 'whats-been-done';
  res.render('patrick-collins/inheritance-tax.html', {backLink});
});

router.post('/inheritance-tax', (req, res) => {
  res.redirect('inheritance-tax-holding-page');
});

router.get('/inheritance-tax-holding-page', (req, res) => {
  const backLink = 'inheritance-tax';
  res.render('patrick-collins/inheritance-tax-holding-page.html', {backLink});
});

router.post('/inheritance-tax-holding-page', (req, res) => {
  const checklist = req.cookies.checklist;
  checklist.ihtax = 'Yes';
  res.cookie('checklist', checklist);
  res.redirect('whats-been-done');
});

router.get('/apply-for-bsp', (req, res) => {
  const backLink = 'whats-been-done';
  res.render('patrick-collins/apply-for-bsp.html', {backLink});
});

router.post('/apply-for-bsp', (req, res) => {
  if (req.body['bsp-select'] === 'Yes') {
    res.redirect('bsp-eligibility');
  } else {
    res.cookie('checklist', true);
    res.redirect('things-to-think-about');
  }
});

router.get('/bsp-eligibility', (req, res) => {
  const backLink = 'apply-for-bsp';
  res.render('patrick-collins/bsp-eligibility.html', {backLink});
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
  res.render('patrick-collins/bsp-exit-page.html', {backLink});
});

router.get('/bsp-dependent-children', (req, res) => {
  const backLink = 'bsp-eligibility';
  res.render('patrick-collins/bsp-dependent-children.html', {backLink});
});

router.post('/bsp-dependent-children', (req, res) => {
  res.redirect('bsp-bank-details');
});

router.get('/bsp-bank-details', (req, res) => {
  const backLink = 'bsp-dependent-children';
  res.render('patrick-collins/bsp-bank-details.html', {backLink});
});

router.post('/bsp-bank-details', (req, res) => {
  res.redirect('bsp-declaration');
});

router.get('/bsp-declaration', (req, res) => {
  const backLink = 'bsp-bank-details';
  res.render('patrick-collins/bsp-declaration.html', {backLink});
});

router.post('/bsp-declaration', (req, res) => {
  res.redirect('bsp-end');
});

router.get('/bsp-end', (req, res) => {
  const checklist = req.cookies.checklist;
  checklist.bsp = 'Yes';
  res.cookie('checklist', checklist);
  const completeDate = moment().format('DD MMMM YYYY');
  res.render('patrick-collins/bsp-end-page.html', {completeDate});
});

router.post('/bsp-end', (req, res) => {
  res.redirect('whats-been-done');
});

module.exports = router;

function randomNum(min, max) {
  return Math.floor((Math.random() * (max - min + 1)) + min);
}
