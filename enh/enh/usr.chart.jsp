<%@ include file="/sys/jsv/template/template.head.jsp" %>
<%@ include file="/enh/jsv-enh-ext.jsp" %>
<%--------------------------------------------------------------------

	나의 고도화 현황 그래프
 
----------------------------------------------------------------------%>
<style>
.mainHeadLeft .writeDiv {padding:0px 0px 0px 3px;height:12px}
.mainHeadLeft .writeDiv .content {padding:0px 0px 0px 7px; font-family:'Dotum','Arial'; font-size:11px; color:#666;}
.TemplateLayoutLeftView {height:80px;}
#folderDiv{float:left;position:relative;top:4px;left:10px;}
#taskImg{float:right;position:relative;top:5px;}
</style>
<script type="text/javascript">
var nYear;
var pro;
var enhId;;
var targetTextAreaViewer;
var selector;
JSV.Block(function () {
	var template = '<template color="green" name="com.kcube.doc.list" catalog="/enh/catalog.xml.jsp">\
		<header label="<kfmt:message key="menu.enh.003"/>"/>\
		<columns class="Array">\
		</columns>\
	</template>';
	
	var t = new TableTemplate(document.getElementById('main'), template);

	$('<div><span id="taskCombo" style="float:left;">\
		<span id="content"></span>\
		<span id="yearSpan"></span>\
		<span id="enhSpan"></span>\
		</span>\
	<span id="folderDiv"></span><span id="taskImg"></span></div>').css('width','100%').appendTo(t.layout.topRightArea);
	$('<img>').attr('src',JSV.getContextPath('/enh/img/chartColor.jpg')).css({'align':'right','height':'18px'}).appendTo('#taskImg');
	$('#yearSpan').css('padding-right','5px');
	var ContentArea = $('#content');
	 
	var writeDiv = $('<div>').addClass('writeDiv').appendTo(ContentArea).get(0);
	
	var currentYear = new Date().getFullYear();
	nYear = new ComboFieldEditor($('#yearSpan'));
	for (i = currentYear+1; i >= currentYear - 10; i--) {
		nYear.add(i + ' ' + JSV.getLang('ListCompositeTemplate','selectYear'), i);
	}
	nYear.setValue(JSV.getParameter('nYear') ? JSV.getParameter('nYear') : currentYear);

	var prostyle = { 'options':'<kfmt:message key="enh.chart.002"/>', 'optionValue':'enhId', 'optionText':'enhName'};
	pro = new ComboFieldEditor($('#enhSpan'),prostyle);
	nYear.onchange = function(value) {
		pro.refreshByAjaxEnh('/jsl/EnhOwner.SelectProjectByOwner.json?nYear='+nYear.getValue());
		doSubmit();
	}
	
	pro.refreshByAjaxEnh('/jsl/EnhOwner.SelectProjectByOwner.json?nYear='+nYear.getValue());
 	
	pro.onchange = function(value) {
		doSubmit();
	}
	
	var selectorStyle = { 'options':'<kfmt:message key="enh.chart.004"/>' };
	selector = new RadioGroupFieldEditor($('#folderDiv'), selectorStyle);
	selector.setValue(1);
	selector.onchange = function(value){
		doSubmit();
	}
	doSubmit();
	
	window.addEventListener("message", function(event){
		if(event.data){
			var fInfo = event.data;
			$('#' + fInfo.id).height(fInfo.height);
		}
	}, false);
});
function doSubmit() {
	var f = new ItemForm();
	f.put('enhId', pro.getValue());
	f.put('nYear', nYear.getValue());
	f.put('folderDiv', selector.getValue());
	f.setTarget('chartView');
	f.submit('usr.chartViewer.jsp');
}
</script>
<%@ include file="/sys/jsv/template/template.body.jsp" %>
<div id="main" style="height:127px;"></div>
<div style="padding: 0 30px 0 30px;">
	<iframe id="chartView" name="chartView" frameborder="0" width="100%"></iframe>
</div>
<%@ include file="/sys/jsv/template/template.tail.jsp" %>