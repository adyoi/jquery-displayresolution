'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const minSource = fs.readFileSync(
    path.join(__dirname, '..', 'jquery.displayresolution.min.js'),
    'utf8'
);

function makeWindow() {
    return new JSDOM('<div id="resolution"></div>', {
        url: 'https://example.org/',
        pretendToBeVisual: true,
        runScripts: 'outside-only'
    }).window;
}

(async () => {
    const withJQuery = makeWindow();
    const $ = require('jquery')(withJQuery);
    withJQuery.$ = withJQuery.jQuery = $;
    withJQuery.eval(minSource);

    withJQuery.$('#resolution').displayresolution({ position: 'bottom-center', screen: true });
    const widget = withJQuery.document.querySelector('#resolution .jquery-displayresolution');
    assert.ok(widget, 'min+jQuery: widget rendered');
    assert.strictEqual(widget.style.left, '50%', 'min+jQuery: bottom-center left');
    assert.strictEqual(widget.style.bottom, '20px', 'min+jQuery: bottom-center bottom');
    assert.match(widget.textContent, /Screen: \d+ x \d+/, 'min+jQuery: screen shown');

    withJQuery.$('#resolution').displayresolution('destroy');
    assert.strictEqual(
        withJQuery.document.querySelectorAll('#resolution .jquery-displayresolution').length,
        0,
        'min+jQuery: destroy works'
    );

    const withoutJQuery = makeWindow();
    withoutJQuery.eval(minSource);

    await new Promise((resolve) => {
        if (withoutJQuery.document.readyState === 'complete') {
            resolve();
        } else {
            withoutJQuery.addEventListener('load', resolve);
        }
    });

    const vanillaWidget = withoutJQuery.document.querySelector('#resolution .jquery-displayresolution');
    assert.ok(vanillaWidget, 'vanilla fallback: auto-init rendered widget');
    assert.strictEqual(typeof withoutJQuery.displayresolution, 'function', 'vanilla fallback exposed');

    console.log('Minified bundle tests passed.');
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
