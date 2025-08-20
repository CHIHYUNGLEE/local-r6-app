ComboFieldEditor.prototype.refreshByAjaxEnh = function(refreshAjaxOptions) {
	while (this.widget.options.length) {
		this.widget.options[0] = null;
	}

	var u = JSV.getContextPath(refreshAjaxOptions);
	$.ajax({
		url : u,
		async : false,
		context : this,
		dataType : 'json',
		success : function(data, status){
			var options = [];
			var id = this.style.optionValue || 'id';
			var name = this.style.optionText || 'name';
			options.push(JSV.getLang('EnhChart', 'projectSelect'));
			if(data.array){
				$.each(data.array, function(index, value){
					
					options.push(value[id]+':'+value[name]);
				});
			}
			this.init(options);
		},
		error : function(xhr){
			alert('error');
		}
	});
}
