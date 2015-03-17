(function(window, $){
	
	// Jquery Resolution
	// Created and Design by Adi Apriyanto
	// Tangerang Selatan, 17 March 2015 | 8:50 AM
	
	$.fn.resolution = function(options){
		
		var t = this;
		
		var w = $(window);
		
		var s = $.extend({
			
			opacity: 0.5,
			background: "black",
			color: "white",
			width: 300
			
		}, options);
		
		t.css({
			
			top: 0,
			right: 0,
			left: 0,
			padding: 6,
			zIndex: 99,
			marginRight: "auto",
			marginLeft: "auto",
			textAlign: "center",
			position: "fixed",
			opacity: s.opacity,
			width: s.width,
			background: s.background,
			color: s.color
			
		});
		
		t.each(function(){
			
			$(t).text('scroll-top:' + w.scrollTop() + ' | width:' + w.width() + 'px | height:' + w.height() +'px');
		
		});
		
		w.scroll(function(){
			
			$(t).text('scroll-top:' + w.scrollTop() + ' | width:' + w.width() + 'px | height:' + w.height() +'px');
		
		});
		
		w.resize(function(){
			
			$(t).text('scroll-top:' + w.scrollTop() + ' | width:' + w.width() + 'px | height:' + w.height() +'px');
		
		});
		
	};
	
}(window, jQuery));
