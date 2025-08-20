function EmpColumn(parent, style) {
	this.parent = parent;
	this.style = style || {};
	this.className = this.style.className || 'EmpColumn';
	parent.appendChild(this);
}
EmpColumn.prototype.setValue = function(element, td, tr) {
	var id = element[this.style.id || 'id'];
	var name = JSV.getLocaleStr(element[this.style.name || 'name']);
	var vrtl = this.style.vrtl || null;
	var a = null;
	if (vrtl != null && id == vrtl) {
		a = $('<div>').get(0);
		var nobr = $('<nobr>').addClass('nobr').text(name).attr('title', name).appendTo(a);
	} else {
		a = AnchorEmp.generateAnchor(id, name);
	}
	$(a).addClass(this.className).appendTo(td);
	$(td).attr('align', this.style.align || 'center');
	if (this.style.width) {
		$(td).width(this.style.width);
	}
}
