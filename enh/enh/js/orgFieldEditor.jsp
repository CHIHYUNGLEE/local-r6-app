<%@ include file="/jspf/head.jsp"%>
<script type="text/javascript">
	JSV.Block(function() {
		document.body.style.margin = "0px";
		var header = new HeaderPopup(document.getElementById('headerDiv'), '<kfmt:message key="cst.enh.hnm.001"/>');
		var isNum = JSV.getParameter('isNum') ? JSV.getParameter('isNum') : 'false';
		JSV.doGET('/enh/js/rfrn.tree.jsp?isNum=' + isNum, 'tree');
		JSV.doGET('/enh/js/rfrn.list.jsp?isNum=' + isNum, 'list');
		JSV.autoResizeElement(document.getElementById('treeTd'), ['headerDiv']);
		JSV.autoResizeElement(document.getElementById('listTd'), ['headerDiv']);
	});
</script>
<%@ include file="/jspf/body.jsp"%>
<table width="100%" cellspacing="0" cellpadding="0"	style="table-layout: fixed;">
 	<colgroup>
       	<col width="200px"><col>
    </colgroup>
	<tr>
		<td colspan="2" id="headerDiv"></td>
	</tr>
	<tr>
		<td id="treeTd" valign="top">
			<iframe name="tree" scrolling="auto" frameborder="0" width="100%" height="100%" marginHeight="0px" marginWidth="0px"></iframe>
		</td>
		<td id="listTd" valign="top">
			<div style="height:100%;">
				<iframe name="list" scrolling="no" frameborder="0" width="100%"	height="100%" marginHeight="0px" marginWidth="0px"></iframe>
			</div>
		</td>
	</tr>
</table>
<%@ include file="/jspf/tail.jsp"%>