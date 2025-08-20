<%@ include file="/sys/jsv/template/template.head.jsp" %>
<%@ include file="/enh/jsv-enh-ext.jsp" %>
<script type="text/javascript" src="<%= request.getContextPath() %>/enh/js/human.js"></script>
<style type="text/css">
.mainHeadLeft .ComboFieldEditor{margin-right:19px;}
</style>
<script type="text/javascript">
JSV.Block(function () {
	var template = '<template color="green" name="com.kcube.doc.list" catalog="/enh/catalog.xml.jsp" listType="LIST">\
		<header label="<kfmt:message key="enh.009"/>"/>\
		<columns class="Array">\
			<column property="status.list"/>\
			<column property="enhName.list"/>\
			<column property="orgInfo.list"/>\
			<column property="mbrs.list"/>\
		 	<column property="period.list"/>\
			<column property="author.list"/>\
		</columns>\
		<search class="Array" width="125px">\
			<option property="enhName.list"/>\
			<option property="orgInfo.list"/>\
		</search>\
		<footer/>\
		<count/>\
		<footer count="disabled"/>\
		<pageMover/>\
		<rows name="com.kcube.doc.rowsPerPage"/>\
	</template>';
	
	var t = new TableTemplate(document.getElementById('main'), template);
	t.setDataUrl('/jsl/EnhUser.ListByUser.json', 'ts');
	
	var currentYear = new Date().getFullYear();
	var year = JSV.getParameter('nYear') || currentYear;
	var status = JSV.getParameter('status') || -1;
	
	<!-- 상단 년도 선택 -->
	var nYearDrop = new DropDownGroupFieldEditor(t.layout.mainHeadRight);
	nYearDrop.add(JSV.getLang('EnhChart','yearSelect'), 9999);
	for (i = currentYear + 1; i >= currentYear - 10; i--) {
		nYearDrop.add(i + ' ' + JSV.getLang('ListCompositeTemplate','selectYear'), i);
	}
	nYearDrop.setValue(year);
	nYearDrop.onclick = function(value) {
		JSV.setState('status', status);
		JSV.setState('com.kcube.doc.list', null);
		JSV.setState('nYear', value);
		JSV.doGET('usr.list.jsp');
	}

	<!-- 상단 상태 선택 -->
	var options = '<kfmt:message key="enh.rdo.001"/>';
	if (options.length) {
		var statusDrop = new DropDownGroupFieldEditor(t.layout.mainHeadRight,{'options':options});
		statusDrop.onclick = function(value) {
			JSV.setState('status', value);
			JSV.setState('com.kcube.doc.list', null);
			JSV.doGET('usr.list.jsp');
		}
		statusDrop.setValue(status);
	}
	
	<!-- 고도화 등록 -->
	var write = new KButton(t.layout.titleRight, <kfmt:message key="btn.enh.001"/>);
	write.onclick = function() {
		JSV.doGET('usr.write.jsp');
	}
});
</script>
<%@ include file="/sys/jsv/template/template.body.jsp" %>
<div id="main"></div>
<%@ include file="/sys/jsv/template/template.tail.jsp" %>