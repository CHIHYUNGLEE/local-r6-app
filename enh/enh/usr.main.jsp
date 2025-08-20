<%@ include file="/sys/jsv/template/template.head.jsp" %>
<%@ include file="/enh/jsv-enh-ext.jsp" %>
<style>
.TagCloud .noDataDiv{}
.TagCloud .noDataDiv .noDataSpan{color:#7b82a4;font-family: 'Dotum','Arial';font-size:12px;text-align:center; width:100%; margin:0 0 0 90px; padding:0;}
</style>
<script type="text/javascript">
JSV.Block(function () {
	var tagCloud = new TagCloud(document.getElementById('tagList'));
	TagCloud.prototype.onclick = function(tagObj) {
		JSV.setState('selectedTab', '3');
		JSV.setState('ts', null);
		var tagName = $(tagObj).attr('tag');
		var rowPerPage = (JSV.getCookie('com.kcube.doc.rowsPerPage')) ? JSV.getCookie('com.kcube.doc.rowsPerPage') : 5;
		JSV.setState('com.kcube.doc.list', "1."+rowPerPage+"..mod_"+tagName);
		JSV.doGET($(tagObj).attr('href'), '_self');
	}
	tagCloud.loadData('enh.mod.xml.jsp?count=60&order=' + (JSV.getParameter("order") || '1'));
	
	var template = '<template color="green" name="com.kcube.doc.list" catalog="/enh/catalog.xml.jsp">\
			<header label="<kfmt:message key="enh.mod.005"/>"/>\
			<columns class="Array" columns="100px,,,100px,100px,,100px," >\
					<column property="enhName.webzineList"/>\
					<column property="period.list"/>\
					<column property="author.list"/>\
					<column property="rgstDate.list"/>\
			</columns>\
			<search class="Array" width="125px">\
				<option property="enhName.list"/>\
				<option property="mods.search"/>\
			</search>'
			+ '<footer/>'
			+ '<pageMover/>'
			+ '<rows name="com.kcube.doc.rowsPerPage" rows="<kfmt:message key="mod.style.rows"/>"/>'
			+ '</template>';
		
		var t = new TableTemplate(document.getElementById('main1'), template);
		t.setDataUrl('/jsl/EnhUser.ModListByUser.json', 'ts');
		
		var write = new GroupButton(t.layout.rightArea,
				   {text:<fmt:message key="btn.doc.010"/>.text,
				   onclick:function() {
				   		JSV.doGET('usr.write.jsp');
				   }});
});
<%-- 관련기술 키워드가 없을경우 문구를 출력해준다 --%>
TagCloud.prototype.loadData = function(action) {
	var taglist = JSV.loadXml(action);
	var obj = this;
	$(taglist).children().each(function(n) {
		obj.addTag(this);
	});
	
	var count = $(taglist).children().length; // 키워드 Xml형태의 갯수
	if(count == 0) {
		var noDataDiv = $('<div>').addClass('noDataDiv').appendTo(this.widget);
		$('<span>').addClass('noDataSpan').text(JSV.getLang('ModTagCloud', 'noData')).appendTo(noDataDiv);
	}
}
<%-- 같은 명칭의 탭이 여러개일 경우 제목옆에 카운트를 붙여준다.--%>
TagCloud.prototype.addTag = function(tagObj) {
	var $tagObj = $(tagObj);
	
	var str = $tagObj.attr('tag');
	if($tagObj.attr('cnt') > 1)
		{
			str = str +'('+$tagObj.attr('cnt')+')';
		}
	
	$('<a  hidefocus="true"></a>').addClass('anchor').addClass(
			'rank' + $tagObj.attr('rank')).text(str).appendTo(this.widget).bind('click', this,
			function(e) {
				e.data.onclick(tagObj);
			});
	$(document.createTextNode(' ')).appendTo(this.widget);
}
</script>
<%@ include file="/sys/jsv/template/template.body.jsp" %>
<div id="main" style="display: block;width:100%">
	<div id="main1" style="float:left; display:inline-block;width:70%;"></div>
	<div id="main2" style="float:left; display:inline-block;width:30%;">
		<div class="tagArea" style="display: block; padding:0 0; overflow:hidden; margin:115px 35px 0 40px;">
				<div class="tagWrapper" style="border:1px solid #e1e1e1; padding:10px;">
				<div class="tagTitle" style="border-bottom:1px solid #e1e1e1; padding:7px 0 10px 0; margin:0 0 10px 0; font-weight:bold; font-family:"돋움"; font-size:14px;"><kfmt:message key="enh.mod.006"/></div>
				<div class="tagList" id="tagList"></div>
				</div>
		</div>
	</div>
</div>
<%@ include file="/sys/jsv/template/template.tail.jsp" %>