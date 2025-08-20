<%@ include file="/sys/jsv/template/template.head.jsp" %>
<%@ include file="/enh/config.jsp" %>
<%@ include file="/enh/jsv-enh-ext.jsp" %><%
	boolean isMbr = com.kcube.enh.EnhPermission.isMbr(Long.valueOf(request.getParameter("enhId")));
%>
<script type="text/javascript">
JSV.Block(function(){
	var template='<template name="item" color="green" catalog="/enh/task/catalog.xml.jsp">\
		<header label="<kfmt:message key="enh.task.004"/>"/>\
		<fields columns="110px,70px,,100px,,100px" type="write" class="Array">\
			<field property="author.write" colSpan="3"/>\
			<field property="reside.write" colSpan="3"/>\
			<field property="taskCode.write" colSpan="3"/>\
			<field property="task.write"  colSpan="3"/>\
			<field property="period.write" colSpan="3"/>\
			<field property="planPeriod.write" colSpan="3"/>\
			<field property="percent.write" />\
			<field property="content.write"/>\
			<field property="attachments.write"/>\
			<field property="enhId.hidden"/>\
			<field property="id.hidden"/>\
		</fields>\
		</template>';

	var model = <%ctx.execute("EnhTaskUser.ReadByUser");%>;
		
	var t = new ItemTemplate(document.getElementById('main'), template);
	t.setValue(model);
	t.getChild('enhId').setValue(JSV.getParameter('enhId'));

	var author = t.getChild('author');
	var isPm = JSV.getParameter('isPm');

	if(<%=isMbr%> || <%=isAdmin(moduleParam)%>) {
		author.button.show();
	} else {
		author.button.hide();
	}
	
	
	var save = new KButton(t.layout.bottomCenterArea, <fmt:message key="btn.doc.001"/>);
	save.onclick = function() {
		if(checkNum(t.getChild('percent').getValue()) == 0){
			if (t.validate('taskCode,task,author')) {
				var s = t.getChild('attachments');
				s.files = FileFieldEditor.merge(t.getChild('content').getImages(), s.getValue());
				s.toJSON = function() {
					return this.files;
				} 
				if(opener == null)
					t.action.setRedirect(JSV.setUrlAlert('/enh/usr.read.jsp?id=' + JSV.getParameter('enhId')));
				else
					t.action.setRedirect(JSV.setUrlAlert('/enh/usr.popup.read.jsp?id=' + JSV.getParameter('enhId')));
				t.submit('/jsl/EnhTaskOwner.DoUpdateByOwner.jsl');
			}
		}else{
			alert('<kfmt:message key="enh.doc.001"/>');
		}
	}
	var cancelBtn = new KButton(t.layout.bottomCenterArea, {'text':'<fmt:message key="doc.013"/>','css':{'font-Weight':'bold'}});
		cancelBtn.onclick = function() {
			if(opener == null)
				JSV.doGET('../usr.read.jsp?id=' + JSV.getParameter('enhId'));
			else
				JSV.doGET('../usr.popup.read.jsp?id=' + JSV.getParameter('enhId'));
	}
});
function checkNum(value){
	//숫자를 입력했는지 체크
	var num_regx = /^[0-9]*$/;
	var char;
	var check = 0;
	for(var i = 0 ; i < value.length ; i++){
		char = value.substring(i, i+1);
		if(!num_regx.test(char)) {
			check++;
		}
	}
	//공백인지 체크
	if(value == ''){
		check++;
	}
	//0 부터 100 사이의 숫자인지 체크
	if(!(value >= 0 && value <= 100)){
		check++;
	}
	//두자리 이상일 때 첫번째 숫자가 0 인지 체크
	if(value.length > 1){
		if(value.substring(0, 1) == 0){
			check++;
		}
	}
	return check;
}
</script>
<%@ include file="/sys/jsv/template/template.body.jsp" %>
<div id="main"></div>
<%@ include file="/sys/jsv/template/template.tail.jsp" %>