<%@ include file="/sys/jsv/template/template.head.jsp"%>
<%@ include file="/jspf/head.jqueryui.jsp" %>
<style type="text/css">
</style>
<script type="text/javascript">
JSV.Block(function () {
	var template = '<template color="blue"\
			catalog="/enh/mod/catalog.xml.jsp">\
		<fields class="Array" columns="100px,,,100px,100px,,100px," type="read">\
			<field property="itemTitle.tabRead"/>\
			<field property="title.tabRead"/>\
			<field property="author.tabRead"/>\
			<field property="pacname.tabRead"/>\
			<field property="content.tabRead"/>\
			<field property="attachments.modRead"/>\
			<field property="id.hidden"/>\
			<field property="enhId.hidden"/>\
		</fields>\
	</template>';

	var model = <%
		ctx.execute("EnhModUser.ReadByUser");
	%>;
	
	var t = new ItemTemplate(document.getElementById('main'), template);
	t.setValue(model);
	
	var tds = [[t.layout.mainHeadRight],[t.layout.mainFootCenter],[t.layout.mainHeadRight, t.layout.mainFootRight]];
	
	// 고도화 참여자 & 작성자
	if(model.currentMember == true || model.currentOwner == true || model.currentModMember == true || model.currentParentAuthor == true) {
		var edit = new KButton(tds[2], <fmt:message key="btn.doc.005"/>);
		edit.onclick = function() {
			JSV.doGET('mod.edit.only.jsp?modid=@{modid}');
		}
		
		var del = new KButton(tds[2], <fmt:message key="btn.pub.remove"/>);
		del.onclick = function() {
			if (confirm('<kfmt:message key="enh.mod.003"/>')) {
				t.action.setRedirect(JSV.setUrlAlert('/enh/adm.deletelist.jsp?status=2'),'<fmt:message key="pub.034"/>');
		 		t.submit('/jsl/EnhAdmin.DoAdminModRemove.jsl?modid=@{modid}');
			}
		}
	}
	var list = new KButton(tds[2], <fmt:message key="btn.doc.list"/>);
	list.onclick = function() {
		JSV.doGET('/enh/adm.deletelist.jsp');
	}
});
</script>
<%@ include file="/sys/jsv/template/template.body.jsp"%>
<div id="tabDiv"> </div>
<div id="main"></div>
<%@ include file="/sys/jsv/template/template.tail.jsp"%>