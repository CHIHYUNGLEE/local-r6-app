
function AnchorMbr(){}
AnchorMbr.generateAnchor=function(id,name){var anchor='<a class="AnchorMbr_generateAnchor"  hidefocus="true" onclick="AnchorMbr.showDetail('+id
+');return false;">'+JSV.getLocaleStr(name)+'</a>';return anchor;}
AnchorMbr.generateBoldAnchor=function(id,name){var anchor='<a class="AnchorMbr_generateBoldAnchor" hidefocus="true" onclick="AnchorMbr.showDetail('+id
+');return false;">'+JSV.getLocaleStr(name)+'</a>';return anchor;}
AnchorMbr.showDetail=function(id){var u='/group/gcop/member/gcopEmpDetailPopup.jsp';var q='userId='+id;var n='mbrPopup';var f='width=481,height=286,scrollbars=no,status=no,toolbar=no,menubar=no,location=no,resizable=no';var url=JSV.getContextPath(u,q);window.open(url,n,f);}
function AutoTextFieldEditor(parent,style){TextFieldEditor.call(this,parent,$.extend(style,{}));this.init();}
AutoTextFieldEditor.prototype=$.extend({},TextFieldEditor.prototype,{init:function(){JSV.register(new EnhAutoUserNameComplete(null,this.widget,this,this.style),this,'autoComplete');},autoComplete:function(){if(!this.widget.attr('title')){return false;}
this.setValue(this.widget.attr('title'));}});function EnhAutoUserNameComplete(widget,parent,component,style){this.component=component;this.parent=$(parent);this.widget=$(widget);this.style=style||{};this.className=this.style.className||'EnhAutoUserNameComplete';this.listCount=this.style.count||EnhAutoUserNameComplete.DEFAULT_COUNT;this.preValue='';this.canvas=$('<div>').addClass(this.className).appendTo('body');this.iframe=$('<iframe class="iframe"></iframe>').css('opacity','0.0').appendTo(this.canvas);this.widget=$('<div>').addClass('widget').css('visibility','hidden').appendTo(this.canvas);this.unList=$('<ul>').addClass('unlist').appendTo(this.widget);this.appendParentEvent();this.url=this.style.url||EnhAutoUserNameComplete.SEARCH_URL;this.loadFlag=false;}
EnhAutoUserNameComplete.prototype.setPosition=function(){var topMargin=3;var top=this.parent.offset().top+this.parent.height()+topMargin;var left=this.parent.offset().left;var width=this.parent.width();this.canvas.css({'left':left,'top':top+10.5,'width':'15%'});}
EnhAutoUserNameComplete.prototype.loadData=function(keyword){this.loadFlag=false;this.clear();if(this.timeout)
clearTimeout(this.timeout);if(!keyword)
return;var _this=this;this.setPosition();this.timeout=setTimeout(function(){$.ajax({url:JSV.getContextPath(_this.url),context:_this,dataType:'json',data:{'key':keyword,'count':_this.listCount},async:false,success:function(data,status){for(var i=0;i<data.array.length;i++){this.createItem(data.array[i],keyword);}
this.showLayer();},error:function(xhr){alert(JSV.getLang('EnhAutoUserNameComplete','error'));}})},300);}
EnhAutoUserNameComplete.prototype.clear=function(){this.unList.empty();this.preText=null;this.canvas.hide();this.value=null;}
EnhAutoUserNameComplete.prototype.createItem=function(jsonObj,key){this.widget.css('visibility','visible');var html=jsonObj.title;var RegExp=eval("/("+key+")/gi");var emphasis='<strong>$1</strong>';html=html.replace(RegExp,emphasis);tmp=$('<a>').attr('key',jsonObj.key).attr('title',jsonObj.title).addClass('linker');var textArea=$('<nobr>').html(html);var tmp;$('<li>').addClass('item').append(tmp.bind('click',this,function(e){e.data.doSelect($(this).parent());e.data.bindDisplay();e.data.clear();}).unbind('mouseover.EnhAutoUserNameComplete').bind('mouseover.EnhAutoUserNameComplete',this,function(e){e.data.parent.unbind('blur.EnhAutoUserNameComplete');$(this).addClass('selected');}).unbind('mouseout.EnhAutoUserNameComplete').bind('mouseout.EnhAutoUserNameComplete',this,function(e){e.data.bindDisplay();$(this).removeClass('selected');}).append(textArea)).appendTo(this.unList);}
EnhAutoUserNameComplete.prototype.doSelect=function(item){this.setItemData(item);JSV.notify(null,this,'autoComplete');}
EnhAutoUserNameComplete.prototype.moveNext=function(){var item;if(this.unList.children().length==0)
return;if($(this.unList).find('li.selected').length==0){item=$(this.unList).children(':first');item.addClass('selected');}else{item=$(this.unList).find('li.selected').removeClass('selected');if(item.next().get(0)==undefined){item=$(this.unList).children(':first').addClass('selected');}else{item=item.next().addClass('selected');}}
this.setItemData(item);item.get(0).focus();}
EnhAutoUserNameComplete.prototype.setItemData=function(item){var val=item.children(':first');this.parent.attr('title',val.attr('title'));this.value=val;}
EnhAutoUserNameComplete.prototype.movePrev=function(){var item;if(this.unList.children().length==0)
return;if($(this.unList).find('li.selected').length==0){item=$(this.unList).children(':last');item.addClass('selected');}else{item=$(this.unList).find('li.selected').removeClass('selected');if(item.prev().get(0)==undefined){item=$(this.unList).children(':last').addClass('selected');}else{item=item.prev().addClass('selected');}}
this.setItemData(item);item.get(0).focus();}
EnhAutoUserNameComplete.prototype.getSelected=function(){return this.value;}
EnhAutoUserNameComplete.prototype.firstSelect=function(){var item;item=$(this.unList).children(':first');this.setItemData(item);}
EnhAutoUserNameComplete.prototype.appendParentEvent=function(){this.parent.unbind('keyup.EnhAutoUserNameComplete').bind('keyup.EnhAutoUserNameComplete',this,function(e){if(e.keyCode==EnhAutoUserNameComplete.BUTTON_UP||e.keyCode==EnhAutoUserNameComplete.BUTTON_DOWN||e.keyCode==EnhAutoUserNameComplete.BUTTON_ENTER)
return;var value=$.trim(e.data.parent.val());if(e.data.preText&&(e.data.preText==value))
return;e.data.loadData(value);e.data.preText=value;}).unbind('keydown.EnhAutoUserNameComplete').bind('keydown.EnhAutoUserNameComplete',this,function(e){if(e.keyCode==EnhAutoUserNameComplete.BUTTON_UP){e.data.movePrev();}else if(e.keyCode==EnhAutoUserNameComplete.BUTTON_DOWN){e.data.moveNext();}else if((e.keyCode==EnhAutoUserNameComplete.BUTTON_ENTER||(!e.shiftKey&&e.keyCode==EnhAutoUserNameComplete.BUTTON_COMMA)||e.keyCode==EnhAutoUserNameComplete.BUTTON_TAB)&&e.data.loadFlag==true){if(e.data.timeout)
clearTimeout(e.data.timeout);if(e.data.unList.children().length>0&&!e.data.getSelected())
e.data.firstSelect();JSV.notify(null,e.data,'autoComplete');e.data.clear();}});this.bindDisplay();}
EnhAutoUserNameComplete.prototype.showLayer=function(){var count=this.unList.children().length;if(count>0){var height=parseInt(this.unList.children(':first').css('height'));height=(height*count)+5;this.iframe.height((height>237)?238:height);this.canvas.show();}
this.loadFlag=true;}
EnhAutoUserNameComplete.prototype.bindDisplay=function(){this.parent.unbind('blur.EnhAutoUserNameComplete').bind('blur.EnhAutoUserNameComplete',this,function(e){e.data.clear();}).unbind('focus.EnhAutoUserNameComplete').bind('focus.EnhAutoUserNameComplete',this,function(e){e.data.showLayer();});}
EnhAutoUserNameComplete.SEARCH_URL='/jsl/EnhModUser.SelectModLikeName.json';EnhAutoUserNameComplete.BUTTON_TAB=9;EnhAutoUserNameComplete.BUTTON_UP=38;EnhAutoUserNameComplete.BUTTON_DOWN=40;EnhAutoUserNameComplete.BUTTON_ENTER=13;EnhAutoUserNameComplete.BUTTON_COMMA=188;EnhAutoUserNameComplete.DEFAULT_COUNT=10;ComboFieldEditor.prototype.refreshByAjaxEnh=function(refreshAjaxOptions){while(this.widget.options.length){this.widget.options[0]=null;}
var u=JSV.getContextPath(refreshAjaxOptions);$.ajax({url:u,async:false,context:this,dataType:'json',success:function(data,status){var options=[];var id=this.style.optionValue||'id';var name=this.style.optionText||'name';options.push(JSV.getLang('EnhChart','projectSelect'));if(data.array){$.each(data.array,function(index,value){options.push(value[id]+':'+value[name]);});}
this.init(options);},error:function(xhr){alert('error');}});}
function EnhDateTermViewer(parent,style){this.style=style||{};this.className=this.style.className||'DateTermViewer';this.widget=$('<div>').addClass(this.className).appendTo(parent);this.format=this.style.format?this.style.format:null;}
EnhDateTermViewer.prototype.setFormat=function(format){this.format=format;}
EnhDateTermViewer.prototype.setValue=function(value){if(value==null||value.length==0){return;}
if(value[0]!=null&&value[1]!=null){this.startDate=value[0];this.endDate=value[1];if(typeof(this.startDate)!='number')this.startDate=parseInt(this.startDate);if(typeof(this.endDate)!='number')this.endDate=parseInt(this.endDate);str=DateFormat.format(new Date(this.startDate),this.format)+' ~ '+DateFormat.format(new Date(this.endDate),this.format);this.widget.text(str);}else if(value[0]==null&&value[1]!=null){this.startDate='';this.endDate=value[1];if(typeof(this.endDate)!='number')this.endDate=parseInt(this.endDate);str=this.startDate+' ~ '+DateFormat.format(new Date(this.endDate),this.format);this.widget.text(str);}else if(value[0]!=null&&value[1]==null){this.startDate=value[0];this.endDate='';if(typeof(this.startDate)!='number')this.startDate=parseInt(this.startDate);str=DateFormat.format(new Date(this.startDate),this.format)+' ~ '+this.endDate;this.widget.text(str);}else{this.widget.text('-');}}
EnhDateTermViewer.prototype.getValue=function(){var value=new Array();value[0]=this.startDate;value[1]=this.endDate;return value;}
function EmpColumn(parent,style){this.parent=parent;this.style=style||{};this.className=this.style.className||'EmpColumn';parent.appendChild(this);}
EmpColumn.prototype.setValue=function(element,td,tr){var id=element[this.style.id||'id'];var name=JSV.getLocaleStr(element[this.style.name||'name']);var vrtl=this.style.vrtl||null;var a=null;if(vrtl!=null&&id==vrtl){a=$('<div>').get(0);var nobr=$('<nobr>').addClass('nobr').text(name).attr('title',name).appendTo(a);}else{a=AnchorEmp.generateAnchor(id,name);}
$(a).addClass(this.className).appendTo(td);$(td).attr('align',this.style.align||'center');if(this.style.width){$(td).width(this.style.width);}}
function EnhEmpsFieldEditor(parent,style){this.parent=parent?parent:$('body').get(0);this.style=style?style:{};this.className=this.style.className?this.style.className:'EmpsFieldEditor';this.widget=$('<table cellSpacing="0" cellPadding="0">\
<tr class="empsFldTr">\
 <td class="empsFldTd1"></td>\
 <td class="empsFldTd2"><div class="addDiv"></div><div class="delDiv"></div></td>\
</tr></table>').addClass(this.className).appendTo(this.parent).get(0);var viewerTd=$(this.widget).find('.empsFldTd1');var addDiv=$(this.widget).find('.addDiv');var delDiv=$(this.widget).find('.delDiv');var imgAdd=this.style.imgAdd?this.style.imgAdd:JSV.getLang('EmpsFieldEditor','addButton');this.button=new KButton(addDiv,imgAdd);this.button.editor=this;this.button.onclick=function(){EnhEmpsFieldEditor.editor=this.editor
EnhEmpsFieldEditor.onok=function(value){var model=JSV.clone(value);EnhEmpsFieldEditor.editor.setValue(model);}
EnhEmpsFieldEditor.showPopup(this.editor.userList,this.editor.style.role);return false;};if(this.style.viewer=='ListViewer'){this.viewer=new ListViewer(viewerTd,this.style);$(this.viewer).addClass('empsList');this.viewer.setLabelProvider(new ListViewerLabelProvider('displayName'));this.buttonDel=new KButton(delDiv,JSV.getLang('EmpsFieldEditor','deleteButton'));this.buttonDel.editor=this;this.buttonDel.onclick=function(){var selection=this.editor.viewer.getSelection();if(selection.length>0){this.editor.viewer.removeSelection();}else{alert(JSV.getLang('EmpsFieldEditor','notSelect'));}
return false;}}else if(this.style.viewer=='EmpsHtmlViewer'){this.viewer=new EmpsHtmlViewer(viewerTd);}else if(this.style.viewer=='EmpsTextViewer'){this.viewer=new EmpsTextViewer(viewerTd);this.viewer.button=this.button;this.viewer.onclick=function(){this.button.onclick();}}else{this.viewer=null;}}
EnhEmpsFieldEditor.prototype.setValue=function(value){this.userList=value;if(this.viewer){this.viewer.setValue(value);}
JSV.notify(value,this);}
EnhEmpsFieldEditor.prototype.getValue=function(){if(this.style&&this.userList){this.userList.nodeName=this.style.nodeName;}
return this.userList;}
EnhEmpsFieldEditor.prototype.notify=function(value,observable){if(this.userList){var i=this.userList.indexOf(value,EnhEmpsFieldEditor.equals);if(i>=0){alert(JSV.getLang('EmpsFieldEditor','duplicate'));this.userList.remove(this.userList[i]);this.setValue(this.userList);}}}
EnhEmpsFieldEditor.prototype.validate=function(style){return(this.getValue()!=null&&this.getValue().length>0);}
EnhEmpsFieldEditor.equals=function(obj1,obj2){return(obj1.id==obj2.id);}
EnhEmpsFieldEditor.showPopup=function(value,role,id,action){var name='EnhEmpsFieldEditor';var obj=eval(id?name+id:name);obj.value=value;var u='/enh/js/EnhEmpsFieldEditorDialog.jsp';var q=(role?'role='+role:'')+(id?(role)?'&id='+id:'id='+id:'')+(action?(role||id)?'&action='+action:'action='+action:'');var n='usersPopup';var f='width=800,height=730,scrollbars=no,status=no,toolbar=no,menubar=no,location=no,resizable=no';var url=JSV.getContextPath(u,q);window.open(url,n,f);}
EnhEmpsFieldEditor.getData=function(){return EnhEmpsFieldEditor.value;}
EnhEmpsFieldEditor.getObject=function(id){var name='EmpsFieldEditor';var obj;if(id){eval('obj = '+(name+id)+' = {}');}else{obj=eval(name);}
return obj;}
function EnhMbrsHtmlViewer(parent,style){this.style=style?style:{};this.className=this.style.className?this.style.className:'MbrHtmlViewer';this.widget=$('<div>').addClass(this.className).appendTo(parent).get(0);this.user=null;}
EnhMbrsHtmlViewer.prototype.setValue=function(value){if(!value||!value.length||value.length==0){if(this.style.ifNullHide){ItemViewer.removeTR(this.widget);}else{$(this.widget).text(JSV.getLang('EmpsHtmlViewer','nobody'));}
return;}
$(this.widget).empty();for(var i=0;i<value.length;i++){if(i>0){$(document.createTextNode(', ')).appendTo(this.widget);}
if(this.style.vrtl!=null&&this.style.vrtl==value[i].id){$(this.widget).html(JSV.getLocaleStr(value[i].name));}else if(this.style&&this.style.isGlobal=='true'){$(AnchorMbr.generateAnchor(value[i].id,value[i].name)).appendTo(this.widget);}else{$(AnchorEmp.generateAnchor(value[i].id,value[i].name)).removeClass('AnchorEmp_generateAnchor').addClass('link').appendTo(this.widget);}}}
function EnhOrgTitleColumn(parent,style){this.parent=parent;this.style=style||{};this.className=this.style.className||'EnhOrgTitleColumn';this.align=this.style.align||'center';this.padding=this.style.padding||null;parent.appendChild(this);}
EnhOrgTitleColumn.prototype.setLabelProvider=function(lp){this.labelProvider=lp;}
EnhOrgTitleColumn.prototype.setValue=function(element,td,tr){$(td).attr('align',this.align);var div=$('<div>').addClass(this.className).appendTo(td);if(this.labelProvider==null){this.setLabelProvider(new TextColumnLabelProvider());}
this.textValue=(element&&this.style.attribute)?this.labelProvider.getText(element,this.style.attribute):'';var orgId=(this.style.orgId&&element)?JSV.merge(this.style.orgId,element):0;var $titleTag=$('<nobr>').addClass('nobr').appendTo(div).attr('title',this.textValue||'').text(this.style.isMenu?'[ '+this.textValue+' ]':this.textValue);if(orgId>0){var href=(this.style.href&&element)?JSV.merge(this.style.href,element):'';$titleTag.removeClass('nobr').addClass('link').on('click',this,function(e){JSV.doPOST(href);});}}
function EnhQuestionButton(parent,style){this.parent=parent;this.style=style||{'title':'','text':''};this.seq=JSV.SEQUENCE++;this.qImg=this.style.qImg||'ico_helpxfff.png';this.className=this.style.className||'EnhQuestionButton';this.widget=$('<div>').addClass(this.className).appendTo(this.parent);var anchor=$('<a hidefocus="true"></a>').addClass('qbtnA').bind('click',this,function(e){e.data.onclick(this);}).appendTo(this.widget);var spanImg=$('<span>').text('?').css({'background':'url('+this.getURL(this.qImg)+')','background-repeat':'no-repeat'});this.btn=this.style.element||$('<span>').addClass('qbtn').append(spanImg);this.btn.appendTo(anchor);if(this.style.title!=null){this.btn.attr('title',this.style.title);}
this.tip=this.getLayer();}
EnhQuestionButton.prototype.getLayer=function(){var tip=$('#QstnBtnTipDiv'+this.seq);if(tip.length>0){return tip;}else{return $('<div class="tipDiv"><div id="QstnBtnInWrap'+this.seq+'" class="innerWrap"></div></div>').attr('id','QstnBtnTipDiv'+this.seq).hide().appendTo(this.widget);}}
EnhQuestionButton.prototype.getURL=function(fileName){var root='/img/component/questionbutton/';return JSV.getContextPath(root+fileName);}
EnhQuestionButton.prototype.onclick=function(element){var eventSrc=this.tip.data('eventSrc');var $document=$(document);$('#QstnBtnInWrap'+this.seq).html(this.style.text);if(eventSrc==null||element==eventSrc){this.toggleLayer();}else{if(this.tip.data('timeout'))clearTimeout(this.tip.data('timeout'));this.tip.show();}
$document.one('click.tipDiv',this,function(e){e.data.tip.fadeOut();});this.widget.one('click',function(e){e.stopPropagation();});if(this.style.autoHide){this.tip.data('timeout',setTimeout($.proxy(this,'hideLayer'),(this.style.hideTime||1)*1000));}
this.tip.data('eventSrc',element);}
EnhQuestionButton.prototype.hideLayer=function(){this.tip.fadeOut();this.widget.removeClass('on');}
EnhQuestionButton.prototype.toggleLayer=function(){if(this.tip.css('display')=='none'){this.tip.show();this.widget.addClass('on');}else{this.tip.fadeOut();this.widget.removeClass('on');}}
function EnhStatusFieldEditor(parent,style){this.style=style||{};this.className=this.style.className||'TaskStatusFieldEditor';this.widget=$('<div>').addClass(this.className).appendTo(parent);this.statuses={};this.init();}
EnhStatusFieldEditor.prototype.init=function(){this.completeDate=$('<p>').addClass('dueDate').appendTo(this.widget);this.statusViewer=$('<div>').addClass('TaskStatusBox').css('float','left').appendTo(this.widget);this.arrow=$('<a href="javascript:void(0);"></a>').addClass('btn').appendTo(this.widget).on('click',this,function(e){if(e.data.setDiv.css('display')=='none'){$(document).one('click.taskstatus',e.data,function(e){e.data.widget.removeClass('on');e.data.setDiv.hide();});e.data.widget.addClass('on');e.data.setDiv.show();e.stopPropagation();}});this.setDiv=$('<div>').addClass('layer').appendTo(this.arrow);this.ul=$('<ul>').appendTo(this.setDiv);$('<img>').attr('src',JSV.getContextPath('/img/btn_pulldown_arr.png')).appendTo(this.arrow);var options=EnhStatusFieldEditor.enhStatus;var _this=this;$(options).each(function(i){_this.add(this);});this.setEnhEditable(this.style.editable);}
EnhStatusFieldEditor.prototype.setEnhEditable=function(){this.editable=arguments[0]||false;if(this.editable)
this.arrow.show();else
this.arrow.hide();}
EnhStatusFieldEditor.prototype.create=function(){var options=EnhStatusFieldEditor.enhStatus;var _this=this;$(options).each(function(i){_this.add(this);});}
EnhStatusFieldEditor.prototype.add=function(option){var a=$('<a href="javascript:void(0);"></a>').attr('value',option.value).appendTo($('<li>').appendTo(this.ul));$('<span>').addClass('txt').text(option.text).appendTo(a);a.click(this,function(e){var $this=$(this);e.data.value=$this.attr('value');e.data.ul.find('li.selected').removeClass('selected');$this.parent().addClass('selected');e.data.doUpdate();});this.statuses[option.value]=option.text;}
EnhStatusFieldEditor.prototype.setValue=function(value,component){if(value==TaskItem.DRAFT||value==TaskItem.DELETED){this.widget.hide();return;}
this.value=value;this.ul.find('li a[value="'+value+'"]').parent().addClass('selected');this.statusViewer.text(this.statuses[this.value]).removeClass().addClass('TaskStatusBox status'+this.value);if(this.value==TaskItem.COMPLETE){var date=component.getProperty(this.style.completeDate);this.setCompleteDate(date);}else{this.completeDate.hide();}}
EnhStatusFieldEditor.prototype.getValue=function(){return this.value;}
EnhStatusFieldEditor.prototype.setId=function(id){this.id=id;}
EnhStatusFieldEditor.prototype.setCompleteDate=function(date){this.completeDate.text(JSV.getLang('TaskStatusFieldEditor','completeDate')+DateFormat.format(new Date(date),JSV.getLang('DateFormat','dateType1'))).show();}
EnhStatusFieldEditor.prototype.doUpdate=function(){var id=this.id||JSV.getParameter(this.style.attribute);if(this.editable){$.ajax({url:JSV.getModuleUrl(JSV.getContextPath(this.style.action||EnhStatusFieldEditor.action)),type:'POST',dataType:'json',data:{'id':id,'status':this.value},context:this,async:false,success:function(data,status){if(data.error!=undefined){alert(JSV.getLang('TaskEmpsViewer','permissionDenied'));}else{this.onsuccess(data);}},error:function(xhr){this.onerror();}});}}
EnhStatusFieldEditor.prototype.onsuccess=function(data){this.statusViewer.text(this.statuses[this.value]).removeClass().addClass('TaskStatusBox status'+this.value);if(this.value==TaskItem.COMPLETE){this.setCompleteDate(data.completeDate);}else{this.completeDate.hide();}
JSV.notify(this.value,this,'onupdate');}
EnhStatusFieldEditor.prototype.onerror=function(){alert(JSV.getLang('TaskStatusFieldEditor','error'));}
EnhStatusFieldEditor.getStatusButton=function(parent,value){var div=$('<div>').addClass('TaskStatusBox').appendTo(parent);$(EnhStatusFieldEditor.allStatus).each(function(n){if(this.value==value){div.text(this.text).addClass('status'+value);return false;}});return div;}
EnhStatusFieldEditor.action=JSV.getModuleUrl('/jsl/EnhAdmin.UpdateStatus.json');EnhStatusFieldEditor.enhStatus=[{text:JSV.getLang('TaskStatusFieldEditor','stay'),value:TaskItem.STAY,color:'0;#26985d'},{text:JSV.getLang('TaskStatusFieldEditor','doing'),value:TaskItem.DOING,color:'1;#4e6fdc'},{text:JSV.getLang('TaskStatusFieldEditor','comp'),value:TaskItem.COMPLETE,color:'3;#696969'}];function EnhTaskActorColumn(parent,style){this.style=style||{};this.className=this.style.className||'EnhTaskActorColumn';parent.appendChild(this);}
EnhTaskActorColumn.prototype.setValue=function(element,td,tr){var $td=$(td);var id=element[this.style.id||'id'];var json=JSV.loadJSON(EnhTaskActorColumn.ACTORLIST+'?id='+id).array;var name=title=_name=JSV.getLocaleStr(json[0].name);var uid=json[0].id;var cnt=parseInt(element[this.style.cnt||'actorCnt']);if(cnt>1){var nobr=$('<nobr>',{'class':this.className}).appendTo(td);name+='...';title='';nobr.css('cursor','pointer').data({'name':_name,'id':id}).on('click',this,function(e){var $this=$(this);var rId=$(this).data('id');var name=$(this).data('name');if(EnhTaskActorColumn.itemid&&EnhTaskActorColumn.itemid==rId){e.data.changed=false;e.data.toggleList();}else if($this.data('array')){e.data.changed=true;e.data.actorName=name;e.data.actors=$this.data('array');EnhTaskActorColumn.itemid=id;e.data.reloadList($td.children('nobr:first'));}else{$.getJSON(JSV.getContextPath(EnhTaskActorColumn.ACTORLIST+'?id='+id),function(data,status){if(status=='success'){e.data.changed=true;e.data.actorName=name;e.data.actors=data.array;EnhTaskActorColumn.itemid=id;e.data.createList($td.children('nobr:first'));$this.data('array',data.array);}})}
e.stopPropagation();});nobr.text(name||'-').attr('title',title||'');}else{if(cnt>0){var nobr=$('<div>',{'class':this.className}).appendTo(td);if(uid){nobr.append(AnchorEmp.generateAnchor(uid,name));}else{$.getJSON(JSV.getContextPath(EnhTaskActorColumn.ACTORLIST+'?id='+id),function(data,status){if(status=='success'){nobr.append(AnchorEmp.generateAnchor(data.array[0].id,data.array[0].name));}});}}}
$td.attr('align',this.style.align||'center');}
EnhTaskActorColumn.prototype.createList=function(widget){this.createLayer();this.reloadList(widget);}
EnhTaskActorColumn.prototype.reloadList=function(widget){this.addActors();this.setPosition(widget);this.toggleList();}
EnhTaskActorColumn.prototype.createLayer=function(){var widget=$('#EnhTaskActorColumn_moveDiv');this.layer=layer=(widget.length==0)?$('<div>',{id:'EnhTaskActorColumn_moveDiv','class':'EnhTaskActorColumn_moveDiv'}).appendTo('body'):widget;this.layer.bind('click',function(e){e.stopPropagation();});}
EnhTaskActorColumn.prototype.setPosition=function(widget){var ofs=widget.offset();var top=ofs.top+widget.height()+3;var left=ofs.left;this.layer.css({'top':top,'left':left});}
EnhTaskActorColumn.prototype.addActors=function(){var layer=this.layer.empty();$.each(this.actors,function(i){$('<div>').addClass('actors').append(AnchorEmp.generateAnchor(this.id,this.name)).appendTo(layer);});}
EnhTaskActorColumn.prototype.toggleList=function(){var layer=this.layer;if(layer.is(':visible')&&!this.changed){this.hideList();}else{layer.show();$(document).one('click.EnhTaskActorColumn',this,function(e){e.data.hideList();});}}
EnhTaskActorColumn.prototype.hideList=function(){this.layer.fadeOut();}
EnhTaskActorColumn.ACTORLIST='/jsl/EnhUser.GetMbrs.json';function EnhTaskChargeFieldEditor(parent,style){this.style=style||{};this.parent=parent;this.className=this.style.className||'TaskChargeFieldEditor';this.widget=$('<table cellpadding="0" cellspacing="0" border="0"><tr>\
   <td class="left"></td><td class="right"></td>\
   </tr></table>').addClass(this.className).appendTo(this.parent).get(0);this.radios=new RadioImageGroupFieldEditor(this.widget.rows[0].cells[0],{options:EnhTaskChargeFieldEditor.OPTIONS});this.radios.onclick=function(value){$.data(EnhTaskChargeFieldEditor,'component').onclick(value);}
this.dprtArea=$('<span>').appendTo(this.widget.rows[0].cells[1]).hide();this.projectArea=$('<span>').appendTo(this.widget.rows[0].cells[1]).hide();this.dprtEditor=new FolderCompositeEditor(this.dprtArea.get(0),this.style.dprt);this.projectEditor=new FolderCompositeEditor(this.projectArea.get(0),this.style.project);this.type=null;$.data(EnhTaskChargeFieldEditor,'component',this);}
EnhTaskChargeFieldEditor.prototype.setValue=function(value){this.type=EnhTaskChargeFieldEditor.getType(value);if(this.type==EnhTaskChargeFieldEditor.DRPT.value){this.radios.setValue(EnhTaskChargeFieldEditor.DRPT.value);this.dprtEditor.setValue({id:value[EnhTaskChargeFieldEditor.DRPT.id],path:[JSV.getLocaleStr(value[EnhTaskChargeFieldEditor.DRPT.name])]});this.dprtArea.show();this.projectArea.hide();}else{this.radios.setValue(EnhTaskChargeFieldEditor.PROJECT.value);this.projectEditor.setValue({id:value[EnhTaskChargeFieldEditor.PROJECT.id],path:[JSV.getLocaleStr(value[EnhTaskChargeFieldEditor.PROJECT.name])]});this.projectArea.show();this.dprtArea.hide();}}
EnhTaskChargeFieldEditor.prototype.getValue=function(){if(this.type==EnhTaskChargeFieldEditor.DRPT.value){var value=this.dprtEditor.getValue();if(value.id&&value.path)return[value.id,value.path[value.path.length-1],,];}else{var value=this.projectEditor.getValue();if(value.id&&value.path)return[value.id,value.path[value.path.length-1],,];}
return[,,,];}
EnhTaskChargeFieldEditor.prototype.validate=function(metadata){if(this.type==EnhTaskChargeFieldEditor.DRPT.value){var value=this.dprtEditor.getValue();if(value.id&&value.path)
return null;else
return JSV.getLang('EnhTaskChargeFieldEditor','dprtError');}else{var value=this.projectEditor.getValue();if(value.id&&value.path)
return null;else
return JSV.getLang('EnhTaskChargeFieldEditor','projectError');}
return metadata.message;}
EnhTaskChargeFieldEditor.prototype.focus=function(){this.title.focus();}
EnhTaskChargeFieldEditor.prototype.onclick=function(value){if(value==EnhTaskChargeFieldEditor.DRPT.value){this.type=EnhTaskChargeFieldEditor.DRPT.value;this.dprtArea.show();this.projectArea.hide();}else{this.type=EnhTaskChargeFieldEditor.PROJECT.value;this.dprtArea.hide();this.projectArea.show();}}
EnhTaskChargeFieldEditor.getType=function(value){if(value[EnhTaskChargeFieldEditor.DRPT.id]&&value[EnhTaskChargeFieldEditor.DRPT.name]){return EnhTaskChargeFieldEditor.DRPT.value;}else if(value[EnhTaskChargeFieldEditor.PROJECT.id]&&value[EnhTaskChargeFieldEditor.PROJECT.name]){return EnhTaskChargeFieldEditor.PROJECT.value;}else{return EnhTaskChargeFieldEditor.NONE;}}
EnhTaskChargeFieldEditor.NONE=null;EnhTaskChargeFieldEditor.DRPT={value:0,id:'chargeDprtId',name:'chargeDprtName'}
EnhTaskChargeFieldEditor.PROJECT={value:1,id:'chargeProjectId',name:'chargeProjectName'}
EnhTaskChargeFieldEditor.OPTIONS=EnhTaskChargeFieldEditor.DRPT.value+':'+JSV.getLang('EnhTaskChargeFieldEditor','dprt')+','+EnhTaskChargeFieldEditor.PROJECT.value+':'+JSV.getLang('EnhTaskChargeFieldEditor','project');function EnhTaskColumn(parent,style){this.parent=parent;this.style=style||{};this.options=ComboViewer.createOptions(this.style);this.className=this.style.className||'EnhTaskColumn';parent.appendChild(this);}
EnhTaskColumn.prototype.setValue=function(element,td,tr){var att=element[this.style.attribute];var title=element[this.style.title];var combo=(null!=att)?ComboColumn.LabelProvider(this.options[att]):'';var href=(this.style.href&&element)?JSV.merge(this.style.href,element):'';$('<div>').addClass(this.className).appendTo(td).attr('align',this.style.align||'center').html('['+combo+']'+title).on('click',this,function(e){e.preventDefault();e.data.onclick(element,href);});}
EnhTaskColumn.prototype.onclick=function(element,href){JSV.doPOST(href);}
function EnhTaskEmpsViewer(parent,style){this.style=style||{};this.id=this.style.id||'';this.className=this.style.className||'EnhTaskEmpsViewer';this.widget=$('<table cellpadding="0" cellspacing="0" border="0"><tr>\
   <td class="empLeft"></td><td class="empRight"></td>\
   </tr></table>').addClass(this.className).appendTo(parent);this.empsViewer=new EnhMbrsHtmlViewer(this.widget.find('.empLeft').get(0),this.style);this.empsEditor=new KButton(this.widget.find('.empRight').get(0),JSV.getLang('TaskEmpsViewer','changeActor'));this.empsEditor.id=this.id;this.editable=function(){var component=$.data(EnhTaskEmpsViewer,'component'+this.id);component.addUser();}
this.notEditable=function(msg){alert(msg);return;}
$.data(EnhTaskEmpsViewer,'component'+this.id,this);this.setEditable(this.style.editable);this.setVisible(this.style.editable);}
EnhTaskEmpsViewer.prototype.setEditable=function(editable,resMsg){var notEditable=this.notEditable;if(editable){this.empsEditor.onclick=this.editable;}else{this.empsEditor.onclick=function(){notEditable(resMsg);}}}
EnhTaskEmpsViewer.prototype.setVisible=function(visible){visible?this.empsEditor.show():this.empsEditor.hide();}
EnhTaskEmpsViewer.prototype.setValue=function(value){this.value=value;this.empsViewer.setValue(value);JSV.notify(this.value,this,'onupdate');}
EnhTaskEmpsViewer.prototype.getActors=function(){return this.value;}
EnhTaskEmpsViewer.prototype.includedMe=function(){var userId=this.style.userId,result=false;$(this.value).each(function(i){if(userId==this.id)result=true;});return result;}
EnhTaskEmpsViewer.prototype.size=function(){return this.value.length;}
EnhTaskEmpsViewer.prototype.setId=function(id){this.itemId=id;}
EnhTaskEmpsViewer.prototype.addUser=function(){var editor=EmpsFieldEditor.getObject(this.id);editor.editor=this;editor.validator=function(model){var result={};if(model.length){result.result=true;}else{result.result=false;result.msg=JSV.getLang('TaskEmpsViewer','atLeastOneActor');}
return result;}
editor.onok=function(value){var model=JSV.clone(value);this.editor.doUpdate(model);}
editor.getData=function(){return this.value;}
EmpsFieldEditor.showPopup(this.value,null,this.id);return false;}
EnhTaskEmpsViewer.prototype.doUpdate=function(users){var value=[];var component=this;var id=this.itemId||JSV.getParameter(this.style.attribute);$(users).each(function(i){value.push(this.id);});$.ajax({url:JSV.getContextPath(this.style.action||EnhTaskEmpsViewer.action),type:'POST',dataType:'json',data:{'id':id,'users':value.join(',')},async:false,success:function(data,status){if(data.result=='true'){component.setValue(users);JSV.notify(users,component,'onupdate');}else if(data.error!=undefined){alert(JSV.getLang('TaskEmpsViewer','permissionDenied'));}},error:function(xhr){alert(JSV.getLang('TaskStatusFieldEditor','error'));}});}
EnhTaskEmpsViewer.prototype.isSingleActor=function(){return this.includedMe()&&(this.size()==1);}
EnhTaskEmpsViewer.action='/jsl/TaskActor.UpdateActor.json';function EnhTaskStatusColumn(parent,style){this.parent=parent;this.style=style||{};parent.appendChild(this);}
EnhTaskStatusColumn.prototype.setValue=function(element,td,tr){var att=element[this.style.attribute];$(td).attr('align',this.style.align||'center');var statusButton=TaskStatusFieldEditor.getStatusButton(td,att);if(att==TaskItem.COMPLETE){var completeText=JSV.getLang('TaskStatusFieldEditor','completeDate')
+': '+DateFormat.format(new Date(element[this.style.completeDate]),JSV.getLang('DateFormat','fullType1'));new EnhQuestionButton(td,{'element':statusButton,'title':'','text':completeText,'autoHide':true,'hideTime':5}).widget.css('margin','0px');}}
function EnhTaskStatusFieldEditor(parent,style){this.style=style||{};this.className=this.style.className||'EnhTaskStatusFieldEditor';this.widget=$('<div>').addClass(this.className).appendTo(parent);this.statuses={};this.init();}
EnhTaskStatusFieldEditor.prototype.init=function(){this.completeDate=$('<p>').addClass('dueDate').appendTo(this.widget);this.statusViewer=$('<div>').addClass('EnhTaskStatusBox').css('float','left').appendTo(this.widget);this.arrow=$('<a href="javascript:void(0);"></a>').addClass('btn').appendTo(this.widget).on('click',this,function(e){if(e.data.setDiv.css('display')=='none'){$(document).one('click.enhtaskstatus',e.data,function(e){e.data.widget.removeClass('on');e.data.setDiv.hide();});e.data.widget.addClass('on');e.data.setDiv.show();e.stopPropagation();}});this.setDiv=$('<div>').addClass('layer').appendTo(this.arrow);this.ul=$('<ul>').appendTo(this.setDiv);$('<img>').attr('src',JSV.getContextPath('/img/btn_pulldown_arr.png')).appendTo(this.arrow);var options=EnhTaskStatusFieldEditor.enhStatus;var _this=this;$(options).each(function(i){_this.add(this);});this.setEnhEditable(this.style.editable);}
EnhTaskStatusFieldEditor.prototype.setEnhEditable=function(){this.editable=arguments[0]||false;if(this.editable)
this.arrow.show();else
this.arrow.hide();}
EnhTaskStatusFieldEditor.prototype.create=function(){var options=EnhTaskStatusFieldEditor.enhStatus;var _this=this;$(options).each(function(i){_this.add(this);});}
EnhTaskStatusFieldEditor.prototype.add=function(option){var a=$('<a href="javascript:void(0);"></a>').attr('value',option.value).appendTo($('<li>').appendTo(this.ul));$('<span>').addClass('txt').text(option.text).appendTo(a);a.click(this,function(e){var $this=$(this);e.data.value=$this.attr('value');e.data.ul.find('li.selected').removeClass('selected');$this.parent().addClass('selected');e.data.doUpdate();});this.statuses[option.value]=option.text;}
EnhTaskStatusFieldEditor.prototype.setValue=function(value,component){if(value==TaskItem.DRAFT||value==TaskItem.DELETED){this.widget.hide();return;}
this.value=value;this.ul.find('li a[value="'+value+'"]').parent().addClass('selected');this.statusViewer.text(this.statuses[this.value]).removeClass().addClass('EnhTaskStatusBox status'+this.value);if(this.value==TaskItem.COMPLETE){var date=component.getProperty(this.style.completeDate);this.setCompleteDate(date);}else{this.completeDate.hide();}}
EnhTaskStatusFieldEditor.prototype.getValue=function(){return this.value;}
EnhTaskStatusFieldEditor.prototype.setId=function(id){this.id=id;}
EnhTaskStatusFieldEditor.prototype.setCompleteDate=function(date){this.completeDate.text(JSV.getLang('TaskStatusFieldEditor','completeDate')+DateFormat.format(new Date(date),JSV.getLang('DateFormat','dateType1'))).show();}
EnhTaskStatusFieldEditor.prototype.doUpdate=function(){var id=this.id||JSV.getParameter(this.style.attribute);if(this.editable){$.ajax({url:JSV.getModuleUrl(JSV.getContextPath(this.style.action||EnhTaskStatusFieldEditor.action)),type:'POST',dataType:'json',data:{'id':id,'status':this.value},context:this,async:false,success:function(data,status){if(data.error!=undefined){alert(JSV.getLang('TaskEmpsViewer','permissionDenied'));}else{this.onsuccess(data);}},error:function(xhr){this.onerror();}});}}
EnhTaskStatusFieldEditor.prototype.onsuccess=function(data){this.statusViewer.text(this.statuses[this.value]).removeClass().addClass('EnhTaskStatusBox status'+this.value);if(this.value==TaskItem.COMPLETE){this.setCompleteDate(data.completeDate);}else{this.completeDate.hide();}
JSV.notify(this.value,this,'onupdate');}
EnhTaskStatusFieldEditor.prototype.onerror=function(){alert(JSV.getLang('TaskStatusFieldEditor','error'));}
EnhTaskStatusFieldEditor.getStatusButton=function(parent,value){var div=$('<div>').addClass('EnhTaskStatusBox').appendTo(parent);$(EnhTaskStatusFieldEditor.allStatus).each(function(n){if(this.value==value){div.text(this.text).addClass('status'+value);return false;}});return div;}
EnhTaskStatusFieldEditor.action=JSV.getModuleUrl('/jsl/EnhAdmin.UpdateStatus.json');EnhTaskStatusFieldEditor.enhStatus=[{text:JSV.getLang('TaskStatusFieldEditor','stay'),value:TaskItem.STAY,color:'0;#26985d'},{text:JSV.getLang('TaskStatusFieldEditor','doing'),value:TaskItem.DOING,color:'1;#4e6fdc'},{text:JSV.getLang('TaskStatusFieldEditor','comp'),value:TaskItem.COMPLETE,color:'3;#696969'}];EnhTaskStatusFieldEditor.allStatus=[{text:JSV.getLang('TaskStatusFieldEditor','draft'),value:TaskItem.DRAFT},{text:JSV.getLang('TaskStatusFieldEditor','stay'),value:TaskItem.STAY},{text:JSV.getLang('TaskStatusFieldEditor','inquiry'),value:TaskItem.INQUIRY},{text:JSV.getLang('TaskStatusFieldEditor','doing'),value:TaskItem.DOING},{text:JSV.getLang('TaskStatusFieldEditor','comp'),value:TaskItem.COMPLETE},{text:JSV.getLang('TaskStatusFieldEditor','stop'),value:TaskItem.STOP},{text:JSV.getLang('TaskStatusFieldEditor','hold'),value:TaskItem.HOLD},{text:JSV.getLang('TaskStatusFieldEditor','delete'),value:TaskItem.DELETED}];function EnhTextFieldEditor(parent,style){this.style=style||{};this.prefix=this.style.prefix||'';this.className=this.style.className||'TextFieldEditor';this.notice=JSV.getLang('EnhTextFieldEditor','guide');var table=$('<table cellSpacing="0" cellPadding="0">\
   <tr class="tr">\
    <td class="editor" style="width:100px;"></td>\
    <td class="notice" style="padding-left:10px;"></td>\
   </tr></table>\
  ').addClass(this.className).appendTo(parent).get(0);this.noticeTd=$(table.rows[0].cells[1]).text(this.notice).get(0);this.widget=$('<input type="text">').addClass(this.className).addClass(this.className+'_normal').appendTo(table.rows[0].cells[0]).bind('keydown',this,function(e){if(e.data.onkeydown)
e.data.onkeydown(e);if(e.keyCode==13)return false;}).bind('keyup',this,function(e){if(e.data.onkeyup)
e.data.onkeyup(e);if(e.keyCode==13)return false;}).bind('focus',this,function(e){$(this).removeClass(e.data.className+'_normal').addClass(e.data.className+'_focus');e.data.onfocus(e);}).bind('blur',this,function(e){$(this).removeClass(e.data.className+'_focus').addClass(e.data.className+'_normal');e.data.onfocusout(e);}).bind('click',this,function(e){if(e.data.onclick)
e.data.onclick(e);});if(this.style.readOnly=='true'){this.widget.prop('readOnly',true).addClass(this.className+'_readOnly');}else{this.widget.removeProp('readOnly').removeClass(this.className+'_readOnly');}
this.onEvent=true;if(this.style.width)
this.widget.width(this.style.width);if(this.style.value)
this.widget.val(this.prefix+this.style.value);if(this.style.maxLength)
this.widget.attr('maxLength',this.style.maxLength);if(this.style.imeMode)
this.widget.css('imeMode',this.style.imeMode);if(this.style.autoComplete){JSV.register(new AutoComplete(this.widget.get(0),this),this,'autoComplete');}}
EnhTextFieldEditor.prototype.setValue=function(value){if(value!=null){this.setOriginal(this.prefix+value);}else if(this.style.example){this.setExam();}else{this.widget.val('');}
JSV.notify(value,this);}
EnhTextFieldEditor.prototype.getValue=function(){if(this.style.example&&this.onEvent){return'';}
return $.trim(this.widget.val());}
EnhTextFieldEditor.prototype.focus=function(){this.widget.focus();}
EnhTextFieldEditor.prototype.onfocus=function(){if(this.preFocus){this.preFocus();}
if(this.style.example&&this.onEvent){this.setOriginal('');}}
EnhTextFieldEditor.prototype.onfocusout=function(){if(this.preFocusout){this.preFocusout();}
if(this.style.example&&this.getValue()==''){this.setExam();}}
EnhTextFieldEditor.prototype.setMaxlength=function(maxLength){this.widget.attr('maxLength',maxLength);}
EnhTextFieldEditor.prototype.setReadOnly=function(value){if(value){this.widget.prop('readOnly',true).addClass(this.className+'_readOnly');}else{this.widget.removeProp('readOnly').removeClass(this.className+'_readOnly');}}
EnhTextFieldEditor.prototype.setEditable=function(value){this.widget.attr('disabled',!value);}
EnhTextFieldEditor.prototype.setExam=function(){this.widget.val(this.style.example).removeClass(this.className+'_original').addClass(this.className+'_exam');this.onEvent=true;}
EnhTextFieldEditor.prototype.setOriginal=function(value){this.widget.val(value).removeClass(this.className+'_exam').addClass(this.className+'_original');this.onEvent=false;}
EnhTextFieldEditor.prototype.autoComplete=function(value,observable){this.setValue(value);}
function EnhWebzineColumn(parent,style){this.style=style||{};this.className=this.style.className||'EnhWebzineColumn';this.comment=this.style.comment||'';this.prtContentLine=this.style.prtContentLine||3;this.attr=this.style.attribute?this.style.attribute.split(','):'';this.titleRender=this.style.titleRender||'EnhWebzineColumnStrRender';this.status=this.style.status?this.style.status.split(','):'';this.img=this.style.img||'';this.contentHighlight=(this.style.contentHighlight=='false')?false:true;this.showContent=(this.style.showContent=='true')?true:false;parent.appendChild(this);}
EnhWebzineColumn.prototype.onclick=function(href){JSV.doPOST(href);}
EnhWebzineColumn.prototype.setValue=function(element,td,tr){var table=$('<table>').addClass(this.className).appendTo(td);var titleTr=$('<tr class="titleTr">').appendTo(table);var contentTr=$('<tr class="contentTr">').appendTo(table);var tagsTr=$('<tr class="tagsTr">').appendTo(table);var titleTd=$('<td class="titleTd">').appendTo(titleTr);var contentTd=$('<td class="contentTd">').appendTo(contentTr);var tagsTd=$('<td class="tagsTd">').appendTo(tagsTr);this.setTitle(titleTd,element);this.setContent(contentTd,element);this.setTags(tagsTd,element);}
EnhWebzineColumn.prototype.setTitle=function(parent,element){var title=element[this.attr[0]]||'';var preSize=this.setPre(parent,element);var titleColumn=$('<a>').addClass('titleA').attr({'title':title,'href':JSV.mergeXml(this.style.href,element)}).appendTo(parent).bind('click',this,function(e){e.data.onclick(this.href);return false;});preSize+=this.setPost(parent,element);var titleSize=parseInt($(parent).width())-preSize;var titleText=EnhWebzineColumn.abbreviateString(title,titleSize);titleText=JSV.escapeHtml(titleText);var clazz=eval(this.titleRender);titleText=new clazz(titleText,element,this.style).getValue();titleColumn.html(titleText);}
EnhWebzineColumn.prototype.setContent=function(parent,element){var content=(element[this.attr[1]])?EnhWebzineColumn.removeTag(element[this.attr[1]]):'';content=EnhWebzineColumn.abbreviateString(content,parseInt($(parent).width())*parseInt(this.prtContentLine));$('<a>').addClass('contentA').attr('href',JSV.mergeXml(this.style.href,element)).html(content).bind('click',this,function(e){e.data.onclick(this.href);return false;}).appendTo(parent);}
EnhWebzineColumn.prototype.setTags=function(parent,element){var tags=(element[this.attr[2]])?element[this.attr[2]].split(', '):{};if(tags.length>0){for(var i=0;i<tags.length;i++){var clazz=eval(this.titleRender);var tag=new clazz(JSV.escapeHtml(tags[i]),element,this.style).getValue();$('<a>').addClass('tagsA').html(tag).bind('click',function(e){JSV.setState('com.kcube.doc.list','1.10..mod_'+$(this).text());JSV.doGET('usr.main.jsp');}).appendTo(parent);if(i!=tags.length-1){$(document.createTextNode(', ')).appendTo(parent);}}
$(parent).attr('align',this.align);}else{parent.parent().hide();}}
EnhWebzineColumn.prototype.setPre=function(parent,element){if(this.status!=''&&this.imgSrc!=''&&element[this.status[0]]==this.status[1]){return $('<img>').addClass('icon').attr('src',JSV.getLocaleImagePath(this.img)).appendTo(parent).width();}
return 0;}
EnhWebzineColumn.prototype.setPost=function(parent,element){var count=0;if(this.style.opnCnt){var opnCnt=element[this.style.opnCnt];var id=element['id'];if(opnCnt>0){var opn=$('<font>').addClass('opnFont').appendTo(parent);if(this.style.opnView&&this.style.opnDelete){opn.html(' &nbsp;['+opnCnt+']');opn.bind('click',this,function(e){e.data.style.id=id;OpnViewer.showPopup(e.data.style);return false;});}else{opn.html(' &nbsp;['+opnCnt+']');}
count++;}}
return count*22;}
EnhWebzineColumn.removeTag=function(value){return value.replace(/\n/gi," ").replace(/<SCRIPT.*?\/SCRIPT>.*?/gi,"").replace(/<STYLE.*?\/STYLE>.*?/gi,"").replace(/<.*?>.*?/gi,"");}
EnhWebzineColumn.abbreviateString=function(str,size){var l=0;var newStr='';for(var i=0;i<str.length;i++){if(str.charCodeAt(i)>128)l+=13;if(str.charCodeAt(i)<=128&&str.charCodeAt(i)>96)l+=7;if(str.charCodeAt(i)<=96&&str.charCodeAt(i)>64)l+=9;if(str.charCodeAt(i)<=64)l+=6;if(l<size-24)newStr+=str.charAt(i);}
if(l>size-24)newStr=newStr+'...';return newStr;}
function EnhWebzineColumnStrRender(str,element,style){this.str=str;this.element=element;this.style=style;}
EnhWebzineColumnStrRender.prototype.getValue=function(){var ts=JSV.getParameter(this.style.ts?this.style.ts:'com.kcube.doc.list');if(ts){var i=ts.lastIndexOf('.');var search=ts.substring(i+1);if(search!=''){var arr=search.split('_');var attrArr=this.style.attribute.split(',');if(attrArr.indexOf(arr[0])>=0){return this.highlighting(this.str,arr[1]);}}}
return this.str;}
EnhWebzineColumnStrRender.prototype.highlighting=function(value,highlight){if(value!=null&&highlight!=null){highlight=JSV.escapeHtml(highlight).replace(/([#$^*=+|:?(){}.'\\])/,"\\$1");var RegExp=eval("/("+highlight+")/gi");var emphasis="<font class='highlightFont'>$1</font>";value=value.replace(RegExp,emphasis);}
return value;}
function ProjectFolderFieldEditor(parent,style){this.style=style?style:{};this.buttonImg=this.style.img?this.style.img:JSV.getLang('FolderFieldEditor','selectMapIcon');this.msg=this.style.msg?this.style.msg:JSV.getLang('FolderFieldEditor','selectMapMsg');this.url=this.style.url?this.style.url:'/jsl/FolderSelector.ListByUser.xml?rootId=';this.isOrgType=this.style.typeOrg=='true'?true:false;this.scrtCode=this.style.scrtCode?this.style.scrtCode:null;this.button=new KButton(parent,this.buttonImg);this.button.editor=this;this.button.onclick=function(){var editor=this.editor;ProjectFolderFieldEditor.showProjectDialog(function(folder){if(folder)
editor.setValue(folder);},this.style.useLocalLang);return false;};this.viewers=new Array();}
ProjectFolderFieldEditor.prototype.onclick=function(){this.button.onclick();}
ProjectFolderFieldEditor.prototype.setAxisList=function(axisList){this.button.axisList=axisList;}
ProjectFolderFieldEditor.prototype.setRootId=function(rootId){this.button.rootId=rootId;}
ProjectFolderFieldEditor.prototype.setValue=function(folder){this.folder=folder;this.button.selectedId=folder?folder.id:null;JSV.notify(folder,this);}
ProjectFolderFieldEditor.prototype.getValue=function(){return this.folder;}
ProjectFolderFieldEditor.showDialog=function(rootId,selectedId,msg,axisList,url,scrtCode,callBack){var sUrl=JSV.getContextPath('/enh/js/EnhRadioFieldSelectorDialog.jsp?nYear=@{nYear}');var aArguments=[rootId,selectedId,msg?msg:JSV.getLang('FolderFieldEditor','selectMapMsg'),axisList,scrtCode];var sFeatures='dialogWidth:850px;dialogHeight:640px;scroll:yes;status:no;resizable:no;';JSV.showModalDialog(sUrl,aArguments,sFeatures,function(folder){var newFolder=ProjectFolderFieldEditor.copyFolder(folder);callBack(newFolder);});}
ProjectFolderFieldEditor.showProjectDialog=function(callBack,useLocal){var sUrl=JSV.getContextPath('/enh/js/EnhRadioFieldSelectorDialog.jsp');var aArguments=nYear?[nYear]:null;var sFeatures='dialogWidth:850px;dialogHeight:640px;scroll:yes;status:no;resizable:no;';JSV.showModalDialog(sUrl,aArguments,sFeatures,function(folder){var newFolder=ProjectFolderFieldEditor.copyFolder(folder);callBack(newFolder);});}
ProjectFolderFieldEditor.copyFolder=function(oldFolder){if(oldFolder==null){return null;}
var newFolder={};newFolder.id=oldFolder.id;newFolder.path=[].concat(oldFolder.name);return newFolder;}
function TabSortAdmin(parent,style){this.style=style||{};this.readUrl=this.style.readUrl;this.tabUrl=this.style.tabUrl;this.writeUrl=this.style.writeUrl;this.isManager=(null!=this.style.isManager)?eval(this.style.isManager):false;this.isUsr=(null!=this.style.isUsr)?eval(this.style.isUsr):false;this.className=this.style.className||'ModGroupTopMenuAdmin';this.widget=$('<div>').addClass(this.className).css({'overflow-x':'auto'}).appendTo(parent);this.table=$('<table cellspacing="0" cellpadding="0">').addClass('menuTable').appendTo(this.widget);var menuTr=$('<tr>').appendTo(this.table);this.tabTd=$('<td>').addClass('menuTd').appendTo(menuTr);this.toolTd=$('<td>').addClass('menuTd').appendTo(menuTr);this.tabArea=$('<table>').addClass('tableArea').css({'border-spacing':'0px'}).appendTo(this.tabTd);this.toolArea=$('<table>').addClass('tableArea').css({'border-spacing':'0px'}).appendTo(this.toolTd);}
TabSortAdmin.prototype.setValue=function(value){var count=value.length;JSV.notify(count,this,'updateCount');this.value=value;this.load();}
TabSortAdmin.prototype.load=function(){var obj=this;if(!this.menuArea){if(this.isManager){this.menuArea=$('<tr>').addClass('menuArea').appendTo(this.tabArea).sortable({axis:'x',tolerance:'pointer',opacity:0.5,start:function(event,ui){},stop:function(event,ui){var ctx=new Object();ctx.item=obj.getJSON();JslAction.call(JSV.getModuleUrl('/jsl/EnhModUser.UpdateModSortAdmin.jsl'),ctx,tabSortAdminReload);}}).disableSelection();}else{this.menuArea=$('<tr>').addClass('menuArea').appendTo(this.tabArea);}}
$(this.value).each(function(n){this.method='edit';obj.addMenu(this,n);});if(this.isUsr){var addTd=$('<td>').addClass('header').css({'border':'none','cursor':'pointer','padding':'5px 10px 0px 10px'}).attr('enhid',JSV.getParameter('id')).attr('title',JSV.getLang('TabSortAdmin','help')).appendTo(this.menuArea);$('<img>').addClass('plus').attr('src',JSV.getContextPath('/img/component/maintitleviewer/btn_slot_folded.gif')).appendTo(addTd);$(addTd).bind('click',this,function(e){if(e.data.writeBtnClick){e.data.writeBtnClick();}});}}
TabSortAdmin.SelectId=null;TabSortAdmin.prototype.addMenu=function(menu,index){var readUrl=this.readUrl;var tabUrl=this.tabUrl;var isDel=false;if(this.isManager){var tableTd=$('<td nowrap>').addClass('header').attr('id',menu.id).attr('enhid',menu.enhId).attr('seq',menu.seqOrder).appendTo(this.menuArea);}else{var tableTd=$('<td nowrap>').addClass('header').css({'cursor':'pointer'}).attr('id',menu.id).attr('enhid',menu.enhId).attr('seq',menu.seqOrder).appendTo(this.menuArea);}
var titleDiv=$('<div>').addClass('title').text(menu.title).appendTo(tableTd);if(this.isManager){$('<img>').addClass('minus').css({'cursor':'pointer','height':'11px','width':'11px','margin-left':'5px'}).attr('src',JSV.getContextPath('/img/component/plan/btn_close.gif')).appendTo(titleDiv).bind('click',this,function(e){if(confirm(JSV.getLang('TabSortAdmin','del'))){var ctx=new Object();JslAction.call(JSV.getModuleUrl('/jsl/EnhModUser.DoRemove.jsl?modid='+menu.id),ctx,function(){tabSortAdminReload(menu.id);e.data.seqHover(menu.seqOrder,menu.enhId);});}
isDel=true;});}
$.data(tableTd.get(0),'menu',menu);$(tableTd).bind('click',this,function(e){if(!isDel){var url;if($(this).attr('id')=='k'+JSV.getParameter('id')){url=readUrl;}else{e.data.valueHover($(this).attr('id'));url=tabUrl;}
if(JSV.getParameter('tr')){JSV.setState('tr',JSV.getParameter('tr'));}
JSV.setState('modid',$(this).attr('id'));JSV.setState('enhid',$(this).attr('enhid'));JSV.setState('com.kcube.doc.list',null);JSV.doGET(url,'modReadFrame');}
isDel=false;});if(TabSortAdmin.SelectId!=null&&tableTd.attr('id')==TabSortAdmin.SelectId){tableTd.trigger('click');}else if(index==0){tableTd.trigger('click');}}
TabSortAdmin.prototype.reset=function(){this.menuArea.empty();this.setValue(this.value);}
TabSortAdmin.prototype.isExists=function(obj){var exists=false;this.menuArea.find('.header').each(function(n){var menu=$.data(this,'menu');if('delete'!=menu.method&&menu.url==obj.url){exists=true;}});return exists;}
TabSortAdmin.prototype.getVisibleCount=function(){var cnt=0;this.menuArea.find('.header').each(function(n){var menu=$.data(this,'menu');if('delete'!=menu.method){cnt++;}});return cnt;}
TabSortAdmin.prototype.getJSON=function(){var obj=new Object();obj.modList=[];this.menuArea.find('.header').each(function(n){var menuIndex=n;var menu=$.data(this,'menu');if(menu){if('delete'!=menu.method){menu.seqOrder=menuIndex;if(menu.id){obj.modList.push(menu);}}}});return JSV.toJSON(obj);}
TabSortAdmin.prototype.valueHover=function(id){this.menuArea.find('td[id='+id+']').addClass('clicked').siblings('.clicked').removeClass('clicked');}
TabSortAdmin.prototype.seqHover=function(seq,enhId){if(seq>0){var seq=seq-1;var modid=this.menuArea.find('td[seq='+seq+']').attr('id');if(modid!=null){JSV.doGET(this.tabUrl+'?modid='+modid,'modReadFrame');this.menuArea.find('td[seq='+seq+']').addClass('clicked').siblings('.clicked').removeClass('clicked');}else{tabRefresh(enhId);JSV.doGET('about:blank','modReadFrame');}}else{var seq=seq;var modid=this.menuArea.find('td[seq='+seq+']').attr('id');if(modid!=null){JSV.doGET(this.tabUrl+'?modid='+modid,'modReadFrame');this.menuArea.find('td[seq='+seq+']').addClass('clicked').siblings('.clicked').removeClass('clicked');}else{tabRefresh(enhId);JSV.doGET('about:blank','modReadFrame');}}}
TabSortAdmin.prototype.admRomove=function(seq,enhId){var modid=this.menuArea.find('td[seq='+seq+']').attr('id');if(modid==null){tabRefresh(enhId);JSV.doGET('about:blank','modReadFrame');}}
function TableRows(parent,style){this.style=style||{};this.name=this.style.name||null;this.className=this.style.className||'TableRows';this.options=this.style.rows?this.style.rows:JSV.getLang('TableRows','rows');this.rows=this.options.split(',');var span=$('<span>').addClass(this.className).appendTo(parent).get(0);if(this.rows.length>1){this.widget=new ComboFieldEditor(span,this.style);$(this.widget.widget).addClass('optList');this.widget.component=this;this.widget.onchange=function(value){this.component.notify(value);}
this.widget.init(this.rows);}}
TableRows.prototype.getInitial=function(){if(this.name&&JSV.getCookie(this.name)){return parseInt(JSV.getCookie(this.name));}else{var initValue=this.rows[0].split(':');return initValue[0];}}
TableRows.prototype.setValue=function(value){if(this.rows.length>1){this.widget.setValue(value);}}
TableRows.prototype.notify=function(value){if(this.name){JSV.setCookie(this.name,value);}
JSV.notify(parseInt(value),this);}
function SearchPage(parent,style){this.style=style||{};this.className=this.style.className||'SearchPage';this.widget=$('<div>').addClass(this.className).appendTo(parent);this.main=$('<div>').addClass('btnWrapper').appendTo(this.widget);this.shadow=$('<div>').addClass(this.className+'_shadow').appendTo(parent);if(this.style.options){this.combo=$('<div>').addClass('roundWrapper').appendTo(this.main);var options=style.options.split(',');for(var i=0;i<options.length;i++){var option=options[i].split(':');var anchor=$('<a  hidefocus="true"></a>').attr('type',option[0]).addClass('roundOff').html(option[1]).appendTo(this.combo).bind('click',this,function(event){event.data.combo.find('a').removeClass('roundOn').addClass('roundOff');$(this).removeClass('roundOff').addClass('roundOn');event.data.type=$(this).attr('type');});if(this.style.type&&option[0]==this.style.type){this.type=this.style.type;anchor.click();}}
$('<img>').addClass('grayBar').attr('src',JSV.getContextPath('/sys/jsv/header/gray_bar3.gif')).appendTo(this.main);}
this.init();}
SearchPage.prototype.getValue=function(){return this.type;}
SearchPage.prototype.init=function(){this.btns=$('<div>').addClass('btns').appendTo(this.main);$('<a hidefocus="true"></a>').addClass('btnMiddle').attr({'href':'javascript:change_bcrd("all","")','val':'all'}).html(JSV.getLang('Search','all')).appendTo(this.btns);if(this.style.locale=='ko'){$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("'+JSV.getLang('Search','jaum01')+'","'+JSV.getLang('Search','jaum02')+'")','val':JSV.getLang('Search','jaum01')}).html(JSV.getLang('Search','chosung01')).appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("'+JSV.getLang('Search','jaum02')+'","'+JSV.getLang('Search','jaum03')+'")','val':JSV.getLang('Search','jaum02')}).html(JSV.getLang('Search','chosung02')).appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("'+JSV.getLang('Search','jaum03')+'","'+JSV.getLang('Search','jaum04')+'")','val':JSV.getLang('Search','jaum03')}).html(JSV.getLang('Search','chosung03')).appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("'+JSV.getLang('Search','jaum04')+'","'+JSV.getLang('Search','jaum05')+'")','val':JSV.getLang('Search','jaum04')}).html(JSV.getLang('Search','chosung04')).appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("'+JSV.getLang('Search','jaum05')+'","'+JSV.getLang('Search','jaum06')+'")','val':JSV.getLang('Search','jaum05')}).html(JSV.getLang('Search','chosung05')).appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("'+JSV.getLang('Search','jaum06')+'","'+JSV.getLang('Search','jaum07')+'")','val':JSV.getLang('Search','jaum06')}).html(JSV.getLang('Search','chosung06')).appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("'+JSV.getLang('Search','jaum07')+'","'+JSV.getLang('Search','jaum08')+'")','val':JSV.getLang('Search','jaum07')}).html(JSV.getLang('Search','chosung07')).appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("'+JSV.getLang('Search','jaum08')+'","'+JSV.getLang('Search','jaum09')+'")','val':JSV.getLang('Search','jaum08')}).html(JSV.getLang('Search','chosung08')).appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("'+JSV.getLang('Search','jaum09')+'","'+JSV.getLang('Search','jaum10')+'")','val':JSV.getLang('Search','jaum09')}).html(JSV.getLang('Search','chosung09')).appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("'+JSV.getLang('Search','jaum10')+'","'+JSV.getLang('Search','jaum11')+'")','val':JSV.getLang('Search','jaum10')}).html(JSV.getLang('Search','chosung10')).appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("'+JSV.getLang('Search','jaum11')+'","'+JSV.getLang('Search','jaum12')+'")','val':JSV.getLang('Search','jaum11')}).html(JSV.getLang('Search','chosung11')).appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("'+JSV.getLang('Search','jaum12')+'","'+JSV.getLang('Search','jaum13')+'")','val':JSV.getLang('Search','jaum12')}).html(JSV.getLang('Search','chosung12')).appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("'+JSV.getLang('Search','jaum13')+'","'+JSV.getLang('Search','jaum14')+'")','val':JSV.getLang('Search','jaum13')}).html(JSV.getLang('Search','chosung13')).appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("'+JSV.getLang('Search','jaum14')+'","")','val':JSV.getLang('Search','jaum14')}).html(JSV.getLang('Search','chosung14')).appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnLarge').attr({'href':'javascript:change_bcrd("A","N")','val':'A'}).html('A~M').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnLarge').attr({'href':'javascript:change_bcrd("N","a")','val':'N'}).html('N~Z').appendTo(this.btns);}else{$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("A","B")','val':'A'}).html('A').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("B","C")','val':'B'}).html('B').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("C","D")','val':'C'}).html('C').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("D","E")','val':'D'}).html('D').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("E","F")','val':'E'}).html('E').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("F","G")','val':'F'}).html('F').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("G","H")','val':'G'}).html('G').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("H","I")','val':'H'}).html('H').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("I","J")','val':'I'}).html('I').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("J","K")','val':'J'}).html('J').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("K","L")','val':'K'}).html('K').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("L","M")','val':'L'}).html('L').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("M","N")','val':'M'}).html('M').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("N","O")','val':'N'}).html('N').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("O","P")','val':'O'}).html('O').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("P","Q")','val':'P'}).html('P').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("Q","R")','val':'Q'}).html('Q').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("R","S")','val':'R'}).html('R').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("S","T")','val':'S'}).html('S').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("T","U")','val':'T'}).html('T').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("U","V")','val':'U'}).html('U').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("V","W")','val':'V'}).html('V').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("W","Z")','val':'W'}).html('W').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("X","Y")','val':'X'}).html('X').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("Y","Z")','val':'Y'}).html('Y').appendTo(this.btns);$('<a hidefocus="true"></a>').addClass('btnSmall').attr({'href':'javascript:change_bcrd("Z","ZZ")','val':'Z'}).html('Z').appendTo(this.btns);}
if(this.style.jaum)
this.btns.find('a[val='+this.style.jaum+']').addClass('on');}
SearchPage.prototype.reset=function(jaum){if(this.btns){this.btns.find('a').removeClass('on');this.btns.find('a[val='+jaum+']').addClass('on');}}
function DivHandler(e,div){var posX=e.screenX;var posY=e.screenY;var scrollX=$(document).scrollLeft();var scrollY=$(document).scrollTop();var isDrag=true;$(document).bind('mousemove.humanDrag',div,function(event){if(isDrag){var currentScrollX=$(this).scrollLeft();var currentScrollY=$(this).scrollTop();event.data.style.left=(event.data.offsetLeft+(event.screenX-posX)+(currentScrollX-scrollX))+'px';event.data.style.top=(event.data.offsetTop+(event.screenY-posY)+(currentScrollY-scrollY))+'px';posX=event.screenX;posY=event.screenY;scrollX=currentScrollX;scrollY=currentScrollY;}
return false;});$(document).bind('mouseup.humanDrag',function(event){$(document).unbind('mousemove.humanDrag').unbind('mouseup.humanDrag');isDrag=false;});}
function DuplicateChecker(parent,style){this.style=style||{};this.className=this.style.className||'DuplicateChecker';this.actionUrl=this.style.actionUrl||'';this.maxLength=this.style.maxLength||28;this.attrName=this.style.attrName||'name';this.width=this.style.width;this.checked=false;this.viewer=new TextFieldEditor(parent,this.style);$.data(this.viewer,'editor',this);this.viewer.setMaxlength(this.maxLength);this.makeFadeDiv(parent);this.makeMainDiv(parent);this.viewer.preFocusout=function(){$.data(this,'editor').focusout();}}
DuplicateChecker.prototype.setValue=function(name){this.viewer.setValue(name);}
DuplicateChecker.prototype.getValue=function(){return this.viewer.getValue();}
DuplicateChecker.prototype.validate=function(style){var errors=[];if(this.getValue()==''){errors.push(style.message);}
return errors;}
DuplicateChecker.prototype.setReadOnly=function(value){this.viewer.setReadOnly(value);}
DuplicateChecker.prototype.makeMainDiv=function(parent){this.mainDiv=$('<div>').addClass(this.className).css({'top':150,'left':document.body.clientWidth/2-300}).appendTo(parent).get(0);this.subDiv=$('<div>').addClass('subDiv').appendTo(this.mainDiv).get(0);this.makeBodyDiv(this.subDiv);new RoundedPannel(this.subDiv,{"shape":"all","outerColor":"#F1F1F1","innerColor":"#FFFFFF","options":"border #7fc225"});}
DuplicateChecker.prototype.makeFadeDiv=function(parent){this.fadeIframe=$('<iframe frameBorder="0" scrolling="no"></iframe>').addClass(this.className+'_iframe').css('opacity','0.2').appendTo(parent).get(0);this.fadeDiv=$('<div>').addClass(this.className+'_fadeDiv').css('opacity','0.2').appendTo(parent).get(0);}
DuplicateChecker.prototype.makeBodyDiv=function(parent){var header=this.style.header||'';var comment=this.style.comment||'';var info=this.style.info||JSV.getLang('DuplicateChecker','duplicateInfo');var clazz=this.style.clazz||'PrsnCheck';var bodyDiv=$('<div>').addClass(this.className+'_bodyDiv').html('<div class="bodyChildDiv1">\
    <div class="bodyChildDiv2">\
     <img class="bodyChildImg1" src="'+JSV.getContextPath('/img/btn/ekp/hnm/arrow.gif')+'"></img> '+header+'</div>\
    <div class="bodyChildDiv3">\
     <img class="bodyChildImg2" src="'+JSV.getContextPath('/img/btn/ekp/hnm/close.gif')+'"/>\
    </div>\
   </div>\
   <b class="bodyChildB"></b>\
   <div class="bodyChildDiv4">\
    <img class="bodyChildImg3" src="'+JSV.getContextPath('/img/btn/ekp/hnm/noti.gif')+'"/>&nbsp;<span class="infoSpan">'+info+' </span><span class="commentSpan">'+comment+'</span>&nbsp;&nbsp;<img class="bodyChildImg4" src="'+JSV.getContextPath('/img/btn/ekp/hnm/smile.gif')+'"/>\
   </div>\
   <div class="bodyChildDiv5"></div>').appendTo(parent);var instance=eval(clazz);this.inst=new instance(bodyDiv.find('.bodyChildDiv5').get(0),this);bodyDiv.find('.bodyChildDiv1').bind('mousedown',this.mainDiv,function(event){DivHandler(event,event.data);});bodyDiv.find('.bodyChildDiv2').css('paddingRight',$(this.mainDiv).width()-200);this.closeImg=bodyDiv.find('.bodyChildImg2').bind('click',this,function(event){event.data.setHide();});}
