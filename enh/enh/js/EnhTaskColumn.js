/**
 * 업무 역할과 업무를 출력한다.
 * 
 * @param parent
 *            표시되는 위치
 * @param style
 */
function EnhTaskColumn(parent, style) {
	this.parent = parent;
	this.style = style || {};
	this.options = ComboViewer.createOptions(this.style);
	this.className = this.style.className || 'EnhTaskColumn';
	parent.appendChild(this);
}
EnhTaskColumn.prototype.setValue = function(element, td, tr) {
	var att = element[this.style.attribute];
	var title = element[this.style.title];
	var combo = (null != att) ? ComboColumn.LabelProvider(this.options[att]) : '';
	var href = (this.style.href && element) ? JSV.merge(this.style.href, element) : '';
	$('<div>').addClass(this.className).appendTo(td).attr('align', this.style.align || 'center').html('[' + combo + ']' + title).on('click', this, function(e) { e.preventDefault(); e.data.onclick(element, href); });
}
EnhTaskColumn.prototype.onclick = function(element, href) {
	JSV.doPOST(href);
}
