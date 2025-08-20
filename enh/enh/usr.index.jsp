<%@ include file="/jspf/head.frame.jsp" %>
<script>
JSV.Block(function () {
	var rightUrl = (JSV.getParameter("rightUrl"));

	doLeft(JSV.getModuleUrl('usr.menu.jsp'));
	if (rightUrl) {
		doRight(rightUrl);
	} else {
		doRight(JSV.getModuleUrl('usr.list.jsp'));
	}
});
</script>
<%@ include file="/jspf/tail.frame.jsp" %>