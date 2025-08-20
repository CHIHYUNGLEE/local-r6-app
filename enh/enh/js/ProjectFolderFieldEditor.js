function ProjectFolderFieldEditor(parent, style) {
	this.style = style ? style : {};
	this.buttonImg = this.style.img ? this.style.img : JSV.getLang('FolderFieldEditor', 'selectMapIcon');
	this.msg = this.style.msg ? this.style.msg : JSV.getLang('FolderFieldEditor', 'selectMapMsg');
	this.url = this.style.url ? this.style.url : '/jsl/FolderSelector.ListByUser.xml?rootId=';
	this.isOrgType = this.style.typeOrg == 'true' ? true : false;
	this.scrtCode = this.style.scrtCode ? this.style.scrtCode : null ;

	this.button = new KButton(parent, this.buttonImg);
	this.button.editor = this;
	this.button.onclick = function() {
		var editor = this.editor;
			ProjectFolderFieldEditor.showProjectDialog(function(folder) {
				if (folder)
					editor.setValue(folder);
			}, this.style.useLocalLang);
		return false;
	};
	this.viewers = new Array();
}
ProjectFolderFieldEditor.prototype.onclick = function() {
	this.button.onclick();
}
ProjectFolderFieldEditor.prototype.setAxisList = function(axisList) {
	this.button.axisList = axisList;
}
ProjectFolderFieldEditor.prototype.setRootId = function(rootId) {
	this.button.rootId = rootId;
}
ProjectFolderFieldEditor.prototype.setValue = function(folder) {
	this.folder = folder;
	this.button.selectedId = folder ? folder.id : null;
	JSV.notify(folder, this);
}
ProjectFolderFieldEditor.prototype.getValue = function() {
	return this.folder;
}
ProjectFolderFieldEditor.showDialog = function(rootId, selectedId, msg, axisList, url, scrtCode, callBack) {
	var sUrl = JSV.getContextPath('/enh/js/EnhRadioFieldSelectorDialog.jsp?nYear=@{nYear}');
	var aArguments = [rootId, selectedId, msg ? msg : JSV.getLang('FolderFieldEditor', 'selectMapMsg'), axisList, scrtCode];
	var sFeatures = 'dialogWidth:850px;dialogHeight:640px;scroll:yes;status:no;resizable:no;';
	JSV.showModalDialog(sUrl, aArguments, sFeatures, function(folder) {
		var newFolder = ProjectFolderFieldEditor.copyFolder(folder); 
		callBack(newFolder);
	});
}
ProjectFolderFieldEditor.showProjectDialog = function(callBack, useLocal) {
	var sUrl = JSV.getContextPath('/enh/js/EnhRadioFieldSelectorDialog.jsp');
	var aArguments = nYear ? [nYear] : null;
	var sFeatures = 'dialogWidth:850px;dialogHeight:640px;scroll:yes;status:no;resizable:no;';
	JSV.showModalDialog(sUrl, aArguments, sFeatures, function(folder) {
		var newFolder = ProjectFolderFieldEditor.copyFolder(folder); 
		callBack(newFolder);
	});
}
ProjectFolderFieldEditor.copyFolder = function(oldFolder) {
	if (oldFolder == null) {
		return null;
	}
	var newFolder = {};
	newFolder.id = oldFolder.id;
	newFolder.path = [].concat(oldFolder.name);
	return newFolder;
}
