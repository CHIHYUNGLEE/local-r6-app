function EnhTaskEmpsViewer(parent, style) {
	this.style = style || {};
	this.id = this.style.id || '';
	this.className = this.style.className || 'EnhTaskEmpsViewer';
	this.widget = $('<table cellpadding="0" cellspacing="0" border="0"><tr>\
			<td class="empLeft"></td><td class="empRight"></td>\
			</tr></table>').addClass(this.className).appendTo(parent);
	
	this.empsViewer = new EnhMbrsHtmlViewer(this.widget.find('.empLeft').get(0),this.style);
	this.empsEditor = new KButton(this.widget.find('.empRight').get(0), JSV.getLang('TaskEmpsViewer','changeActor'));
	this.empsEditor.id = this.id;
	this.editable = function(){
		var component = $.data(EnhTaskEmpsViewer, 'component' + this.id);
		component.addUser();
	}
	this.notEditable = function(msg){
		alert(msg);
		return;
	}
	$.data(EnhTaskEmpsViewer, 'component'+this.id, this);
	this.setEditable(this.style.editable);
	this.setVisible(this.style.editable);
}
EnhTaskEmpsViewer.prototype.setEditable = function(editable, resMsg) {
	var notEditable = this.notEditable;
	if(editable){
		this.empsEditor.onclick = this.editable;
	} else {
		this.empsEditor.onclick = function(){
			notEditable(resMsg);
		}
	}
}
EnhTaskEmpsViewer.prototype.setVisible = function(visible) {
	visible ? this.empsEditor.show() : this.empsEditor.hide(); 
}
EnhTaskEmpsViewer.prototype.setValue = function(value) {
	this.value = value;
	this.empsViewer.setValue(value);
	JSV.notify(this.value, this, 'onupdate');
}
EnhTaskEmpsViewer.prototype.getActors = function() {
	return this.value ;
}
EnhTaskEmpsViewer.prototype.includedMe = function() {
	var userId = this.style.userId, result = false;
	$(this.value).each(function(i){
		if(userId == this.id)result = true;
	});
	return result;
}
EnhTaskEmpsViewer.prototype.size = function() {
	return this.value.length;
}
EnhTaskEmpsViewer.prototype.setId = function(id) {
	this.itemId = id;
}
EnhTaskEmpsViewer.prototype.addUser = function(){
	var editor = EmpsFieldEditor.getObject(this.id);
	editor.editor = this;
	editor.validator = function(model){
		var result = {};
		if(model.length){
			result.result = true;
		} else {
			result.result = false;
			result.msg = JSV.getLang('TaskEmpsViewer', 'atLeastOneActor');
		}
		return result;
	}
	editor.onok = function(value){
		var model = JSV.clone(value);
		this.editor.doUpdate(model);
	}
	editor.getData = function(){
		return this.value;
	}
	EmpsFieldEditor.showPopup(this.value, null, this.id);
	return false;
}
EnhTaskEmpsViewer.prototype.doUpdate = function(users){
	var value = [];
	var component = this;
	var id = this.itemId || JSV.getParameter(this.style.attribute);
	$(users).each(function(i){
		value.push(this.id);
	});
	$.ajax({
		url : JSV.getContextPath(this.style.action || EnhTaskEmpsViewer.action),
		type : 'POST',
		dataType : 'json',
		data : {'id' : id, 'users' : value.join(',')},
		async : false,
		success : function(data, status){
			if(data.result == 'true'){
				component.setValue(users);
				JSV.notify(users, component, 'onupdate');
			} else if (data.error != undefined) {
				alert(JSV.getLang('TaskEmpsViewer','permissionDenied'));
			}
		},
		error : function(xhr){
			alert(JSV.getLang('TaskStatusFieldEditor','error'));
		}
	});
}
EnhTaskEmpsViewer.prototype.isSingleActor = function(){
	return this.includedMe() && (this.size() == 1);
}
EnhTaskEmpsViewer.action = '/jsl/TaskActor.UpdateActor.json';
