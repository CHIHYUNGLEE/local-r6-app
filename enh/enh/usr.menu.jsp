<%@ include file="/jspf/head.jsp" %>
<%@ include file="/jspf/app.info.jsp" %>
<%@page import="com.kcube.sys.usr.UserPermission"%>
<script type="text/javascript">
JSV.Block(function(){
	var menu = JSV.getParameter("menu") ? JSV.getParameter("menu") : 1;	
	var title = '${currAppName}';
	var style = {'title':title, 'iconType':'${currAppIconType}', 'iconCode':'${currAppIconCode}', 'iconSaveCode':'${currAppIconSaceCode}', 'iconSavePath':'${currAppIconSavePath}', 'link':{url:'usr.index.jsp', target:'bottom'},'isAdmin':<%=UserPermission.isAppAdmin(moduleParam)%>, hideMenuTop:true, hideSearch : true};
	var leftMenu = new LeftMenu(document.getElementById('main'), style);
	
	infoMenu = new SelectListMenu(leftMenu);
	leftMenu.addTopMenu('mydoc', <fmt:message key="leftmenu.icon.mydoc"/>,
			{'component':'SelectListMenu', 'isPreLoad':true}
		);	
	infoMenu = new SelectListMenu({widget:$(leftMenu.lnbMenu).empty()});
	infoMenu.add('<kfmt:message key="menu.enh.002"/>', 1, 'usr.list.jsp', 'right');
	infoMenu.add('<kfmt:message key="menu.enh.003"/>', 2, 'usr.chart.jsp', 'right');
 	infoMenu.add('<kfmt:message key="menu.enh.004"/>', 3, 'usr.all.chart.jsp', 'right');	
 	infoMenu.add('<kfmt:message key="enh.mod.004"/>', 5, 'usr.main.jsp', 'right');	
	infoMenu.setValue(menu);
});
var infoMenu;
function menuSelect(index) {
	infoMenu.setValue(index);
}
</script>
<%@ include file="/jspf/body.jsp" %>
<div id="main"></div>
<%@ include file="/jspf/tail.jsp" %>