'use strict';

const fs = require('fs');
const express = require('express');
const router = new express.Router();
const multer = require('multer');
const upload = multer({dest: 'public/uploads'});

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

  switch (how) {
    case 'uploadIt':
      url = 'upload';
      break;
    case 'postIt':
      url = 'post';
      break;
    case 'jobCentre':
      url = 'job-centre';
      break;
    case 'dontHaveIt':
      url = 'dont-have-marriage-cert';
      break;
    default:
      url = 'we-need-your-marriage-certificate';
  }

  res.redirect(url);
});

router.get('/upload', (req, res) => {
  res.render('marriage-certs/upload');
});

router.post('/upload', upload.single('pic'), (req, res) => {
  const tmpPath = req.file.path;
  const targetPath = `public/uploads/${req.file.originalname}`;

  const src = fs.createReadStream(tmpPath);
  const dest = fs.createWriteStream(targetPath);

  res.cookie('upload', targetPath);

  src.pipe(dest);
  src.on('end', () => {
    res.redirect('upload-success');
  });

  src.on('error', err => {
    if (err) {
      res.render('marriage-certs/upload', {error: 'There was a problem'});
    }
  });
});

router.get('/upload-success', (req, res) => {
  const filename = `/${req.cookies.upload}`;
  res.render('marriage-certs/upload-success', {filename});
});

router.post('/upload-success', (req, res) => {
  res.redirect('end');
});

router.get('/job-centre', (req, res) => {
  const query = req.query.postcode;
  res.render('marriage-certs/job-centre', {query});
});

router.get('/end', (req, res) => {
  res.render('marriage-certs/end');
});

module.exports = router;
