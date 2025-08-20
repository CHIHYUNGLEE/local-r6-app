<%@ include file="/sys/jsv/template/template.head.jsp" %>
<%@ include file="/enh/config.jsp" %>
<%@ include file="/enh/jsv-enh-ext.jsp" %>
<%@ include file="/jspf/group-jsv.jsp" %><%
	boolean isMbr = com.kcube.enh.EnhPermission.isMbr(Long.valueOf(request.getParameter("enhId")));
%>
<script type="text/javascript">
JSV.Block(function(){
	var template = '<template color="green" catalog="/enh/task/catalog.xml.jsp">\
			<navigation label="<kfmt:message key="enh.task.003"/>"/>\
			<header label="<kfmt:message key="enh.task.003"/>"/>\
			<fields class="Array" columns="100px,,,100px,100px,,100px," type="read">\
				<field property="author.read" colSpan="4"/>\
				<field property="reside.read" colSpan="4"/>\
				<field property="rgstDate.read" colSpan="4"/>\
				<field property="taskCode.read" colSpan="4"/>\
				<field property="task.read" colSpan="4"/>\
				<field property="percent.read" colSpan="4"/>\
				<field property="period.read" colSpan="4"/>\
				<field property="planPeriod.read" colSpan="4"/>\
				<field property="content.read"/>\
				<field property="attachments.read"/>\
				<field property="id.hidden"/>\
				<field property="enhId.hidden"/>\
				<field property="author.hidden"/>\
				<field property="currentOwner.hidden"/>\
			</fields>\
			<opinions class="Array">\
				<opinion property="opinions.read"/>\
				<opinion property="opinions.write"/>\
			</opinions>\
		</template>';
		
	var t = new ItemTemplate(document.getElementById('main'), template);

	var model = <%ctx.execute("EnhTaskUser.ReadByUser");%>;	
	t.setValue(model);
	
	t.getChild('percent').setValue(t.getChild('percent').getValue()+' (%)');
	
	if(<%=isMbr%> || <%=isAdmin(moduleParam)%>)
	{		
		var rightBtnArr = [{text:<fmt:message key="btn.pub.modify"/>.text,
			   onclick:function() {
				   JSV.doGET('usr.edit.jsp?id=' + JSV.getParameter('id') + "&enhId=" + t.getProperty('enhId'));
		   }}];
		var rightAreaBtn = new GroupButton([t.layout.mainHeadRight, t.layout.mainFootRight], {css:{'margin-right':'9px'}});
		rightAreaBtn.setButtons(rightBtnArr);
	}
	
	var list = new GroupButton([t.layout.mainHeadRight, t.layout.mainFootRight],
			   {css:{'margin-right':'1px'}},
			   {icon:'/img/btn/pub/btn_etc.gif',
			   onclick:function() {
				   JSV.doGET('../usr.popup.read.jsp?id=' + t.getProperty('enhId'));
			   }});
});
</script>
<%@ include file="/sys/jsv/template/template.body.jsp" %>
<div id="main"></div>
<br/>
<table width="100%" height="45px"><tr><td><div id="closeButton" align="center"></div></td></tr></table>
<%@ include file="/sys/jsv/template/template.tail.jsp" %>
			