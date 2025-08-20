function EnhTaskStatusFieldEditor(parent, style) {
	this.style = style || {};
	this.className = this.style.className || 'EnhTaskStatusFieldEditor';
	this.widget = $('<div>').addClass(this.className).appendTo(parent);
	
	this.statuses = {};
	this.init();
}
EnhTaskStatusFieldEditor.prototype.init = function(){
	this.completeDate = $('<p>').addClass('dueDate').appendTo(this.widget);
	this.statusViewer = $('<div>').addClass('EnhTaskStatusBox').css('float', 'left').appendTo(this.widget);
	this.arrow = $('<a href="javascript:void(0);"></a>').addClass('btn').appendTo(this.widget)
	.on('click', this, function(e){
		if  (e.data.setDiv.css('display') == 'none') {
			$(document).one('click.enhtaskstatus', e.data, function(e){
				e.data.widget.removeClass('on');
				e.data.setDiv.hide();
			});
			e.data.widget.addClass('on');
			e.data.setDiv.show();
			e.stopPropagation();
		}
	});
	this.setDiv = $('<div>').addClass('layer').appendTo(this.arrow);
	this.ul = $('<ul>').appendTo(this.setDiv);
	$('<img>').attr('src', JSV.getContextPath('/img/btn_pulldown_arr.png')).appendTo(this.arrow);
	
	var options = EnhTaskStatusFieldEditor.enhStatus ;
	var _this = this;
	$(options).each(function(i){
		_this.add(this);
	});
	
	this.setEnhEditable(this.style.editable);
}
EnhTaskStatusFieldEditor.prototype.setEnhEditable = function(){
	this.editable = arguments[0] || false;
	if (this.editable)
		this.arrow.show();
	else
		this.arrow.hide();	
}
EnhTaskStatusFieldEditor.prototype.create = function() {
	var options = EnhTaskStatusFieldEditor.enhStatus ;
		
	var _this = this;
	$(options).each(function(i){
		_this.add(this);
	});
}
EnhTaskStatusFieldEditor.prototype.add = function(option){
	var a = $('<a href="javascript:void(0);"></a>').attr('value', option.value).appendTo($('<li>').appendTo(this.ul));
	$('<span>').addClass('txt').text(option.text).appendTo(a);
	a.click(this, function(e) {
		var $this = $(this);
		e.data.value = $this.attr('value');
		e.data.ul.find('li.selected').removeClass('selected');
		$this.parent().addClass('selected');
		e.data.doUpdate();
	});
	this.statuses[option.value] = option.text;
}
EnhTaskStatusFieldEditor.prototype.setValue = function(value, component){
	if(value == TaskItem.DRAFT || value == TaskItem.DELETED) {
		this.widget.hide();
		return;
	}
	this.value = value;
	this.ul.find('li a[value="' + value + '"]').parent().addClass('selected');
	this.statusViewer.text(this.statuses[this.value]).removeClass().addClass('EnhTaskStatusBox status' + this.value);
	if(this.value == TaskItem.COMPLETE){
		var date = component.getProperty(this.style.completeDate);
		this.setCompleteDate(date);
	} else {
		this.completeDate.hide();
	}
}
EnhTaskStatusFieldEditor.prototype.getValue = function(){
	return this.value;
}
EnhTaskStatusFieldEditor.prototype.setId = function(id){
	this.id = id;
}
EnhTaskStatusFieldEditor.prototype.setCompleteDate = function(date){
	this.completeDate.text(JSV.getLang('TaskStatusFieldEditor', 'completeDate') + DateFormat.format(new Date(date), JSV.getLang('DateFormat','dateType1'))).show();
}
EnhTaskStatusFieldEditor.prototype.doUpdate = function(){
	var id = this.id || JSV.getParameter(this.style.attribute);
	if (this.editable) {
		$.ajax({
			url : JSV.getModuleUrl(JSV.getContextPath(this.style.action || EnhTaskStatusFieldEditor.action)),
			type : 'POST',
			dataType : 'json',
			data : {'id' : id, 'status' : this.value},
			context : this,
			async : false,
			success : function(data, status){
				if(data.error != undefined){
					alert(JSV.getLang('TaskEmpsViewer','permissionDenied'));
				} else {
					this.onsuccess(data);
				}
			},
			error : function(xhr){
				this.onerror();
			}
		});
	}
}
EnhTaskStatusFieldEditor.prototype.onsuccess = function(data){
	this.statusViewer.text(this.statuses[this.value]).removeClass().addClass('EnhTaskStatusBox status' + this.value);
	if(this.value == TaskItem.COMPLETE){
		this.setCompleteDate(data.completeDate);
	} else {
		this.completeDate.hide();
	}
	JSV.notify(this.value, this, 'onupdate');
}
EnhTaskStatusFieldEditor.prototype.onerror = function(){
	alert(JSV.getLang('TaskStatusFieldEditor','error'));
}
EnhTaskStatusFieldEditor.getStatusButton = function(parent, value){
	var div = $('<div>').addClass('EnhTaskStatusBox').appendTo(parent);
	$(EnhTaskStatusFieldEditor.allStatus).each(function(n){
		if(this.value == value){
			div.text(this.text).addClass('status' + value);
			return false;
		}
	});
	return div;
}
EnhTaskStatusFieldEditor.action = JSV.getModuleUrl('/jsl/EnhAdmin.UpdateStatus.json');
EnhTaskStatusFieldEditor.enhStatus = [
   	{text : JSV.getLang('TaskStatusFieldEditor', 'stay'),  value : TaskItem.STAY, color : '0;#26985d'},
	{text : JSV.getLang('TaskStatusFieldEditor', 'doing'), value : TaskItem.DOING, color : '1;#4e6fdc'},
	{text : JSV.getLang('TaskStatusFieldEditor', 'comp'),  value : TaskItem.COMPLETE, color : '3;#696969'}
];
EnhTaskStatusFieldEditor.allStatus = [
	{text : JSV.getLang('TaskStatusFieldEditor', 'draft'),  value : TaskItem.DRAFT},
	{text : JSV.getLang('TaskStatusFieldEditor', 'stay'),  value : TaskItem.STAY},
	{text : JSV.getLang('TaskStatusFieldEditor', 'inquiry'),  value : TaskItem.INQUIRY},
	{text : JSV.getLang('TaskStatusFieldEditor', 'doing'), value : TaskItem.DOING},
	{text : JSV.getLang('TaskStatusFieldEditor', 'comp'),  value : TaskItem.COMPLETE},
	{text : JSV.getLang('TaskStatusFieldEditor', 'stop'),  value : TaskItem.STOP},
	{text : JSV.getLang('TaskStatusFieldEditor', 'hold'),  value : TaskItem.HOLD},
	{text : JSV.getLang('TaskStatusFieldEditor', 'delete'),  value : TaskItem.DELETED}
];
