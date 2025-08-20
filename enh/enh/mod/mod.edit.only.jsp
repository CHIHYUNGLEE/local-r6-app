<%@ include file="/sys/jsv/template/template.head.jsp"%>
<%@ include file="/enh/jsv-enh-ext.jsp" %>
<script type="text/javascript">
JSV.Block(function () {
	var template = '<template color="blue" catalog="/enh/mod/catalog.xml.jsp">\
			<header label="<fmt:message key="kms.004"/>"/>\
			<fields class="Array" columns="100px,,,100px,100px,,100px," type="write">\
				<field property="title.tabwrite"/>\
				<field property="pacname.write"/>\
				<field property="content.write"/>\
				<field property="attachments.write"/>\
				<field property="id.hidden"/>\
				<field property="enhId.hidden"/>\
				<field property="seqOrder.hidden"/>\
				<field property="itemTitle.hidden"/>\
			</fields>\
		</template>';
		
	var model = <%
		ctx.setParameter("modid", ctx.getParameter("modid"));
		ctx.execute("EnhModUser.ReadByUser");
	%>;

	var t = new ItemTemplate(document.getElementById('main'), template);
	t.setValue(model);

	var apply = new KButton(t.layout.bottomCenterArea, <fmt:message key="btn.doc.006"/>);
	apply.onclick = function() {
		if (t.validate('title,content')) {
			var s = t.getChild('attachments');
			s.files = FileFieldEditor.merge(t.getChild('content').getImages(), s.getValue());
			s.toJSON = function() {
				return this.files;
			}
			t.action.setRedirect(JSV.setUrlAlert('/enh/mod/mod.read.only.jsp?modid=@{modid}'));
			t.submit('/jsl/EnhModUser.DeleteDoUpdateByUser.jsl');
		}
	}

	var cancle = new KButton(t.layout.bottomCenterArea, <fmt:message key="btn.pub.cancel"/>);
	cancle.onclick = function() {
		history.back();
	}
});
</script>
<%@ include file="/sys/jsv/template/template.body.jsp" %>
<div id="main"></div>
<%@ include file="/sys/jsv/template/template.tail.jsp" %>