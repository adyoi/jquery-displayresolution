'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const docs = path.join(root, 'docs');

fs.copyFileSync(
    path.join(root, 'jquery.displayresolution.js'),
    path.join(docs, 'jquery.displayresolution.js')
);
fs.copyFileSync(
    path.join(root, 'jquery-3.7.1.min.js'),
    path.join(docs, 'jquery-3.7.1.min.js')
);

console.log('docs/ synced with plugin and jQuery.');
