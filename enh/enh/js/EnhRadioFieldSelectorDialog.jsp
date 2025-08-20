<%@ include file="/jspf/head.jsp" %>
<style>
.TreeMenuSearchResult{width:220px;}
</style>
<script type="text/javascript">
JSV.Block(function () {
	var nYear = null;
	if (JSV.dialogArguments) {
		nYear = JSV.dialogArguments[0];
	} else {
		if(JSV.getParameter('nYear') != null){
			nYear = JSV.getParameter('nYear');
		}
	}
	var enhId = null;
	var enhName = null;
	
	var url = JSV.getParameter('action') || 'EnhUser.SelectProjectByUser';
	url = '/jsl/' + url + '.json';
	<%-- Header --%>
	var header = new HeaderPopup(document.getElementById('headerTd'), '<kfmt:message key="enh.dialog.002"/>');
	
	<%-- TableViewer --%>
	var tableViewerStyle = {'name':'ts'};
	var tl = new TableViewer(document.getElementById('TableViewerDiv'), tableViewerStyle);
	tl.createHeader();
	tl.createBody();
	tl.createFooter();
	tl.createCount();
	tl.createSearch({'width':'110px'});
	tl.onchange = function() {
		this.setValue(url + '?nYear=' + nYear + '&ts=' + encodeURIComponent(this.getState()));
	}
	
	var style0 = {'name':'project', 'align':'center'};
	var check = new RadioColumn(tl, style0);
	check.width = '40px';
	check.header = {'label': '<fmt:message key="hrm.006"/>'};
	RadioColumn.prototype.onclick = function(value, element) {
		addProject();
		return false;
	}

// 	var style1 = {'attribute':'enhId', 'align':'center'};
// 	var id = new TextColumn(tl, style1);
// 	id.width = '60px';
// 	id.header = {'label':'<fmt:message key="doc.006"/>','sort':'enhId'};

	var style2 = {'attribute':'enhName'};
	var enhName = new TextColumn(tl, style2);
	enhName.header = {'label':'<kfmt:message key="enh.001"/>','sort':'enhName'};
	
	var style3 = {'attribute':'orgName'};
	var orgName = new TextColumn(tl, style3);
	orgName.header = {'label':'<kfmt:message key="enh.003"/>','sort':'orgName'};
	
	var style4 = {'attribute':'enhSdate', 'format':'<fmt:message key="date.medium"/>'};
	var enhSdate = new DateColumn(tl, style4);
	enhSdate.header = {'label':'<kfmt:message key="enh.005"/>','sort':'enhSdate'};
	
	var style5 = {'attribute':'enhEdate', 'format':'<fmt:message key="date.medium"/>'};
	var enhEdate = new DateColumn(tl, style5);
	enhEdate.header = {'label':'<kfmt:message key="enh.006"/>','sort':'enhEdate'};
	
	var style6 = {'attribute':'pmName'};
	var pmName = new TextColumn(tl, style6);
	pmName.header = {'label':'<kfmt:message key="enh.012"/>','sort':'pmName'};
	
	var style7 = {'attribute':'rgstDate', 'format':'<fmt:message key="date.medium"/>'};
	var rgstDate = new DateColumn(tl, style7);
	rgstDate.header = {'label':'<fmt:message key="srch.007"/>','sort':'rgstDate'};
	
	tl.onchange();	
	tl.appendSearch('<kfmt:message key="enh.001"/>', 'enhName');
	tl.appendSearch('<kfmt:message key="enh.003"/>', 'orgName');
	tl.appendSearch('<kfmt:message key="enh.012"/>', 'pmName');
	
	var addProject = function() {
		var project = new Object();
		var projectList = document.getElementsByName('project');
		for (var i = 0 ; i < projectList.length ; i++) {
			
			if (projectList[i].checked == true) {
				var element = $.data(projectList[i], 'element');
				enhId = element.enhId;
				enhName = element.enhName;
			}
		}
		return false;
	};

	<%-- Dialog button --%>
	var ok = new KButton(document.getElementById('dialogButtonTd'), <fmt:message key="btn.pub.ok"/>);
	ok.onclick = function() {
			if(enhId == null){
				alert('<kfmt:message key="enh.dialog.msg.002"/>');
				return;
			}
		
		var folder = new Object();
		folder.id = enhId;
		folder.name =  enhName;
		JSV.setModalReturnValue(folder);
		window.close();
		
	}
	var cancel = new KButton(document.getElementById('dialogButtonTd'), <fmt:message key="btn.pub.cancel"/>);
	cancel.onclick = function() {
		window.close();
		return false;
	}
});
</script>

<%@ include file="/jspf/body.jsp" %>
<table width="100%" cellspacing="0" cellpadding="0" style="table-layout:fixed;">
	<tr height="35px">
		<td id="headerTd" style="vertical-align:top;"></td>
	</tr>
	<tr>
		<td id="listTd" valign="top" style="padding:18px 30px 0px 24px;">
			<div style="height:95%;overflow-y:auto" id="TableViewerDiv"></div>
			<div id="dialogButtonTd" style="padding:15px 0px 20px 0px;text-align:center;"></div>
		</td>
	</tr>
</table>
<%@ include file="/jspf/tail.jsp" %>