DuplicateChecker.prototype.setBlock=function(){$(this.fadeIframe).width(document.body.clientWidth);$(this.fadeIframe).height((document.body.scrollHeight>document.body.clientHeight)?document.body.scrollHeight:document.body.clientHeight);$(this.fadeDiv).width(document.body.clientWidth);$(this.fadeDiv).height((document.body.scrollHeight>document.body.clientHeight)?document.body.scrollHeight:document.body.clientHeight);$(this.fadeIframe).show();$(this.fadeDiv).show();$(this.mainDiv).show();$(window).unbind('resize.DuplicateChecker').bind('resize.DuplicateChecker',this,function(event){$(event.data.fadeIframe).width(document.body.clientWidth);$(event.data.fadeIframe).height((document.body.scrollHeight>document.body.clientHeight)?document.body.scrollHeight:document.body.clientHeight);$(event.data.fadeDiv).width(document.body.clientWidth);$(event.data.fadeDiv).height((document.body.scrollHeight>document.body.clientHeight)?document.body.scrollHeight:document.body.clientHeight);});}
DuplicateChecker.prototype.setHide=function(){$(this.mainDiv).hide();$(this.fadeDiv).hide();$(this.fadeIframe).hide();$(window).unbind('resize.DuplicateChecker');}
DuplicateChecker.prototype.focusout=function(){var mainDiv=$('.'+this.className);for(var i=0;i<mainDiv.length;i++){if(mainDiv[i].style.display=='block')
return false;}
if(this.getObjValue){this.inst.setObj(this.getObjValue());}else{var obj=new Object();obj[this.attrName]=this.getValue();this.inst.setObj(obj);}
var isExist=this.inst.getExist();if((this.getObjValue||this.getValue()!='')&&isExist){this.inst.onchange();this.setBlock();}}
function PrsnCheck(parent,mainClass){this.value='';this.t=new TableViewer(parent);this.t.createHeader();this.t.createBody();this.t.createFooter({'pagesPerSet':10});this.t.createCount();this.t.comp=this;this.t.onchange=function(){this.setValue(this.comp.value+'&ts='+this.currentPage+'.'+this.rowsPerPage+'..');}
var style1={'attribute':'prsnName','align':'left','href':'javascript:popUpObjRead(@{id}, "/ekp/hnm/human/usr.id.read.jsp")'};var prsnName=new PrsnColumn(this.t,style1);prsnName.width='130px';prsnName.header={'label':JSV.getLang('PrsnCheck','name')}
var style2={'attribute':'orgName','align':'left'};var orgName=new TextColumn(this.t,style2);orgName.width='';orgName.header={'label':JSV.getLang('PrsnCheck','orgName')};var style3={'attribute':'email','align':'left'};var email=new TextColumn(this.t,style3);email.width='150px';email.header={'label':JSV.getLang('PrsnCheck','eMail')};var style4={'attribute':'cellPhone','align':'right'};var hphone=new TextColumn(this.t,style4);hphone.width='110px';hphone.header={'label':JSV.getLang('PrsnCheck','cellPhn')};var style5={'text':(mainClass.style&&mainClass.style.editBtn)?mainClass.style.editBtn:null};var editButton=new EditColumn(this.t,style5);editButton.width='50px';editButton.header={'label':''};editButton.onclick=function(id){doEdit(id);$(mainClass.closeImg).click();}}
PrsnCheck.prototype.setObj=function(obj){this.value='/jsl/HumanUser.SearchListByUser.json?name='
if(obj.name)this.value+=JSV.encode(obj.name);if(obj.email)this.value+='&email='+obj.email;if(obj.phone)this.value+='&phone='+obj.phone;}
PrsnCheck.prototype.onchange=function(){this.t.onchange();}
PrsnCheck.prototype.getExist=function(){var json=JSV.loadJSON(this.value).array;return json.length>0;}
function OrgCheck(parent,mainClass){this.value='';this.t=new TableViewer(parent);this.t.createHeader();this.t.createBody();this.t.createFooter({'pagesPerSet':10});this.t.createCount();this.t.comp=this;this.t.onchange=function(){this.setValue('/jsl/OrgUser.ListByUser.json?ts='+this.currentPage+'.'+this.rowsPerPage+'..orgName_'+this.comp.value);}
var style1={'attribute':'orgName','align':'center','href':'javascript:popUpObjRead(@{id}, "/ekp/hnm/org/usr.popup.read.jsp")'};var orgName=new TitleColumn(this.t,style1);orgName.width='200px';orgName.header={'label':JSV.getLang('OrgCheck','orgName')};var style2={'attribute':'rgstDate','format':JSV.getLang('DateFormat','dateType1')};var rgstDate=new DateColumn(this.t,style2);rgstDate.width='150px';rgstDate.header={'label':JSV.getLang('OrgCheck','rgstDate')}
var style3={'attribute':'userName','id':'userId','name':'userName'};var userName=new EmpColumn(this.t,style3);userName.width='150px';userName.header={'label':JSV.getLang('OrgCheck','author')};var editButton=new EditColumn(this.t);editButton.width='50px';editButton.header={'label':''};editButton.onclick=function(id){doEdit(id);$(mainClass.closeImg).click();}}
OrgCheck.prototype.setObj=function(obj){if(obj.name&&(obj.name!=''))this.value=JSV.encode(obj.name);}
OrgCheck.prototype.onchange=function(){this.t.onchange();}
OrgCheck.prototype.getExist=function(){if(this.value=='')return false;var json=JSV.loadJSON('/jsl/OrgUser.ListByUser.json?ts=1.10..orgName_'+this.value).array;return json.length>0;}
function EditColumn(parent,style){this.style=style||{};this.text=this.style.text||JSV.getLang('EditColumn','btn');parent.appendChild(this);}
EditColumn.prototype.setValue=function(element,td,tr){var btn=new KButton(td,this.text);btn.comp=this;btn.onclick=function(){if(this.comp.onclick)
this.comp.onclick(element['id']);}}
function popUpObjRead(id,url){var u=url;var q='id='+id;var n='';var f='width=850,height=600,scrollbars=yes,status=no,toolbar=no,menubar=no,location=no,resizable=no';var url=JSV.getContextPath(JSV.getModuleUrl(u),q);window.open(url,n,f);}
function RfrnOrgFieldEditor(layout,style){this.style=style||{};this.org=null;this.name=new TextFieldEditor(layout.next(-1),this.style);this.name.comp=this;this.name.setReadOnly(true);this.name.onclick=function(){this.comp.button.onclick();}
var imgAdd=this.style.imgAdd||JSV.getLang('RfrnOrgFieldEditor','srchBtn');this.buttonTd=layout.next();this.buttonTd.align='left';this.button=new KButton(this.buttonTd,imgAdd);this.button.editor=this;this.button.onclick=function(){RfrnOrgFieldEditor.editor=this.editor
RfrnOrgFieldEditor.showPopup();return false;};}
RfrnOrgFieldEditor.prototype.setValue=function(value){this.org=null;if(value){if(value.orgId){this.org=value.orgId;}
if(value.orgName){this.name.setValue(value.orgName);}else{this.name.setValue('');}}else{this.name.setValue('');}}
RfrnOrgFieldEditor.prototype.getValue=function(){var obj=new Object();if(this.org&&this.org!=null)
{obj.orgId=this.org;}
obj.orgName=this.name.getValue();return obj;}
RfrnOrgFieldEditor.prototype.validate=function(style){var errors=[];if(this.name.getValue()==''){errors.push(style.message);}
return errors;}
RfrnOrgFieldEditor.showPopup=function(){var u=JSV.getContextPath(JSV.getModuleUrl('/enh/js/orgFieldEditor.jsp'));var n='popOrg'
var f='width=800, height=700, scrollbars=no, status=no, toolbar=no, menubar=no, location=no, resizable=no';window.open(u,n,f);}
function RfrnOrgViewer(parent,style){this.style=style||{};this.className=this.style.className||'RfrnOrgViewer';this.widget=$('<div>').addClass(this.className).appendTo(parent);}
RfrnOrgViewer.prototype.setValue=function(value){if(value){if(value.orgId){$(this.widget).append(RfrnOrgViewer.generateAnchor(value.orgId,value.orgName));}else{$(this.widget).text(value.orgName);}}}
RfrnOrgViewer.generateAnchor=function(id,name){var anchor=$('<a>').attr('hidefocus','true').addClass('rfrnOrgA').text(name).bind('click',id,function(event){RfrnOrgViewer.showDetail(event.data);}).get(0);return anchor;}
RfrnOrgViewer.showDetail=function(id){var u='/sys/jsv/doc/popup.jsp';var q='targetUrl=/ekp/hnm/org/usr.popup.read.jsp'+'?id='+id;var n='org';var f='width=800,height=600,scrollbars=no,status=no,toolbar=no,menubar=no,location=no,resizable=yes';var url=JSV.getContextPath(JSV.getModuleUrl(u),q);window.open(url,n,f);}
function ScrapFolderEditor(parent,style){this.style=style||{};this.className=this.style.className||'ScrapFolderEditor';this.widget=$('<table cellpadding="0" cellspacing=0">\
     <tr class="scrapTr">\
      <td class="scrapTd1"></td>\
      <td class="scrapTd2"></td>\
     </td>\
    </table>').addClass(this.className).appendTo(parent);this.pid=null;this.viewer=new TextFieldEditor(this.widget.find('.scrapTd1').get(0),this.style);this.viewer.editor=this;this.viewer.setReadOnly(true);this.viewer.onclick=function(){this.editor.button.onclick();}
this.button=new KButton(this.widget.find('.scrapTd2').get(0),JSV.getLang('ScrapFolderEditor','srchBtn'));this.button.editor=this;this.button.onclick=function(){var arg={'userId':this.editor.style.userId,'scrapId':null,'isList':true,'isWrite':true};var u=JSV.getContextPath(JSV.getModuleUrl('/ekp/hnm/scrap/moveDialog.jsp'));var f='dialogWidth:350px;dialogHeight:500px;scroll:no;status:no;resizable:no';var editor=this.editor;JSV.showModalDialog(u,[arg],f,function(searchDialog){if(searchDialog){editor.viewer.setValue(searchDialog.name);editor.pid=searchDialog.parentId;}});}}
ScrapFolderEditor.prototype.setValue=function(value){}
ScrapFolderEditor.prototype.getValue=function(){return this.pid;}
ScrapFolderEditor.prototype.validate=function(style){var errors=[];if(this.pid==null){errors.push(style.message);}
return errors;}
function PrsnColumn(parent,style){this.parent=parent;this.style=style||{};this.className=this.style.className||'PrsnColumn';this.align=this.style.align?this.style.align:'left';parent.appendChild(this);}
PrsnColumn.prototype.setLabelProvider=function(lp){this.labelProvider=lp;}
PrsnColumn.prototype.setValue=function(element,td,tr){if(this.labelProvider==null){this.setLabelProvider(new TitleColumnLabelProvider());}
$(td).addClass(this.className);var titleColumn=this.setTitleColoring(element,td);var str=this.labelProvider.getText(element,this.style.attribute);$(titleColumn).appendTo(td);var postSize=this.setPost(td,element);var titleSize=parseInt(td.offsetWidth-postSize);this.style.isAbbr=(this.style.isAbbr)?this.style.isAbbr:true;this.style.isAbbr=(titleSize<=0)?false:this.style.isAbbr;var titleText=this.style.isAbbr?TitleColumn.abbreviateString(str,titleSize):str;$('<span>').addClass('prsnTitleSpan').html(titleText).appendTo(titleColumn);$(td).attr({'align':this.align,'title':str});}
PrsnColumn.prototype.onclick=function(element,href){JSV.doPOST(href);}
PrsnColumn.prototype.setTitleColoring=function(element,td){if(this.style.applyAtt&&(element[this.style.applyAtt]==''||element[this.style.applyAtt]=='0'))
return $('<nobr>').addClass('prsnNobr').get(0);var a=$('<a>').addClass('prsnA');if(this.style.href&&element){$(a).attr('href',JSV.mergeXml(this.style.href,element));}else{$(a).attr('hidefocus','true');}
$(a).bind('click',this,function(event){event.data.onclick(element,this.href);return false;});return a.get(0);}
PrsnColumn.prototype.setPost=function(parent,element){var count=0;if(this.style.nameCard){var type=element.cSaveCode;var path=element.cSavePath;if(path||(type&&path)){var img='';if(type&&path){img=JSV.getContextPath('/jsl/inline/ImageAction.Download/?type='+type+'&path='+path);}else if(path){img=path;}
var anch=$('<a  hidefocus="true"></a>').append('&nbsp;').append($('<img>').addClass('cardIcon').attr({'src':JSV.getContextPath('/img/btn/ekp/hnm/btn_namecard.gif'),'title':JSV.getLang('PrsnColumn','view')})).appendTo(parent).bind('click',this.style.nameCard,function(event){var func=eval(event.data);func($.data(this,'src'),$.data(this,'top'),$.data(this,'left'));}).get(0);$.data(anch,'src',img);$.data(anch,'top',$(parent).offset().top);$.data(anch,'left',$(parent).offset().left);count++;}}
if(this.style.vrsnupIcon){var vrsnNum=element[this.style.vrsnupIcon];if(vrsnNum>1){this.addIcon(parent,TitleColumn.VRSNUP);$('<span>').addClass('vrsnNumSpan').text(vrsnNum).appendTo(parent);count++;}}
if(this.style.opnCnt){var opnCnt=element[this.style.opnCnt];var id=element['id'];if(opnCnt>0){var opn=$('<span>').addClass('opnCntSpan').appendTo(parent).get(0);if(this.style.opnView&&this.style.opnDelete){$(opn).html(' ['+opnCnt+']').bind('click',this,function(event){event.data.style.id=id;OpnViewer.showPopup(event.data.style);return false;});}else{$(opn).html(' ['+opnCnt+']');}
count++;}}
return count*22;}
PrsnColumn.prototype.addIcon=function(parent,src){$('<img>').addClass('prsnIcon').attr('src',JSV.getContextPath(src)).appendTo($(parent).append('&nbsp;'));}
function OrgCheckboxColumn(parent,style){this.style=style||{};this.className=this.style.className||'OrgCheckboxColumn';parent.appendChild(this);}
OrgCheckboxColumn.prototype.setValue=function(element,td,tr){$(td).attr('align',this.style.align||'center');var name=this.style.name||'chk';var value=this.style.attribute?element[this.style.attribute]:'';var check=$('<input type="checkbox" name="'+name+'">').addClass(this.className).val(value).appendTo(td).get(0);check.element=element;$(check).bind('click',this,function(event){SingleCheck(this.value);});}
function ComboTextFieldEditor(parent,style){this.style=style||{};this.className=this.style.className||'ComboTextFieldEditor';this.t=$('<table>\
     <tr class="comTextTr">\
      <td class="comTextTd1"></td>\
      <td class="comTextTd2"></td>\
     </tr>\
    </table>').addClass(this.className).appendTo(parent);this.comboTd=$(this.t).find('.comTextTd1').get(0);var comboStyle={'options':style.comboStyle,'layerStyle':'true'};this.combo=new ComboFieldEditor(this.comboTd,comboStyle);this.combo.comp=this;this.textTd=$(this.t).find('.comTextTd2').get(0);this.text=new TextFieldEditor(this.textTd,style);this.combo.onchange=function(value){if(value=='0'){$(this.comp.textTd).show();}else{$(this.comp.textTd).hide();}}}
