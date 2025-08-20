<%@ include file="/sys/jsv/template/template.head.jsp"%>
<%@ include file="/enh/config.jsp" %>
<%@ include file="/jspf/head.jqueryui.jsp" %>
<%@ include file="/enh/jsv-enh-ext.jsp" %>
<style type="text/css">
.ItemLayoutMainHead {margin:5px 0 0 0;}
.pathTd {padding-bottom:0px;}
</style>

<script type="text/javascript">
JSV.Block(function () {
	var template = '<template color="blue"\
			catalog="/enh/mod/catalog.xml.jsp">\
		<fields class="Array" columns="100px,,,100px,100px,,100px," type="read">\
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
	
	var tds = [[t.layout.mainHeadRight],[t.layout.mainFootCenter],[t.layout.mainFootRight]];
	
	// 고도화 참여자 & 작성자
	if(model.currentMember == true || model.currentOwner == true || model.currentModMember == true || model.currentParentAuthor == true || <%= isAdmin(moduleParam)%>) {
		var rightBtnArr = [];
		
		rightBtnArr.push({text:<fmt:message key="btn.doc.005"/>.text,
 			  onclick:function() {
 				 JSV.doGET('mod.edit.jsp?modid=@{modid}&enhid=@{enhid}');
 			}});
		rightBtnArr.push({text:<fmt:message key="btn.pub.delete"/>.text,
			  onclick:function() {
				  if (confirm('<kfmt:message key="enh.mod.003"/>')) {
						t.submitInner('/jsl/EnhModUser.DoRemove.jsl?modid=@{modid}',function(value){
							if(parent){
								parent.tabRefresh(model.enhId);
								parent.tab.seqHover(model.seqOrder, model.enhId);
							}
						});
					}
			}});
		
		var rightAreaBtn = new GroupButton(tds[2], {css:{'margin-right':'1px'}});
		rightAreaBtn.setButtons(rightBtnArr);		
	}
});
</script>
<%@ include file="/sys/jsv/template/template.body.jsp"%>
<div id="tabDiv"> </div>
<div id="main"></div>
<%@ include file="/sys/jsv/template/template.tail.jsp"%>