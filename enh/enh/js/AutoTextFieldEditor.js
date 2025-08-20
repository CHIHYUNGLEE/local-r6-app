function AutoTextFieldEditor(parent, style) {
	TextFieldEditor.call(this, parent, $.extend(style, {}));
	this.init();
}
AutoTextFieldEditor.prototype = $.extend({}, TextFieldEditor.prototype, {
	init : function() {
		JSV.register(new EnhAutoUserNameComplete(null, this.widget, this, this.style), this, 'autoComplete');
	},
	autoComplete: function() {
		if (!this.widget.attr('title')) {
			return false;
		}
		this.setValue(this.widget.attr('title'));
	}
});
