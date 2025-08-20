<%@ include file="/sys/jsv/template/template.head.jsp"%>
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
}

.ProjectYearViewer .planTd {
	height: 30px;
	font-family: 'Dotum', 'Arial';
	border-bottom: #eeeeee 1px solid;
	border-left: #eeeeee 1px solid;
	background-color: #fafafa;
	text-align: center;
}

.ProjectYearViewer .myTd {
	border-bottom: #eeeeee 1px solid;
	top: 35px;
	height: 30px;
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
var folderDiv = 10;
JSV.Block(function () {
	
	var nYear = parseInt(JSV.getParameter('nYear'));
	
	var enhId=0;
	if(JSV.getParameter('enhId')){
		enhId=JSV.getParameter('enhId');
	}

	var json = JSV.loadJSON('/jsl/EnhOwner.SelectTaskByOwner.json?enhId='+enhId+'&nYear='+nYear);
	if(json.error){
		alert('<fmt:message key="err.name.DefaultException"/>');
	}else{
		var jsl = json.array;
		if(jsl.length){
			var prjViewer = new ProjectYearViewer(document.getElementById('main'), {'mode':'existData','nYear':nYear});
		}else{
			var prjViewer = new ProjectYearViewer(document.getElementById('main'),{'mode':'noData'});
		}
	}
	
	folderDiv = JSV.getParameter('folderDiv');
	
	var preId = 0;
	
	//현재날짜에 한줄 라인 관련추가
	var addToday= new Object();
	addToday.sDate = new Date();
	addToday.eDate = new Date();
	addToday.percent = 0;
	
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
		author.hStatus=jsl[i].hStatus;
		
		obj.author=author;
		obj.status=jsl[i].status;
		
		obj.enhTr = 0;
		if(i != 0 && (i-1) >= 0 && (jsl[i].userId==jsl[i-1].userId) && (new Date(jsl[i].taskSdate) - new Date(jsl[i-1].taskEdate)) < 0){
			preId +=1;
		}else if(i != 0 && (i-1) >= 0 && (jsl[i].userId==jsl[i-1].userId)){
			preId = preId;
		}else{
			preId = 0;
		}
		obj.enhTr = preId;
		
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
function ProjectYearViewer(parent, style){
	this.style = style || {};
	this.mode = style.mode;
	this.className = this.style.className || 'ProjectYearViewer';
	this.$widget = $('<div>').addClass(this.className).appendTo(parent);
	this.$tbl = $('<table cellspacing="0" cellpadding="0"></table>').addClass(this.className)
				.appendTo(this.$widget);
	this.nYear = this.style.nYear;	
	var $tr = $('<tr>').appendTo(this.$tbl);
	var $td = $('<td>').appendTo($tr).width('100%').text(' ').css('position','relative');
	this.yearDays = Math.abs(Math.floor((new Date(this.nYear,11,31))/(1000 * 60 * 60 * 24)))-Math.abs(Math.floor((new Date(this.nYear,0,1))/(1000 * 60 * 60 * 24)))+1;

	var left = 0; 
	this.percent = 100;
	this.right = 0;
	if(this.mode=='existData'){
		for(var i = 1 ; i < 13; i++){
			var days = Math.abs(Math.floor((new Date(this.nYear,i,this.getLastDay(this.nYear, i)))/(1000 * 60 * 60 * 24)))
					-Math.abs(Math.floor((new Date(this.nYear,i,1))/(1000 * 60 * 60 * 24)))+1;
			var width = (days/this.yearDays)*this.percent;
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
		this.$myTr = $('<tr>').appendTo(this.$tbl);
		this.$myTd = $('<td colspan="12">&nbsp;</td>').width('100%').addClass('myTd')
		.css('position','relative')
		.appendTo(this.$myTr);
		
// 		this.$dataTr = $('<tr>').appendTo(this.$tbl);
// 		this.$myTd = $('<td colspan="12">&nbsp;</td>').width(this.percent+'%').addClass('myTd').css('position','relative').appendTo(this.$dataTr);

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
ProjectYearViewer.prototype.performDays = function(value){
	this.cal += value;
}
ProjectYearViewer.prototype.performPeriod = function(sdate,edate){
	if(this.nYearSdate>=sdate&&this.nYearEdate<=edate){
		this.startTerm=0;
		this.endTerm=this.yearDays;
	}else if(this.nYearSdate>=sdate&&this.nYearSdate<=edate&&this.nYearEdate>=edate){
		this.startTerm=0;
		this.endTerm = Math.abs(Math.floor((edate-this.nYearSdate)/(1000 * 60 * 60 * 24)));

	}else if(this.nYearSdate<=sdate&&this.nYearEdate>=sdate&&this.nYearEdate<=edate){
		this.startTerm = Math.abs(Math.floor((sdate-this.nYearSdate)/(1000 * 60 * 60 * 24)));
		this.endTerm=this.yearDays;

	}else{
		this.startTerm = Math.abs(Math.floor((sdate-this.nYearSdate)/(1000 * 60 * 60 * 24)));
		this.endTerm = Math.abs(Math.floor((edate-this.nYearSdate)/(1000 * 60 * 60 * 24)));
	}
	if(this.dprtId!=null){
		if((this.endTerm-this.startTerm)!=0){
			if(this.startTerm==0&&this.endTerm==this.yearDays){
				this.perform = this.yearDays;
			}else{
				this.perform = (this.endTerm-this.startTerm+1);
			}
			
		}
	}
}
ProjectYearViewer.prototype.planPeriod = function(sdate,edate){
		if(this.nYearSdate>=sdate&&this.nYearEdate<=edate){
			this.planStart=0;
			this.planEnd=this.yearDays;
		}else if(this.nYearSdate>=sdate&&this.nYearSdate<=edate&&this.nYearEdate>=edate){
			this.planStart=0;
			this.planEnd = Math.abs(Math.floor((edate-this.nYearSdate)/(1000 * 60 * 60 * 24)));

		}else if(this.nYearSdate<=sdate&&this.nYearEdate>=sdate&&this.nYearEdate<=edate){
			this.planStart = Math.abs(Math.floor((sdate-this.nYearSdate)/(1000 * 60 * 60 * 24)));
			this.planEnd=this.yearDays;

		}else{
			this.planStart = Math.abs(Math.floor((sdate-this.nYearSdate)/(1000 * 60 * 60 * 24)));
			this.planEnd = Math.abs(Math.floor((edate-this.nYearSdate)/(1000 * 60 * 60 * 24)));
		}
		if(this.dprtId!=null){
			if((this.planEnd-this.planStart)!=0){
				if(this.planStart==0&&this.planEnd==this.yearDays){
					this.plan = this.yearDays;
				}else{
					this.plan = (this.planEnd-this.planStart+1);
				}
				
			}
		}
}
ProjectYearViewer.prototype.addData = function(obj){
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
	
	this.startTerm = 0;
	this.endTerm = 0;
	this.nYearEdate = obj.nYearEdate;
	this.nYearSdate = obj.nYearSdate;
	this.planStart = 0;
	this.planEnd = 0;

	var taskName=JSV.getLang('TaskCodeViewer', obj.taskCode);
	
	this.performPeriod(obj.sDate,obj.eDate);
    this.planPeriod(obj.psDate,obj.peDate);

	stDate = DateFormat.format(obj.sDate, JSV.getLang('DateFormat','dateType9'));
	enDate = DateFormat.format(obj.eDate, JSV.getLang('DateFormat','dateType9'));
	
	var top = 2;
	if(obj.enhTr != 0){
		if(folderDiv==1){
			top = 10*obj.enhTr;
			this.$myTd.height(30+(obj.enhTr*10) + 'px');
			if(this.dprtId != null){
				this.$myTd.find('.performTd').height(30+(obj.enhTr*10) + 'px');
				this.$myTd.find('.planTd').height(30+(obj.enhTr*10) + 'px');
			}
		}else{
			top = 30*obj.enhTr;
			this.$myTd.height(30*(obj.enhTr+1) + 'px');
			if(this.dprtId != null){
				this.$myTd.find('.performTd').height(30*(obj.enhTr+1) + 'px');
				this.$myTd.find('.planTd').height(30*(obj.enhTr+1) + 'px');
			}
		}
	}
	
	var addData = 'dataTd2';
	if(obj.status==3600) {
		addData = 'dataTd4';
	} else if (obj.status==3900) {
		addData = 'dataTd3';
	}
	if(this.startTerm==0&&this.endTerm==this.yearDays){
 		$('<div onclick="popupEnhRead('+obj.enhId+');" onmouseover="this.style.cursor=\'hand\'">').css({'position':'absolute','left':'0px','top': top + 'px'})
		.width('99.5%')
		.html('<div class="ellipsis">'+obj.enhName+'['+taskName+']</a><br/>'+'('+stDate+'~'+enDate+')</div>')
		.appendTo(this.$myTd)
			.bind('mouseover', overPop)
			.bind('mouseout', outPop)
			.addClass(addData);
	}else if(this.endTerm==this.yearDays&&this.startTerm!=0){
		var startLeft = (this.startTerm/this.yearDays*this.percent);
		var divWidth = this.percent-startLeft;
		$('<div onclick="popupEnhRead('+obj.enhId+');" onmouseover="this.style.cursor=\'hand\'">').css({'position':'absolute','right':this.right+'%', 'top':top + 'px'})
			.width(divWidth+'%')
			.html('<div class="ellipsis">'+obj.enhName+'['+taskName+']</a><br/>'+'('+stDate+'~'+enDate+')</div>')
			.appendTo(this.$myTd)
			.bind('mouseover', overPop)
			.bind('mouseout', outPop)
			.addClass(addData);
	}else if(this.startTerm==0&&this.endTerm!=this.yearDays){
		$('<div onclick="popupEnhRead('+obj.enhId+');" onmouseover="this.style.cursor=\'hand\'">').css({'position':'absolute','left':'0px', 'top':top + 'px'})
		.width((this.endTerm/this.yearDays*this.percent)+'%')
		.html('<div class="ellipsis">'+obj.enhName+'['+taskName+']</a><br/>'+'('+stDate+'~'+enDate+')</div>')
		.appendTo(this.$myTd)
			.bind('mouseover', overPop)
			.bind('mouseout', outPop)
			.addClass(addData);
	}else if(this.startTerm!=0&&this.endTerm!=this.yearDays){
		var startLeft = (this.startTerm/this.yearDays*this.percent);
		$('<div onclick="popupEnhRead('+obj.enhId+');" onmouseover="this.style.cursor=\'hand\'">').css({'position':'absolute','left':startLeft+'%', 'top':top + 'px'})
			.width(((this.endTerm-this.startTerm)/this.yearDays*this.percent)+'%')
			.html('<div class="ellipsis">'+obj.enhName+'['+taskName+']</a><br/>'+'('+stDate+'~'+enDate+')</div>')
			.appendTo(this.$myTd)
			.bind('mouseover', overPop)
			.bind('mouseout', outPop)
			.addClass(addData);
	}
	
	popupEnhRead = function(value) {
		var u = '/enh/usr.popup.read.jsp?id='+value
		var q = '';
		var n = 'usersPopup';
		var f = 'width=850,height=700,scrollbars=yes,status=no,toolbar=no,menubar=no,location=no,resizable=yes';
		var url = JSV.getContextPath(JSV.getModuleUrl(u), q);
		window.open(url, n, f);
	}
	
	//현재날짜에 한줄 라인추가
	ProjectYearViewer.prototype.addTodayLine = function(addToday){
			
		this.performPeriod(addToday.sDate,addToday.eDate,addToday.percent);
	    var startLeft = (this.startTerm/this.yearDays*this.percent);
	    this.$myTd = this.$tbl.find('.myTd');
	    
		$('<div>').css({'position':'absolute','left':startLeft+'%', 'top':top-3+'px'}).
			html('<div class="ellipsis" style="cursor:default; height:33px; border-left: solid #FFC3FA;"></div>').appendTo(this.$myTd);
		
	}
}	
</script>
<%@ include file="/sys/jsv/template/template.body.jsp"%>
<div id="main"></div>
<%@ include file="/sys/jsv/template/template.tail.jsp"%>