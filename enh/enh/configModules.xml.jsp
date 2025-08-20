<%@ include file="/jspf/head.xml.jsp" %>
<%@ page import="com.kcube.sys.usr.UserPermission" %>
<list class="Array">
	<n id="1" url="/sys/conf/adm/configInit.jsp"><fmt:message key="conf.001"/></n>
	<% if (UserPermission.isAdmin(moduleParam) && UserPermission.isLocationAllowed()) { %>
		<!-- 고도화 관리(인맥관리 연동 설정) -->
		<n id="enh24500" pid="1" url="/enh/adm.config.xml.jsp"><kfmt:message key="cst.enh.conf.007"/></n>
	<% } %>
</list>
<%@ include file="/jspf/tail.xml.jsp" %>