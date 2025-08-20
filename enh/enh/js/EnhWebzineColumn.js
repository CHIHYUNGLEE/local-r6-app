function EnhWebzineColumn(parent, style) {
	this.style = style || {};
	this.className = this.style.className || 'EnhWebzineColumn';
	this.comment = this.style.comment || '';
	this.prtContentLine = this.style.prtContentLine || 3; 
	this.attr = this.style.attribute ? this.style.attribute.split(',') : '';
	this.titleRender = this.style.titleRender || 'EnhWebzineColumnStrRender';
	this.status = this.style.status ? this.style.status.split(',') : '';
	this.img = this.style.img || '';
	this.contentHighlight = (this.style.contentHighlight == 'false') ? false : true;
	this.showContent = (this.style.showContent == 'true') ? true : false;
	parent.appendChild(this);
}
EnhWebzineColumn.prototype.onclick = function(href) {
	JSV.doPOST(href);
}
EnhWebzineColumn.prototype.setValue = function(element, td, tr) {
	var table = $('<table>').addClass(this.className).appendTo(td);
	var titleTr = $('<tr class="titleTr">').appendTo(table);
	var contentTr = $('<tr class="contentTr">').appendTo(table);
	var tagsTr = $('<tr class="tagsTr">').appendTo(table);
	var titleTd = $('<td class="titleTd">').appendTo(titleTr);
	var contentTd = $('<td class="contentTd">').appendTo(contentTr);
	var tagsTd = $('<td class="tagsTd">').appendTo(tagsTr);
	this.setTitle(titleTd, element);
	this.setContent(contentTd, element);
	this.setTags(tagsTd, element);
}
EnhWebzineColumn.prototype.setTitle = function(parent, element) {
	var title = element[this.attr[0]]||'';
	var preSize = this.setPre(parent, element);
	var titleColumn = $('<a>').addClass('titleA').attr({'title':title,'href':JSV.mergeXml(this.style.href, element)}).appendTo(parent)
		.bind('click', this, function(e) {
			e.data.onclick(this.href);
			return false;
		});
	preSize += this.setPost(parent, element);
	var titleSize = parseInt($(parent).width()) - preSize ;
	var titleText = EnhWebzineColumn.abbreviateString(title, titleSize);
	titleText = JSV.escapeHtml(titleText);
	var clazz = eval(this.titleRender);
	titleText = new clazz(titleText, element, this.style).getValue();
	titleColumn.html(titleText);
}
EnhWebzineColumn.prototype.setContent = function(parent, element) {
		var content = (element[this.attr[1]])?EnhWebzineColumn.removeTag(element[this.attr[1]]):'';
		content = EnhWebzineColumn.abbreviateString(content, parseInt($(parent).width()) * parseInt(this.prtContentLine)) ;
		$('<a>').addClass('contentA').attr('href', JSV.mergeXml(this.style.href, element)).html(content)
		.bind('click', this, function(e) {
			e.data.onclick(this.href);
			return false;
		}).appendTo(parent);
}
EnhWebzineColumn.prototype.setTags = function(parent, element) {
	var tags = (element[this.attr[2]]) ? element[this.attr[2]].split(', ') : {};
	if (tags.length > 0) {
		for (var i = 0; i < tags.length; i++) {
			var clazz = eval(this.titleRender);
			var tag = new clazz(JSV.escapeHtml(tags[i]), element, this.style).getValue();
			$('<a>').addClass('tagsA').html(tag).bind('click', function(e){
				JSV.setState('com.kcube.doc.list', '1.10..mod_' + $(this).text());
				JSV.doGET('usr.main.jsp');
			}).appendTo(parent);
			if (i != tags.length-1) {
				$(document.createTextNode(', ')).appendTo(parent);
			}
		}
		$(parent).attr('align', this.align);
	} else {
		parent.parent().hide();
	}
}
EnhWebzineColumn.prototype.setPre = function(parent, element) {
	if(this.status != '' && this.imgSrc != '' && element[this.status[0]] == this.status[1]){
		return $('<img>').addClass('icon').attr('src',JSV.getLocaleImagePath(this.img)).appendTo(parent).width();
	}
	return 0 ; 
}
EnhWebzineColumn.prototype.setPost = function(parent, element) {
	var count = 0;
	if (this.style.opnCnt) {
		var opnCnt = element[this.style.opnCnt];
		var id = element['id'];
		if (opnCnt > 0) {
			var opn = $('<font>').addClass('opnFont').appendTo(parent);
			if (this.style.opnView && this.style.opnDelete) {
				opn.html(' &nbsp;[' + opnCnt + ']');
				opn.bind('click', this, function(e) {
					e.data.style.id = id;
					OpnViewer.showPopup(e.data.style);
					return false;
				});
			} else {
				opn.html(' &nbsp;[' + opnCnt + ']');
			}
			count++;
		}
	}
	return count * 22;
}
EnhWebzineColumn.removeTag = function(value){
	return value.replace(/\n/gi, " ").replace(/<SCRIPT.*?\/SCRIPT>.*?/gi, "").replace(/<STYLE.*?\/STYLE>.*?/gi, "").replace(/<.*?>.*?/gi, ""); 
}
EnhWebzineColumn.abbreviateString = function(str, size) {
	var l = 0;
	var newStr = '';
	for (var i=0; i<str.length; i++) {
		if(str.charCodeAt(i) > 128) l += 13;
		if(str.charCodeAt(i) <= 128 && str.charCodeAt(i) > 96) l += 7;
		if(str.charCodeAt(i) <= 96 && str.charCodeAt(i) > 64) l += 9;
		if(str.charCodeAt(i) <= 64) l += 6;
		if(l < size - 24) newStr += str.charAt(i);
	}
	if(l > size - 24) newStr = newStr + '...';
	return newStr;
}
function EnhWebzineColumnStrRender(str, element, style) {
	this.str = str;
	this.element = element;
	this.style = style;
}
EnhWebzineColumnStrRender.prototype.getValue = function() {
	var ts = JSV.getParameter(this.style.ts ? this.style.ts : 'com.kcube.doc.list');
	if (ts) {
		var i = ts.lastIndexOf('.');
		var search = ts.substring(i + 1);
		if (search != '') {
			var arr = search.split('_');
			var attrArr = this.style.attribute.split(',');
			if (attrArr.indexOf(arr[0]) >= 0) {
				return this.highlighting(this.str, arr[1]); 
			}
		}
	}
	return this.str;
}
EnhWebzineColumnStrRender.prototype.highlighting = function(value, highlight) {
	if (value != null && highlight != null) {
		highlight = JSV.escapeHtml(highlight).replace(/([#$^*=+|:?(){}.'\\])/, "\\$1");
		var RegExp = eval("/(" + highlight + ")/gi");
		var emphasis = "<font class='highlightFont'>$1</font>";
		value = value.replace(RegExp, emphasis);
	}
	return value;
}