ComboTextFieldEditor.prototype.setValue=function(value){if(value!=null){var options=this.combo.widget.options;var isCombo=false;for(var i=0;i<options.length;i++){if(options[i].value==value){this.combo.setValue(value);isCombo=true;break;}}
if(!isCombo){$(this.textTd).show();this.combo.setValue('0');this.text.setValue(value);}}}
ComboTextFieldEditor.prototype.getValue=function(){if(this.combo.getValue()=='0'){return this.text.getValue();}else{return this.combo.getValue();}}
function AnvrFieldEditor(parent,style){this.style=style||{};this.className=this.style.className||'AnvrFieldEditor';this.size=this.style.size||1;this.selectionList=new Array();this.t=$('<table cellSpacing="0" cellPadding="0">\
     <tr class="anvrFldTr">\
      <td class="anvrFldTd" align="right"></td>\
     </tr>\
 </table>').addClass(this.className).appendTo(parent).get(0);var addButton=new KButton($(this.t).find('.anvrFldTd').get(0),JSV.getLang('AnvrFieldEditor','addIcon'));addButton.editor=this;addButton.onclick=function(){var selection=new Object();this.editor.addEditor(this.editor.t,selection);}}
AnvrFieldEditor.prototype.addEditor=function(table,selection){var tr=$('<tr>\
     <td class="innrTd">\
      <table class="innrTable">\
       <tr class="inChildTr">\
        <td class="inChildTd2"></td>\
        <td class="inChildTd4"></td>\
        <td class="inChildTd5" align="left"></td>\
        <td class="inChildTd6"></td>\
       </tr>\
      </table>\
     </td>\
 </tr>').addClass('innrTr').appendTo(table);var title=new ComboTextFieldEditor(tr.find('.inChildTd2').get(0),this.style);if(selection&&selection.title)
title.setValue(selection.title);var date=new DateFieldEditor(tr.find('.inChildTd4').get(0),this.style);if(selection&&selection.anvrDate)
date.setValue(selection.anvrDate);var combo=new RadioGroupFieldEditor(tr.find('.inChildTd5').get(0),this.style);if(selection&&selection.type)
combo.setValue(selection.type);else
combo.setValue('0');var mb=new KButton(tr.find('.inChildTd6').get(0),JSV.getLang('AnvrFieldEditor','delIcon'));mb.tr=tr;mb.titleEditor=title;mb.dateEditor=date;mb.comboEditor=combo;mb.selection=selection;mb.selectionList=this.selectionList;mb.component=this;mb.onclick=function(){JSV.finalizeAll(this.tr.get(0));this.tr.remove();this.selectionList.remove(this);}
this.selectionList.push(mb);}
AnvrFieldEditor.prototype.setValue=function(selections){if(!selections||(selections.length==0)){for(var i=0;i<this.size;i++){var selection=new Object();this.addEditor(this.t,selection);}}else{for(var i=0;selections&&i<selections.length;i++){this.addEditor(this.t,selections[i]);}}}
AnvrFieldEditor.prototype.getValue=function(){var selections=new Array();for(var i=0;i<this.selectionList.length;i++){var select=this.selectionList[i];var title=select.titleEditor.getValue();var date=select.dateEditor.getValue();if((title&&title!='')&&(date&&date!='')){var obj=new Object();obj.title=title;obj.anvrDate=date;obj.type=select.comboEditor.getValue();selections.push(obj);}else{continue;}}
return selections;}
function AnvrViewer(parent,style){this.style=style||{};this.className=this.style.className||'AnvrViewer';this.t=$('<table cellSpacing="0" cellPadding="0">\
 </table>').addClass(this.className).appendTo(parent);}
