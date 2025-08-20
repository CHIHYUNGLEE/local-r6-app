function EnhMbrsHtmlViewer(parent, style) {
	this.style = style ? style : {};
	this.className = this.style.className ? this.style.className : 'MbrHtmlViewer';
	this.widget = $('<div>').addClass(this.className).appendTo(parent).get(0);
	this.user = null;
}
EnhMbrsHtmlViewer.prototype.setValue = function(value) {		
	if (!value || !value.length || value.length == 0) {
		if(this.style.ifNullHide){
			ItemViewer.removeTR(this.widget);
		} else {
			$(this.widget).text(JSV.getLang('EmpsHtmlViewer', 'nobody'));
		}
		return;
	}
	$(this.widget).empty();
	for ( var i = 0; i < value.length; i++) {
		if (i > 0) {
			$(document.createTextNode(', ')).appendTo(this.widget);
		}
		
		if (this.style.vrtl != null && this.style.vrtl == value[i].id) {
			$(this.widget).html(JSV.getLocaleStr(value[i].name));
		} else if (this.style && this.style.isGlobal == 'true') {
			$(AnchorMbr.generateAnchor(value[i].id, value[i].name)).appendTo(this.widget);
		} else {
			$(AnchorEmp.generateAnchor(value[i].id, value[i].name)).removeClass('AnchorEmp_generateAnchor')
			.addClass('link').appendTo(this.widget);
		}	
		
	}
}
