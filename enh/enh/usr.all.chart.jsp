<%@ include file="/sys/jsv/template/template.head.jsp" %>
<%@ include file="/enh/jsv-enh-ext.jsp" %>
<%@page import="com.kcube.map.FolderCache"%>
<%@page import="com.kcube.map.Folder"%>
<%@page import="com.kcube.sys.emp.EmployeeService"%>
<%@page import="com.kcube.sys.emp.EmployeeConfig"%>
<%@page import="com.kcube.sys.conf.ConfigService"%>
<%@page import="com.kcube.sys.usr.UserService"%><%
	EmployeeConfig _empConf = (EmployeeConfig) ConfigService.getConfig(EmployeeConfig.class);
	Folder dprt = EmployeeService.getDprt(UserService.getUserId());
	Long dprtId = dprt == null ? _empConf.getDprtId() : EmployeeService.getDprt(UserService.getUserId()).getId();
	String dprtPath = FolderCache.getFolder(dprtId).getPath(" > ");
%>
<style>
.mainHeadLeft .writeDiv {padding:0px 0px 0px 3px;height:12px}
.mainHeadLeft .writeDiv .content {padding:0px 0px 0px 7px; font-family:'Dotum','Arial'; font-size:11px; color:#666;}
.TemplateLayoutLeftView {height:80px;}
#folderDiv{float: left;position: relative;top: 4px;left: 10px;}
#printButtonSpan{padding-left: 10px;position: relative;top: -10px;}
.TaskChargeFieldEditor {table-layout: inherit;}
.TaskChargeFieldEditor .RadioImageGroupFieldEditor{position: relative;top: 5px;width:160px;}
</style>
<script type="text/javascript">
var nYear;
var dprtId = <%=dprtId%> ;
var enhId;
var selector;
JSV.Block(function () {
	var template = '<template color="green" name="com.kcube.doc.list" catalog="/enh/catalog.xml.jsp">\
		<header label="<kfmt:message key="menu.enh.004"/>"/>\
		<columns class="Array">\
		</columns>\
	</template>';
	
	var t = new TableTemplate(document.getElementById('main'), template);
	
		$('<table><tr>\
				<span id="taskCombo" style="float:left;">\
					<span id="yearSpan" style="padding-right:5px;float:left;" ></span>\
					<span id="folderDiv"></span></span>\
		        <span id="taskImg" style="float:right;">\
					<img src="'+JSV.getContextPath('/enh/img/chartColor.jpg')+'" style="height:18px;margin-top:3px;"/>\
					<span id="printButtonSpan"></span></span></tr>\
			<tr id="dprtSel"><div><span id="selectorSpan"></span></div></tr></table>')
	.attr('id','selectDiv').appendTo(t.layout.topRightArea);

	var currentYear = new Date().getFullYear();
	nYear = new ComboFieldEditor($('#yearSpan'));
	nYear.onchange = function(value) {
		if(!(dprtId == null && enhId == null)){
			doSubmit();
		}
	}
	
	for (i = currentYear+1; i >= currentYear - 10; i--) {
		nYear.add(i + ' ' + JSV.getLang('ListCompositeTemplate', 'selectYear'), i);
	}
	
	nYear.setValue(JSV.getParameter('nYear') ? JSV.getParameter('nYear') : currentYear);
	
	var taskStyle =	{'dprt' : {'idx':'' , 'viewer':'FolderTextViewer', 'editor':'FolderFieldEditor', 'code':'1000', 'typeOrg':'true'}, 
					'project' : {'idx':'-1' , 'viewer':'FolderTextViewer', 'editor':'ProjectFolderFieldEditor',	'code':'1000', 'typeOrg':'true', 'nYear':nYear.getValue()}}
	var taskCharge = new EnhTaskChargeFieldEditor($('#selectorSpan'), taskStyle);
	var dprtDefault =  {'chargeDprtId': dprtId, 'chargeDprtName':'<%=dprtPath%>'};

	taskCharge.setValue(dprtDefault);
	
	var a = new Object();
	a.path = dprtDefault.chargeDprtName.split(' > ');
	taskCharge.dprtEditor.viewer.setValue(a);
	
	var ContentArea = $('#content');
	
	var selectorStyle = { 'options':'<kfmt:message key="enh.chart.004"/>' };
	selector = new RadioGroupFieldEditor($('#folderDiv'), selectorStyle);
	selector.setValue(1);
	selector.onchange = function(value){
		doSubmit();
	}
	
	var print = new KButton($('#printButtonSpan'), <fmt:message key="btn.pub.print"/>);
	print.onclick = function() {
		JSV.setState('dprtId', dprtId);
		JSV.setState('enhId', enhId);
		JSV.setState('nYear', nYear.getValue());
		JSV.setState('folderDiv', selector.getValue());

		var u = '/enh/usr.popup.print.jsp';
		var q = '';
		var n = 'printPopup';
		var f = 'width=900,height=600,scrollbars=yes,status=no,toolbar=no,menubar=no,location=no,resizable=no';
		var url = JSV.getContextPath(u, q);
		window.open(url, n, f);
		JSV.doGET(u, n);
	}
	
	FolderFieldEditor.prototype.setValue = function(folder) {
		this.folder = folder;
		this.button.selectedId = folder ? folder.id : null;
		dprtId = this.button.selectedId;
		enhId=null;
		JSV.notify(folder, this);
		doSubmit();
	}
	ProjectFolderFieldEditor.showProjectDialog = function(callBack, useLocal) {
		var sUrl = JSV.getContextPath('/enh/js/EnhRadioFieldSelectorDialog.jsp');
		var aArguments = nYear.getValue() ? [nYear.getValue()] : null;
		var sFeatures = 'dialogWidth:850px;dialogHeight:640px;scroll:yes;status:no;resizable:no;';
		JSV.showModalDialog(sUrl, aArguments, sFeatures, function(folder) {
			var newFolder = ProjectFolderFieldEditor.copyFolder(folder);
			if(typeof folder != "undefined"){
				enhId=folder.id;
			}
			dprtId=null;
			callBack(newFolder);
		});
	}
	ProjectFolderFieldEditor.prototype.setValue = function(folder) {
		this.folder = folder;
		this.button.selectedId = folder ? folder.id : null;
		JSV.notify(folder, this);
		doSubmit();
	}
	RadioImageGroupFieldEditor.prototype.onchange = function(value) {
		if(this.value=='0'){
			taskCharge.setValue(dprtDefault);
			taskCharge.dprtEditor.viewer.setValue(a);
			enhId = null;
			doSubmit();
		}else{
			var enhDefault = {};
			enhDefault.chargeProjectId = null;
			enhDefault.chargeProjectName = '';
			taskCharge.setValue(enhDefault);
		}

	}
	
	window.addEventListener("message", function(event){
		if(event.data){
			var fInfo = event.data;
			$('#' + fInfo.id).height(fInfo.height);
		}
	}, false);
	
	doSubmit();
});
function doSubmit() {
	var f = new ItemForm();
	f.put('enhId', enhId);
	f.put('dprtId', dprtId);
	f.put('nYear', nYear.getValue());
	f.put('folderDiv', selector.getValue());
	f.setTarget('chartView');
	f.submit('usr.all.chartViewer.jsp');
}
</script>
<%@ include file="/sys/jsv/template/template.body.jsp" %>
<div id="main" style="height: 155px"></div>
<div style="padding: 0 30px 0 30px;">
	<iframe id="chartView" name="chartView" width="100%" height="100%" marginWidth="0" marginHeight="0" frameborder="no" scrolling="no"></iframe>
</div>
<%@ include file="/sys/jsv/template/template.tail.jsp" %>