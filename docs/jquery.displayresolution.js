// Jquery Display Resolution
// Modernized and optimized by AI
// Based on original by Adi Apriyanto

(function (root, factory) {
    'use strict';

    if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (root.jQuery) {
        factory(root.jQuery);
    } else {
        root.displayresolution = createVanillaPlugin(root);
        if (root.document.readyState === 'loading') {
            root.document.addEventListener('DOMContentLoaded', function () {
                var el = root.document.getElementById('resolution');
                if (el) root.displayresolution(el);
            });
        } else {
            var el = root.document.getElementById('resolution');
            if (el) root.displayresolution(el);
        }
    }
}(typeof window !== 'undefined' ? window : this, function ($) {
    'use strict';

    var VERSION = '2.1.0';
    var DATA_KEY = 'displayresolution';
    var uid = 0;

    var defaults = {
        sep: ' | ',
        font: 'System, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        size: '14px',
        background: '#000000',
        color: '#fff',
        opacity: 1,
        width: 300,
        height: 'auto',
        padding: 12,
        margin: 12,
        borderRadius: 8,
        position: 'top-right',
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
        zIndex: 999999,
        screen: false,
        dpr: false,
        copyFormat: 'css',
        copyFeedback: 'Copied!',
        feedbackTimeout: 1500,
        labels: {
            scroll: 'Scroll Top',
            width: 'Width',
            height: 'Height',
            screen: 'Screen',
            dpr: 'DPR'
        },
        onCopy: null
    };

    function px(value) {
        return typeof value === 'number' ? value + 'px' : value;
    }

    function positionStyles(o) {
        var pos = o.position || 'top-right';
        var styles = {
            'top-right': { top: px(o.top), right: px(o.right) },
            'top-left': { top: px(o.top), left: px(o.left) },
            'bottom-right': { bottom: px(o.bottom), right: px(o.right) },
            'bottom-left': { bottom: px(o.bottom), left: px(o.left) },
            'top-center': { top: px(o.top), left: '50%', transform: 'translateX(-50%)' },
            'bottom-center': { bottom: px(o.bottom), left: '50%', transform: 'translateX(-50%)' },
            'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
            'top': { top: px(o.top), left: '50%', transform: 'translateX(-50%)' },
            'bottom': { bottom: px(o.bottom), left: '50%', transform: 'translateX(-50%)' },
            'right': { top: '50%', right: px(o.right), transform: 'translateY(-50%)' },
            'left': { top: '50%', left: px(o.left), transform: 'translateY(-50%)' }
        };
        return styles[pos] || styles['top-right'];
    }

    function buildBaseCss(o) {
        var css = Object.assign({
            position: 'fixed',
            zIndex: o.zIndex,
            padding: px(o.padding),
            fontFamily: o.font,
            fontSize: o.size,
            background: o.background,
            color: o.color,
            opacity: o.opacity,
            width: px(o.width),
            maxWidth: 'calc(100vw - 24px)',
            height: px(o.height),
            margin: px(o.margin),
            cursor: 'pointer',
            borderRadius: px(o.borderRadius),
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '8px'
        }, positionStyles(o));

        return css;
    }

    function createInstance(el, userOptions) {
        var $el = $(el);
        var existing = $el.data(DATA_KEY);
        if (existing) existing.destroy();

        var o = $.extend(true, {}, defaults, userOptions);
        var ns = '.displayresolution' + (++uid);
        var $window = $(window);
        var raf = window.requestAnimationFrame
            ? window.requestAnimationFrame.bind(window)
            : function (fn) { return setTimeout(fn, 16); };
        var ticking = false;
        var feedbackTimer = null;

        var $widget = $('<div>')
            .addClass('jquery-displayresolution')
            .attr({
                role: 'button',
                tabindex: 0,
                'aria-label': 'Resolution widget. Press Enter to copy CSS values.'
            })
            .css(buildBaseCss(o))
            .text('Loading...');

        $el.append($widget);

        function buildParts() {
            var parts = [
                o.labels.scroll + ': ' + $window.scrollTop(),
                o.labels.width + ': ' + $window.width() + ' px',
                o.labels.height + ': ' + $window.height() + ' px'
            ];
            if (o.screen) {
                parts.push(o.labels.screen + ': ' + window.screen.width + ' x ' + window.screen.height);
            }
            if (o.dpr) {
                parts.push(o.labels.dpr + ': ' + (window.devicePixelRatio || 1));
            }
            return parts;
        }

        function update() {
            $widget.text(buildParts().join(o.sep));
        }

        function onScrollResize() {
            if (ticking) {
                return;
            }
            ticking = true;
            raf(function () {
                update();
                ticking = false;
            });
        }

        function buildCopyText() {
            if (o.copyFormat === 'text') {
                return buildParts().join(o.sep);
            }
            var text = 'scroll-top: ' + $window.scrollTop() + '; ' +
                'width: ' + $window.width() + 'px; ' +
                'height: ' + $window.height() + 'px;';
            if (o.screen) {
                text += ' screen: ' + window.screen.width + 'x' + window.screen.height + ';';
            }
            if (o.dpr) {
                text += ' dpr: ' + (window.devicePixelRatio || 1) + ';';
            }
            return text;
        }

        function legacyCopy(text) {
            try {
                var $temp = $('<textarea>')
                    .val(text)
                    .css({ position: 'fixed', top: '-1000px', left: '-1000px', opacity: '0' });
                $('body').append($temp);
                $temp[0].select();
                document.execCommand('copy');
                $temp.remove();
            } catch (err) {
            }
        }

        function feedback() {
            $widget.text(o.copyFeedback).addClass('displayresolution-copied');
            clearTimeout(feedbackTimer);
            feedbackTimer = setTimeout(function () {
                $widget.removeClass('displayresolution-copied');
                update();
            }, o.feedbackTimeout);
        }

        function copy() {
            var text = buildCopyText();
            var done = function () {
                feedback();
                if (typeof o.onCopy === 'function') {
                    o.onCopy(text);
                }
            };
            if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                navigator.clipboard.writeText(text).then(done, function () {
                    legacyCopy(text);
                    done();
                });
            } else {
                legacyCopy(text);
                done();
            }
        }

        function onKeydown(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copy();
            }
        }

        $widget.on('click' + ns, copy);
        $widget.on('keydown' + ns, onKeydown);
        $window.on('scroll' + ns + ' resize' + ns, onScrollResize);

        update();

        return {
            update: update,
            show: function () { $widget.show(); },
            hide: function () { $widget.hide(); },
            destroy: function () {
                clearTimeout(feedbackTimer);
                $window.off(ns);
                $widget.off(ns).remove();
                $el.removeData(DATA_KEY);
            }
        };
    }

    $.fn.displayresolution = function (options) {
        if (typeof options === 'string') {
            var method = options;
            this.each(function () {
                var inst = $(this).data(DATA_KEY);
                if (inst && typeof inst[method] === 'function') {
                    inst[method]();
                }
            });
            return this;
        }
        return this.each(function () {
            $(this).data(DATA_KEY, createInstance(this, options));
        });
    };
    $.fn.displayresolution.version = VERSION;

    return $.fn.displayresolution;
}));

