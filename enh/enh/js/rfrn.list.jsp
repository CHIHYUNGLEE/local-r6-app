<%@ include file="/sys/jsv/template/template.head.jsp" %>
<link href="<%= request.getContextPath() %>/support/img/human.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="<%=request.getContextPath()%>/enh/js/human.js"></script>
<style type="text/css">
.SearchPage .btnWrapper{width:100%;}
.SearchPage .btnWrapper	.btns{width:580px;}
</style>
<script type="text/javascript" src="../enh_min.js"></script>
<script type="text/javascript">
JSV.Block(function() {
	var mParam = JSV.loadJSON('/jsl/SupItemOrgUser.BaseToModuleParam.json');
	
	if (!mParam.error) {
		document.body.style.margin="0px";
		arr = new Array();
		org = new Object();
		var org_name = '';
		param = 'all';
		var folderId = JSV.getParameter('tr');
	
		page = new SearchPage(document.getElementById('searchPageDiv'), {'jaum':'all', 'locale':JSV.getLocale()});
	
		<%-- EasySearch --%>
		tl = new TableViewer(document.getElementById('TableViewerTd'), {'name':'ts','template':'<kfmt:message key="enh.020"/>'});
		tl.createHeader();
		tl.createBody();
		tl.createFooter({'pagesPerSet':10});
		tl.createCount();
		tl.createSearch();
		tl.onchange = function(isFirst) {
			if(tl.search == null)
				tl.search = 'orgName_' + org_name;
			var ipage = '1';
			if (isFirst) {
				tl.currentPage = 1;	
			} else {
				ipage = tl.currentPage;
			}
			var srch = (param != 'all') ? param : '';
			var ts = ipage + '.' + tl.rowsPerPage +  '..';
			this.setValue('/jsl/SupItemOrgUser.ListByUser.json?tr=' + folderId +'&ts=' + ts + JSV.encode(tl.search) + srch
					+ '&spId=' + mParam.spId + '&appId=' + mParam.appId + '&csId=' + mParam.csId + '&mdId=' + mParam.mdId);
		}
		tl.appendSearch('<kfmt:message key="enh.021"/>', 'orgName');
		
		var style1 = {'attribute':'id','name':'id'};
		var orgId = new OrgCheckboxColumn(tl, style1);
		orgId.width = '10%';
		orgId.header = {'label':'<fmt:message key="doc.037"/>'};
	
		var style2 = {'attribute':'orgName'};
		var orgName = new TextColumn(tl, style2);
		orgName.width = '30%';
		orgName.header = {'label':'<kfmt:message key="enh.021"/>'};
	
		var style3 = {'attribute':'rgstDate','format':'<fmt:message key="date.medium"/>'};
		var rgstDate = new DateColumn(tl, style3);
		rgstDate.width = '30%';
		rgstDate.header = {'label':'<fmt:message key="doc.022"/>'}
	
		var style4 = {'attribute':'Name','id':'userId', 'name':'Name'};
		var userName = new EmpColumn(tl, style4);
		userName.width = '30%';
		userName.header = {'label':'<kfmt:message key="cstm.info.006"/>'};
	
		<%-- textViewerTd, 직접입력 --%>
		check = new BooleanFieldEditor(document.getElementById('directTd'), {'message':'<kfmt:message key="enh.022"/>'});
		$(check.checkbox).bind('click', function(event) {
			if (this.checked){
				<%-- 직접입력 체크시 기존 선택한 고객사 값 및 체크 박스 해제 --%>
				arr=null;
				$(TableBody).find('.OrgCheckboxColumn').prop('checked',false);
				
				orgText.setReadOnly(false);
				orgText.setValue('');
				org = new Object();
				orgText.focus();
			} else {
				orgText.setReadOnly(true);
				orgText.setValue('');
				org = new Object();
			}
		});
		if (JSV.getParameter('isNum') == 'true') {
			$('#directTd').hide();
			JSV.setState('isNum', 'true');
		}
		<%--직접 입력 텍스트 박스--%>
		orgText = new TextFieldEditor(document.getElementById('textViewerTd'));
		orgText.setReadOnly(true);
	
		<%-- ButtonTd, 확인 버튼 --%>
		var ok = new KButton(document.getElementById('buttonTd'), <fmt:message key="btn.pub.ok"/>);
		ok.onclick = function() {
			if (orgText.getValue() == '') {
				alert('<kfmt:message key="enh.023"/>');
				return false;
			}
			<%--목록에서 고객사 선택한 경우--%>
			if($(check.checkbox).is(':checked')==false){
				var orgList = document.getElementsByName('id');// 그냥 전체 목록임
				var temp;
				for(var i=0; i< orgList.length ; i++){
					if(orgList[i].element.id == arr[0].orgId){//전체목록중에  클릭한 값 목록
						temp = orgList[i].element
					}
				}
				if(parent.opener && parent.opener.RfrnOrgFieldEditor.onok) {
					arr = new Array();
					org = new Object();
					org.orgName = orgText.getValue();
					org.kmId = temp.kmid;
					org.orgId = temp.id;
					org.level1 = temp.level1;
					org.level2 = temp.level2;
					org.level3 = temp.level3;
					org.level4 = temp.level4;
					org.name = temp.Name;
					org.userId = temp.userId;
					org.displayName = temp.userDisp;
					arr.push(org);
					parent.opener.RfrnOrgFieldEditor.onok(arr);
				}
			}
			parent.window.close();
			return false;
		}
	
		var cb = new KButton(document.getElementById('buttonTd'), <fmt:message key="btn.pub.close"/>);
		cb.onclick = function() {
			parent.window.close();
			return false;
		}
		tl.onchange();
	} 
});
var tl;
var param;
var check; //직접 입력 컴포넌트
var arr; //선택한 고객사 정보 담을 변수
var org;
var orgText;
var page;
<%--자음 버튼 선택 함수  --%>
function change_bcrd(str1, str2){ 
	if(str1 == 'all') {
		param = 'all'; 
	} else {
		param = '&srch=2&s1=' + JSV.encode(str1) + '&s2=' + JSV.encode(str2);
	}
	page.reset(str1);
	tl.onchange(true);
} 
<%-- 고객사 목록 체크 박스 선택시 호출  --%>
function SingleCheck(value) {
	check.checkbox.checked = false;
	orgText.setReadOnly(false);
	var elems = $(':checkbox');
	for (var i=0; i<elems.length; i++) {
		if (elems[i].value != value)
			elems[i].checked = false;
	}

	var orgList = document.getElementsByName('id');
	
	for (var i = 0 ; i < orgList.length ; i++) 
	{
		if (orgList[i].checked == true) 
		{			
			arr = new Array();
			org = new Object();
			org.orgId = orgList[i].element['id'];
			org.orgName = orgList[i].element['orgName'];
			org.pstl = orgList[i].element['pstl'];
			org.adrs = orgList[i].element['adrs'];
			org.phone = orgList[i].element['phone'];
			org.fax = orgList[i].element['fax'];
			org.userId = orgList[i].element['userId'];
			org.name = orgList[i].element['Name'];
			org.displayName = orgList[i].element['userDisp'];
			orgText.setValue(org.orgName);
			arr.push(org);
			
			var folders = new Array();
			var folder = new Object();
			folder.id = orgList[i].element['kmid'];
			folder.computed = 'false';
			folders.push(folder);
			arr.push(folders);
		}
	}
}

