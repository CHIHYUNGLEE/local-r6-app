<%@ include file="/jspf/head.jsp" %>
<%@ include file="/ekp/emp/config.jsp" %>
<script type="text/javascript">
JSV.Block(function() {
	document.body.style.margin="0px";
	var rootId = <%=getDprtId()%>;
	var groupId = null;
	var url = '/jsl/EmployeeSelector.SelectUserList.json';
	if (JSV.getParameter('role') == 'master') {
		url = '/jsl/EmployeeSelector.MasterListByDprtId.json';
	}

	<%-- Tree --%>
	var tree = new TreeViewer(document.getElementById('treeTd'));
	tree.setContentProvider(new LazyXMLTreeContentProvider(
		'/jsl/FolderSelector.ChildrenList.xml',
		'/jsl/FolderSelector.AncestorsOrSelf.xml'
	));
	tree.onclick = function(obj) {
		groupId = tree.getId(obj);
		tl.change();
	}
	tree.setInput('/jsl/FolderSelector.SelfOrChildren.xml?id=' + rootId);

	<%-- TableViewer --%>
	var tl = new TableViewer(document.getElementById('TableViewerDiv'));
	tl.createHeader();
	tl.createBody();
	tl.createFooter();
	tl.createCount();
	tl.createSearch();
	tl.onchange = function() {
		this.setValue(url + '?dprtId=' + groupId + '&ts=' + encodeURIComponent(this.getState()));
	}
	tl.change = function() {
		this.currentPage = 1;
		this.sort = '';
		this.tableSearch.setValue(this.tableSearch.oSelect.getValue()+'_');
		this.search = '';
		this.setValue(url + '?dprtId=' + groupId +'&ts='+ this.getState());
	}

	var style1 = {'name':'user'};
	var check = new CheckboxColumn(tl, style1);
	check.width = '50px';
	check.header = {'label': '<fmt:message key="hrm.006"/>', 'toggle':'user'};

	var style2 = {'attribute':'empno'};
	var empno = new TextColumn(tl, style2);
	empno.width = '70px';
	empno.header = {'label':'<fmt:message key="hrm.002"/>'};

	var style3 = {'attribute':'name'};
	var userName = new EmpColumn(tl, style3);
	userName.width = '120px';
	userName.header = {'label':'<fmt:message key="hrm.004"/>', 'sort':'name'};

	var style4 = {'attribute':'dprtName'};
	var dprt = new TextColumn(tl, style4);
	dprt.header = {'label':'<fmt:message key="hrm.003"/>', 'sort':'dprtName'};

	var style5 = {'attribute':'gradeName'};
	var grade = new TextColumn(tl, style5);
	grade.width = '120px';
	grade.header = {'label':'<fmt:message key="hrm.005"/>', 'sort':'gradeName'};

	if (!groupId) groupId = rootId;
	tl.onchange();

	tl.appendSearch('<fmt:message key="hrm.004"/>', 'name');
	tl.appendSearch('<fmt:message key="hrm.005"/>', 'gradeName');

	<%-- add,delete button --%>
	var add = new KButton(document.getElementById('selectButtonTd'), <fmt:message key="btn.pub.add_large"/>);
	add.onclick = function() {
		var userList = document.getElementsByName('user');
		if(!BooleanFieldEditor.isChecked('user')) {
			alert('<fmt:message key="pub.007"/>');
			return;
		}
		var subModel = new Array();
		for(var i = 0 ; i < userList.length ; i++) {
			if(userList[i].checked == true) {
				var user = new Object();
				user.id = userList[i].element['id'];
				user.name = userList[i].element['name'];
				user.displayName = userList[i].element['displayName'] ;
				subModel[subModel.length] = user;
			}
		}
		if(parent && parent.setModel) parent.setModel(subModel);
		BooleanFieldEditor.check('user', false);
		return false;
	}

	var del = new KButton(document.getElementById('selectButtonTd'), <fmt:message key="btn.pub.close"/>);
	del.onclick = function() {
		if(parent && parent.delModel) parent.delModel();
		return false;
	}
	JSV.autoResizeElement(document.getElementById('treeTd'), []);
});
</script>
<%@ include file="/jspf/body.jsp" %>
<table width="100%" border="0" cellspacing="0" cellpadding="0"
	style="table-layout: fixed;">
	<col width="220px">
	<col>
	<tr>
		<td rowSpan="2" id="treeTd"
			style="vertical-align: top; padding: 5px 0px 0px 5px;"></td>
		<td valign="top">
			<div style="height: 465px;" id="TableViewerDiv"></div>
			<div align="center"><nobr id="selectButtonTd"></nobr></div>
		</td>
	</tr>
</table>
<%@ include file="/jspf/tail.jsp" %>