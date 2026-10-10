'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const dom = new JSDOM(
    '<!doctype html><html><body><div id="resolution"></div><div id="second"></div></body></html>',
    { url: 'https://example.org/', pretendToBeVisual: true, runScripts: 'outside-only' }
);
const { window } = dom;
const { document } = window;

const $ = require('jquery')(window);
window.$ = window.jQuery = $;

const pluginSource = fs.readFileSync(
    path.join(__dirname, '..', 'jquery.displayresolution.js'),
    'utf8'
);
window.eval(pluginSource);

let copiedText = null;
Object.defineProperty(window.navigator, 'clipboard', {
    configurable: true,
    value: {
        writeText: (text) => {
            copiedText = text;
            return Promise.resolve();
        }
    }
});
document.execCommand = () => true;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
    assert.strictEqual($.fn.displayresolution.version, '2.1.0', 'plugin version exposed');

    $('#resolution').displayresolution({ sep: ' | ', screen: true, dpr: true });

    const $widget = $('#resolution .jquery-displayresolution');
    assert.strictEqual($widget.length, 1, 'widget rendered');
    assert.strictEqual($widget.attr('role'), 'button', 'widget has button role');
    assert.strictEqual($widget.attr('tabindex'), '0', 'widget is keyboard focusable');

    const text = $widget.text();
    assert.match(text, /Scroll Top: \d+/, 'shows scroll top');
    assert.match(text, /Width: \d+ px/, 'shows viewport width');
    assert.match(text, /Height: \d+ px/, 'shows viewport height');
    assert.match(text, /Screen: \d+ x \d+/, 'shows screen resolution when enabled');
    assert.match(text, /DPR: \d+/, 'shows device pixel ratio when enabled');

    assert.strictEqual($widget.css('position'), 'fixed', 'widget is fixed');
    assert.strictEqual($widget.css('top'), '20px', 'top-right default top offset');
    assert.strictEqual($widget.css('right'), '20px', 'top-right default right offset');
    assert.strictEqual($widget.css('width'), '300px', 'width option applied');
    assert.strictEqual($widget.css('text-align'), 'center', 'widget text centered');
    assert.strictEqual($widget.css('margin-top'), '12px', 'margin option applied');

    $('#resolution').displayresolution('destroy');
    assert.strictEqual($('#resolution .jquery-displayresolution').length, 0, 'destroy removes widget');
    assert.strictEqual($('#resolution').data('displayresolution'), undefined, 'destroy clears instance data');

    $('#resolution').displayresolution({ position: 'top-center' });
    let $w = $('#resolution .jquery-displayresolution');
    assert.strictEqual($w[0].style.left, '50%', 'top-center centers horizontally');
    assert.strictEqual($w[0].style.transform, 'translateX(-50%)', 'top-center uses translateX');
    $('#resolution').displayresolution('destroy');

    $('#resolution').displayresolution({ position: 'center' });
    $w = $('#resolution .jquery-displayresolution');
    assert.strictEqual($w[0].style.transform, 'translate(-50%, -50%)', 'center centers both axes');
    $('#resolution').displayresolution('destroy');

    $('#resolution').displayresolution();
    $('#resolution').displayresolution({ sep: ' · ' });
    assert.strictEqual(
        $('#resolution .jquery-displayresolution').length,
        1,
        're-init replaces previous instance instead of stacking widgets'
    );
    $('#resolution').displayresolution('destroy');

    $('#resolution').displayresolution({ copyFeedback: 'Copied!' });
    $w = $('#resolution .jquery-displayresolution');
    copiedText = null;
    $w.trigger('click');
    await sleep(50);
    assert.ok(/width: \d+px;/.test(copiedText), 'click copies CSS values via clipboard API');
    assert.strictEqual($w.text(), 'Copied!', 'copy feedback shown');
    assert.ok($w.hasClass('displayresolution-copied'), 'copied state class applied');
    $('#resolution').displayresolution('destroy');

    $('#second').displayresolution({ copyFormat: 'text', sep: ' ~ ' });
    $w = $('#second .jquery-displayresolution');
    copiedText = null;
    $w.trigger('click');
    await sleep(50);
    assert.ok(copiedText.indexOf(' ~ ') !== -1, 'copyFormat text uses the separator');
    $('#second').displayresolution('destroy');

    $('#resolution').displayresolution({ labels: { scroll: 'Scroll' } });
    $w = $('#resolution .jquery-displayresolution');
    assert.match($w.text(), /Scroll: \d+/, 'custom labels applied');
    $('#resolution').displayresolution('update');
    $('#resolution').displayresolution('destroy');

    console.log('All smoke tests passed.');
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
