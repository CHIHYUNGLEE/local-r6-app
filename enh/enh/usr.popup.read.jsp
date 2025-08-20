<%@ include file="/sys/jsv/template/template.head.jsp" %>
<%@ include file="/enh/config.jsp" %>
<%@ include file="/jspf/group-jsv.jsp" %>
<%@ include file="/enh/jsv-enh-ext.jsp" %><%
	boolean isMbr = com.kcube.enh.EnhPermission.isMbr(Long.valueOf(request.getParameter("id")));
%>
<script type="text/javascript" src="<%= request.getContextPath() %>/enh/js/human.js"></script>
<script type="text/javascript">
JSV.Block(function(){
	var template = '<template color="green" catalog="/enh/catalog.xml.jsp">\
			<navigation label="<kfmt:message key="enh.010"/>"/>\
			<header label="<kfmt:message key="enh.010"/>"/>\
			<fields class="Array" columns="120px,,,100px,120px,,100px," type="read">\
				<field property="enhName.read"/>\
				<field property="orgInfo.read"/>\
				<field property="mbrs.read" colSpan="4"/>\
				<field property="period.read"/>\
				<field property="status.read"/>\
				<field property="content.read"/>\
				<field property="attachments.read"/>\
				<field property="author.hidden"/>\
				<field property="id.hidden"/>\
				<field property="currentPm.hidden"/>\
			</fields>\
			<opinions class="Array">\
				<opinion property="opinions.read"/>\
				<opinion property="opinions.write"/>\
			</opinions>\
		</template>';

	var model = <% ctx.execute("EnhUser.ReadByUser"); %>;
	var pt = new ItemTemplate(document.getElementById('main'), template);
	
	pt.setValue(model);
	JSV.setState('id', JSV.getParameter('id'));

	var author = pt.getProperty('author');
	if ( <%=isMbr%> || <%=isAdmin(moduleParam)%>) {
		if(pt.getProperty('visible')){
			var tstatus = pt.getChild('status');
			tstatus.setEnhEditable(true);
		}

		var edit = new KButton([pt.layout.mainHeadRight, pt.layout.mainFootRight],<fmt:message key="btn.pub.modify"/>);
		edit.onclick = function() {
			JSV.doGET('usr.edit.jsp?id=' + JSV.getParameter('id'));
		}		
	}
	
/* 	var taskTemplate = '<template color="blue" name="com.kcube.doc.taskList" catalog="/enh/task/catalog.xml.jsp">\
		<header label="<kfmt:message key="enh.task.001"/>" type="inner"/>\
		<columns class="Array">\
			<column property="author.list"/>\
			<column property="task.popupList"/>\
			<column property="taskSdate.list"/>\
			<column property="taskEdate.list"/>\
			<column property="rgstDate.list"/>\
			<column property="attachments.list"/>\
			<column property="taskCode.hidden"/>\
			</columns>\
			<footer/>\
			 <count/>\
			<footer count="disabled"/>\
			<pageMover/>\
			<rows name="com.kcube.doc.rowsPerPage"/>\
		</template>';	

	var tt = new TableTemplate(document.getElementById('task'), taskTemplate);
	tt.setDataUrl('/jsl/EnhTaskUser.ListByUser.json', 'ts'); */
});
</script>
<%@ include file="/sys/jsv/template/template.body.jsp" %>
<div id="main"></div>
<div id="task"></div>
<%@ include file="/sys/jsv/template/template.tail.jsp" %>