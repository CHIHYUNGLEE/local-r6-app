/**
 * 자동완성을 출력한다.
 * 
 * @class 자동완성 컴퍼넌트
 * @param parent
 *            표시되는 위치
 * @param component
 *            추가되는 component
 * @param style
 *            style.count : 목록표시 수
 */
function EnhAutoUserNameComplete(widget, parent, component, style) {
	this.component = component;
	this.parent = $(parent);
	this.widget= $(widget);
	this.style = style || {};
	this.className = this.style.className || 'EnhAutoUserNameComplete';
	this.listCount = this.style.count || EnhAutoUserNameComplete.DEFAULT_COUNT;
	this.preValue = '';
	this.canvas = $('<div>').addClass(this.className).appendTo('body');
	this.iframe = $('<iframe class="iframe"></iframe>').css('opacity', '0.0').appendTo(this.canvas);
	this.widget = $('<div>').addClass('widget').css('visibility', 'hidden').appendTo(this.canvas);
	this.unList = $('<ul>').addClass('unlist').appendTo(this.widget);
	this.appendParentEvent();
	this.url = this.style.url || EnhAutoUserNameComplete.SEARCH_URL;
	this.loadFlag = false;
}
EnhAutoUserNameComplete.prototype.setPosition = function() {
	var topMargin = 3;
	var top = this.parent.offset().top + this.parent.height() + topMargin;
	var left = this.parent.offset().left;
	var width = this.parent.width();
	this.canvas.css({
		'left' : left,
		'top' : top + 10.5,
		'width': '15%'
	});
}
EnhAutoUserNameComplete.prototype.loadData = function(keyword) {
	this.loadFlag = false;
	this.clear();
	if (this.timeout)
		clearTimeout(this.timeout);
	if (!keyword)
		return;
	var _this = this;
	this.setPosition();
	this.timeout = setTimeout(function() {
		$.ajax({
			url : JSV.getContextPath(_this.url),
			context : _this,
			dataType : 'json',
			data : {
				'key' : keyword,
				'count' : _this.listCount
			},
			async : false,
			success : function(data, status) {
				for ( var i = 0; i < data.array.length; i++) {
					this.createItem(data.array[i],keyword);
				}
				this.showLayer();
			},
			error : function(xhr) {
				alert(JSV.getLang('EnhAutoUserNameComplete', 'error'));
			}
		})
	}, 300);
}
EnhAutoUserNameComplete.prototype.clear = function() {
	this.unList.empty();
	this.preText = null;
	this.canvas.hide();
	this.value = null;
}
EnhAutoUserNameComplete.prototype.createItem = function(jsonObj,key) {
	this.widget.css('visibility', 'visible');
	var html = jsonObj.title;
	var RegExp = eval("/(" + key + ")/gi");
	var emphasis = '<strong>$1</strong>';
	html = html.replace(RegExp, emphasis);
	tmp = $('<a>').attr('key', jsonObj.key).attr('title', jsonObj.title).addClass('linker');
	
	var textArea = $('<nobr>').html(html);
	var tmp ;
	
	$('<li>').addClass('item').append(
			tmp
			.bind('click', this, function(e) {
				e.data.doSelect($(this).parent());
				e.data.bindDisplay();
				e.data.clear();
			}).unbind('mouseover.EnhAutoUserNameComplete')
			.bind('mouseover.EnhAutoUserNameComplete', this,
					function(e) {
						e.data.parent.unbind('blur.EnhAutoUserNameComplete');
						$(this).addClass('selected');
			})
			.unbind('mouseout.EnhAutoUserNameComplete')
			.bind('mouseout.EnhAutoUserNameComplete',
					this, function(e) {
						e.data.bindDisplay();
						$(this).removeClass('selected');
			}).append(textArea)
		).appendTo(this.unList);
}
EnhAutoUserNameComplete.prototype.doSelect = function(item) {
	this.setItemData(item);
	JSV.notify(null, this, 'autoComplete');
}
EnhAutoUserNameComplete.prototype.moveNext = function() {
	var item;
	if (this.unList.children().length == 0)
		return;
	if ($(this.unList).find('li.selected').length == 0) {
		item = $(this.unList).children(':first');
		item.addClass('selected');
	} else {
		item = $(this.unList).find('li.selected').removeClass('selected');
		if (item.next().get(0) == undefined) {
			item = $(this.unList).children(':first').addClass('selected');
		} else {
			item = item.next().addClass('selected');
		}
	}
	this.setItemData(item);
	item.get(0).focus();
}
EnhAutoUserNameComplete.prototype.setItemData = function(item){
	var val = item.children(':first');
	this.parent.attr('title', val.attr('title'));
	this.value = val;
}
EnhAutoUserNameComplete.prototype.movePrev = function() {
	var item;
	if (this.unList.children().length == 0)
		return;
	if ($(this.unList).find('li.selected').length == 0) {
		item = $(this.unList).children(':last');
		item.addClass('selected');
	} else {
		item = $(this.unList).find('li.selected').removeClass('selected');
		if (item.prev().get(0) == undefined) {
			item = $(this.unList).children(':last').addClass('selected');
		} else {
			item = item.prev().addClass('selected');
		}
	}
	this.setItemData(item);
	item.get(0).focus();
}
EnhAutoUserNameComplete.prototype.getSelected = function() {
	return this.value;
}
EnhAutoUserNameComplete.prototype.firstSelect = function() {
	var item;
	item = $(this.unList).children(':first');
	this.setItemData(item);
}
EnhAutoUserNameComplete.prototype.appendParentEvent = function() {
	this.parent.unbind('keyup.EnhAutoUserNameComplete').bind(
			'keyup.EnhAutoUserNameComplete',
			this,
			function(e) {
				if (e.keyCode == EnhAutoUserNameComplete.BUTTON_UP
						|| e.keyCode == EnhAutoUserNameComplete.BUTTON_DOWN
						|| e.keyCode == EnhAutoUserNameComplete.BUTTON_ENTER)
					return;
				var value = $.trim(e.data.parent.val());
				if (e.data.preText && (e.data.preText == value))
					return;
				e.data.loadData(value);
				e.data.preText = value;
			}).unbind('keydown.EnhAutoUserNameComplete').bind(
			'keydown.EnhAutoUserNameComplete',
			this,
			function(e) {
				if (e.keyCode == EnhAutoUserNameComplete.BUTTON_UP) {
					e.data.movePrev();
				} else if (e.keyCode == EnhAutoUserNameComplete.BUTTON_DOWN) {
					e.data.moveNext();
				} else if ((e.keyCode == EnhAutoUserNameComplete.BUTTON_ENTER
						|| (!e.shiftKey && e.keyCode == EnhAutoUserNameComplete.BUTTON_COMMA)
						|| e.keyCode == EnhAutoUserNameComplete.BUTTON_TAB) && e.data.loadFlag == true) {
					if (e.data.timeout)
						clearTimeout(e.data.timeout);
					if (e.data.unList.children().length > 0 && !e.data.getSelected())
						e.data.firstSelect();
					JSV.notify(null, e.data, 'autoComplete');
					e.data.clear();
				}
			});
	this.bindDisplay();
}
EnhAutoUserNameComplete.prototype.showLayer = function() {
	var count = this.unList.children().length;
	if (count > 0) {
		var height = parseInt(this.unList.children(':first').css('height'));
		height = (height * count) + 5;
		this.iframe.height((height > 237) ? 238 : height);
		this.canvas.show();
	}
	this.loadFlag =true;
}
EnhAutoUserNameComplete.prototype.bindDisplay = function() {
	this.parent.unbind('blur.EnhAutoUserNameComplete').bind('blur.EnhAutoUserNameComplete', this, function(e) {
		e.data.clear();
	}).unbind('focus.EnhAutoUserNameComplete').bind('focus.EnhAutoUserNameComplete', this, function(e) {
		e.data.showLayer();
	});
}
EnhAutoUserNameComplete.SEARCH_URL = '/jsl/EnhModUser.SelectModLikeName.json';
EnhAutoUserNameComplete.BUTTON_TAB = 9;
EnhAutoUserNameComplete.BUTTON_UP = 38;
EnhAutoUserNameComplete.BUTTON_DOWN = 40;
EnhAutoUserNameComplete.BUTTON_ENTER = 13;
EnhAutoUserNameComplete.BUTTON_COMMA = 188;
EnhAutoUserNameComplete.DEFAULT_COUNT = 10;
