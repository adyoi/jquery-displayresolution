// Jquery Display Resolution
// Created and Design by Adi Apriyanto
// Tangerang Selatan, 30 September 2019 | 6:32 AM

'use strict';

$.fn.displayresolution = function(options){
let t = this;
let w = $(window);
let s = $.extend({
background: "black",
color: "white",
opacity: 0.5,
width: 300
}, options);
let o = $.extend({
font: "Helvetica",
size: "12px",
sep: " | ",
}, options);
t.css({
top: 0,
right: 0,
left: 0,
padding: 6,
zIndex: 999999,
marginRight: "auto",
marginLeft: "auto",
textAlign: "center",
position: "fixed",
opacity: s.opacity,
width: s.width,
'font-family': o.font,
'font-size': o.size,
background: s.background,
color: s.color,
cursor: "pointer"
});
t.each(function(){
$(t).text('Scroll Top: ' + w.scrollTop() + o.sep +
'Width: ' + w.width() + ' px' + o.sep +
'Height: ' + w.height() +' px');
});
w.scroll(function(){
$(t).text('Scroll Top: ' + w.scrollTop() + o.sep +
'Width: ' + w.width() + ' px' + o.sep +
'Height: ' + w.height() +' px');
});
w.resize(function(){
$(t).text('Scroll Top: ' + w.scrollTop() + o.sep +
'Width: ' + w.width() + ' px' + o.sep +
'Height: ' + w.height() +' px');
});
$(t).click(function(e){
let $temp = $('<input>');
$('body').append($temp);
$temp.val('top: ' + w.scrollTop() + "; " +
'width: ' + w.width() + 'px' + "; " +
'height: ' + w.height() +'px' + "; ").select();
document.execCommand('copy');
$temp.remove();
$(t).text('copied');
});
};
