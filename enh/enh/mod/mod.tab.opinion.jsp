<%@ include file="/jspf/head.portlet.jsp" %>
<%@ include file="/jspf/jspContext.jsp" %>
<%@ include file="/enh/config.jsp" %>
<style>
#loader {
  position: relative;
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #666;
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
</style>
<script type="text/javascript">
JSV.Block(function(){
	isReload = JSV.getParameter('reload', ${PORTLET_ID}), 
	id = JSV.getParameter('id', ${PORTLET_ID});
	var _parent = $('#main${PORTLET_ID}').get(0);
	
	var opnViewerStyle = {
		'itemId' : 'id',
		'userId' : '<%=com.kcube.sys.usr.UserService.getUserId()%>',
		'isCenter' : '<%=isAdmin(moduleParam)%>',
		'reloadUrl' : '/enh/usr.read.jsp',
		'actionUrl' : '/jsl/EnhOpinion.DeleteOpinion.jsl',
		'actionAddUrl' : '/jsl/EnhOpinion.InsertOpinion.json?id=@{id}',
		'opnView' : 'EnhOpinion.ViewOpinion',
		'opnDelete' : 'EnhOpinion.DeleteOpinion',
		'opnUpdate' : 'EnhOpinion.UpdateOpinion',
		'noTitle' : true
	};
	var opnWriterStyle = {
		'itemId' : 'id',
		'reloadUrl' : '/enh/usr.read.jsp',
		'actionUrl' : '/jsl/EnhOpinion.InsertOpinion.json?itemid=@{id}'
	}
	var opnViewer = new OpnViewer(_parent, opnViewerStyle);
	var opnWriter = new OpnWriter(opnViewer.writerArea, opnWriterStyle);
	
	model${PORTLET_ID} = model.opinions;
	model${PORTLET_ID}.totalRows = model${PORTLET_ID}.total;
	
	opnViewer.setValue(model${PORTLET_ID}, new function(){
		this.layout = {};
		this.getProperty = function(field){
			return JSV.getProperty(model, field);
		}
	});
	opnWriter.setId(id);
	JSV.register(opnWriter, opnViewer);
	JSV.register(opnViewer, new function(){
		this.updateCount = function(value, observable){
			tabViewer${PORTLET_ID}.updateCount(value);
			model.opinions = opnViewer.getValue();
			model.opinions.total = value;
		};
	}, 'updateCount');
	if (pt) {
		tabViewer${PORTLET_ID} = pt.tabViewer;
		tabViewer${PORTLET_ID}.updateCount(model${PORTLET_ID}.totalRows);
	} else {
		resetTemplate${PORTLET_ID}();
	}	
}, '${PORTLET_ID}');
var tabViewer${PORTLET_ID}, model${PORTLET_ID} = {};
var isReload, id;
function resetTemplate${PORTLET_ID}() {
	setTimeout(function() {
		if (pt) {
			tabViewer${PORTLET_ID} = pt.tabViewer;
			tabViewer${PORTLET_ID}.updateCount(model${PORTLET_ID}.totalRows);
		} else {
			resetTemplate${PORTLET_ID}();
		}
	}, 200);
}
JSV.loadJSON = function(path, query) {
	var obj = null;
	var url = JSV.getContextPath(path, query);
	$.ajax({'url':url, 
			'dataType':'json', 
			'async':false,
			'xhrFields':{withCredentials: true},
			'success':function(data, status) {
				if(document.getElementById("main${PORTLET_ID}")){
					document.getElementById("loader").style.display = "none";
				}
				obj = data;
			},
			'error':function(xhr) {
				if(document.getElementById("main${PORTLET_ID}")){
					document.getElementById("loader").style.display = "none";
				}
				if (JSV.browser.msie){
					window.status = 'json error: ' + url;
				}else{
					JSV.consoleLog('JSON load Error :'+url);
				}
			}
	});
	return obj;
}
</script>
<div id="main${PORTLET_ID}">
	<div id="loader">
	  <div class="spinner"></div>
	</div>
</div>
<%@ include file="/jspf/tail.portlet.jsp" %>