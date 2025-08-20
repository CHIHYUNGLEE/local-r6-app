<%@ include file="/sys/jsv/template/template.head.jsp" %>
<style>
.ShowToolTip {
	position: absolute;
	display: none;
	z-index: 500;
	border: 1px solid #ffcd00;
	width: 220px;
	font-family: 'Dotum', 'Arial';
	font-size: 12px;
	float: left;
	margin: 0;
	padding: 0
}

.ShowToolTip .title {
	padding: 7px 0 7px 0;
	background: #ffde57;
	width: 100%;
	float: left;
	color: #9d4a01;
	margin: 0 0 6px 0;
	_margin: 0px;
}

.ShowToolTip .title .com {
	float: left;
	margin: 0 0 0 12px;
}

.ShowToolTip .date {
	background: #ffffff;
	padding: 6px 10px 5px 10px;
	color: #777777;
}

.ellipsis {
	width: 100%;
	height: 28px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	cursor:pointer;
}

.ProjectYearViewer {
	width: 100%;
}

.ProjectYearViewer .monTd {
	margin: 0px;
	padding: 0px;
	height: 32px;
	line-height: 32px;
	background-color: #f8f8f8;
	color: #6575b0;
	font-family: 'Dotum', 'Arial';
	font-size: 12px;
	font-weight: bold;
	table-layout: fixed;
	border-top: #cccccc 1px solid;
	border-bottom: #cccccc 1px solid;
	text-align: center;
}

.ProjectYearViewer .monTd1 {
	margin: 0px;
	padding: 0px;
	height: 32px;
	line-height: 32px;
	background-color: #f0f0f0;
	color: #6575b0;
	font-family: 'Dotum', 'Arial';
	font-size: 12px;
	font-weight: bold;
	table-layout: fixed;
	border-top: #cccccc 1px solid;
	border-bottom: #cccccc 1px solid;
	text-align: center;
}

.ProjectYearViewer .nameTd {
	height: 30px;
	font-family: 'Dotum', 'Arial';
	border-bottom: #eeeeee 1px solid;
	border-right: #eeeeee 1px solid;
	background-color: #fafafa;
	text-align: center;
}

.ProjectYearViewer .performTd {
	height: 30px;
	font-family: 'Dotum', 'Arial';
	border-bottom: #eeeeee 1px solid;
	border-left: #eeeeee 1px solid;
	background-color: #fafafa;
	text-align: center;
	font-weight: bold;
}

.ProjectYearViewer .planTd {
	height: 30px;
	font-family: 'Dotum', 'Arial';
	border-bottom: #eeeeee 1px solid;
	border-left: #eeeeee 1px solid;
	background-color: #fafafa;
	text-align: center;
	font-weight: bold;
}

.ProjectYearViewer .myTd {
	border-bottom: #eeeeee 1px solid;
}

.ProjectYearViewer .myTd .dataTd1 {
	font-family: 'Dotum', 'Arial';
	height: 24px;
	background-color: #f5eaa0;
	border: #E1E1E1 1px solid;
	color: #b28a00;
	text-align: center;
	font-size: 11px;
	margin: 0;
}

.ProjectYearViewer .myTd .dataTd2 {
	font-family: 'Dotum', 'Arial';
	height: 24px;
	background-color: #E9FFE0;
	border:#67a723 1px solid;
	color: #365009;
	text-align: center;
	font-size: 11px;
	margin: 0;
}

.ProjectYearViewer .myTd .dataTd3 {
	font-family: 'Dotum', 'Arial';
	height: 24px;
	background-color: #fdf7f3;
	border: #e78e8f 1px solid;
	color: #d53535;
	text-align: center;
	font-size: 11px;
	margin: 0;
}

