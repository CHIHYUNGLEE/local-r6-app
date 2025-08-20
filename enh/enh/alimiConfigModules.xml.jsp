<%@ include file="/jspf/head.xml.jsp" %>
<%@ page import="com.kcube.sys.usr.UserPermission" %>
<list class="Array">
	<% if (UserPermission.isEmbeddedAppAdmin("ADM_ENH")) { %>
	<n key="com.kcube.enh.EnhNotify.mbrRegist"><kfmt:message key="cst.enh.conf.002"/></n>
	<n key="com.kcube.enh.EnhNotify.mbrRemove"><kfmt:message key="cst.enh.conf.003"/></n>
	<n key="com.kcube.enh.EnhNotify.modify"><kfmt:message key="cst.enh.conf.004"/></n>
	<n key="com.kcube.enh.EnhNotify.remove"><kfmt:message key="cst.enh.conf.005"/></n>
	<n key="com.kcube.enh.task.EnhTaskNotify.roleRegist"><kfmt:message key="cst.enh.conf.006"/></n>
	<% } %>
</list>
<%@ include file="/jspf/tail.xml.jsp" %>
