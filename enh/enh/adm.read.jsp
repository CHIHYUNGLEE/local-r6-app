<%@ include file="/sys/jsv/template/template.head.jsp" %>
<%@ include file="/enh/config.jsp" %>
<%@ include file="/jspf/group-jsv.jsp" %>
<%@ include file="/enh/jsv-enh-ext.jsp" %>
<% checkAdmin(moduleParam); %>
<style>
	.chartImg {background-repeat:no-repeat; height:25px; background-image:url(./img/chartColor.jpg);}
</style>
<script type="text/javascript" src="<%= request.getContextPath() %>/enh/js/human.js"></script>
<script type="text/javascript">
var nYear;
JSV.Block(function(){
	var template = '<template color="green" catalog="/enh/catalog.xml.jsp">\
			<navigation label="<kfmt:message key="enh.010"/>"/>\
			<header label="<kfmt:message key="enh.010"/>"/>\
			<fields class="Array" columns="120px,,,100px,120px,,100px," type="read">\
				<field property="enhName.read"/>\
				<field property="author.read" colSpan="4"/>\
				<field property="rgstDate.read" colSpan="4"/>\
				<field property="orgInfo.read"/>\
				<field property="mbrs.read" colSpan="4"/>\
				<field property="period.read"/>\
				<field property="status.read"/>\
				<field property="content.read"/>\
				<field property="attachments.read"/>\
				<field property="id.hidden"/>\
				<field property="author.hidden"/>\
			</fields>\
			<tablist class="Array">\
				<tab property="tablist.admMod"/>\
				template += <tab property="tablist.admOpinion"/>\
			</tablist>\
		</template>';
		
	var model = <% ctx.execute("EnhUser.ReadByUser"); %>;
	pt = new ItemTemplate(document.getElementById('main'), template);
	pt.setValue(model);
	JSV.setState('id', JSV.getParameter('id'));

	var author = pt.getProperty('author');
	
	var rightAreas = [pt.layout.mainHeadRight, pt.layout.mainFootRight];	
	<%-- list btn --%>
	var listBtn = new KButton(rightAreas, <fmt:message key="btn.pub.list_icon"/>);
	listBtn.onclick = function() {
		JSV.doGET('adm.list.jsp');
	}
	
<%-- 	var taskTemplate = '<template color="blue" name="com.kcube.doc.taskList" catalog="/enh/task/catalog.xml.jsp">\
		<header label="<kfmt:message key="enh.task.001"/>" type="inner"/>\
		<columns class="Array">\
			<column property="author.list"/>\
			<column property="reside.list"/>\
			<column property="task.list"/>\
			<column property="grade.list"/>\
			<column property="planSdate.list"/>\
			<column property="planEdate.list"/>\
			<column property="taskSdate.list"/>\
			<column property="taskEdate.list"/>\
			<column property="rgstDate.list"/>\
			<column property="attachments.list"/>\
			<column property="taskCode.hidden"/>\
			</columns>\
			<footer count="disabled"/>\
			<pageMover/>\
			<rows name="com.kcube.doc.rowsPerPage"/>\
		</template>';	
	
	var taskModel = <%
		setTableState(request, "ts", "com.kcube.doc.taskList", "com.kcube.doc.rowsPerPage");
		ctx.execute("EnhTaskUser.ListByUser");
	%>;

	var tt = new TableTemplate(document.getElementById('task'), taskTemplate);
	tt.setValue(taskModel); --%>

	var currentYear = new Date().getFullYear();
	$('<div><span id="taskCombo" style="float:left;"></span><span id="taskImg" style="float:right;"></span></div>').css('width','100%').appendTo('#btnArea');
	$('<img>').attr('src',JSV.getContextPath('/enh/img/chartColor.jpg')).css({'align':'right','height':'18px'}).appendTo('#taskImg');
	nYear = new ComboFieldEditor($('#taskCombo'));
	nYear.onchange = function(value) {
			doSubmit();
			//불필요 하므로 주석 처리
			//globalSubmit(); //연도 변경시 외주개발자 그래프 영역도 호출
	}
	for (i = currentYear+1; i >= currentYear - 4; i--) {
		nYear.add(i + ' ' + JSV.getLang('ListCompositeTemplate', 'selectYear'), i);
	}
	
	$('<div width="50%" align="right">\
		  	  <span class="chartImg" width="100px"></span>\
		</div>').appendTo('#task');
	
	nYear.setValue(model.enhSdate != null ? new Date(parseInt(model.enhSdate)).getFullYear() : new Date(parseInt(model.rgstDate)).getFullYear());
	
	$(window).off("message onmessage").on("message onmessage", function(e) {
	    if(e.originalEvent.data){
			var fInfo = e.originalEvent.data;
			$('#' + fInfo.id).height(fInfo.height);
		}
	});
	
	doSubmit();
	//globalSubmit();
});
var pt; // 포틀릿에서 쓸 수 있도록 전역변수 설정
function doSubmit() {
	var f = new ItemForm();
 	f.put('enhId', JSV.getParameter('id'));
 	f.put('nYear', nYear.getValue());	
 	f.setTarget('chartView');
 	f.submit('enhChartViewer.jsp'); 
}
//외주개발자 그래프
function globalSubmit() {
 	var f = new ItemForm();
 	f.put('enhId', JSV.getParameter('id'));
 	f.put('nYear', nYear.getValue());	
 	f.setTarget('globalView');
 	f.submit('enhGlobalChartViewer.jsp'); 
}
//포틀릿 전환 시 Iframe 전 페이지가 나오지 않도록 구문 추가
TabListViewer.prototype.onchange = function(index){
	if(this.selectedIndex == index) return;
	else {
		$.each(this.children, function(i){
			if(this.index == index){
				this.doSelect();
			} else {
				this.doUnSelect();
			}
		});
		
		this.viewer.empty(); // 포틀릿 전환 시 Iframe 전 페이지가 나오지 않도록 비워줌
		this.viewer.css('display', 'block'); // 관련기술 포틀릿 접은 상태에서 의견 클릭할 경우 안나오던 버그 수정(IE)
		this.viewer.load(JSV.getContextPath(JSV.getModuleUrl(this.children[index].getURL())));
		this.selectedIndex = index;
	}
}
</script>
<%@ include file="/sys/jsv/template/template.body.jsp" %>
<div id="main"></div>
<div id="task" style="margin-top:18px;"></div>
<div id="btnArea" style="padding: 0 30px 0 30px;"></div>
<div style="padding: 0 30px 0 30px;">
	<iframe id="chartView" name="chartView" width="100%" height="100%" marginWidth="0" marginHeight="0" frameborder="no" scrolling="no"></iframe>
	<iframe id="globalView" name="globalView" width="100%" height="100%" marginWidth="0" marginHeight="0" frameborder="no" scrolling="no"></iframe>
</div>
<%@ include file="/sys/jsv/template/template.tail.jsp" %>