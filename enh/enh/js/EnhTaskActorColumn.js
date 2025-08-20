/**
 * 고도화 목록화면에서 고도화 팀원들 출력
 * @param parent
 * @param style
 * @returns
 */
function EnhTaskActorColumn(parent, style) {
	this.style = style || {};
	this.className = this.style.className || 'EnhTaskActorColumn';
	parent.appendChild(this);
}
EnhTaskActorColumn.prototype.setValue = function(element, td, tr) {
	var $td = $(td);
	var id = element[this.style.id || 'id'];
	var json = JSV.loadJSON(EnhTaskActorColumn.ACTORLIST + '?id=' + id).array;
	var name = title =  _name = JSV.getLocaleStr(json[0].name);
	var uid = json[0].id;
	//var name = title = _name = JSV.getLocaleStr(element[this.style.name || 'actorName']);
	//var uid = element[this.style.uid || 'actorUserId'];
	var cnt = parseInt(element[this.style.cnt || 'actorCnt']);
	if (cnt > 1) {
		var nobr = $('<nobr>', {'class':this.className}).appendTo(td);
		name  += '...';
		title = '';//JSV.merge(JSV.getLang('EnhTaskActorColumn', 'moreThanOne'), {cnt:--cnt});
		nobr.css('cursor', 'pointer').data({'name': _name, 'id' : id}).on('click', this, function(e){
			var $this = $(this);
			var rId = $(this).data('id');
			var name = $(this).data('name');
			if (EnhTaskActorColumn.itemid && EnhTaskActorColumn.itemid == rId){
				e.data.changed = false;
				e.data.toggleList();
			} else if ($this.data('array')) {
				e.data.changed = true;
				e.data.actorName = name;
				e.data.actors = $this.data('array');
				EnhTaskActorColumn.itemid = id;
				e.data.reloadList($td.children('nobr:first'));
			} else {
				$.getJSON(JSV.getContextPath(EnhTaskActorColumn.ACTORLIST + '?id=' + id), 
					function(data, status){
						if (status == 'success') {
							e.data.changed = true;
							e.data.actorName = name;
							e.data.actors = data.array;
							EnhTaskActorColumn.itemid = id;
							e.data.createList($td.children('nobr:first'));
							$this.data('array', data.array);
						}
					}
				)
			}
			e.stopPropagation();
		});
		nobr.text(name || '-').attr('title', title || '');
	} else {
		if (cnt > 0) {
			var nobr = $('<div>', {'class':this.className}).appendTo(td);
			if (uid) {
				nobr.append(AnchorEmp.generateAnchor(uid, name));
			} else {
				$.getJSON(JSV.getContextPath(EnhTaskActorColumn.ACTORLIST + '?id=' + id), 
					function(data, status){
						if (status == 'success') {
							nobr.append(AnchorEmp.generateAnchor(data.array[0].id, data.array[0].name));
						}
					}
				);
			}
		}
	}
	$td.attr('align', this.style.align || 'center');
}
EnhTaskActorColumn.prototype.createList = function(widget){
	this.createLayer();
	this.reloadList(widget);
}
EnhTaskActorColumn.prototype.reloadList = function(widget){
	this.addActors();
	this.setPosition(widget);
	this.toggleList();
}
EnhTaskActorColumn.prototype.createLayer = function(){
	var widget = $('#EnhTaskActorColumn_moveDiv');
	this.layer = layer = (widget.length == 0) ? $('<div>', { 
			id: 'EnhTaskActorColumn_moveDiv',
			'class':'EnhTaskActorColumn_moveDiv'}).appendTo('body') : widget;
	this.layer.bind('click', function(e){
		e.stopPropagation();
	});
}
EnhTaskActorColumn.prototype.setPosition = function(widget){
	var ofs  = widget.offset();
	var top  = ofs.top + widget.height() + 3;
	var left = ofs.left;
	this.layer.css({'top': top, 'left':left});
}
EnhTaskActorColumn.prototype.addActors = function(){
	var layer = this.layer.empty();
	$.each(this.actors, function(i) {
		$('<div>').addClass('actors').append(AnchorEmp.generateAnchor(this.id, this.name)).appendTo(layer);
	});
}
EnhTaskActorColumn.prototype.toggleList = function() {
	var layer = this.layer;
	if (layer.is(':visible') && !this.changed) {
		this.hideList();
	} else {
		layer.show();
		$(document).one('click.EnhTaskActorColumn', this, function(e) {
			e.data.hideList();
		});
	}
}
EnhTaskActorColumn.prototype.hideList = function() {
	this.layer.fadeOut();
}
EnhTaskActorColumn.ACTORLIST = '/jsl/EnhUser.GetMbrs.json';
