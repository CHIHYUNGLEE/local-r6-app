function EnhOrgTitleColumn(parent, style) {
	this.parent = parent;
	this.style = style || {};
	this.className = this.style.className || 'EnhOrgTitleColumn';
	this.align = this.style.align || 'center';
	this.padding = this.style.padding || null;
	parent.appendChild(this);
}
EnhOrgTitleColumn.prototype.setLabelProvider = function(lp) {
	this.labelProvider = lp;
}
EnhOrgTitleColumn.prototype.setValue = function(element, td, tr) {
	$(td).attr('align', this.align);
	var div = $('<div>').addClass(this.className).appendTo(td);
	if (this.labelProvider == null) {
		this.setLabelProvider(new TextColumnLabelProvider());
	}
	this.textValue = (element && this.style.attribute) ? this.labelProvider.getText(element, this.style.attribute) : '';
	var orgId = (this.style.orgId && element) ? JSV.merge(this.style.orgId, element) : 0;
	var $titleTag = $('<nobr>').addClass('nobr').appendTo(div).attr('title', this.textValue || '').text(
		this.style.isMenu ? '[ ' + this.textValue + ' ]' : this.textValue);

	if (orgId > 0) {
		var href = (this.style.href && element) ? JSV.merge(this.style.href, element) : '';
		$titleTag.removeClass('nobr').addClass('link').on('click', this, function(e) {
			JSV.doPOST(href);
		});
	}
}
