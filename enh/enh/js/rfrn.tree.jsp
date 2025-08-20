<%@ include file="/jspf/head.jsp" %>
<script type="text/javascript" src="../enh_min.js"></script>
<script type="text/javascript">
JSV.Block(function() {
	document.body.style.margin="0px";
	var rootId;
	var folderId = JSV.getParameter('folderId');
	var defaultAxis;
	var isFirst = true;
	isNum = false;

	var axes = new FlexTabList(document.getElementById('axisDiv'));
	var tree = new TreeViewer(document.getElementById('treeDiv'));

	if (JSV.getParameter('isNum') == 'true') isNum = true;
		
	<%-- 축이 선택되었을 때 --%>
	axes.onchange = function(axis) {
		axisId = axis.id;
		rootId = axis.rootId;
		
		if (!isFirst) {
			folderId = rootId;
		}
		tree.setInput('/jsl/FolderSelector.ListByUser.xml?rootId=' + axis.rootId);
		isFirst = false;
	}

	<%-- 트리의 노드가 선택되었을 때 --%>
	tree.onclick = function(obj) {
		folderId = obj.getAttribute('id');
		var nodeId = obj.getAttribute('id');
		var path = tree.getPath(nodeId);
		callList(folderId);
	};

	<%--   축 목록을 받아온다. --%>
	<%--   라이센스관리의 축목을 받아온다 --%>
	var model = JSV.loadJSON('/jsl/AxisSelector.ListByModule.json?csId=921&mdId=5901&spId=1&appId=7262').array;
	if(model.length > 0) {
		var j;
		for(j = 0; j < model.length; j++) {
			var axis = {'id':model[j].id, 'name':model[j].name, 'rootId':model[j].rootId};
			if (j==0) 
			{
				defaultAxis = axis;
			}
			axes.add(axis.name, axis);
		}
		axes.setValue(defaultAxis);
		axes.onchange(defaultAxis);	
	}
	JSV.autoResizeElement(document.getElementById('treeDiv'), ['tr_axisDiv']);
});
var isNum;
function callList(folderId){
	if (isNum) {
		JSV.setState('isNum', 'true');
	}
	JSV.setState('tr', folderId);
	JSV.doGET('/enh/js/rfrn.list.jsp', 'list');
}
</script>
<%@ include file="/jspf/body.jsp" %>
<table width="100%" cellpadding="0" cellspacing="0" style="table-layout:fixed">
 <tr id="tr_axisDiv">
  <td valign="top" id="axisDiv"></td>
 </tr>
 <tr>
  <td valign="top" id="treeDiv" style="padding-top:5px;padding-left:5px"></td>
 </tr>
</table>
<%@ include file="/jspf/tail.jsp" %>