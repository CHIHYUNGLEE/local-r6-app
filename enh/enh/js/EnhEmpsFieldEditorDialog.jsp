<%@ include file="/jspf/head.jsp" %>
<style>
.mt {
 font-family: "Gulim,seoul,helvetica";
 color: #000000;
 font-size: 12px;
}
.mt a {
 color: #000000;
 text-decoration: none;
}
.mt a:hover {
 color: #3366FF;
}
</style>
<script type="text/javascript">
JSV.Block(function() {
	document.body.style.margin="0px";
	var isModal = JSV.getParameter('isModal');

	if(opener && opener.getData) {
		model = JSV.clone(opener.getData());
	}

	if (opener != null && !opener.closed && opener.EnhEmpsFieldEditor && opener.EnhEmpsFieldEditor.getData) {
		model = JSV.clone(opener.EnhEmpsFieldEditor.getData());
	}

	//기존값을 Hidden으로 가져온다.
	if(opener && opener.getHiddenData) {
		model = JSV.clone(opener.getHiddenData());
	}

	if(!model)	model = new Array();

	<%-- Header --%>
	var header = new HeaderPopup(document.getElementById('headerDiv'), '<kfmt:message key="menu.enh.006"/>');

	<%-- Message --%>
	var txt = new HtmlViewer(document.getElementById('infoTd'));
	txt.setValue('<fmt:message key="hrm.087"/>');

	<%-- ListViewer --%>
	var style1 = {'size' : 5, 'multiple' : true, 'height' : 80};

	list = new ListViewer(document.getElementById('listViewerTd'), style1);
	list.setLabelProvider(new ListViewerLabelProvider('displayName'));
	list.setValue(model);

	<%-- Dialog button --%>
	var ok = new KButton(document.getElementById('dialogButtonTd'), <fmt:message key="btn.pub.ok"/>);
	ok.onclick = function() {
		if(opener && opener.setData) opener.setData(model);
		if(opener && opener.EnhEmpsFieldEditor && opener.EnhEmpsFieldEditor.onok) {
			opener.EnhEmpsFieldEditor.onok(model);
		}
		window.close();
		return false;
	}
	var cancel = new KButton(document.getElementById('dialogButtonTd'), <fmt:message key="btn.pub.cancel"/>);
	cancel.onclick = function() {
		window.close();
		return false;
	}
	<% if(com.kcube.sys.license.LicenseService.isAuthorized(com.kcube.sys.PlusAppBoot.SYSTEM_EKP) && !com.kcube.sys.usr.UserService.isGlobal()){ %>
	doChgMenu('1');
	<% } else { %>
	doChgMenu('2');
	<% } %>
	JSV.autoResizeElement(document.getElementById('frameTd'), ['headerDiv','menuTr','infoTd','listViewerTd','dialogButtonTd']);
});
var model;
var list;
function setModel(arr) {
	var rseArr = JSV.clone(arr);
	for(var i = 0 ; i < rseArr.length ; i++) {
		if(model.indexOf(rseArr[i], equals) < 0) {
			model[model.length] = rseArr[i] ;
		}
	}
	list.refresh();
}
function delModel(){
	var selection = list.getSelection();
 	if(selection.length > 0) {
	 	for(var i = 0 ; i < selection.length ; i++) {
 			if(model.indexOf(selection[i], equals) > -1)
				model.remove(selection[i], equals);
	 	}
 	}else{
 		alert('<fmt:message key="pub.007"/>');
 	}
	list.refresh();
}
function equals(obj1, obj2) {
	return (obj1.id == obj2.id);
}
function doChgMenu(nType) {	
	var menu = nType;
	<% if(com.kcube.sys.license.LicenseService.isAuthorized(com.kcube.sys.PlusAppBoot.SYSTEM_EKP)) { %>
	doMenuClick(menu);
	<% } %>
	if(menu == 1) {	
		JSV.doGET('/enh/js/EnhgeneralUser.list.jsp', 'right');
	} else if(menu == 2) {	
		JSV.doGET('/enh/js/globalUser.list.jsp', 'right');
	}
}
function doMenuClick(sMenu) {
	$('.mt nobr').css('fontWeight', 'normal');
	$('#_menu_' + sMenu).css('fontWeight', 'bold');
}
</script>
<%@ include file="/jspf/body.jsp" %>
<div id="headerDiv" style="height:35px"></div>
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed;">
 <tr id="menuTr" height="23px">
    <td id="menuTd" style="background:url(<c:url value="/img/popup_menubg.gif"/>) ;">
    	<% if(com.kcube.sys.license.LicenseService.isAuthorized(com.kcube.sys.PlusAppBoot.SYSTEM_EKP)) {%>
		<table cellspacing="0" cellpadding="0" border="0" style="table-layout:fixed;">
		 <tr>
		 	<%if(!com.kcube.sys.usr.UserService.isGlobal()){%>
			<td class="mt" width="80px" style="padding-left:5px;">
				<a  onClick="doChgMenu('1');return false;">
				<nobr id="_menu_1"/><fmt:message key="group.580"/></nobr></a>
			</td>
			<td style="font-size:12px;" width="10px">|</td>
			<%}%>
			<td class="mt" width="70px" style="padding-left:5px;">
				<a  onClick="doChgMenu('2');return false;">
				<nobr id="_menu_2"/><fmt:message key="group.581"/></nobr></a>
			</td>
		   <td></td>
		 </tr>
		</table>
		<% } %>
    </td>
 </tr>
 <tr>
  <td vAlign="top" id="frameTd">
   <iframe name="right" id="right" scrolling="no" frameborder="0" width="100%" height="100%"
            marginHeight="0px" marginWidth="0px"></iframe>
  </td>
 </tr>
 <tr>
  <td height="20px" id="infoTd" style="padding-left:10px;"></td>
 </tr>
 <tr>
  <td height="40px" id="listViewerTd" align="center"></td>
 </tr>
 <tr>
  <td height="30px" id="dialogButtonTd" align="center"></td>
 </tr>
</table>
<%@ include file="/jspf/tail.jsp" %>