'use strict';

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'docs', 'index.html'), 'utf8');
const errors = [];

const dom = new JSDOM(html, {
    url: 'file:///' + path.resolve(path.join(__dirname, '..', 'docs')).replace(/\\/g, '/') + '/index.html',
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    beforeParse(window) {
        window.addEventListener('error', (e) => errors.push(e.message));
    }
});

dom.window.addEventListener('error', (e) => errors.push(e.message));

dom.window.document.addEventListener('DOMContentLoaded', () => {
    setTimeout(async () => {
        const widget = dom.window.document.querySelector('#resolution .jquery-displayresolution');
        if (!widget) {
            console.error('FAIL: widget not rendered');
            process.exit(1);
        }
        if (errors.length) {
            console.error('FAIL: script errors:', errors);
            process.exit(1);
        }
        const assert = require('assert');
        assert.strictEqual(widget.style.left, '50%', 'default position bottom-center');
        assert.strictEqual(widget.style.bottom, '20px', 'default bottom offset');
        assert.strictEqual(widget.style.width, '420px', 'default width 420');
        assert.strictEqual(widget.style.textAlign, 'center', 'widget text centered');
        assert.ok(!/Screen:/.test(widget.textContent), 'screen disabled by default');
        assert.ok(!/DPR:/.test(widget.textContent), 'dpr disabled by default');

        const snippet = dom.window.document.getElementById('codeSnippet').textContent;
        assert.ok(snippet.indexOf('position: "bottom-center"') !== -1, 'snippet includes position');
        assert.ok(snippet.indexOf('width: 420') !== -1, 'snippet includes width');
        assert.ok(snippet.indexOf('screen') === -1, 'snippet omits default-off screen');

        const doc = dom.window.document;
        assert.strictEqual(doc.getElementById('sep').tagName, 'SELECT', 'separator is a dropdown');
        assert.strictEqual(doc.getElementById('sep').value, ' | ', 'separator default value');
        assert.strictEqual(doc.getElementById('font').tagName, 'SELECT', 'font is a dropdown');
        assert.ok(doc.getElementById('font').value.indexOf('JetBrains Mono') !== -1, 'font default value');
        assert.strictEqual(
            doc.querySelectorAll('.options-grid .option-row').length,
            12,
            'options grid contains all 12 option rows'
        );
        assert.strictEqual(doc.getElementById('margin').tagName, 'INPUT', 'margin input exists');
        assert.strictEqual(doc.getElementById('padding').tagName, 'INPUT', 'padding input exists');
        assert.strictEqual(doc.getElementById('width').tagName, 'INPUT', 'width input exists');
        assert.strictEqual(doc.getElementById('height').tagName, 'INPUT', 'height input exists');
        assert.strictEqual(doc.getElementById('boxShadow'), null, 'box shadow removed');
        assert.strictEqual(doc.getElementById('backdrop'), null, 'backdrop filter removed');
        assert.strictEqual(doc.getElementById('transition'), null, 'transition removed');
        ['presetFuturistic', 'presetNeon', 'presetMinimal', 'presetTerminal', 'presetSunset', 'resetDemo', 'copyCode'].forEach(function (id) {
            assert.ok(doc.getElementById(id), 'button exists: ' + id);
        });
        assert.strictEqual(doc.getElementById('updateCode'), null, 'update code removed');
        assert.strictEqual(
            doc.getElementById('copyCode').closest('.code-actions').previousElementSibling.tagName,
            'PRE',
            'copy code button sits below the code block'
        );
        doc.getElementById('presetNeon').click();
        assert.ok(
            doc.getElementById('presetNeon').classList.contains('active'),
            'neon preset active after click'
        );
        assert.ok(
            !doc.getElementById('presetFuturistic').classList.contains('active'),
            'previous preset deactivated after switching'
        );
        assert.strictEqual(
            doc.querySelectorAll('.panel-head h2').length,
            2,
            'both card headers present'
        );
        assert.strictEqual(
            doc.querySelectorAll('.panel-head button').length,
            0,
            'no controls inside card headers'
        );

        let copiedText = null;
        Object.defineProperty(dom.window.navigator, 'clipboard', {
            configurable: true,
            value: {
                writeText: (text) => {
                    copiedText = text;
                    return Promise.resolve();
                }
            }
        });
        doc.getElementById('copyCode').click();
        await new Promise((resolve) => setTimeout(resolve, 50));
        assert.strictEqual(
            copiedText,
            doc.getElementById('codeSnippet').textContent,
            'copy code copies the snippet text'
        );
        assert.strictEqual(
            doc.getElementById('copyCode').textContent,
            'Copied!',
            'copy code feedback shown'
        );

        console.log('Demo page OK — widget rendered:', widget.textContent);
        console.log('Widget styles — position:', widget.style.position,
            '| bottom:', widget.style.bottom, '| width:', widget.style.width);
        console.log('Code snippet:\n' + snippet);
        process.exit(0);
    }, 1500);
});
