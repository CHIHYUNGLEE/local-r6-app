function EnhStatusFieldEditor(parent, style) {
	this.style = style || {};
	this.className = this.style.className || 'TaskStatusFieldEditor';
	this.widget = $('<div>').addClass(this.className).appendTo(parent);
	
	this.statuses = {};
	this.init();
}
EnhStatusFieldEditor.prototype.init = function(){
	this.completeDate = $('<p>').addClass('dueDate').appendTo(this.widget);
	this.statusViewer = $('<div>').addClass('TaskStatusBox').css('float', 'left').appendTo(this.widget);
	this.arrow = $('<a href="javascript:void(0);"></a>').addClass('btn').appendTo(this.widget)
	.on('click', this, function(e){
		if  (e.data.setDiv.css('display') == 'none') {
			$(document).one('click.taskstatus', e.data, function(e){
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
	
	var options = EnhStatusFieldEditor.enhStatus ;
	var _this = this;
	$(options).each(function(i){
		_this.add(this);
	});
	
	this.setEnhEditable(this.style.editable);
}
EnhStatusFieldEditor.prototype.setEnhEditable = function(){
	this.editable = arguments[0] || false;
	if (this.editable)
		this.arrow.show();
	else
		this.arrow.hide();	
}
EnhStatusFieldEditor.prototype.create = function() {
	var options = EnhStatusFieldEditor.enhStatus ;
		
	var _this = this;
	$(options).each(function(i){
		_this.add(this);
	});
}
EnhStatusFieldEditor.prototype.add = function(option){
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
EnhStatusFieldEditor.prototype.setValue = function(value, component){
	if(value == TaskItem.DRAFT || value == TaskItem.DELETED) {
		this.widget.hide();
		return;
	}
	this.value = value;
	this.ul.find('li a[value="' + value + '"]').parent().addClass('selected');
	this.statusViewer.text(this.statuses[this.value]).removeClass().addClass('TaskStatusBox status' + this.value);
	if(this.value == TaskItem.COMPLETE){
		var date = component.getProperty(this.style.completeDate);
		this.setCompleteDate(date);
	} else {
		this.completeDate.hide();
	}
}
EnhStatusFieldEditor.prototype.getValue = function(){
	return this.value;
}
EnhStatusFieldEditor.prototype.setId = function(id){
	this.id = id;
}
EnhStatusFieldEditor.prototype.setCompleteDate = function(date){
	this.completeDate.text(JSV.getLang('TaskStatusFieldEditor', 'completeDate') + DateFormat.format(new Date(date), JSV.getLang('DateFormat','dateType1'))).show();
}
EnhStatusFieldEditor.prototype.doUpdate = function(){
	var id = this.id || JSV.getParameter(this.style.attribute);
	if (this.editable) {
		$.ajax({
			url : JSV.getModuleUrl(JSV.getContextPath(this.style.action || EnhStatusFieldEditor.action)),
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
EnhStatusFieldEditor.prototype.onsuccess = function(data){
	this.statusViewer.text(this.statuses[this.value]).removeClass().addClass('TaskStatusBox status' + this.value);
	if(this.value == TaskItem.COMPLETE){
		this.setCompleteDate(data.completeDate);
	} else {
		this.completeDate.hide();
	}
	JSV.notify(this.value, this, 'onupdate');
}
EnhStatusFieldEditor.prototype.onerror = function(){
	alert(JSV.getLang('TaskStatusFieldEditor','error'));
}
EnhStatusFieldEditor.getStatusButton = function(parent, value){
	var div = $('<div>').addClass('TaskStatusBox').appendTo(parent);
	$(EnhStatusFieldEditor.allStatus).each(function(n){
		if(this.value == value){
			div.text(this.text).addClass('status' + value);
			return false;
		}
	});
	return div;
}
EnhStatusFieldEditor.action = JSV.getModuleUrl('/jsl/EnhAdmin.UpdateStatus.json');
EnhStatusFieldEditor.enhStatus = [
   	{text : JSV.getLang('TaskStatusFieldEditor', 'stay'),  value : TaskItem.STAY, color : '0;#26985d'},
	{text : JSV.getLang('TaskStatusFieldEditor', 'doing'), value : TaskItem.DOING, color : '1;#4e6fdc'},
	{text : JSV.getLang('TaskStatusFieldEditor', 'comp'),  value : TaskItem.COMPLETE, color : '3;#696969'}
];
