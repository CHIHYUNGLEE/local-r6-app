/**
 * 탭의 순서를 설정하는 컴포넌트
 */
function TabSortAdmin(parent, style) {
	this.style = style || {};
	this.readUrl = this.style.readUrl;
	this.tabUrl = this.style.tabUrl;
	this.writeUrl = this.style.writeUrl;
	this.isManager = (null != this.style.isManager) ? eval(this.style.isManager) : false;
	this.isUsr = (null != this.style.isUsr) ? eval(this.style.isUsr) : false;
	this.className = this.style.className || 'ModGroupTopMenuAdmin';

	this.widget = $('<div>').addClass(this.className).css({'overflow-x':'auto'}).appendTo(parent);
	this.table = $('<table cellspacing="0" cellpadding="0">').addClass('menuTable').appendTo(this.widget);
	var menuTr = $('<tr>').appendTo(this.table);
	this.tabTd = $('<td>').addClass('menuTd').appendTo(menuTr);
	this.toolTd = $('<td>').addClass('menuTd').appendTo(menuTr);
	
	this.tabArea = $('<table>').addClass('tableArea').css({'border-spacing':'0px'}).appendTo(this.tabTd);
	this.toolArea = $('<table>').addClass('tableArea').css({'border-spacing':'0px'}).appendTo(this.toolTd);
}
TabSortAdmin.prototype.setValue = function(value) {
	var count = value.length;
	JSV.notify(count, this, 'updateCount');
	this.value = value;
	this.load();
}
TabSortAdmin.prototype.load = function() {
	var obj = this;
	if (!this.menuArea) {
		if (this.isManager) {
			this.menuArea = $('<tr>').addClass('menuArea').appendTo(this.tabArea).sortable({
				axis : 'x',
				tolerance : 'pointer',
				opacity : 0.5,
				start: function( event, ui ) {
					
				},
				stop: function( event, ui ) {
					var ctx = new Object();
					ctx.item = obj.getJSON();
					JslAction.call(JSV.getModuleUrl('/jsl/EnhModUser.UpdateModSortAdmin.jsl'), ctx, tabSortAdminReload);
				}
			}).disableSelection();
		} else {
			this.menuArea = $('<tr>').addClass('menuArea').appendTo(this.tabArea);
		}
	}
	$(this.value).each(function(n) {
		this.method = 'edit';
		obj.addMenu(this,n);
	});
	
		//var writeUrl = this.writeUrl;
//		this.toolArea.empty();
//		var toolTr = $('<tr>').addClass('menuArea').appendTo(this.toolArea);
		if(this.isUsr) {
			var addTd = $('<td>').addClass('header').css({'border':'none','cursor':'pointer','padding':'5px 10px 0px 10px'}).attr('enhid', JSV.getParameter('id')).attr('title', JSV.getLang('TabSortAdmin','help')).appendTo(this.menuArea);
			$('<img>').addClass('plus').attr('src', JSV.getContextPath('/img/component/maintitleviewer/btn_slot_folded.gif')).appendTo(addTd);
			$(addTd).bind('click', this, function(e) {
				if(e.data.writeBtnClick){
					e.data.writeBtnClick();
				}
			});
		}
}
TabSortAdmin.SelectId= null;
TabSortAdmin.prototype.addMenu = function(menu,index) {
	var readUrl = this.readUrl;
	var tabUrl = this.tabUrl;
	var isDel = false;
	if (this.isManager) {
		var tableTd = $('<td nowrap>').addClass('header').attr('id', menu.id).attr('enhid', menu.enhId).attr('seq', menu.seqOrder).appendTo(this.menuArea);
	} else {
		var tableTd = $('<td nowrap>').addClass('header').css({'cursor':'pointer'}).attr('id', menu.id).attr('enhid', menu.enhId).attr('seq', menu.seqOrder).appendTo(this.menuArea);
	}
	var titleDiv = $('<div>').addClass('title').text(menu.title).appendTo(tableTd);
	if (this.isManager) {
		$('<img>').addClass('minus').css({'cursor':'pointer','height':'11px','width':'11px','margin-left':'5px'}).attr('src', JSV.getContextPath('/img/component/plan/btn_close.gif'))
		.appendTo(titleDiv).bind('click', this, function(e) {
			if (confirm(JSV.getLang('TabSortAdmin','del'))) {
				var ctx = new Object();
				JslAction.call(JSV.getModuleUrl('/jsl/EnhModUser.DoRemove.jsl?modid='+menu.id), ctx, function (){
					tabSortAdminReload(menu.id);
					e.data.seqHover(menu.seqOrder, menu.enhId);
				});
			}
			isDel = true;
		});
	}
	$.data(tableTd.get(0), 'menu', menu);
	$(tableTd).bind('click', this, function(e) {
		if (!isDel) {
			var url;
			if ($(this).attr('id') == 'k'+JSV.getParameter('id')) {
				url = readUrl;
			} else {
				e.data.valueHover($(this).attr('id'));
				url = tabUrl;
			}
			if (JSV.getParameter('tr')) {
				JSV.setState('tr', JSV.getParameter('tr'));
			}
			JSV.setState('modid', $(this).attr('id'));
			JSV.setState('enhid', $(this).attr('enhid'));
			JSV.setState('com.kcube.doc.list', null);
			
			JSV.doGET(url,'modReadFrame');
		}
		isDel = false;
	});
	if(TabSortAdmin.SelectId != null && tableTd.attr('id') == TabSortAdmin.SelectId){
		tableTd.trigger('click');
	}else if(index == 0){
		tableTd.trigger('click');
	} 
}
TabSortAdmin.prototype.reset = function() {
	this.menuArea.empty();
	this.setValue(this.value);
}
TabSortAdmin.prototype.isExists = function(obj) {
	var exists = false;
	this.menuArea.find('.header').each(function(n) {
		var menu = $.data(this, 'menu');
		if ('delete' != menu.method && menu.url == obj.url) {
			exists = true;
		}
	});
	return exists;
}
TabSortAdmin.prototype.getVisibleCount = function() {
	var cnt = 0;
	this.menuArea.find('.header').each(function(n) {
		var menu = $.data(this, 'menu');
		if ('delete' != menu.method) {
			cnt++;
		}
	});
	return cnt;
}
TabSortAdmin.prototype.getJSON = function() {
	var obj = new Object();
	obj.modList = [];
	this.menuArea.find('.header').each(function(n) {
		var menuIndex = n;
		var menu = $.data(this, 'menu');
		if(menu) {
			if ('delete' != menu.method) {
					menu.seqOrder = menuIndex;
				if(menu.id) {
					obj.modList.push(menu);
				}
			}
		}
	});
	return JSV.toJSON(obj);
}

