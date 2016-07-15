'use strict';
const express = require('express');
const moment = require('moment');

const router = new express.Router();

// Redirect to start page
router.get('/', (req, res) => {
  res.redirect('/version-5/start');
});

// Start page
router.get('/start', (req, res) => {
  res.render('version-5/start-page.html');
});

router.post('/start', (req, res) => {
  res.redirect('details-partner');
});

// About the deceased person
router.get('/details-partner', (req, res) => {
  res.render('version-5/details-partner.html');
});

router.post('/details-partner', (req, res) => {
  res.cookie('deceasedName', req.body['full-name']);
  res.redirect('details-yours');
});

// About you
router.get('/details-yours', (req, res) => {
  const name = req.cookies.deceasedName;
  res.render('version-5/details-yours.html', {name});
});

router.post('/details-yours', (req, res) => {
  res.cookie('yourAge', `${req.body['dob-day']}${req.body['dob-month']}${req.body['dob-year']}`);

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
  res.render('version-5/details-contact.html');
});

router.post('/details-contact', (req, res) => {
  res.redirect('inform-organisations');
});

// Next of kin details
router.get('/details-next-of-kin', (req, res) => {
  const name = req.cookies.deceasedName;
  res.render('version-5/details-next-of-kin.html', {name});
});

router.post('/details-next-of-kin', (req, res) => {
  res.redirect('inform-organisations');
});

// Inform organisations about the death
router.get('/inform-organisations', (req, res) => {
  const name = req.cookies.deceasedName;
  res.render('version-5/inform-organisations.html', {name});
});

router.post('/inform-organisations', (req, res) => {
  res.redirect('checklist');
});

// Checklist
router.get('/checklist', (req, res) => {
  let checklist = req.cookies.checklist;
  const bspElig = req.cookies.bspElig;
  const name = req.cookies.deceasedName;
  if (checklist === undefined) {
    checklist = {
      bsp: 'No',
      registered: 'No',
      funeral: 'No',
      bankAccounts: 'No',
      insurance: 'No',
      employers: 'No',
      funeralSupport: 'No'
    };
    res.cookie('checklist', checklist);
  }

  res.render('version-5/checklist.html', {checklist, bspElig, name});
});

router.get('/find-a-funeral-director', (req, res) => {
  const backLink = 'have-you-arranged-funeral';
  res.render('version-5/find-a-funeral-director.html', {backLink});
});

router.post('/find-a-funeral-director', (req, res) => {
  res.redirect('checklist');
});

router.get('/apply-for-sffp', (req, res) => {
  const backLink = req.get('referrer').indexOf('funeral-no') > -1 ? 'funeral-no' : 'funeral-date';
  res.render('version-5/apply-for-sffp.html', {backLink});
});

router.post('/apply-for-sffp', (req, res) => {
  res.redirect('apply-for-bsp');
});

router.get('/apply-for-bsp', (req, res) => {
  const now = moment();
  const dob = moment(req.cookies.yourAge, 'DDMMYYYY');
  const age = now.diff(dob, 'years');
  let eligible;

  if (req.cookies.married === 'yes' && age < 62) {
    eligible = true;
    res.cookie('bspElig', true);
  }

  if (eligible) {
    res.render('version-5/apply-for-bsp.html');
  } else {
    res.redirect('checklist');
  }
});

router.post('/apply-for-bsp', (req, res) => {
  if (req.body['bsp-select'] === 'Yes') {
    res.redirect('bsp-eligibility');
  } else {
    res.cookie('checklist', true);
    res.redirect('checklist');
  }
});

router.get('/bsp-eligibility', (req, res) => {
  const backLink = 'apply-for-bsp';
  res.render('version-5/bsp-eligibility.html', {backLink});
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
  res.render('version-5/bsp-exit-page.html', {backLink});
});

router.get('/bsp-dependent-children', (req, res) => {
  const backLink = 'bsp-eligibility';
  res.render('version-5/bsp-dependent-children.html', {backLink});
});

router.post('/bsp-dependent-children', (req, res) => {
  res.redirect('bsp-bank-details');
});

router.get('/bsp-bank-details', (req, res) => {
  const backLink = 'bsp-dependent-children';
  res.render('version-5/bsp-bank-details.html', {backLink});
});

router.post('/bsp-bank-details', (req, res) => {
  res.redirect('bsp-declaration');
});

router.get('/bsp-declaration', (req, res) => {
  const backLink = 'bsp-bank-details';
  res.render('version-5/bsp-declaration.html', {backLink});
});

router.post('/bsp-declaration', (req, res) => {
  res.redirect('bsp-end');
});

router.get('/bsp-end', (req, res) => {
  const checklist = req.cookies.checklist;
  checklist.bsp = 'Yes';
  res.cookie('checklist', checklist);
  const completeDate = moment().format('DD MMMM YYYY');
  res.render('version-5/bsp-end-page.html', {completeDate});
});

router.post('/bsp-end', (req, res) => {
  res.redirect('checklist');
});

router.get('/mark-as-complete/:id', (req, res) => {
  const id = req.params.id;
  const checklist = req.cookies.checklist;

  for (const key in checklist) {
    if ({}.hasOwnProperty.call(checklist, key)) {
      if (id === key) {
        checklist[id] = 'Yes';
      }
    }
  }

  res.cookie('checklist', checklist);
  res.redirect('/version-5/checklist');
});

module.exports = router;
