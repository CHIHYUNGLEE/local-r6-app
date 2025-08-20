<%@ include file="/sys/jsv/template/template.inner.head.jsp" %>
<%@ include file="/enh/config.jsp" %>
<%@ include file="/jspf/group-jsv.jsp" %>
<%@ include file="/enh/jsv-enh-ext.jsp" %>
<%@page import="com.kcube.enh.EnhPermission"%>
<%@ page import="com.kcube.sys.usr.UserService"%><%
	boolean isMbr = EnhPermission.isMbr(Long.valueOf(request.getParameter("id")));
%>
<script type="text/javascript" src="<%= request.getContextPath() %>/enh/js/human.js"></script>
<script type="text/javascript">
var nYear;
JSV.Block(function(){
	var template = '<template color="green" catalog="/enh/catalog.xml.jsp">\
			<navigation label="<kfmt:message key="enh.010"/>"/>\
			<header label="<kfmt:message key="enh.010"/>"/>\
			<fields class="Array" columns="150px,,,100px,150px,,100px," type="read">\
				<field property="enhName.read"/>\
				<field property="orgInfo.read"/>\
				<field property="mbrs.read" colSpan="4"/>\
				<field property="period.read"/>\
				<field property="status.read"/>\
				<field property="content.read"/>\
				<field property="attachments.read"/>\
				<field property="id.hidden"/>\
				<field property="enhId.hidden"/>\
				<field property="author.hidden"/>\
				<field property="currentPm.hidden"/>\
			</fields>\
			<tablist class="Array">\
				<tab property="tablist.Mod"/>\
				<tab property="tablist.opinion"/>\
			</tablist>\
		template += </template>';
				
	var model = <% ctx.execute("EnhUser.ReadByUser"); %>;
	pt = new ItemTemplate(document.getElementById('main${PAGE_ID}'), template);
	pt.setValue(model);
	
	JSV.setState('id', JSV.getParameter('id'));

	var btnPos = pt.viewer.getTitleBtnArea();
	var rightBtnArr = [];
	
	var author = pt.getProperty('author');
	if ( <%=isMbr%> || <%=isAdmin(moduleParam)%>) {
		var tstatus = pt.getChild('status');
		tstatus.setEnhEditable(true);

		rightBtnArr.push({text:<fmt:message key="btn.pub.modify"/>.text,
 			  onclick:function() {
	   			JSV.doGET('usr.edit.jsp?id=@{id}');
 			}});
		rightBtnArr.push({text:<fmt:message key="btn.pub.delete"/>.text,
			  onclick:function() {
				if (confirm('<fmt:message key="pub.009"/>') == false) {
					return false;
				}
				pt.action.setRedirect(JSV.setUrlAlert('/enh/usr.list.jsp?isRefresh=1'), '<fmt:message key="pub.004"/>');
				pt.submit('/jsl/EnhOwner.DoDeleteByOwner.jsl?id=' + JSV.getParameter('id'));
			}});
	}
		
	var rightAreaBtn = new GroupButton(btnPos, {css:{'margin-right':'9px'}});
	rightAreaBtn.setButtons(rightBtnArr);
	
	pt.viewer.setListBtn(function() {
		JSV.doGET('usr.list.jsp');
	});
	
<%-- 	역할 등록 불필요해서 삭제(팀원 등록시 자동으로 역할도 등록됨)
		var taskTemplate = '<template color="blue" name="com.kcube.doc.taskList" catalog="/enh/task/catalog.xml.jsp" ptlId="${PAGE_ID}">\
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
			<column property="taskCode.hidden"/>\
			</columns>\
			<footer/>\
			<count/>\
			<footer count="disabled"/>\
			<pageMover/>\
			<rows name="com.kcube.doc.rowsPerPage"/>\
		</template>';

	var tt = new TableTemplate(document.getElementById('task${PAGE_ID}'), taskTemplate);
	var taskAction = '/jsl/EnhTaskUser.ListByUser.json?id=@{id}';
	tt.setValue(JSV.loadJSON(taskAction));
	tt.viewer.onchange = function() {
		JSV.setState(this.style.name, JSV.decodeXSS(this.getState()), this.ptlId);
		this.setValue(JSV.loadJSON(JSV.suffix(taskAction, 'ts=' + JSV.decodeXSS(this.getState()))));
	}
	
	for(var i = 0; i < model.mbrs.length; i++)
	{
		if(model.mbrs[i].id == <%=UserService.getUserId()%> || <%=isMbr%> || <%=isAdmin(moduleParam)%> )
		{	
			var writeTask = new KButton(tt.layout.leftArea, <kfmt:message key="btn.task.001"/>);
			writeTask.onclick = function(){
				JSV.setState('enhId', JSV.getParameter('id'));
				JSV.setState('sDate', model.enhSdate);
				JSV.setState('eDate', model.enhEdate);
				JSV.doGET('/enh/task/usr.write.jsp');
			}
			break;
		}
	} --%>
	
	var currentYear = new Date().getFullYear();
	$('<div><span id="taskCombo" style="float:left;"></span><span id="taskImg" style="float:right;"></span></div>').css('width','100%').appendTo('#btnArea${PAGE_ID}');
	$('<img>').attr('src',JSV.getContextPath('/enh/img/chartColor.jpg')).css({'align':'right','height':'18px'}).appendTo('#taskImg');
	nYear = new ComboFieldEditor($('#taskCombo'));
	for (i = currentYear+1; i >= currentYear - 4; i--) {
		nYear.add(i + ' ' + JSV.getLang('ListCompositeTemplate', 'selectYear'), i);
	}
	
	<%-- 고도화가 진행중(3600)이면 현재연도, 아니면 기존 enhSdate 혹은 regtDate를 보여준다. --%>
 	var selectedYear;
 	if (model.status == 3600) {
 		selectedYear = currentYear;
 	} else {
 		selectedYear = (model.enhSdate != null) ? new Date(parseInt(model.enhSdate)).getFullYear() : new Date(parseInt(model.rgstDate)).getFullYear();
 	}

	nYear.setValue(selectedYear);
	nYear.onchange = function(value) {
		doSubmit();
		//불필요 하므로 주석 처리
		//globalSubmit(); //연도 바뀔시 외주개발자 그래프도 해당 연도에 나오도록
	}
	
 	$('<div width="50%" align="right">\
 		  	  <span class="chartImg" width="100px"></span>\
 		</div>').appendTo('#task${PAGE_ID}');

 	
 	$(window).on("message", function(e) {
	    if(e.originalEvent.data){
			var fInfo = e.originalEvent.data;
			$('#' + fInfo.id).height(fInfo.height);
		}
	});

	setTimeout(function() {
		doSubmit();
		//불필요 하므로 주석 처리
		//globalSubmit(); //외주개발자 그래프 
	}, 0);
});
var pt; // 포틀릿에서 쓸 수 있도록 전역변수 설정
function doSubmit() {
 	var f = new ItemForm();
 	f.put('enhId', JSV.getParameter('id'));
 	f.put('nYear', nYear.getValue());	
 	f.setTarget('chartView${PAGE_ID}');
 	f.submit('enhChartViewer.jsp'); 
} 
function globalSubmit() { //외주개발자 그래프를 보기 위한 액션
 	var f = new ItemForm();
 	f.put('enhId', JSV.getParameter('id'));
 	f.put('nYear', nYear.getValue());	
 	f.setTarget('globalView${PAGE_ID}');
 	f.submit('enhGlobalChartViewer.jsp'); 
}
// 포틀릿 전환 시 Iframe 전 페이지가 나오지 않도록 구문 추가
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
<div id="main${PAGE_ID}"></div>
<div id="task${PAGE_ID}"></div>
<div id="btnArea${PAGE_ID}" style="padding: 0 30px 0 30px;"></div>
<div id="chartArea${PAGE_ID}" style="padding: 0 30px 0 30px;">
	<iframe id="chartView${PAGE_ID}" name="chartView${PAGE_ID}" width="100%" height="0px" marginWidth="0" marginHeight="0" frameborder="no" scrolling="no"></iframe>
	<iframe id="globalView${PAGE_ID}" name="globalView${PAGE_ID}" width="100%" height="0px" marginWidth="0" marginHeight="0" frameborder="no" scrolling="no"></iframe>
</div>
<%@ include file="/sys/jsv/template/template.inner.tail.jsp" %>