AnvrViewer.prototype.setValue=function(values){if(values){for(var i=0;i<values.length;i++){var tr=$('<tr>\
    <td class="anvrTd1" align="right"></td>\
    <td class="anvrTd2" align="center"></td>\
    <td class="anvrTd3" align="left"></td>\
   </tr>').addClass('anvrTr').appendTo(this.t);new TextViewer(tr.find('.anvrTd1').get(0),this.style).setValue(values[i].title+' : ');new DateViewer(tr.find('.anvrTd2').get(0),this.style).setValue(values[i].anvrDate);new ComboViewer(tr.find('.anvrTd3').get(0),this.style).setValue(values[i].type);}}}
function HiddenTdFieldEditor(parent,style){}
function NameCardInitEditor(parent,style){this.style=style||{};var name=this.style.name||'imgCode';this.type=this.style.type||'6100';this.widget=$('<DIV>').appendTo(parent).get(0);this.hidden=$('<input type="hidden" name="'+name+'">').appendTo(this.widget);this.downUrl=this.style.downUrl||JSV.getContextPath('/ekp/hnm/human/file/NameScanX.exe');this.value=new Object();this.value.method='copy';var basis=$(parent).prev().length>0?$(parent).prev():$(parent);this.style.offsetTop=basis.offset().top;this.style.offsetLeft=basis.offset().left;this.viewer=new NameCardViewer(this.widget,this.style);NameCardInitEditor.editor=this;var NameScanUtil;var NameScanX;if(JSV.browser.msieEqualOrOver9){NameScanUtil=$('<OBJECT height="0" width="0" id="NameScanUtil" classid="clsid:BFFD04FF-F487-4BBF-A97C-1CF585FB93E7" CodeBase="'+JSV.getLocationPath('/ekp/hnm/human/file/NameScanXUtil.cab')+'#version=9,5,9,1"></OBJECT>').get(0);NameScanX=$('<OBJECT height="0" width="0" id="NameScanX" classid="clsid:138741CF-22AD-4BC6-B511-C73967D1D768"></OBJECT>').get(0);}else{NameScanUtil=document.createElement('<OBJECT height="0" width="0" id="NameScanUtil" classid="clsid:BFFD04FF-F487-4BBF-A97C-1CF585FB93E7" CodeBase="'+JSV.getLocationPath('/ekp/hnm/human/file/NameScanXUtil.cab')+'#version=9,5,9,1"></OBJECT>');NameScanX=document.createElement('<OBJECT height="0" width="0" id="NameScanX" classid="clsid:138741CF-22AD-4BC6-B511-C73967D1D768"></OBJECT>');}
var ReadyToRecog;var EndRecog;if(JSV.browser.msieEqualOrOver9){ReadyToRecog=$('<script for=\"NameScanX\" event=\"ReadyToRecog(stat)\"></script>').get(0);EndRecog=$('<script for=\"NameScanX\" event=\"EndRecog(res)\"></script>').get(0);}else{ReadyToRecog=document.createElement('<script for=\"NameScanX\" event=\"ReadyToRecog(stat)\"></script>');EndRecog=document.createElement('<script for=\"NameScanX\" event=\"EndRecog(res)\"></script>');}
ReadyToRecog.text='NameCardInitEditor.ReadyToRecog(stat);';EndRecog.text='NameCardInitEditor.EndRecog(res);';var headTag=$('head').get(0);headTag.appendChild(ReadyToRecog);headTag.appendChild(EndRecog);this.widget.appendChild(NameScanUtil);this.widget.appendChild(NameScanX);NameCardInitEditor.init(this.downUrl);}
NameCardInitEditor.prototype.getValue=function(){return this.value;}
NameCardInitEditor.prototype.setValue=function(value){if(value){this.value.path=value.path;this.value.type=value.type;this.viewer.setValue(value);}else{this.viewer.setValue('');}}
NameCardInitEditor.prototype.setNamecardValue=function(){var nameScan=document.getElementById('NameScanX');var obj=new Object();obj.name=nameScan.GetRecogFieldValue("NC_Name");obj.officeName=nameScan.GetRecogFieldValue("NC_Company");obj.dprt=nameScan.GetRecogFieldValue("NC_Office");obj.position=nameScan.GetRecogFieldValue("NC_Position");obj.hPhone=nameScan.GetRecogFieldValue("NC_HP");obj.email=nameScan.GetRecogFieldValue("NC_EMail");obj.offPhone=nameScan.GetRecogFieldValue("NC_CoTel");obj.offFax=nameScan.GetRecogFieldValue("NC_CoFax");obj.zipcode=nameScan.GetRecogFieldValue("NC_CoZipNo");obj.address=nameScan.GetRecogFieldValue("NC_CoAddress");this.hidden.val(nameScan.GetBase64Image(400,80));this.saveJPGImage();if(this.setFieldValue){this.setFieldValue(obj);}}
NameCardInitEditor.prototype.saveJPGImage=function(){var nameScan=document.getElementById('NameScanX');var filePath=nameScan.GetInstallDirectory()+'\\temp\\image.jpg';nameScan.SaveToJPG(filePath);var obj=new Object();obj.path='file://'+filePath;this.viewer.setValue(obj);this.value.type=this.type;this.value.path=filePath;}
NameCardInitEditor.ReadyToRecog=function(stat){if(stat==0){alert(JSV.getLang('HBRUpdate','noScanner'));window.close();}else{var div=$('#btn').get(0);var nameScan=document.getElementById('NameScanX');var clean=new KButton(div,JSV.getLang('HBRUpdate','headerClean'));clean.onclick=function(){nameScan.Cleaning();}
var calibration=new KButton(div,JSV.getLang('HBRUpdate','calibration'));calibration.onclick=function(){nameScan.Calibration();}}}
NameCardInitEditor.EndRecog=function(res){if(res==1){NameCardInitEditor.editor.setNamecardValue();}else{alert('error');return false;}}
NameCardInitEditor.init=function(downUrl){var nameScanUtil=document.getElementById('NameScanUtil');if(nameScanUtil.object!=null){if(!nameScanUtil.IsNSXInstalled){alert(JSV.getLang('HBRUpdate','noInstEngine'));location.href=downUrl;}
return false;}
setTimeout(function(){NameCardInitEditor.init(downUrl);},500);}
NameCardInitEditor.editor=null;function NameCardViewer(parent,style){this.parent=parent;this.style=style||{};this.className=this.style.className||'NameCardViewer';this.src=this.style.src||JSV.getLang('NameCardViewer','viewBcardBtn');this.defaultImg=style.defaultImg?style.defaultImg:'/img/btn/ekp/hnm/card_noimage.gif';this.button=new KButton(parent,this.src);this.button.comp=this;this.button.onclick=function(){this.comp.cardWindow.setViewPosition(parseInt(this.comp.style.offsetTop)+parseInt(this.comp.style.topSize),parseInt(this.comp.style.offsetLeft)+parseInt(this.comp.style.leftSize));}
var cardStyle={'header':JSV.getLang('NameCardViewer','viewBcard')};this.cardWindow=new CreateMoveDiv(parent,cardStyle);this.mainDiv=this.cardWindow.getContentDiv();}
NameCardViewer.prototype.setValue=function(value){var img=JSV.getContextPath(this.defaultImg);if(value.type&&value.path){img=JSV.getContextPath('/jsl/inline/ImageAction.Download/?type='+value.type+'&path='+value.path);}else if(value.path){img=value.path;}
$(this.mainDiv).html('<img class="'+this.className+'" src="'+img+'">');}
function PrsnNameViewer(parent,style){this.style=style||{};this.className=this.style.className||'PrsnNameViewer';this.widget=$('<table cellpadding="0" cellspacing="0" border="0">\
      <col class="col1"><col class="col2">\
      <tr class="prsnViewTr">\
       <td class="prsnViewTd1" align="left"></td>\
       <td class="prsnViewTd2" align="left"></td>\
      </tr>\
     </table>').addClass(this.className).appendTo(parent);this.style.offsetTop=parent.offsetTop;this.style.offsetLeft=parent.offsetLeft;this.viewer=new TitleViewer(this.widget.find('.prsnViewTd1').get(0),this.style);}