.ProjectYearViewer .myTd .dataTd4 {
	font-family: 'Dotum', 'Arial';
	height: 24px;
	background-color: #f5fbfb;
	border: #7599f0 1px solid;
	color: #2d5b9f;
	text-align: center;
	font-size: 11px;
	margin: 0;
}
</style>
<script type="text/javascript">
JSV.Block(function () {

	var nYear = parseInt(JSV.getParameter('nYear'));
	var enhId = null;
	
	//현재날짜에 한줄 라인 관련추가
	var addToday= new Object();
	addToday.sDate = new Date();
	
	if(JSV.getParameter('enhId')){
		enhId=JSV.getParameter('enhId');
	}

	//삭제된 고도화인 경우 'isDel' 파라미터를 넘기고
	//아닌 경우 넘기지 않는다.
	if(enhId){
		if(JSV.getParameter('isDel') != null){
			var json=JSV.loadJSON('/jsl/EnhOwner.SelectGlobalProject.json?enhId='+enhId+'&nYear='+nYear+'&isDel=true');
		}else{
			var json=JSV.loadJSON('/jsl/EnhOwner.SelectGlobalProject.json?enhId='+enhId+'&nYear='+nYear);
		}
		if (json && Array.isArray(json.array) && json.array.length > 0) {
		    jsl = json.array;
		} else {
		    jsl = [];
		}
 	}
	
 	if(jsl.length){
		var prjViewer = new ProjectYearViewer(document.getElementById('main'), {'mode':'existData','nYear':nYear});
	}

	for(var i=0;i<jsl.length;i++){
		var obj= new Object();

		obj.sDate = new Date(jsl[i].taskSdate);
		obj.eDate = new Date(jsl[i].taskEdate);
		obj.psDate =new Date(jsl[i].planSdate);
		obj.peDate =new Date(jsl[i].planEdate);
		obj.nYearSdate= new Date(nYear,0,1);
		obj.nYearEdate= new Date(nYear,11,31);
		obj.enhId = jsl[i].enhId;
		obj.enhName=jsl[i].enhName;
		obj.taskCode=jsl[i].taskCode;
		obj.enhId=jsl[i].enhId;

		var author=new Object();
		author.userId=jsl[i].userId;
		author.userName=jsl[i].userName;
		obj.author=author;
		obj.status=jsl[i].status;
		prjViewer.addData(obj);	
		//선택년도와 현재년도 체크 현재날짜 라인 관련추가
		if (nYear == addToday.sDate.getFullYear()){
			prjViewer.addTodayLine(addToday);
		}
	}

	if(window.parent){
		window.parent.postMessage({'id' : window.frameElement.id, 'height' : document.documentElement.scrollHeight}, '*');
	}
});
var jsl;
function ProjectYearViewer(parent, style){
	this.style = style || {};
	this.mode = style.mode;
	this.className = this.style.className || 'ProjectYearViewer';
	this.nYear = this.style.nYear;
	this.$widget = $('<div>').addClass(this.className).appendTo(parent);
	this.$tbl = $('<table cellspacing="0" cellpadding="0"></table>').addClass(this.className)
				.appendTo(this.$widget);
	var $tr = $('<tr>').appendTo(this.$tbl);
	if(this.mode=='existData'){
		$('<td>').appendTo($tr).addClass('monTd1')
			.width('7%').text(JSV.getLang('EmployeeType','outside'));
	}
	var $td = $('<td>').appendTo($tr).width('93%').text(' ').css('position','relative');
	this.yearDays = Math.abs(Math.floor((new Date(this.nYear,11,31))/(1000 * 60 * 60 * 24)))-Math.abs(Math.floor((new Date(this.nYear,0,1))/(1000 * 60 * 60 * 24)))+1;

	var left = 0; 
	if(this.mode=='existData'){
		for(var i = 1 ; i < 13; i++){
			var days = Math.abs(Math.floor((new Date(this.nYear,i,this.getLastDay(this.nYear, i)))/(1000 * 60 * 60 * 24)))
					-Math.abs(Math.floor((new Date(this.nYear,i,1))/(1000 * 60 * 60 * 24)))+1;
			var width = (days/this.yearDays)*100;
			if(i%2==0) {
				$('<div>').appendTo($td).addClass('monTd1').css({'position':'absolute','left':left+'%','top':'0'})
				.width(width+'%')
				.text((i||' '));
			} else {
				$('<div>').appendTo($td).addClass('monTd').css({'position':'absolute','left':left+'%','top':'0'})
				.width(width+'%')
				.text((i||' '));
			}
			left += width;
		}
	}else if(this.mode=='noData'){
		$('<div>').appendTo($td).addClass('monTd')
		.width('100%').text(JSV.getLang('chartBody','noData'));
	}
}
ProjectYearViewer.prototype.getLastDay = function(x1,x2){  // 년,월 을 입력하면 마지막 날을 가져온다.
	  var rtn = "";
	  var tempDate = new Date(x1,x2,1);
	   tempDate.setDate(0);
	  rtn = tempDate.getDate();
	  return rtn;
}
ProjectYearViewer.prototype.addData = function(obj){
	
	popupEnhRead = function(value){
		var u = '/enh/usr.popup.read.jsp?id='+value;
		var q = '';
		var n = 'usersPopup';
		var f = 'width=850,height=700,scrollbars=yes,status=no,toolbar=no,menubar=no,location=no,resizable=yes';
		var url = JSV.getContextPath(u, q);
		window.open(url, n, f);
	}
	
	function ShowToolTip(){
		var Tooltip = $('#TOOLTIP');
		if (Tooltip.length === 0) {
			return $('<div id="TOOLTIP"></div>')
			.html('<div class="title">\
	            	<span id="TOOLTIP_TITLE" class="com"></span>\
	            </div>\
	            <div id="TOOLTIP_DATE" class="date">\
			</div>').addClass('ShowToolTip').appendTo('body').get(0);
		}else{
			return Tooltip.get(0);
		}
	}
	
	overPop =function(event) { 
		var toolTip = ShowToolTip();
		$(toolTip).find('#TOOLTIP_TITLE').html(HtmlViewer.convertHtml(obj.enhName+'['+taskName+']')) ;
		var content = HtmlViewer.convertHtml(obj.enhName);
		if (content == null)
			content = '&nbsp;';
		
		$(toolTip).find('#TOOLTIP_DATE')
			.html( '<p>'+JSV.getLang('EnhChart','projectDays') +' : [' + DateFormat.format(obj.sDate, JSV.getLang('DateFormat','dateType9')) + '~' + DateFormat.format(obj.eDate, JSV.getLang('DateFormat','dateType9')) + ']</p>'
			+ JSV.getLang('EnhChart','planDays') +' : [' + DateFormat.format(obj.psDate, JSV.getLang('DateFormat','dateType9')) + '~' + DateFormat.format(obj.peDate, JSV.getLang('DateFormat','dateType9')) + ']') ;

		var left = event.clientX + $(document).scrollLeft() + 10;
		var width = $(toolTip).width();
		var height = $(toolTip).height();
		if ( ( left + width ) > document.body.clientWidth ) {
			left = event.clientX - width;
		}
		var top = event.clientY + $(document).scrollTop() + 10;
		if ((event.clientY + height + 10) > document.body.clientHeight) {
			if (top - height - 10 > $(document).scrollTop()) {
				top = top - height - 10;
			} else {
				top = $(document).scrollTop() + 10;
			}
		}
		$('.ShowToolTip').width('270px');
		$(toolTip).css({'top':top, 'left':left}).show();
	}
	
	outPop=function(event) {
		var toolTip = ShowToolTip();
		$(toolTip).hide();
	}
	
	this.$myTd = this.$tbl.find('#USER_'+obj.author.userId);
	if(this.$myTd.length === 0){
		var $myTr = $('<tr>').appendTo(this.$tbl);
		
		$('<td>').addClass('nameTd').width('7%').appendTo($myTr).text(JSV.getLocaleStr(obj.author.userName));
		this.$myTd = $('<td colspan="12">&nbsp;</td>').width('93%').addClass('myTd').css('position','relative').appendTo($myTr).attr('id', 'USER_'+obj.author.userId);
	}
	var startTerm = 0;
	var endTerm = 0;
	
	var taskName=JSV.getLang('TaskCodeViewer', obj.taskCode);
	
	if(obj.nYearSdate>obj.sDate&&obj.nYearEdate<obj.eDate){
		startTerm=0;
		endTerm=this.yearDays;
	}else if(obj.nYearSdate>obj.sDate&&obj.nYearSdate<=obj.eDate&&obj.nYearEdate>=obj.eDate){
		startTerm=0;
		endTerm = Math.abs(Math.floor((obj.eDate-obj.nYearSdate)/(1000 * 60 * 60 * 24)));
	}else if(obj.nYearSdate<=obj.sDate&&obj.nYearEdate>=obj.sDate&&obj.nYearEdate<obj.eDate){
		startTerm = Math.abs(Math.floor((obj.sDate-obj.nYearSdate)/(1000 * 60 * 60 * 24)));
		endTerm=this.yearDays;
	}else{
		startTerm = Math.abs(Math.floor((obj.sDate-obj.nYearSdate)/(1000 * 60 * 60 * 24)));
		endTerm = Math.abs(Math.floor((obj.eDate-obj.nYearSdate)/(1000 * 60 * 60 * 24)));
	}

	stDate = DateFormat.format(obj.sDate, JSV.getLang('DateFormat','dateType9'));
	enDate = DateFormat.format(obj.eDate, JSV.getLang('DateFormat','dateType9'));

	var top = 2;

	var addData = 'dataTd2';
	if(obj.status==3600) {
		addData = 'dataTd4';
	} else if (obj.status==3900) {
		addData = 'dataTd3';
	}
	if(startTerm==0&&endTerm==this.yearDays){
 		$('<div onclick="popupEnhRead('+obj.enhId+');" onmouseover="this.style.cursor=\'hand\'">').css({'position':'absolute','left':'0px','top': top + 'px'})
		.width('100%')
		.html('<div class="ellipsis">'+obj.enhName+'['+taskName+']</a><br/>'+'('+stDate+'~'+enDate+')</div>')
		.appendTo(this.$myTd)
			.bind('mouseover', overPop)
			.bind('mouseout', outPop)
			.addClass(addData);
	}else if(endTerm==this.yearDays&&startTerm!=0){
		var startLeft = (startTerm/this.yearDays*100);
		var divWidth = 100-startLeft;
		$('<div onclick="popupEnhRead('+obj.enhId+');" onmouseover="this.style.cursor=\'hand\'">').css({'position':'absolute','right':'0%', 'top':top + 'px'})
			.width(divWidth+'%')
			.html('<div class="ellipsis">'+obj.enhName+'['+taskName+']</a><br/>'+'('+stDate+'~'+enDate+')</div>')
			.appendTo(this.$myTd)
			.bind('mouseover', overPop)
			.bind('mouseout', outPop)
			.addClass(addData);
	}else if(startTerm==0&&endTerm!=this.yearDays){
		$('<div onclick="popupEnhRead('+obj.enhId+');" onmouseover="this.style.cursor=\'hand\'">').css({'position':'absolute','left':'0px', 'top':top + 'px'})
		.width((endTerm/this.yearDays*100)+'%')
		.html('<div class="ellipsis">'+obj.enhName+'['+taskName+']</a><br/>'+'('+stDate+'~'+enDate+')</div>')
		.appendTo(this.$myTd)
			.bind('mouseover', overPop)
			.bind('mouseout', outPop)
			.addClass(addData);
	}else if(startTerm!=0&&endTerm!=this.yearDays){
		var startLeft = (startTerm/this.yearDays*100);
		$('<div onclick="popupEnhRead('+obj.enhId+');" onmouseover="this.style.cursor=\'hand\'">').css({'position':'absolute','left':startLeft+'%', 'top':top + 'px'})
			.width(((endTerm-startTerm)/this.yearDays*100)+'%')
			.html('<div class="ellipsis">'+obj.enhName+'['+taskName+']</a><br/>'+'('+stDate+'~'+enDate+')</div>')
			.appendTo(this.$myTd)
			.bind('mouseover', overPop)
			.bind('mouseout', outPop)
			.addClass(addData);
	}
	
	//현재날짜에 한줄 라인추가
	ProjectYearViewer.prototype.addTodayLine = function(addToday){
		
		startTerm = Math.abs(Math.floor((addToday.sDate-obj.nYearSdate)/(1000 * 60 * 60 * 24)));
		endTerm = Math.abs(Math.floor((addToday.eDate-obj.nYearSdate)/(1000 * 60 * 60 * 24)));
		
	    var startLeft = (startTerm/this.yearDays*100);
	    this.$myTd = this.$tbl.find('.myTd');
	    
		$('<div>').css({'position':'absolute','left':startLeft+'%', 'top':top-2+'px'}).
			html('<div class="ellipsis" style="cursor:default; height:32px; border-left: solid #FFC3FA;"></div>').appendTo(this.$myTd);
		
	}
}
</script>
<%@ include file="/sys/jsv/template/template.body.jsp"%>
<div id="main" style="padding-top : 10px;padding-bottom:10px"></div>
<%@ include file="/sys/jsv/template/template.tail.jsp"%>