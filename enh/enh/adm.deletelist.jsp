<%@ include file="/sys/jsv/template/template.head.jsp" %>
<%@ include file="/enh/config.jsp" %>
<%@ include file="/enh/jsv-enh-ext.jsp" %>
<% 
	checkAdmin(moduleParam); 
	int status = ctx.getInt("status", 1);
%>
<style>
.radioDiv{margin-top:4px;}
.TableSearch{float:left; margin-right:19px;}
</style>
<script type="text/javascript" src="<%= request.getContextPath() %>/enh/js/human.js"></script>
<script type="text/javascript">
JSV.Block(function () {
	var template = '<template color="green" name="com.kcube.doc.list" catalog="/enh/catalog.xml.jsp">\
		<header label="<kfmt:message key="enh.015"/>"/>\
		<columns class="Array">\
		<% if (status == 1) {%> \
			<column property="id.multiList"/>\
			<column property="enhName.admlist"/>\
			<column property="orgInfo.list"/>\
			<column property="period.list"/>\
			<column property="author.list"/>\
			<column property="rgstDate.list"/>\
			<column property="attachments.list"/>\
		<%}%>\
		<% if (status == 2) {%> \
			<column property="id.multiModList"/>\
			<column property="enhName.modlist"/>\
			<column property="itemTitle.modlist"/>\
			<column property="orgInfo.list"/>\
			<column property="author.modlist"/>\
			<column property="attachments.modlist"/>\
		<%}%>\
		</columns>\
		<search class="Array" width="125px">\
		<% if (status == 1) {%> \
			<option property="enhName.list"/>\
			<option property="orgInfo.list"/>\
		<%}%>\
		<% if (status == 2) {%> \
			<option property="enhName.modlist"/>\
			<option property="itemTitle.modlist"/>\
		<%}%>\
		</search>\
		<footer count="disabled"/>\
		<pageMover/>\
		<rows name="com.kcube.doc.rowsPerPage"/>\
	</template>';

	var model = <%
		setTableState(request, "ts", "com.kcube.doc.list", "com.kcube.doc.rowsPerPage");
		switch(status)
		{
			case 1: ctx.execute("EnhAdmin.DeleteListByUser"); break;
			case 2: ctx.execute("EnhAdmin.DeleteModListByUser"); break;
		}
	%>;

	var t = new TableTemplate(document.getElementById('main'), template);
	t.setValue(model);

	var recover = new KButton(t.layout.rightArea, <fmt:message key="btn.pub.recover"/>);
	recover.onclick = function() {
		if (BooleanFieldEditor.isChecked('id')) {
			if (confirm('<fmt:message key="pub.024"/>') == false) {
				return false;
			}
			
			if (<%=status%> == 1) {
				t.action.setRedirect(JSV.setUrlAlert('/enh/adm.deletelist.jsp?status=1'),'<fmt:message key="pub.025"/>');
				t.submit('/jsl/EnhAdmin.DoRecoverByAdmin.jsl');
			} else if(<%=status%> == 2) {
				t.action.setRedirect(JSV.setUrlAlert('/enh/adm.deletelist.jsp?status=2'),'<fmt:message key="pub.025"/>');
				t.submit('/jsl/EnhAdmin.DoRecoverModByAdmin.jsl');
			}
		} else {
			alert('<fmt:message key="pub.007"/>');
		}
	}
	
	var del = new KButton(t.layout.rightArea, <fmt:message key="btn.pub.remove"/>);
	del.onclick = function(){
		if (BooleanFieldEditor.isChecked('id')) {
			if (!confirm('<fmt:message key="pub.045"/>')) {
				return false;
			}
			
			if (<%=status%> == 1) {
				t.action.setRedirect(JSV.setUrlAlert('/enh/adm.deletelist.jsp?status=1'),'<fmt:message key="pub.034"/>');
				t.submit('/jsl/EnhAdmin.DoRemoveByAdmin.jsl');
			} else if (<%=status%> == 2) {
				t.action.setRedirect(JSV.setUrlAlert('/enh/adm.deletelist.jsp?status=2'),'<fmt:message key="pub.034"/>');
				t.submit('/jsl/EnhAdmin.DoRemoveModByAdmin.jsl');
			}
			
		} else {
			alert('<fmt:message key="pub.007"/>');
		}
	}
	//삭제된 고도화 조회 시 에러 발생하여 
	//삭제된 고도화라는 것을 구분하기 위해 파라미터 부여
	JSV.setState('isDel', JSV.getParameter('isDel'));
	
	var radioDiv = $('<div/>').addClass('radioDiv').appendTo(t.layout.mainHeadLeft);
	
	var options = '<kfmt:message key="enh.mod.008"/>';
	if (options.length) {
		var radios = new RadioImageGroupFieldEditor(radioDiv,{'options':options});
		radios.onclick = function(value) {
			JSV.setState('status', value);
			JSV.setState('com.kcube.doc.list', null);
			JSV.doGET('adm.deletelist.jsp');
		}
		radios.setValue(JSV.getParameter('status'));
		JSV.setState('status', JSV.getParameter('status'));
	}
});
TitleColumn.prototype.setTitleColoring = function(style, element) {
	var isTitleColoring = element['isInRole'];
	if (isTitleColoring && isTitleColoring == 'false') {
		return $('<nobr>').addClass('Nobr').get(0);
	}
	var orgId = (this.style.orgId && element) ? JSV.merge(style.orgId, element) : '';
	var href = (this.style.href && element) ? JSV.merge(style.href, element) : '';	
	var a;
	// OFCEID가 없는 데이터는 고객사정보창을 출력하지 못하도록 분기처리
	if(orgId != 0 || !this.style.orgId) {
		 a = $('<a>').addClass('Anchor').attr('href', href).on('click', this, function(e) {
			e.preventDefault();
			e.data.onclick(element, href);
			return false;
		}).get(0);
	} else {
		a = $('<p>')
	}
	return a;
}
</script>
<%@ include file="/sys/jsv/template/template.body.jsp" %>
<div id="main"></div>
<%@ include file="/sys/jsv/template/template.tail.jsp" %>