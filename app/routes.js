const express = require('express');

const router = new express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/reset', (req, res) => {
  res.session.reset();
  res.redirect('/');
});

module.exports = router;
