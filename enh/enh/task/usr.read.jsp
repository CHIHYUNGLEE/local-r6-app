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
	
	var btnPos = [t.layout.mainHeadRight, t.layout.mainFootRight];
	
	var rightBtnArr = [];
	
	if(<%=isMbr%> || <%= isAdmin(moduleParam)%>)
	{
		rightBtnArr.push({text:<fmt:message key="btn.pub.modify"/>.text,
			  onclick:function() {
				  JSV.doGET('usr.edit.jsp?id=' + JSV.getParameter('id') + "&enhId=" + t.getProperty('enhId'));
			}});
		
		rightBtnArr.push({text:<fmt:message key="btn.pub.delete"/>.text,
			  onclick:function() {
				if (confirm('<fmt:message key="pub.009"/>') == false) {
					return false;
				}
				t.action.setRedirect(JSV.setUrlAlert('/enh/usr.read.jsp?isRefresh=1&id=' + t.getProperty('enhId')), '<fmt:message key="pub.004"/>');
				t.submit('/jsl/EnhTaskOwner.DoRemoveByOwner.jsl?id=' + JSV.getParameter('id')+'&enhId=' + t.getProperty('enhId'));
			}});
	}
	
	var rightAreaBtn = new GroupButton(btnPos, {css:{'margin-right':'9px'}});
	rightAreaBtn.setButtons(rightBtnArr);
	
	<%-- list btn --%>
	var listBtn = new KButton(btnPos, <fmt:message key="btn.pub.list_icon"/>);
	listBtn.onclick = function() {
		JSV.doGET('../usr.read.jsp?id=' + t.getProperty('enhId'));
	}
});
</script>
<%@ include file="/sys/jsv/template/template.body.jsp" %>
<div id="main"></div>
<%@ include file="/sys/jsv/template/template.tail.jsp" %>
			