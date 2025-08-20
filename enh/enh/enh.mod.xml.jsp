<%@ include file="/jspf/head.xml.jsp" %>
<%@ page import="com.kcube.enh.EnhSql"%>
<%@ page import="com.kcube.lib.sql.SqlSelect" %><%
	String cnt = request.getParameter("count") != null ? request.getParameter("count") : "100";
	String ord = request.getParameter("order") != null ? request.getParameter("order") : "0";
	String mpString = request.getParameter("code") != null ? request.getParameter("code") : "0.0.0.0";
	String title = "";
	String target = request.getParameter("target") != null ? request.getParameter("target") : "bottom";
	String m[] = mpString.split("\\.");
	int count = Integer.valueOf(cnt).intValue();
	int order = Integer.valueOf(ord).intValue();

	SqlSelect stmt = EnhSql.getModList(count, title, order);
	request.setAttribute("tagList", stmt.resultImpl());
%>
<list class="Array">
	<c:forEach var="tab" varStatus="vs" items="${tagList.rows}">
		<c:url value="usr.main.jsp" var="encodeURL">
			<c:param name="tab" value="${tab.title}"/>
		</c:url>
		<n rank="<c:out value="${tab.rk}"/>" tag="<c:out value="${tab.title}"/>" cnt="<c:out value="${tab.mod_count}"/>" href="<c:out value="${encodeURL}"/>" target="<%= com.kcube.lib.secure.SecureUtils.XSSFilter(target) %>" />
	</c:forEach>
</list>
<%@ include file="/jspf/tail.xml.jsp" %>