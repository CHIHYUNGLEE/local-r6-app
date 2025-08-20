function EnhEmpsFieldEditor(parent, style) {
	this.parent = parent ? parent : $('body').get(0);
	this.style = style ? style : {};
	this.className = this.style.className ? this.style.className : 'EmpsFieldEditor';
	this.widget = $('<table cellSpacing="0" cellPadding="0">\
<tr class="empsFldTr">\
	<td class="empsFldTd1"></td>\
	<td class="empsFldTd2"><div class="addDiv"></div><div class="delDiv"></div></td>\
</tr></table>').addClass(this.className).appendTo(this.parent).get(0);

	var viewerTd = $(this.widget).find('.empsFldTd1');
	var addDiv = $(this.widget).find('.addDiv');
	var delDiv = $(this.widget).find('.delDiv');
	var imgAdd = this.style.imgAdd ? this.style.imgAdd : JSV.getLang('EmpsFieldEditor', 'addButton');

	this.button = new KButton(addDiv , imgAdd);
	this.button.editor = this;
	this.button.onclick = function() {
		EnhEmpsFieldEditor.editor = this.editor
		EnhEmpsFieldEditor.onok = function(value){
			var model = JSV.clone(value);
			EnhEmpsFieldEditor.editor.setValue(model);
		}
		EnhEmpsFieldEditor.showPopup(this.editor.userList, this.editor.style.role);
		return false;
	};

	if (this.style.viewer == 'ListViewer') {
		this.viewer = new ListViewer(viewerTd, this.style);
		$(this.viewer).addClass('empsList');
		this.viewer.setLabelProvider(new ListViewerLabelProvider('displayName'));
		this.buttonDel = new KButton(delDiv, JSV.getLang('EmpsFieldEditor', 'deleteButton'));
		this.buttonDel.editor = this;
		this.buttonDel.onclick = function() {
			var selection = this.editor.viewer.getSelection();
			if (selection.length > 0) {
				this.editor.viewer.removeSelection();
			} else {
				alert(JSV.getLang('EmpsFieldEditor', 'notSelect'));
			}
			return false;
		}
	} else if (this.style.viewer == 'EmpsHtmlViewer') {
		this.viewer = new EmpsHtmlViewer(viewerTd);
	} else if (this.style.viewer == 'EmpsTextViewer') {
		this.viewer = new EmpsTextViewer(viewerTd);
		this.viewer.button = this.button ; 
		this.viewer.onclick = function() {
			this.button.onclick();
		}
	} else {
		this.viewer = null;
	}
}
EnhEmpsFieldEditor.prototype.setValue = function(value) {
	this.userList = value;
	if (this.viewer) {
		this.viewer.setValue(value);
	}
	JSV.notify(value, this);
}
EnhEmpsFieldEditor.prototype.getValue = function() {
	if (this.style && this.userList) {
		this.userList.nodeName = this.style.nodeName;
	}
	return this.userList;
}
EnhEmpsFieldEditor.prototype.notify = function(value, observable) {
	if (this.userList) {
		var i = this.userList.indexOf(value, EnhEmpsFieldEditor.equals);
		if (i >= 0) {
			alert(JSV.getLang('EmpsFieldEditor', 'duplicate'));
			this.userList.remove(this.userList[i]);
			this.setValue(this.userList);
		}
	}
}
EnhEmpsFieldEditor.prototype.validate = function(style){
	return (this.getValue() != null && this.getValue().length > 0);
}
EnhEmpsFieldEditor.equals = function(obj1, obj2) {
	return (obj1.id == obj2.id);
}
EnhEmpsFieldEditor.showPopup = function(value, role, id, action) {
	var name = 'EnhEmpsFieldEditor';
	var obj = eval(id ? name + id : name);
	obj.value = value;
	var u = '/enh/js/EnhEmpsFieldEditorDialog.jsp';
	var q = (role ? 'role=' + role : '') + (id ? (role) ? '&id=' + id : 'id=' + id : '') + (action ? (role || id) ? '&action=' + action : 'action=' + action : '');
	var n = 'usersPopup';
	var f = 'width=800,height=730,scrollbars=no,status=no,toolbar=no,menubar=no,location=no,resizable=no';
	var url = JSV.getContextPath(u, q);
	window.open(url, n, f);
}
EnhEmpsFieldEditor.getData = function(){
	return EnhEmpsFieldEditor.value;
}
EnhEmpsFieldEditor.getObject = function(id){
	var name = 'EmpsFieldEditor';
	var obj;
	if(id){
		eval('obj = ' + (name + id) + ' = {}');
	} else {
		obj = eval(name);
	}
	return obj;
}