TabSortAdmin.prototype.valueHover = function(id) {
	this.menuArea.find('td[id='+id+']').addClass('clicked').siblings('.clicked').removeClass('clicked');
}

TabSortAdmin.prototype.seqHover = function(seq, enhId) {
	if (seq > 0) {
		var seq = seq - 1;
		var modid = this.menuArea.find('td[seq='+seq+']').attr('id');
		if(modid != null) {
			JSV.doGET(this.tabUrl+'?modid='+modid,'modReadFrame');
			this.menuArea.find('td[seq='+seq+']').addClass('clicked').siblings('.clicked').removeClass('clicked');
		} else {
			tabRefresh(enhId);
			JSV.doGET('about:blank','modReadFrame');
		}
	} else {
		var seq = seq;
		var modid = this.menuArea.find('td[seq='+seq+']').attr('id');
		if(modid != null) {
			JSV.doGET(this.tabUrl+'?modid='+modid,'modReadFrame');
			this.menuArea.find('td[seq='+seq+']').addClass('clicked').siblings('.clicked').removeClass('clicked');
		} else {
			tabRefresh(enhId);
			JSV.doGET('about:blank','modReadFrame');
		}
	}
}
TabSortAdmin.prototype.admRomove = function(seq, enhId) {
	var modid = this.menuArea.find('td[seq='+seq+']').attr('id');
	if(modid == null) {
		tabRefresh(enhId);
		JSV.doGET('about:blank','modReadFrame');
	}
}