PrsnNameViewer.prototype.setValue=function(value){if(value){if(value[0]){this.viewer.setValue(value[0]);}
if(value[1]&&value[1].path){new NameCardViewer(this.widget.find('.prsnViewTd2').get(0),this.style).setValue(value[1]);}}}
PrsnNameViewer.prototype.getValue=function(){this.viewer.getValue();}
function PrsnHtmlViewer(parent,style){this.style=style||{};this.className=this.style.className||'PrsnHtmlViewer';this.widget=$('<div>').addClass(this.className).appendTo(parent);}
PrsnHtmlViewer.prototype.setValue=function(value){if(value){if(this.style.href&&value[1]&&value[1]!=''){var obj={'id':value[1]};$('<a>').addClass('prsnHtmlA').attr('href',JSV.merge(this.style.href,obj)).text(value[0]).appendTo(this.widget);}else{this.widget.text(value[0]);}}
this.user=value;}
function OrgTitleColumn(parent,style){this.style=style||{};this.className=this.style.className||'OrgTitleColumn';var obj=new Object();obj.appendChild=function(){};this.widget=new TitleColumn(obj,this.style);this.widget.setTitleColoring=function(style,element){if(style.applyAtt&&(element[style.applyAtt]==''||element[style.applyAtt]=='0')){return $('<nobr>').addClass(this.className+'Nobr').get(0);}
var href=(this.style.href&&element)?JSV.mergeXml(style.href,element):'';var a=$('<a>').addClass(this.className+'A').attr('href',href).bind('click',this,function(event){event.data.onclick(element,href);return false;}).get(0);return a;}
parent.appendChild(this);}
OrgTitleColumn.prototype.setValue=function(element,td,tr){this.widget.setValue(element,td,tr);}
function CreateMoveDiv(parent,style){this.style=style||{};this.className=this.style.className||'CreateMoveDiv';this.div=$('<div>').addClass(this.className).appendTo(parent).bind('mousedown',function(event){DivHandler(event,this);});this.iframe=$('<iframe class="iframe"></iframe>').css('opacity','0.0').appendTo(this.div);var header=this.style.header||'';this.subDiv=$('<div>').addClass('subDiv').appendTo(this.div);this.bodyTable=$('<table cellpadding="0" cellspacing="0">\
       <col class="col1"><col class="col2">\
       <tr class="bodyTr">\
        <td class="titleTd">\
         <span class="titleText">'+header+'</span>\
        </td>\
        <td class="closeTd" align="right">\
         <img class="closeImg" src="'+JSV.getContextPath('/img/btn/ekp/hnm/mclose.gif')+'">\
        </td>\
       </tr>\
       <tr class="contentTr">\
        <td colspan="2" class="contentTd"><div class="contentDiv"></div></td>\
       </tr>\
    </table>').addClass('bodyTable').appendTo(this.subDiv);if(this.style.width)
this.bodyTable.width(this.style.width+'px');if(this.style.height)
this.bodyTable.height(this.style.height+'px');this.bodyTable.find('.closeImg').bind('click',this,function(event){event.data.setHide();});}
CreateMoveDiv.prototype.getContentDiv=function(){return this.bodyTable.find('.contentDiv').get(0);}
CreateMoveDiv.prototype.setHide=function(){this.div.hide();}
CreateMoveDiv.prototype.setVisibleValue=function(value){this.iframe.height(this.div.height()).width(this.div.width());this.div.css('display',value);}
CreateMoveDiv.prototype.setViewPosition=function(top,left){this.setVisibleValue('block');this.div.css({'top':top+'px','left':left+'px'});}
function HumanImageFieldEditor(parent,style){this.style=style||{};this.className=this.style.className||'HumanImageFieldEditor';this.viewDiv=$('<div>').addClass(this.className).appendTo(parent).bind('click',this,function(event){event.data.searchWindow.setViewPosition(parseInt(parent.offsetTop)+parseInt(event.data.style.topSize),parseInt(parent.offsetLeft)+parseInt(event.data.style.leftSize));});this.width=this.style.width||100;this.height=this.style.height||120;this.alt=this.style.alt||'';this.border=this.style.border||0;var searchStyle={'width':'250','header':JSV.getLang('HumanImageFieldEditor','findImage')};this.searchWindow=new CreateMoveDiv(parent,searchStyle);var mainDiv=this.searchWindow.getContentDiv();this.imageEditor=new ImageFieldEditor(mainDiv,style);this.imageEditor.setViewer(this);}
HumanImageFieldEditor.prototype.setValue=function(oImg){if(oImg&&oImg.type&&oImg.type>0)
this.imageEditor.setValue(oImg);else
this.setSrc();}
HumanImageFieldEditor.prototype.getValue=function(){return this.imageEditor.getValue();}
HumanImageFieldEditor.prototype.setSrc=function(src){this.src=src;if(this.src!=null)
this.createImage();else{this.viewDiv.empty();$('<div>').addClass('textDiv').html('<br><br>'+this.alt).appendTo(this.viewDiv);}}
HumanImageFieldEditor.prototype.createImage=function(){this.viewDiv.empty();$('<img>').attr({'src':this.src,'title':this.alt}).css({'width':this.width,'height':this.height,'border':this.border}).appendTo(this.viewDiv);}
function NameCardAttReadViewer(style){this.style=style||{}
this.className=this.style.className||'NameCardAttReadViewer';this.left=this.style.left?parseInt(this.style.left):0;var cardStyle={'header':JSV.getLang('NameCardViewer','viewBcard')};this.cardWindow=new CreateMoveDiv($('body').get(0),cardStyle);this.mainDiv=this.cardWindow.getContentDiv();this.img=$('<img>').addClass(this.className).appendTo(this.mainDiv);}
NameCardAttReadViewer.prototype.setViewPosition=function(src,top,left){this.img.attr('src',src);top-=60;var clientY=top-$(document).scrollTop()+390;if(clientY>$(document).height()){var height=clientY-$(document).height();var tmpTop=top-height;if(tmpTop>$(document).scrollTop()){top=tmpTop;}else{top=$(document).scrollTop();}}
if(top<$(document).scrollTop())
top=$(document).scrollTop();this.cardWindow.setViewPosition(top,this.style.left?left+parseInt(this.style.left):left);}
function OrgFoldersCompositeEditor(layout,style){this.style=style||{};this.axisList=new Array();this.orgFolder=null;if(this.style.code)
this.axisList=JSV.loadJSON('/jsl/AxisSelector.ListByCode.json?code='+this.style.code).array;else
this.axisList=JSV.loadJSON(JSV.getModuleUrl('/jsl/AxisSelector.ListByModule.json')).array;var next=layout.next('*');if(this.axisList.length>0){this.editor=new FoldersCompositeEditor(next,this.style);}else{$(next).parent().hide();this.editor=new FoldersEmptyEditor();}}
OrgFoldersCompositeEditor.prototype.setValue=function(folders){this.orgFolder=(folders!=null)?this.getOrgFolder(folders):null;this.editor.setValue(folders);}
OrgFoldersCompositeEditor.prototype.getValue=function(){var folders=this.editor.getValue();if(folders==null&&this.orgFolder!=null){var arr=new Array();arr.push(this.orgFolder);return arr;}else if(folders!=null&&this.orgFolder!=null){folders.push(this.orgFolder);}
return folders;}
OrgFoldersCompositeEditor.prototype.setFolder=function(folder){if(folder!=null)
this.orgFolder=folder;}
OrgFoldersCompositeEditor.prototype.getOrgFolder=function(folders){for(var i=0;i<folders.length;i++){var folder=folders[i];if(this.axisList.indexOf(folder,FoldersFieldEditor.eq)<=-1&&folder.computed!='true'){return folder;}}
return null;}
function FoldersEmptyEditor(){}
FoldersEmptyEditor.prototype.getValue=function(){return null;}
FoldersEmptyEditor.prototype.setValue=function(value){}
function HumanMailManager(){}
HumanMailManager.mailPopUp=function(receivers,name,type,id){var u=JSV.getContextPath('/ekp/hnm/human/usr.sendMsg.jsp?receivers='+receivers+'&name='+name+'&type='+type);if(id)
u+='&prsnId='+id;var f='Width=570,Height=590px,scroll=no,status=no,resizable=no,help=no';window.open(JSV.getModuleUrl(u),'mail',f);}
function DateTimeFieldEditor(parent,style){this.style=style||{};this.className=this.style.className||'DateTimeFieldEditor';this.widget=$('<table cellSpacing="0" cellPadding="0">\
      <tr class="dateTimeTr">\
       <td class="dateTimeTd1"></td>\
       <td class="dateTimeTd2"></td>\
       <td class="dateTimeTd3"></td>\
       <td class="dateTimeTd4"></td>\
       <td class="dateTimeTd5"></td>\
      </tr>\
  </table>').addClass(this.className).appendTo(parent);this.radio=new RadioGroupFieldEditor(this.widget.find('.dateTimeTd1'),{'options':JSV.getLang('DateTimeFieldEditor','options')});this.radio.comp=this;new TextViewer(this.widget.find('.dateTimeTd2')).setValue(JSV.getLang('DateTimeFieldEditor','date'));this.date=new DateFieldEditor(this.widget.find('.dateTimeTd3'),this.style);new TextViewer(this.widget.find('.dateTimeTd4')).setValue(JSV.getLang('DateTimeFieldEditor','time'));var timeStr='';for(var i=0;i<24;i++){if(i!=0)
timeStr+=',';timeStr+=(i*1000*60*60)+':'+i;}
this.style.options=timeStr;this.time=new ComboFieldEditor(this.widget.find('.dateTimeTd5'),this.style);this.radio.onchange=function(value){if(value=='0'){this.setVisible('hidden');}else{this.setVisible('visible');}}
this.radio.setVisible=function(type){this.comp.widget.find('.dateTimeTd2').css('visibility',type);this.comp.widget.find('.dateTimeTd3').css('visibility',type);this.comp.widget.find('.dateTimeTd4').css('visibility',type);this.comp.widget.find('.dateTimeTd5').css('visibility',type);}}
DateTimeFieldEditor.prototype.setValue=function(time){if(time){this.radio.setValue('1');time=(time.constructor==String)?parseInt(time):time;var tmpDate=new Date(time);tmpDate=new Date(tmpDate.getFullYear(),tmpDate.getMonth(),tmpDate.getDate());this.date.setValue(tmpDate.getTime());var tmpTime=time-parseInt(tmpDate.getTime());var options=this.time.widget.options
for(var i=0;i<options.length;i++){if(i<options.length-1){if(parseInt(options[i].value)<=tmpTime&&parseInt(options[i+1].value)>tmpTime){tmpTime=options[i].value;break;}}else{tmpTime=options[options.length-1].value;}}
this.time.setValue(tmpTime);}else{this.radio.setValue('0');}
this.radio.onchange(this.radio.getValue());}
DateTimeFieldEditor.prototype.getValue=function(){if(this.radio.getValue()=='1'&&this.date.getValue()){return parseInt(this.date.getValue())+parseInt(this.time.getValue());}
return null;}
function checkNumber(inputValue){var strSpt=inputValue.split('-');if(strSpt.length!=3||strSpt[0].length!=3||!(strSpt[1].length>=3&&strSpt[1].length<=4)||strSpt[2].length!=4){return false;}
inputValue=inputValue.replace('-','');inputValue=inputValue.replace('-','');if(inputValue.length==0){return false;}
if(isNaN(inputValue)||inputValue.length<10||inputValue.length>11||(chkSpace(inputValue)==0)){return false;}
var temp=inputValue.substring(0,3);if((temp!='016')&&(temp!='017')&&(temp!='018')&&(temp!='019')&&(temp!='011')&&(temp!='010')&&(temp!='070')){return false;}
return true;}
function chkSpace(str){var flag=0;var out=0;for(var i=0;i<str.length;i++){if(str.charAt(i)==' '){flag=0;out+=flag;}else{flag=1;out+=flag;}}
return out;}
function checkEmail(inputValue){var re=/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;return re.test(inputValue);}
function QuickButtonColumn(parent,style){this.style=style||{};this.className=this.style.className||'QuickButtonColumn';this.meetUrl=this.style.meetUrl||'/ekp/hnm/meeting/usr.popup.list.jsp?gid=@{gid}';this.meetSize=this.style.meetSize||600;this.friend=this.style.friend||'/ekp/hnm/friend/usr.popup.list.jsp?gid=@{gid}';this.friendSize=this.style.friendSize||600;this.key=this.style.key||'';this.leftSize=this.style.leftSize||'-290';if(this.key!=''){var cardStyle={'header':JSV.getLang('NaverMapColumn','name')};this.cardWindow=new CreateMoveDiv(document.body,cardStyle);this.mainDiv=this.cardWindow.getContentDiv();try{this.mapObj=new NMap(this.mainDiv,300,300);var zoom=new NZoomControl();var save=new NSaveBtn();var mapBtns=new NMapBtns();zoom.setAlign("left");zoom.setValign("bottom");save.setAlign("right");save.setValign("bottom");mapBtns.setAlign("right");mapBtns.setValign("top");this.mapObj.addControl(zoom);this.mapObj.addControl(save);this.mapObj.addControl(mapBtns);}catch(e){this.key='';}}
parent.appendChild(this);}
QuickButtonColumn.prototype.setValue=function(element,td,tr){var t=$('<table><tr><td></td><td></td><td></td></tr></table>').addClass(this.className).appendTo($(td).attr('align',this.style.align||'center'));var flag_code=parseInt(element['flagCode']);var adrs=element['officeAdrs']||'';if(this.key!=''&&adrs!=''){$('<a/>',{'href':'#','hidefocus':true,'title':JSV.getLang('QuickButtonColumn','location')}).addClass('location').append($('<span/>').addClass('locationSpan').text(JSV.getLang('QuickButtonColumn','location'))).click(this,function(event){if(event.data.key&&event.data.key!=''){var xml=JSV.loadXml('/ekp/hnm/human/naver.xml.jsp?key='+event.data.key+'&query='+JSV.encode(adrs));var items=$(xml).find('item');var top=$(td).offset().top;var clientY=top-$(document).scrollTop()+480;if(clientY>$(document).height()){var height=clientY-$(document).height();var tmpTop=top-height;if(tmpTop>$(document).scrollTop()){top=tmpTop;}else{top=$(document).scrollTop();}}
if(top<$(document).scrollTop())
top=$(document).scrollTop();if(items.length>0){var x=parseInt($(items[0]).find('point').find('x').text());var y=parseInt($(items[0]).find('point').find('y').text());var pos=new NPoint(x,y);event.data.mapObj.setCenterAndZoom(pos,3);var iconUrl=JSV.getContextPath('/img/btn/ekp/hnm/map_arrow.gif');event.data.mapObj.addOverlay(new NMark(pos,new NIcon(iconUrl,new NSize(15,14))));}else{event.data.mapObj.clearOverlays();}
event.data.cardWindow.setViewPosition(top,parseInt(td.offsetLeft)+parseInt(event.data.leftSize));}
return false;}).appendTo(t.find("tr >td").eq(0));}
if(!flag_code){flag_code=0;flag_code+=parseInt(element['hnCnt'])>0?4:0;flag_code+=parseInt(element['isMeet'])>0?2:0;}
if(flag_code!=0){if((flag_code&4)==4){$('<a/>',{'href':'#','hidefocus':true,'title':JSV.getLang('QuickButtonColumn','friend')}).addClass('friend').click(this,function(event){if(parseInt(element['hnCnt'])>0){event.data.popOnClick(event.data.friend,element,event.data.friendSize,'orgId='+element['id']);}else{event.data.popOnClick(event.data.friend,element,event.data.friendSize);}
return false;}).appendTo(t.find("tr >td").eq(1));}
if((flag_code&2)==2){$('<a/>',{'href':'#','hidefocus':true,'title':JSV.getLang('QuickButtonColumn','meeting')}).addClass('meeting').click(this,function(event){if(parseInt(element['isMeet'])>0){event.data.popOnClick(event.data.meetUrl,element,event.data.meetSize,'orgId='+element['id']);}else{event.data.popOnClick(event.data.meetUrl,element,event.data.meetSize);}
return false;}).appendTo(t.find("tr >td").eq(2));}}}
QuickButtonColumn.prototype.popOnClick=function(url,element,size,q){var u=JSV.mergeXml(url,element);var n='';var f='width='+size+',height=550,scrollbars=yes,status=no,toolbar=no,menubar=no,location=no,resizable=yes';var url=JSV.getContextPath(JSV.getModuleUrl(u),q);window.open(url,n,f);}
function NaverMapAddressViewer(parent,style){this.parent=parent;this.style=style||{};this.className=this.style.className||'NaverMapAddressViewer';this.key=this.style.key;this.topOffset=this.style.topOffset||'0';this.leftOffset=this.style.leftOffset||'0';this.div=$('<div>').addClass(this.className).appendTo(this.parent).get(0);this.text=new TextViewer(this.div);}
NaverMapAddressViewer.prototype.setValue=function(value){if(value){var pstl=value.pstl?'('+value.pstl+')'+' ':'';var adrs=value.adrs?value.adrs:'';this.text.setValue(pstl+adrs);if(adrs!=''&&this.key&&this.key!=''){var cardStyle={'header':JSV.getLang('NaverMapColumn','name')};this.cardWindow=new CreateMoveDiv(document.body,cardStyle);var mainDiv=this.cardWindow.getContentDiv();try{this.mapObj=new NMap(mainDiv,300,300);}catch(e){return;}
var zoom=new NZoomControl();var save=new NSaveBtn();var mapBtns=new NMapBtns();zoom.setAlign("left");zoom.setValign("bottom");save.setAlign("right");save.setValign("bottom");mapBtns.setAlign("right");mapBtns.setValign("top");this.mapObj.addControl(zoom);this.mapObj.addControl(save);this.mapObj.addControl(mapBtns);$('<a/>',{href:'#',hidefocus:'true'}).addClass('profile_location').text(JSV.getLang('NaverMapAddressViewer','location')).click(this,function(event){event.data.cardWindow.setViewPosition($(this).offset().top+$(this).height()+10+parseInt(event.data.topOffset),$(this).offset().left+$(this).width()-300+parseInt(event.data.leftOffset));var xml=JSV.loadXml('/ekp/hnm/human/naver.xml.jsp?key='+event.data.key+'&query='+JSV.encode(adrs));var items=$(xml).find('item');if(items.length>0){var x=parseInt($(items[0]).find('point').find('x').text());var y=parseInt($(items[0]).find('point').find('y').text());var pos=new NPoint(x,y);event.data.mapObj.setCenterAndZoom(pos,3);var iconUrl=JSV.getContextPath('/img/btn/ekp/hnm/map_arrow.gif');event.data.mapObj.addOverlay(new NMark(pos,new NIcon(iconUrl,new NSize(15,14))));}else{event.data.mapObj.clearOverlays();}
return false;}).appendTo(this.div);}}}
function PhoneColumn(parent,style){this.parent=parent;this.style=style||{};this.className=this.style.className||'PhoneColumn';this.align=this.style.align||'center';parent.appendChild(this);}
PhoneColumn.prototype.setValue=function(element,td,tr){$(td).attr('align',this.align);var text=element[this.style.attribute];if(text&&text!='')
$('<span>').addClass('office').text(text).attr('title',text).appendTo($('<div/>').addClass(this.className).appendTo(td));else
$('<span>').html('&nbsp;').appendTo(td);}
function HumanDetailTabList(parent,style){this.style=style||{};this.className=this.style.className||'HumanDetailTabList';var org=JSV.getParameter('org');if(org)
JSV.setState('org',org);this.params={};if(this.style.model){this.params.id=style.model.id;this.params.gid=style.model.gid;this.params.orgId=style.model.orgInfo.orgId;}else{this.params.id=JSV.getParameter('id');this.params.gid=JSV.getParameter('gid');this.params.orgId=JSV.getParameter('orgId');}
this.tabs=new FlexTabList(parent,{'skin':'orange'});$(this.tabs.div).addClass(this.className);this.add($('<span/>').append($('<img/>',{'src':JSV.getContextPath('/img/btn/ekp/hnm/icon_human.gif')}).addClass('tabIcon')).append($('<span/>').html(JSV.getLang('HumanDetailTabList','human'))).html(),{'id':'human','url':org?'/ekp/hnm/human/usr.id.read.jsp?id=@{id}':'/ekp/hnm/human/usr.read.jsp?id=@{id}'});this.add($('<span/>').append($('<img/>',{'src':JSV.getContextPath('/img/btn/ekp/hnm/icon_catal_tab.gif')}).addClass('tabIcon')).append($('<span/>').html(JSV.getLang('HumanDetailTabList','meeting'))).html(),{'id':'meeting','url':'/ekp/hnm/meeting/usr.list.jsp?gid=@{gid}'});this.add($('<span/>').append($('<img/>',{'src':JSV.getContextPath('/img/btn/ekp/hnm/icon_friend_tab.gif')}).addClass('tabIcon')).append($('<span/>').html(JSV.getLang('HumanDetailTabList','friend'))).html(),{'id':'friend','url':'/ekp/hnm/friend/usr.list.jsp?gid=@{gid}'});if(this.params.orgId){this.add(JSV.getLang('HumanDetailTabList','human.org'),{'id':'human.org','url':'/ekp/hnm/human/usr.org.list.jsp?orgid=@{orgId}'});}
this.add(JSV.getLang('HumanDetailTabList','human.gid'),{'id':'human.gid','url':'/ekp/hnm/human/usr.gid.list.jsp?id=@{id}&gid=@{gid}'});var comp=this;this.tabs.onchange=function(value){JSV.setState('id',comp.params.id);JSV.setState('gid',comp.params.gid);JSV.setState('orgId',comp.params.orgId);JSV.setState('inHumanRead',true);JSV.doGET(JSV.merge(value.url,comp.params));}}
HumanDetailTabList.prototype.add=function(html,value){$.data(this,value.id,value);this.tabs.add(html,value);}
HumanDetailTabList.prototype.setValue=function(id){var value=$.data(this,id);this.tabs.setValue(value);}
HumanDetailTabList.prototype.setValueAndChange=function(id){var value=$.data(this,id);this.tabs.setValue(value);this.tabs.onchange(value);}
function HumanViewer(parent,style){this.style=style||{};this.className=this.style.className||'HumanViewer';this.pictureWidth=this.style.pictureWidth||101;this.pictureHeight=this.style.pictureHeight||134;this.widget=$('<div>\
 <div class="wrapper">\
  <div class="profileViewer">\
   <table class="profileLayout" cellSpacing="0" cellpadding="0" border="0">\
    <tr class="profileTr1">\
              <td class="photoArea" rowspan="2" />\
                 <td class="profileTd">\
                  <div class="profileName" /><div class="intmtCode" />\
                 </td>\
                 <td class="profileTd vAlignTd" align="right">\
                  <span class="recent">'+JSV.getLang('HumanViewer','lastUpdt')+' : <span class="regidate" /></span><span class="secretArea"></span>\
                 </td>\
             </tr>\
             <tr class="profileTr2">\
              <td class="profileTd" colspan="2">\
                  <table class="profileInfo" cellpadding="0" cellspacing="0" border="0">\
                   <colgroup>\
                    <col class="profileInfoLeftCol">\
                    <col class="profileInfoCenterCol">\
                    <col class="profileInfoRightCol">\
                   </colgroup>\
                      <tr>\
                          <td class="profileInfoLeft"><span class="profileList">'+JSV.getLang('HumanViewer','company')+' : </span><span class="dataText"><span class="profile_company" /></span></td>\
                             <td class="profileInfoCenter"></td>\
                             <td class="profileInfoRight"><span class="profileList">'+JSV.getLang('HumanViewer','department')+' : </span><span class="dataText"><span class="profile_department" /></span></td>\
                         </tr>\
                         <tr>\
                          <td class="profileInfoLeft"><span class="profileList">'+JSV.getLang('HumanViewer','office')+' : </span><span class="dataText"><span class="profile_officePhone" /></span></td>\
                             <td class="profileInfoCenter"></td>\
                             <td class="profileInfoRight"><span class="profileList">'+JSV.getLang('HumanViewer','fax')+' : </span><span class="dataText"><span class="profile_fax" /></span></td>\
                         </tr>\
                         <tr>\
                          <td class="profileInfoLeft"><span class="profileList">'+JSV.getLang('HumanViewer','mobile')+' : </span><span class="dataText"><span class="profile_mobilePhone" /></span></td>\
                             <td class="profileInfoCenter"></td>\
                             <td class="profileInfoRight"><span class="profileList">'+JSV.getLang('HumanViewer','email')+' : </span><span class="dataText"><span class="profile_email" /></span></td>\
                         </tr>\
                         <tr>\
                          <td class="profileInfoLeft"><span class="profileList">'+JSV.getLang('HumanViewer','position')+' : </span><span class="dataText"><span class="profile_position" /></span></td>\
                             <td class="profileInfoCenter"></td>\
                             <td class="profileInfoRight"><span class="profileList">'+JSV.getLang('HumanViewer','class')+' : </span><span class="dataText"><span class="profile_class" /></span></td>\
                         </tr>\
                         <tr>\
                          <td class="profileInfoLeft"><span class="profileList">'+JSV.getLang('HumanViewer','work')+' : </span><span class="dataText"><span class="profile_work" /></span></td>\
                             <td class="profileInfoCenter"></td>\
                             <td class="profileInfoRight"><span class="profileList">'+JSV.getLang('HumanViewer','companyAddr')+' : </span><span class="dataText"><span class="profile_companyAddr" /></span></td>\
                         </tr>\
                     </table>\
                 </td>\
             </tr>\
             <tr class="profileTr3">\
              <td class="nameCardTd" />\
                 <td class="buttonTd">\
                  <div class="contact">\
                         <div>\
                          <img class="mailIcon" src="../../../img/btn/ekp/hnm/icon_color_mail.gif" width="12" height="10"><a class="mail" href="#" hidefocus="true">'+JSV.getLang('HumanViewer','sendingEmail')+'</a>\
                         </div>\
                     </div>\
                 </td>\
                 <td class="addPeopleTd buttonTd" align="right" />\
             </tr>\
   </table>\
     </div>\
 </div>').addClass(this.className).prependTo(parent);}