TableBody.prototype.doTR = function(tbody, index, element) {
	this.tr = $('<tr>').addClass('bodyTr').appendTo(tbody).get(0);
	if (element != null && this.onRowClick) {
		$(this.tr).bind('click', this, function(e) {
			$(this).addClass('selected');
			$(this).siblings().each(function(){
				$(this).removeClass('selected');
			});
			e.data.onRowClick(element);
		});
	}
		$(this.tr).bind('click', this, function(e) {
			var checkbox = $(this).find('input[type=checkbox]');
			checkbox.prop('checked', 'checked');
			SingleCheck(checkbox.attr('value'));
			
		});
	this.tr.index = index;
	if (this.style.height) {
		if (this.style.height == '*')
			$(this.tr).height('auto');
		else
			$(this.tr).height(this.style.height);
	}
}
function onSuccess(){
}
</script>
<%@ include file="/sys/jsv/template/template.body.jsp" %>
<div id="searchPageDiv"></div>
<table width="100%" height="500px" border="0" cellpadding="0" cellspacing="0">
	<tr valign="top">
		<td>
		<table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">
			<tr>
				<td id="TableViewerTd" valign="top"></td>
			</tr>
		</table>
		</td>
	</tr>
	<tr valign="top" height="50px">
		<td>
		<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">
			<tr><td align="left" id="directTd" style="padding-left:10px"></td></tr>
			<tr><td style="padding:0px 10px 10px 10px" id="textViewerTd"></td></tr>
			<tr><td align="center" id="buttonTd"></td>	</tr>
		</table>				
		</td>
	</tr>
</table>
<%@ include file="/sys/jsv/template/template.tail.jsp" %>