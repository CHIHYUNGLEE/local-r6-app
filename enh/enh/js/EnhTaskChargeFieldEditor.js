function EnhTaskChargeFieldEditor(parent, style) {
	this.style = style || {};
	this.parent = parent;
	this.className = this.style.className || 'TaskChargeFieldEditor';
	this.widget = $('<table cellpadding="0" cellspacing="0" border="0"><tr>\
			<td class="left"></td><td class="right"></td>\
			</tr></table>').addClass(this.className).appendTo(this.parent).get(0);
	this.radios = new RadioImageGroupFieldEditor(this.widget.rows[0].cells[0], {options : EnhTaskChargeFieldEditor.OPTIONS});
	this.radios.onclick = function(value){
		$.data(EnhTaskChargeFieldEditor, 'component').onclick(value);
	}
	this.dprtArea = $('<span>').appendTo(this.widget.rows[0].cells[1]).hide();
	this.projectArea = $('<span>').appendTo(this.widget.rows[0].cells[1]).hide();
	this.dprtEditor = new FolderCompositeEditor(this.dprtArea.get(0), this.style.dprt);
	this.projectEditor = new FolderCompositeEditor(this.projectArea.get(0), this.style.project);
	this.type = null;
	$.data(EnhTaskChargeFieldEditor, 'component', this);
}
EnhTaskChargeFieldEditor.prototype.setValue = function(value) {
	this.type = EnhTaskChargeFieldEditor.getType(value); 
	if(this.type == EnhTaskChargeFieldEditor.DRPT.value){
		this.radios.setValue(EnhTaskChargeFieldEditor.DRPT.value);
		this.dprtEditor.setValue({id : value[EnhTaskChargeFieldEditor.DRPT.id], path : [JSV.getLocaleStr(value[EnhTaskChargeFieldEditor.DRPT.name])]});
		this.dprtArea.show();
		this.projectArea.hide();
	} else {
		this.radios.setValue(EnhTaskChargeFieldEditor.PROJECT.value);
		this.projectEditor.setValue({id : value[EnhTaskChargeFieldEditor.PROJECT.id], path : [JSV.getLocaleStr(value[EnhTaskChargeFieldEditor.PROJECT.name])]});
		this.projectArea.show();
		this.dprtArea.hide();
		
	}
}
EnhTaskChargeFieldEditor.prototype.getValue = function() {
	if(this.type == EnhTaskChargeFieldEditor.DRPT.value){
		var value = this.dprtEditor.getValue();
		if(value.id && value.path) return [value.id, value.path[value.path.length - 1], , ];
	} else {
		var value = this.projectEditor.getValue();
		if(value.id && value.path) return [value.id, value.path[value.path.length - 1], , ];
	}
	return [ , , , ];
}
EnhTaskChargeFieldEditor.prototype.validate = function(metadata) {
	if(this.type == EnhTaskChargeFieldEditor.DRPT.value){
		var value = this.dprtEditor.getValue();
		if(value.id && value.path) 
			return null;
		else
			return JSV.getLang('EnhTaskChargeFieldEditor','dprtError');
	} else {
		var value = this.projectEditor.getValue();
		if(value.id && value.path) 
			return null;
		else
			return JSV.getLang('EnhTaskChargeFieldEditor','projectError');
	}
	return metadata.message;
}
EnhTaskChargeFieldEditor.prototype.focus = function() {
	this.title.focus();
}
EnhTaskChargeFieldEditor.prototype.onclick = function(value) {
	if(value == EnhTaskChargeFieldEditor.DRPT.value){
		this.type = EnhTaskChargeFieldEditor.DRPT.value;
		this.dprtArea.show();
		this.projectArea.hide();
	} else {
		this.type = EnhTaskChargeFieldEditor.PROJECT.value;
		this.dprtArea.hide();
		this.projectArea.show();
	}
}
EnhTaskChargeFieldEditor.getType = function(value) {
	if(value[EnhTaskChargeFieldEditor.DRPT.id] && value[EnhTaskChargeFieldEditor.DRPT.name]){
		return EnhTaskChargeFieldEditor.DRPT.value;
	} else if (value[EnhTaskChargeFieldEditor.PROJECT.id] && value[EnhTaskChargeFieldEditor.PROJECT.name]) {
		return EnhTaskChargeFieldEditor.PROJECT.value;
	} else {
		return EnhTaskChargeFieldEditor.NONE;
	}
}
EnhTaskChargeFieldEditor.NONE = null;
EnhTaskChargeFieldEditor.DRPT = {
		value : 0,
		id : 'chargeDprtId',
		name : 'chargeDprtName'
}
EnhTaskChargeFieldEditor.PROJECT = {
		value : 1,
		id : 'chargeProjectId',
		name : 'chargeProjectName'
}
EnhTaskChargeFieldEditor.OPTIONS = EnhTaskChargeFieldEditor.DRPT.value + ':' + JSV.getLang('EnhTaskChargeFieldEditor', 'dprt') + ',' + EnhTaskChargeFieldEditor.PROJECT.value + ':' + JSV.getLang('EnhTaskChargeFieldEditor', 'project');
