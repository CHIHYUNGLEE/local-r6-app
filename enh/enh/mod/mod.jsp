<%@ include file="/jspf/head.portlet.jsp" %>
<%@ include file="/jspf/jspContext.jsp" %>
<%@ include file="/jspf/head.jqueryui.jsp" %>
<%@ include file="/enh/config.jsp" %>
<%@ include file="/jspf/jsv-ext.jsp" %>
<style type="text/css">
.ItemLayoutMainHead {margin:5px 0 0 0;}
.pathTd {padding-bottom:0px;}
#loader {
    position: relative;
    text-align: center;
    padding: 20px;
    font-size: 18px;
    color: #666;
    display: none; /* 처음엔 숨기고 데이터 있을때만 표시 */
 }
/* 심플한 스피너 스타일 */
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 10px auto;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
#modReadFrame {
  width: 100%;
  border: none;
  display: none; /* 처음엔 숨겨놓기 */
}
</style>
<script type="text/javascript">
JSV.Block(function () {
	var parent = $('#main${PORTLET_ID}').get(0);

	model = <%
	ctx.execute("EnhUser.ReadByUser");
%>;

	const iframe = document.getElementById("modReadFrame");
	const loader = document.getElementById("loader");
	
	var json = JSV.loadJSON('/jsl/EnhModUser.ModList.json?enhid=' + JSV.getParameter('id')); // id => enhid
	var model1 = json.array;
	if(model1.length > 0){
		loader.style.display = "block"; 
	}
	tab = new TabSortAdmin(document.getElementById('tabDiv'), 
			{
				'readUrl':'/enh/usr.read.jsp',
				'tabUrl':'/enh/mod/mod.read.jsp',
				'writeUrl':'/enh/mod/mod.write.jsp?id=@{id}',
				'isManager':(model.mbr == true || model.currentOwner == true || <%= isAdmin(moduleParam)%>),
				'isUsr':(true)
			}
	);
	
	// 관련기술 조회페이지에서 + 버튼을 눌렀을 때 글쓰기 화면이 나오는 iframe 영역
	tab.writeBtnClick = function() {
		var modReadViewer = $('#modReadFrame').attr('src', JSV.getContextPath('/enh/mod/mod.write.jsp?id=@{id}'));
	}
	
	// 관련기술영역에 model1값을 set함
	tab.setValue( (model1 && model1.length>0)? model1 : [] );
	
	// chrome에서 최초 body height를 없애기 위해서 구문 추가
	$('#modReadFrame').css('height', 0);

	// 최초 관련기술을 눌렀을 때 보여지는 iframe영역
	$('#modReadFrame').unbind('load.modReadFrame').bind('load.modReadFrame' ,function(event){
		var iframeBody = $(this.contentWindow.document.documentElement).find('body');
		var childrenLength = iframeBody.children().length; // iframe의 자식영역길이
		if (childrenLength == 0) {  // iframe의 컨텐츠가 없는 경우
			$(this).css('height', 0);
		} else { 					// iframe의 컨텐츠가 있는 경우
			if(iframeBody.height() == 0){
				$(this).css('height', iframeBody.height() + 400);
			}else if(iframeBody.height() > 400){
				$(this).css('height', 400);
			}
		}
	});  
	

	//로딩된 이후 스피너 처리
	iframe.onload = function() {
	  loader.style.display = "none";   // 스피너 숨김
	  iframe.style.display = "block";  // iframe 표시
	};  
	
	// pt(=ItemTemplete), 관련기술 Count갯수 최신화
	if (pt) { // tabViewer이라는 포틀릿 변수에 pt.tabViewer를 담는다.
		tabViewer${PORTLET_ID} = pt.tabViewer;
		tabViewer${PORTLET_ID}.updateCount(model.enhIdSum);
		JSV.register(tab, tabViewer${PORTLET_ID} , 'updateCount');
	} else {
		resetTemplate${PORTLET_ID}();
	}	
}, '${PORTLET_ID}');
var tabViewer${PORTLET_ID}, model;
function resetTemplate${PORTLET_ID}() {
	setTimeout(function() {
		if (pt) {
			tabViewer${PORTLET_ID} = pt.tabViewer;
			tabViewer${PORTLET_ID}.updateCount(model.enhIdSum);
		} else {
			resetTemplate${PORTLET_ID}();
		}
	}, 200);
}
var tab;
<%-- 탭의 등록 및 수정 후 탭목록을 리로드 시켜준다 --%>
function tabSortAdminReload(modid){
	TabSortAdmin.SelectId = modid; // mod.write.jsp, mod.edit.jsp에서 받아온 value값을 컴포넌트 TabSortAdmin.SelectId에 담는다.
	var json = JSV.loadJSON('/jsl/EnhModUser.ModList.json?enhid=' + JSV.getParameter('id'));
	var model = json.array;
 	tab.value = (model && model.length>0)? model : [];
 	tab.reset();
}
<%-- 탭의 삭제 후 탭목록을 리로드 시켜준다 --%>
function tabRefresh(enhid){
	var json = JSV.loadJSON('/jsl/EnhModUser.ModList.json?enhid=' + enhid);
	var model = json.array;
 	tab.value = (model && model.length>0)? model : [];
 	tab.reset();
}
</script>
<div id="tabDiv"></div>
<!-- 로딩 중 스피너 -->
<div id="loader">
  <div class="spinner"></div>
</div>
<iframe id="modReadFrame" name="modReadFrame" src="" scrolling="yes" frameborder="0" width="100%"></iframe>
<%@ include file="/jspf/tail.portlet.jsp" %>