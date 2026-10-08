// Jquery Display Resolution
// Modernized and optimized by AI
// Based on original by Adi Apriyanto

'use strict';

$.fn.displayresolution = function (options) {
    const $container = this;
    const $window = $(window);

    // Default options with modern defaults
    const defaults = {
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        opacity: 1,
        width: 300,
        height: "auto",
        font: 'System, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        size: '14px',
        sep: ' | ',
        padding: 12,
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s ease',
        position: 'top-right'  // new default position
    };

    options = $.extend({}, defaults, options);

    // Create the resolution display element
    const $resolution = $('<div>')
        .css({
            position: 'fixed',
            // Position handling based on options.position
            // Supported: top-right, top-left, bottom-right, bottom-left, top, right, bottom, left, center
            top: (options.position === 'center') ? '50%' : (options.position === 'top-left' || options.position === 'top-right' || options.position === 'top') ? (options.top !== undefined ? options.top : 20 + 'px') : 'auto',
            right: (options.position === 'center') ? '50%' : (options.position === 'top-right' || options.position === 'bottom-right' || options.position === 'right') ? (options.right !== undefined ? options.right : 20 + 'px') : 'auto',
            left: (options.position === 'center') ? '50%' : (options.position === 'top-left' || options.position === 'bottom-left' || options.position === 'left') ? (options.left !== undefined ? options.left : 'auto') : 'auto',
            // Transform for center positioning
            transform: (options.position === 'center') ? 'translate(-50%, -50%)' : 'none',
            zIndex: 999999,
            padding: options.padding + 'px',
            fontFamily: options.font,
            fontSize: options.size,
            background: options.background,
            color: options.color,
            cursor: 'pointer',
            borderRadius: options.borderRadius + 'px',
            boxShadow: options.boxShadow,
            transition: options.transition,
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        })
        .text('Loading...');

    $container.empty().append($resolution);

    // Function to update display
    const updateDisplay = () => {
        const scrollTop = $window.scrollTop();
        const width = $window.width();
        const height = $window.height();

        $resolution.text(
            'Scroll Top: ' + scrollTop + options.sep +
            'Width: ' + width + ' px' + options.sep +
            'Height: ' + height + ' px'
        );
    };

    // Initial update
    updateDisplay();

    // Event listeners
    $window.on('scroll.displayResolution resize.displayResolution', () => {
        updateDisplay();
    });

    // Click to copy functionality
    $resolution.on('click', function (e) {
        const text = 'scroll-top: ' + $window.scrollTop() + '; ' +
            'width: ' + $window.width() + 'px; ' +
            'height: ' + $window.height() + 'px; ';

        const $temp = $('<input>');
        $('body').append($temp);
        $temp.val(text).select();
        document.execCommand('copy');
        $temp.remove();

        // Visual feedback
        $(this).text('Copied!');
        setTimeout(() => {
            updateDisplay();
        }, 2000);
    });

    // Return for chaining
    return $container;
};

// jQuery-free vanilla alternative (auto-initialized if jQuery not available)
if (typeof jQuery === 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const element = document.getElementById('resolution');
        if (element) {
            element.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 999999;
                padding: 12px;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 14px;
                background: rgba(0, 0, 0, 0.8);
                color: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                cursor: pointer;
                user-select: none;
                display: flex;
                align-items: center;
                gap: 8px;
            `;

            const update = () => {
                element.textContent = `Scroll Top: ${window.scrollTop()} | Width: ${window.innerWidth} px | Height: ${window.innerHeight} px`;
            };

            update();
            window.addEventListener('scroll', update);
            window.addEventListener('resize', update);

            element.addEventListener('click', () => {
                const text = `scroll-top: ${window.scrollTop()}; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`;
                const $temp = document.createElement('input');
                document.body.appendChild($temp);
                $temp.value = text;
                $temp.select();
                document.execCommand('copy');
                document.body.removeChild($temp);
                element.textContent = 'Copied!';
                setTimeout(() => update(), 2000);
            });
        }
    });
}