function createVanillaPlugin(root) {
    'use strict';

    var defaults = {
        sep: ' | ',
        font: 'System, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        size: '14px',
        background: '#000000',
        color: '#fff',
        opacity: 1,
        width: 300,
        height: 'auto',
        padding: 12,
        margin: 12,
        borderRadius: 8,
        position: 'top-right',
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
        zIndex: 999999,
        screen: false,
        dpr: false,
        copyFormat: 'css',
        copyFeedback: 'Copied!',
        feedbackTimeout: 1500,
        labels: {
            scroll: 'Scroll Top',
            width: 'Width',
            height: 'Height',
            screen: 'Screen',
            dpr: 'DPR'
        },
        onCopy: null
    };

    function px(value) {
        return typeof value === 'number' ? value + 'px' : value;
    }

    function positionStyles(o) {
        var pos = o.position || 'top-right';
        var styles = {
            'top-right': { top: px(o.top), right: px(o.right) },
            'top-left': { top: px(o.top), left: px(o.left) },
            'bottom-right': { bottom: px(o.bottom), right: px(o.right) },
            'bottom-left': { bottom: px(o.bottom), left: px(o.left) },
            'top-center': { top: px(o.top), left: '50%', transform: 'translateX(-50%)' },
            'bottom-center': { bottom: px(o.bottom), left: '50%', transform: 'translateX(-50%)' },
            'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
            'top': { top: px(o.top), left: '50%', transform: 'translateX(-50%)' },
            'bottom': { bottom: px(o.bottom), left: '50%', transform: 'translateX(-50%)' },
            'right': { top: '50%', right: px(o.right), transform: 'translateY(-50%)' },
            'left': { top: '50%', left: px(o.left), transform: 'translateY(-50%)' }
        };
        return styles[pos] || styles['top-right'];
    }

    function init(el, userOptions) {
        if (!el) {
            return null;
        }
        if (el._displayresolution) {
            el._displayresolution.destroy();
        }

        var document = root.document;
        var o = Object.assign({}, defaults, userOptions);
        var ticking = false;
        var feedbackTimer = null;
        var raf = root.requestAnimationFrame
            ? root.requestAnimationFrame.bind(root)
            : function (fn) { return setTimeout(fn, 16); };

        function buildParts() {
            var parts = [
                o.labels.scroll + ': ' + root.scrollY,
                o.labels.width + ': ' + root.innerWidth + ' px',
                o.labels.height + ': ' + root.innerHeight + ' px'
            ];
            if (o.screen) {
                parts.push(o.labels.screen + ': ' + root.screen.width + ' x ' + root.screen.height);
            }
            if (o.dpr) {
                parts.push(o.labels.dpr + ': ' + (root.devicePixelRatio || 1));
            }
            return parts;
        }

        function buildCopyText() {
            if (o.copyFormat === 'text') {
                return buildParts().join(o.sep);
            }
            var text = 'scroll-top: ' + root.scrollY + '; ' +
                'width: ' + root.innerWidth + 'px; ' +
                'height: ' + root.innerHeight + 'px;';
            if (o.screen) {
                text += ' screen: ' + root.screen.width + 'x' + root.screen.height + ';';
            }
            if (o.dpr) {
                text += ' dpr: ' + (root.devicePixelRatio || 1) + ';';
            }
            return text;
        }

        function legacyCopy(text) {
            try {
                var temp = document.createElement('textarea');
                temp.value = text;
                temp.style.position = 'fixed';
                temp.style.top = '-1000px';
                temp.style.left = '-1000px';
                temp.style.opacity = '0';
                document.body.appendChild(temp);
                temp.select();
                document.execCommand('copy');
                document.body.removeChild(temp);
            } catch (err) {
            }
        }

        function update() {
            widget.textContent = buildParts().join(o.sep);
        }

        function onScrollResize() {
            if (ticking) {
                return;
            }
            ticking = true;
            raf(function () {
                update();
                ticking = false;
            });
        }

        function feedback() {
            widget.textContent = o.copyFeedback;
            widget.classList.add('displayresolution-copied');
            clearTimeout(feedbackTimer);
            feedbackTimer = setTimeout(function () {
                widget.classList.remove('displayresolution-copied');
                update();
            }, o.feedbackTimeout);
        }

        function copy() {
            var text = buildCopyText();
            var done = function () {
                feedback();
                if (typeof o.onCopy === 'function') {
                    o.onCopy(text);
                }
            };
            if (root.navigator.clipboard && typeof root.navigator.clipboard.writeText === 'function') {
                root.navigator.clipboard.writeText(text).then(done, function () {
                    legacyCopy(text);
                    done();
                });
            } else {
                legacyCopy(text);
                done();
            }
        }

        function onKeydown(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copy();
            }
        }

        var widget = document.createElement('div');
        widget.className = 'jquery-displayresolution';
        widget.setAttribute('role', 'button');
        widget.setAttribute('tabindex', '0');
        widget.setAttribute('aria-label', 'Resolution widget. Press Enter to copy CSS values.');
        widget.textContent = 'Loading...';

        var css = Object.assign({
            position: 'fixed',
            zIndex: o.zIndex,
            padding: px(o.padding),
            fontFamily: o.font,
            fontSize: o.size,
            background: o.background,
            color: o.color,
            opacity: o.opacity,
            width: px(o.width),
            maxWidth: 'calc(100vw - 24px)',
            height: px(o.height),
            margin: px(o.margin),
            cursor: 'pointer',
            borderRadius: px(o.borderRadius),
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '8px'
        }, positionStyles(o));

        Object.keys(css).forEach(function (key) {
            widget.style[key] = css[key];
        });

        el.appendChild(widget);

        widget.addEventListener('click', copy);
        widget.addEventListener('keydown', onKeydown);
        root.addEventListener('scroll', onScrollResize, { passive: true });
        root.addEventListener('resize', onScrollResize);

        update();

        el._displayresolution = {
            update: update,
            show: function () { widget.style.display = 'flex'; },
            hide: function () { widget.style.display = 'none'; },
            destroy: function () {
                clearTimeout(feedbackTimer);
                widget.removeEventListener('click', copy);
                widget.removeEventListener('keydown', onKeydown);
                root.removeEventListener('scroll', onScrollResize);
                root.removeEventListener('resize', onScrollResize);
                if (widget.parentNode) {
                    widget.parentNode.removeChild(widget);
                }
                el._displayresolution = null;
            }
        };
        return el._displayresolution;
    }

    return init;
}
