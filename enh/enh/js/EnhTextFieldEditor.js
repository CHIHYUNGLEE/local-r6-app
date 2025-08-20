/**
 * TEXT 입력을 위한 input box 를 생성한다.
 * 
 * @param parent
 *            input box가 생성되는 위치
 * @param style
 */
function EnhTextFieldEditor(parent, style) {
	this.style = style || {};
	this.prefix = this.style.prefix || '';
	this.className = this.style.className || 'TextFieldEditor';
	this.notice = JSV.getLang('EnhTextFieldEditor', 'guide');
	var table = $('<table cellSpacing="0" cellPadding="0">\
			<tr class="tr">\
				<td class="editor" style="width:100px;"></td>\
				<td class="notice" style="padding-left:10px;"></td>\
			</tr></table>\
		').addClass(this.className).appendTo(parent).get(0);
	this.noticeTd = $(table.rows[0].cells[1]).text(this.notice).get(0);
	this.widget = $('<input type="text">').addClass(this.className).addClass(this.className+'_normal').appendTo(table.rows[0].cells[0])
	.bind('keydown', this, function(e) {
			if (e.data.onkeydown)
				e.data.onkeydown(e);
			if (e.keyCode == 13) return false;
	})
	.bind('keyup', this, function(e) {
			if (e.data.onkeyup)
				e.data.onkeyup(e);
			if (e.keyCode == 13) return false;
	})
	.bind('focus', this, function(e) {
		$(this).removeClass(e.data.className+'_normal').addClass(e.data.className + '_focus');
		e.data.onfocus(e);
	})
	.bind('blur', this, function(e) {
		$(this).removeClass(e.data.className+'_focus').addClass(e.data.className+'_normal');
		e.data.onfocusout(e);
	})
	.bind('click', this, function(e) {
		if(e.data.onclick)
			e.data.onclick(e);
	});
	
	if (this.style.readOnly == 'true') {
		this.widget.prop('readOnly',true).addClass(this.className + '_readOnly');
	} else {
		this.widget.removeProp('readOnly').removeClass(this.className + '_readOnly');
	}
	this.onEvent = true;

	if (this.style.width)
		this.widget.width(this.style.width);
	if (this.style.value)
		this.widget.val(this.prefix + this.style.value);
	if (this.style.maxLength)
		this.widget.attr('maxLength', this.style.maxLength);
	if (this.style.imeMode)
		this.widget.css('imeMode', this.style.imeMode);
	if (this.style.autoComplete) {
		JSV.register(new AutoComplete(this.widget.get(0), this), this, 'autoComplete');
	}
}
EnhTextFieldEditor.prototype.setValue = function(value) {
	if (value != null) {
		this.setOriginal(this.prefix + value);
	} else if (this.style.example) {
		this.setExam();
	} else {
		this.widget.val('');
	}
	JSV.notify(value, this);
}
EnhTextFieldEditor.prototype.getValue = function() {
	if (this.style.example && this.onEvent) {
		return '';
	}
	return $.trim(this.widget.val());
}
EnhTextFieldEditor.prototype.focus = function() {
	this.widget.focus();
}
EnhTextFieldEditor.prototype.onfocus = function() {
	if (this.preFocus) {
		this.preFocus();
	}
	if (this.style.example && this.onEvent) {
		this.setOriginal('');
	}
}
EnhTextFieldEditor.prototype.onfocusout = function() {
	if (this.preFocusout) {
		this.preFocusout();
	}
	if (this.style.example && this.getValue() == '') {
		this.setExam();
	}
}
EnhTextFieldEditor.prototype.setMaxlength = function(maxLength) {
	this.widget.attr('maxLength', maxLength);
}
EnhTextFieldEditor.prototype.setReadOnly = function(value) {
	if (value) {
		this.widget.prop('readOnly',true).addClass(this.className + '_readOnly');
	} else {
		this.widget.removeProp('readOnly').removeClass(this.className + '_readOnly');
	}
}
EnhTextFieldEditor.prototype.setEditable = function(value) {
	this.widget.attr('disabled', !value);
}
EnhTextFieldEditor.prototype.setExam = function() {
	this.widget.val(this.style.example).removeClass(this.className + '_original').addClass(this.className + '_exam');
	this.onEvent = true;
}
EnhTextFieldEditor.prototype.setOriginal = function(value) {
	this.widget.val(value).removeClass(this.className + '_exam').addClass(this.className + '_original');
	this.onEvent = false;
}
EnhTextFieldEditor.prototype.autoComplete = function(value, observable){
	this.setValue(value);
}
