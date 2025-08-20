<%@ include file="/jspf/head.jsp" %>
<%@ include file="/jspf/group-jsv.jsp" %>
<style type="text/css">
	.ellipse{
		
	}
</style>
<script type="text/javascript">
JSV.Block(function() {
	document.body.style.margin="0px";
	var subModel = new Array();
	var actionUrl = JSV.getParameter("actionUrl");
	var groupId = JSV.getParameter("groupId");
	if (!actionUrl) actionUrl = 'GlobalUserList.RegisteredList';

	<%-- TableLayout --%>
	var tl = new TableViewer(document.getElementById('TableViewerTd'));
	tl.createHeader();
	tl.createBody();
	tl.createFooter();
	tl.createCount();
	tl.createSearch();
	tl.onchange = function() {
		this.setValue('/jsl/GlobalUserList.RegisteredList.json?groupId=' + groupId + '&ts=' + encodeURIComponent(this.getState()));
	}

	<%-- Column Setting --%>
	var style0 = {'name':'user'};
	var check = new CheckboxColumn(tl, style0);
	check.width = '50px';
	check.header = {'label': '<fmt:message key="hrm.006"/>', 'toggle':'user'};

	var style1 = {'attribute':'name', 'isGlobal':'true'};
	var memberTitle = new MbrColumn(tl, style1);
	memberTitle.width = '150px';
	memberTitle.header = {'label':'<fmt:message key="group.062"/>', 'sort':'name'}

	var style2 = {'attribute':'officeName'};
	var ofceName = new TextColumn(tl, style2);
	ofceName.width = '180px'; 
	ofceName.header = {'label':'<fmt:message key="group.gcop.002"/>'};

	var style3 = {'attribute':'dprtName'};
	var dprtName = new PathColumn(tl, style3);
	dprtName.header = {'label':'<fmt:message key="group.gcop.005"/>'};

	tl.onchange();
	tl.appendSearch('<fmt:message key="group.062"/>', 'name');

	<%-- add,delete button --%>
	var add = new KButton(document.getElementById('ButtonTd'), <fmt:message key="btn.pub.add_down"/>);
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

	var del = new KButton(document.getElementById('ButtonTd'), <fmt:message key="btn.pub.close"/>);
	del.onclick = function() {
		if(parent && parent.delModel) parent.delModel();
		return false;
	}
});

</script>
<%@ include file="/jspf/body.jsp" %>
<table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed;"> 	
 <tr height="*">
  <td valign="top">
   <table width="100%" height="100%" border="0" cellspacing="3" cellpadding="5" style="table-layout:fixed;">
    <tr valign="top">
		<td id="TableViewerTd"></td>
    </tr>
	<tr height="30px">
		<td height="30px" id="ButtonTd" align="center"></td>
	</tr>
   </table>
  </td>
 </tr>
</table>
<%@ include file="/jspf/tail.jsp" %>