HumanViewer.prototype.setValue=function(value){var pictureViewer=new ImageViewer(this.widget.find('.photoArea'),{'className':'photoWrapper','width':this.pictureWidth,'height':this.pictureHeight});if(value.picture){var type=value.picture.type;var path=value.picture.path;if(path){pictureViewer.setAlt(JSV.getLang('HumanViewer','pictureAlt'));pictureViewer.setSrc(JSV.getContextPath('/jsl/inline/ImageAction.Download/?type='+type+'&path='+path));}else{pictureViewer.setSrc(JSV.getContextPath('/sys/jsv/usr/photo.jpg'));}}
this.widget.find('.profileName').text(value.prsnName);var intmtCodeViewer=new ComboViewer(this.widget.find('.intmtCode'),{className:'state',options:JSV.getLang('HumanViewer','intmtCodeOptions')});intmtCodeViewer.widget.addClass('stateIcon'+value.intmtCode);intmtCodeViewer.setValue(value.intmtCode);this.widget.find('.regidate').text(DateFormat.format(new Date(value.lastUpdt),JSV.getLang('DateFormat','dateType1')));new ComboViewer(this.widget.find('.secretArea'),{className:'secret',options:JSV.getLang('HumanViewer','secretCodeOptions')}).setValue(value.scrtLevel);new RfrnOrgViewer(this.widget.find('.profile_company')).setValue(value.orgInfo);this.widget.find('.profile_department').text(value.officeDprtName);this.widget.find('.profile_officePhone').text(value.officePhn);this.widget.find('.profile_fax').text(value.officeFax);this.widget.find('.profile_mobilePhone').text(value.cellPhone);this.widget.find('.profile_email').text(value.email);this.widget.find('.profile_position').text(value.officeTitle);this.widget.find('.profile_class').text(value.officeGradeName);this.widget.find('.profile_work').text(value.officeCharBsns);if(this.style.mapKey){new NaverMapAddressViewer(this.widget.find('.profile_companyAddr'),{key:this.style.mapKey}).setValue(value.officeAdrs);}else{new AddressFieldViewer(this.widget.find('.profile_companyAddr')).setValue(value.officeAdrs);}
if(value.nameCard&&value.nameCard.path){new NameCardViewer(this.widget.find('.nameCardTd'),this.style).setValue(value.nameCard);}
if(value.email&&value.email!=''){this.widget.find('.mail').click(this,function(event){HumanMailManager.mailPopUp(value.id,event.data.style.emailName,'2',JSV.getParameter('id'));return false;});}else{this.widget.find('.mail').parent().css('display','none');}
if(!this.style.isScrap){new KButton(this.widget.find('.addPeopleTd'),JSV.getLang('HumanViewer','addPeople')).onclick=function(){window.open(JSV.getContextPath(JSV.getModuleUrl('/ekp/hnm/scrap/addScrapPopup.jsp'),'code='+1100+'&id='+value.gid+'&prsnName='+JSV.encode(value.prsnName)),'addScrapPopup','width=300,height=400,scrollbars=yes,status=no,toolbar=no,menubar=no,location=no,resizable=no');}}}
function RgstUserThumbColumn(parent,style){this.parent=parent;this.style=style||{};this.className=this.style.className||'EmpThumbColumn';this.empViewer=eval(this.style.empViewer||'AnchorEmp.generateBoldAnchor');this.empImageViewer=eval(this.style.EmpImageViewer||'EmpImageViewer');parent.appendChild(this);}
RgstUserThumbColumn.prototype.setValue=function(element,td,tr){var widget=$('<table><tr>\
      <td class="photoDiv"></td>\
      <td class="empDiv"></td>\
     </tr></table>').addClass(this.className).appendTo(td).get(0);var empArea=$(widget).find('td.empDiv').get(0);var photoArea=$(widget).find('td.photoDiv').get(0);if(element.thumbPath&&element.thumbCode){var url=JSV.getContextPath('/jsl/inline/ImageAction.Download?path='+element.thumbPath+'&type='+element.thumbCode);$('<img>').addClass('thumb').appendTo(photoArea).bind('click',this,function(e){if(element.id)RgstUserThumbColumn.popup(element.id);}).bind('mouseover',this,function(e){$(this).toggleClass('thumb').toggleClass('thumbOver');}).bind('mouseout',this,function(e){$(this).toggleClass('thumb').toggleClass('thumbOver');}).attr('src',url).error(function(){$(this).attr('src',JSV.getContextPath(EmpImageViewer.DEFAULT_IMAGE));});}else{var image=new this.empImageViewer(photoArea,this.style);image.setValue(element)
image.onclick=function(){if(element.id)RgstUserThumbColumn.popup(element.id);}}
$(this.empViewer(element.rgstUserid,element[this.style.displayName||'name'])).appendTo(empArea);$(td).attr('align',this.style.align||'center');if(this.style.width){$(td).width(this.style.width);}}
RgstUserThumbColumn.popup=function(id){var u='/ekp/hnm/friend/usr.read.jsp';var q='id='+id;var n='Read';var f='width=550,height=350,scrollbars=yes,status=no,toolbar=no,menubar=no,location=no,resizable=no';var url=JSV.getContextPath(JSV.getModuleUrl(u),q);window.open(url,n,f);}
function popUpRead(id){var u='/ekp/hnm/human/usr.id.read.jsp';var q='org=true&id='+id;var n='';var f='width=850,height=600,scrollbars=yes,status=no,toolbar=no,menubar=no,location=no,resizable=no';var url=JSV.getContextPath(JSV.getModuleUrl(u),q);window.open(url,n,f);}
