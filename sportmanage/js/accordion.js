$(function() {
	
	var Accordion = function(el, multiple) {
		this.el = el || {};
		this.multiple = multiple || false;

		// Variables privadas
		var links = this.el.find('.dropdown');
		// Evento
		links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown);
	};

	Accordion.prototype.dropdown = function(e) {
		var $el = e.data.el;
			$this = $(this),
			$next = $this.next();

		$next.slideToggle();
		$this.parent().toggleClass('dropdown');

		if (!e.data.multiple) {
			$el.find('.submenu').not($next).slideUp().parent().removeClass('open');
		};
	};	

/*	var menu = localStorage.getItem("menu");
	if(!menu){
		$.get('menu.html',function(data){
			localStorage.setItem("menu", data);
			$('#accordion').html(data);
		}).complete(function(){
			new Accordion($('#accordion'), false);
		});
	}else{
		$('#accordion').html(menu);
	}*/
	new Accordion($('#accordion'), false);
});