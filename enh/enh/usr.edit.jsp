<%@ include file="/sys/jsv/template/template.head.jsp"%>
<%@ include file="/enh/jsv-enh-ext.jsp" %>
<script type="text/javascript" src="<%= request.getContextPath() %>/enh/js/human.js"></script>
<script type="text/javascript">
JSV.Block(function(){
	var template='<template name="item" color="green" catalog="/enh/catalog.xml.jsp">\
		<header label="<kfmt:message key="enh.011"/>"/>\
		<fields columns="130px,70px,,90px,,100px" type="write" class="Array">\
				<field property="enhName.write"/>\
				<field property="author.write" colSpan="3"/>\
				<field property="orgInfo.write"/>\
				<field property="mbrs.write"/>\
				<field property="period.write"/>\
				<field property="content.write"/>\
				<field property="attachments.write"/>\
				<field property="id.hidden"/>\
				<field property="status.hidden"/>\
				</fields>\
		</template>';
		
	t = new ItemTemplate(document.getElementById('main'), template);
	var model = <%ctx.execute("EnhUser.ReadByUser");%>;
	t.setValue(model);
	
	var orgId = JSV.getParameter('orgId');
	var orgName = JSV.getParameter('orgName');
	
	RfrnOrgFieldEditor.onok = function(value) {		
		if (value) {
			if (value[0]) {
				if (value[0].orgName) {
					var obj = new Object();
					obj.orgName = value[0].orgName;
					if (value[0].orgId) {
						obj.orgId = value[0].orgId;
					}
					t.getChild('orgInfo').setValue(obj);
					if (value[1]) {
						var tmpArr = value[1];
						if (tmpArr[0]) {
							orgFolder = JSV.clone(tmpArr[0]);
						}
					}
				}
				if(value[0].name && value[0].userId){// 고도화할 고객사 선택시 고객사 담당자 자동 셋팅 되도록
					JSV.confirm('<kfmt:message key="enh.024"/>'+JSV.getLocaleStr(value[0].name)+'<kfmt:message key="enh.025"/>', function(res) {
						if (res) {
							const user = [
								  {
									autoDataKey: 0,
									index: 0,
								    id: value[0].userId,
								    displayName: value[0].displayName,
								    name: value[0].name
								  }
								];
							t.getChild('mbrs').setValue(user);		
						}
					});
				}
			}
		}
	}
	
	var save = new KButton(t.layout.bottomCenterArea, <fmt:message key="btn.doc.001"/>);
	save.onclick = function() {
		if (t.validate('enhName')) {
			var s = t.getChild('attachments');
			s.files = FileFieldEditor.merge(t.getChild('content').getImages(), s.getValue());
			s.toJSON = function() {
				return this.files;
			} 
			if(opener == null)
				t.action.setRedirect(JSV.setUrlAlert('/enh/usr.read.jsp?id=@{id}'));
			else
				t.action.setRedirect(JSV.setUrlAlert('/enh/usr.popup.read.jsp?id=@{id}'));
			t.submit('/jsl/EnhOwner.DoUpdateByOwner.jsl');		
		}
	}
	var cancelBtn = new KButton(t.layout.bottomCenterArea, {'text':'<fmt:message key="doc.013"/>','css':{'font-Weight':'bold'}});
		cancelBtn.onclick = function() {
			if(opener == null)
				JSV.doGET('usr.read.jsp?id=' + JSV.getParameter('id'));
			else
				JSV.doGET('usr.popup.read.jsp?id=' + JSV.getParameter('id'));
	}
});
RfrnOrgFieldEditor.showPopup = function() {
	var u = JSV.getContextPath(JSV.getModuleUrl('/enh/js/orgFieldEditor.jsp'));
	var n = 'popOrg'
	var f = 'width=800,height=820,scrollbars=no,status=no,toolbar=no,menubar=no,location=no,resizable=no';
	window.open(u, n, f);
}
</script>
<%@ include file="/sys/jsv/template/template.body.jsp"%>
<div id="main"></div>
<%@ include file="/sys/jsv/template/template.tail.jsp"%>