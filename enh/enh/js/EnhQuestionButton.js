function EnhQuestionButton(parent, style) {
	this.parent = parent;
	this.style = style || {
		'title' : '',
		'text' : ''
	};
	this.seq = JSV.SEQUENCE++;
	this.qImg = this.style.qImg || 'ico_helpxfff.png';
	this.className = this.style.className || 'EnhQuestionButton';
	this.widget = $('<div>').addClass(this.className).appendTo(this.parent);
	var anchor = $('<a hidefocus="true"></a>').addClass('qbtnA').bind('click', this, function(e) {
		e.data.onclick(this);
	}).appendTo(this.widget);
	var spanImg = $('<span>').text('?').css({'background':'url(' + this.getURL(this.qImg) + ')', 'background-repeat':'no-repeat'});
	this.btn = this.style.element
			|| $('<span>').addClass('qbtn').append(spanImg);
	this.btn.appendTo(anchor);
	if (this.style.title != null) {
		this.btn.attr('title', this.style.title);
	}
	this.tip = this.getLayer();
}
EnhQuestionButton.prototype.getLayer = function(){
	var tip = $('#QstnBtnTipDiv' + this.seq);
	if (tip.length > 0) {
		return tip;
	} else {
		return $('<div class="tipDiv"><div id="QstnBtnInWrap' + this.seq + '" class="innerWrap"></div></div>').attr('id', 'QstnBtnTipDiv' + this.seq).hide().appendTo(this.widget);
	}
}
EnhQuestionButton.prototype.getURL = function(fileName) {
	var root = '/img/component/questionbutton/';
	return JSV.getContextPath(root + fileName);
}
EnhQuestionButton.prototype.onclick = function(element) {
	var eventSrc = this.tip.data('eventSrc');
	var $document = $(document);
	$('#QstnBtnInWrap' + this.seq).html(this.style.text);
	if(eventSrc == null || element == eventSrc){
		this.toggleLayer();
	} else {
		if(this.tip.data('timeout'))clearTimeout(this.tip.data('timeout'));
		this.tip.show();
	}
	$document.one('click.tipDiv', this, function(e) {
		e.data.tip.fadeOut();
	});
	this.widget.one('click', function(e){
		e.stopPropagation();
	});
	if (this.style.autoHide) {
		this.tip.data('timeout', setTimeout($.proxy(this, 'hideLayer'), (this.style.hideTime || 1) * 1000));
	}
	this.tip.data('eventSrc', element);
}
EnhQuestionButton.prototype.hideLayer = function() {
	this.tip.fadeOut();
	this.widget.removeClass('on');
}
EnhQuestionButton.prototype.toggleLayer = function() {
	if (this.tip.css('display') == 'none') {
		this.tip.show();
		this.widget.addClass('on');
	} else {
		this.tip.fadeOut();
		this.widget.removeClass('on');
	}
}
