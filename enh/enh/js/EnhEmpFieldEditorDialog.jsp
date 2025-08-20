<%@ include file="/jspf/head.jsp"%>
<%@ include file="/jspf/group-jsv.jsp" %>
<%@ include file="/ekp/emp/config.jsp"%>
<script type="text/javascript">
JSV.Block(function () {
var groupId;
var rootId =<%=getDprtId()%>;
var noUser = (JSV.getParameter('noUser') && JSV.getParameter('noUser') == 'true') ? true : false;
var enhId = JSV.getParameter('enhId');
<%-- Header --%>
var header = new HeaderPopup(document.getElementById('headerTd'), '<fmt:message key="hrm.001"/>');

<%-- TableLayout --%>
var tl = new TableViewer(document.getElementById('TableViewerDiv'));
tl.createHeader();
tl.createBody();
tl.createFooter({'pagesPerSet':5});
tl.createCount();
tl.createSearch();
tl.onchange = function() {
	this.setValue('/jsl/EnhAdmin.SelectUserList.json?dprtId=' + groupId + '&ts=' + encodeURIComponent(this.getState())+'&enhId='+JSV.getParameter('enhId'));
}
tl.change = function() {
	this.currentPage=1;
	this.sort='';
	this.tableSearch.setValue(this.tableSearch.oSelect.getValue()+'_');
	this.search='';
	this.setValue('/jsl/EnhAdmin.SelectUserList.json?dprtId=' + groupId + '&ts=' + this.getState()+'&enhId='+JSV.getParameter('enhId'));
}

<%-- Column --%>
var style0 = {'name':'user', 'align':'center'};
var check = new RadioColumn(tl, style0);
check.width = '40px';
check.header = {'label': '<fmt:message key="hrm.006"/>'};
RadioColumn.prototype.onclick = function(value, element) {
	addUser();
	return false;
}

var style1 = {'attribute':'sabun', 'align':'center'};
var sabun = new TextColumn(tl, style1);
sabun.width = '60px';
sabun.header = {'label':'<fmt:message key="hrm.002"/>'};

var style2 = {'id':'id', 'name':'name', 'align':'center','isGlobal':'true'};
var userName = new MbrColumn(tl, style2);
userName.width = '80px';
userName.header = {'label':'<fmt:message key="hrm.004"/>', 'sort':'name'}

var style3 = {'attribute':'dprtName'};
var dprt = new TextColumn(tl, style3);
dprt.header = {'label':'<fmt:message key="hrm.003"/>', 'sort':'dprtName'};

var style4 = {'attribute':'gradeName'};
var grade = new TextColumn(tl, style4);
grade.width = '120px';
grade.header = {'label':'<fmt:message key="hrm.005"/>', 'sort':'gradeSort'};

if (!groupId) groupId = rootId;
tl.onchange();

tl.appendSearch('<fmt:message key="hrm.004"/>', 'name');
tl.appendSearch('<fmt:message key="hrm.005"/>', 'gradeName');

<%-- User model--%>
var model;
if (opener != null && !opener.closed && opener.EmpFieldEditor && opener.EmpFieldEditor.getData) {
	model = JSV.clone(opener.EmpFieldEditor.getData());
}
if (!model) model = new Object();

function equals(obj1, obj2) {
	return (obj1 != null && obj2 != null && obj1.id == obj2.id);
}

var addUser = function() {
	var user = new Object();
	var userList = document.getElementsByName('user');
	for (var i = 0 ; i < userList.length ; i++) {
		if (userList[i].checked == true) {
			var element = $.data(userList[i], 'element');
			user.id = element.id;
			user.name = element.name;
			user.displayName = element.displayName;
		}
	}
	if (!equals(user, model)) {
		model = user ;
		ut.setValue(user);
	}
	return false;
};
<%-- delete button --%>
var del = new KButton(document.getElementById('delBtnDiv'), <fmt:message key="btn.pub.close"/>);
del.onclick = function() {
	model = null ;
	ut.setValue({'displayName':' '});
	return false;
};

<%-- TextViewer --%>
var ut = new EmpTextViewer(document.getElementById('userViewerDiv'));
ut.setValue(model);

<%-- Dialog button --%>
var ok = new KButton(document.getElementById('dialogButtonTd'), <fmt:message key="btn.pub.ok"/>);
ok.onclick = function() {
	if (model == null && !noUser) {
		alert('<fmt:message key="hrm.036"/>');
		return false;
	}
	if (opener && opener.setData) {
		opener.setData(model);
	}
	if (opener != null && !opener.closed && opener.EmpFieldEditor.onok) {
		opener.EmpFieldEditor.onok(model);
	}
	window.close();
	return false;
}
var cancel = new KButton(document.getElementById('dialogButtonTd'), <fmt:message key="btn.pub.cancel"/>);
cancel.onclick = function() {
	window.close();
	return false;
}
});
</script>
<%@ include file="/jspf/body.jsp"%>
<table width="100%" cellspacing="0" cellpadding="0" style="table-layout:fixed;">
	<col width="220px"/><col/>
	<tr height="35px">
		<td colspan="2" id="headerTd" style="vertical-align:top;"></td>
	</tr>
	<tr>
		<td id="listTd" valign="top" style="padding:18px 24px 0px 24px;" colspan="2"><div style="height:440px;overflow-y:auto" id="TableViewerDiv"></div></td>
	</tr>
	<tr>
		<td id="viewTd" valign="top" height="40px" style="padding:0px 30px 0px 24px;" colspan="2">
			<div id="delBtnDiv" align="right" style="padding:0px 0px 5px 0px"></div>
			<div id="userViewerDiv" class="TextFieldEditor_readOnly" style="height:23px;line-height:23px;"></div>
		</td>
	</tr>
	<tr>
		<td height="auto" id="dialogButtonTd" style="padding:15px 0px 20px 0px" align="center" colspan="2"></td>
	</tr>
</table>
<%@ include file="/jspf/tail.jsp"%>