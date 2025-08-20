function TableRows(parent, style) {
	this.style = style || {};
	this.name = this.style.name || null;
	this.className = this.style.className || 'TableRows';
	this.options = this.style.rows ? this.style.rows : JSV.getLang('TableRows', 'rows');
	this.rows = this.options.split(',');
	var span = $('<span>').addClass(this.className).appendTo(parent).get(0);
	if (this.rows.length > 1) {
		this.widget = new ComboFieldEditor(span, this.style);
		$(this.widget.widget).addClass('optList');
		this.widget.component = this;
		this.widget.onchange = function(value) {
			this.component.notify(value);
		}
		this.widget.init(this.rows);
	}
}
TableRows.prototype.getInitial = function() {
	if (this.name && JSV.getCookie(this.name)) {
		return parseInt(JSV.getCookie(this.name));
	} else {
		var initValue = this.rows[0].split(':');
		return initValue[0];
	}
}
TableRows.prototype.setValue = function(value) {
	if (this.rows.length > 1) {
		this.widget.setValue(value);
	}
}
TableRows.prototype.notify = function(value) {
	if (this.name) {
		JSV.setCookie(this.name, value);
	}
	JSV.notify(parseInt(value), this);
}
