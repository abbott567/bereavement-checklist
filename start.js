'use strict';

// Check for `node_modules` folder and warn if missing
const fs = require('fs');
const path = require('path');

if (!fs.existsSync(path.join(__dirname, '/node_modules'))) {
  console.error('ERROR: Node module folder missing. Try running `npm install`');
  process.exit(0);
}

// remove .port.tmp if it exists
try {
  fs.unlinkSync(path.join(__dirname, '/.port.tmp'));
} catch (e) {}

const gruntfile = path.join(__dirname, '/Gruntfile.js');

require(path.join(__dirname, '/node_modules/grunt/lib/grunt.js')).cli({
  gruntfile
});

process.on('SIGINT', () => {
  // remove .port.tmp if it exists
  try {
    fs.unlinkSync(path.join(__dirname, '/.port.tmp'));
  } catch (e) {}

  process.exit(0);
});
