function EnhTaskStatusColumn(parent, style) {
	this.parent = parent;
	this.style = style || {};
	parent.appendChild(this);
}
EnhTaskStatusColumn.prototype.setValue = function(element, td, tr) {
	var att = element[this.style.attribute];
	$(td).attr('align', this.style.align || 'center');
	var statusButton = TaskStatusFieldEditor.getStatusButton(td, att);

	if(att == TaskItem.COMPLETE){
		var completeText = JSV.getLang('TaskStatusFieldEditor','completeDate')
						   + ': ' + DateFormat.format(new Date(element[this.style.completeDate]), JSV.getLang('DateFormat','fullType1'));
		
		new EnhQuestionButton(td, {
			'element' : statusButton,
			'title' : '',
			'text' : completeText,
			'autoHide' : true,
			'hideTime' : 5
		}).widget.css('margin','0px');
	}
}
