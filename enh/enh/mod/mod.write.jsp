<%@ include file="/sys/jsv/template/template.head.jsp"%>
<%@ include file="/enh/jsv-enh-ext.jsp" %>
<script type="text/javascript">
JSV.Block(function () {
	var template = '<template color="blue" catalog="/enh/mod/catalog.xml.jsp">\
			<header label="<fmt:message key="doc.182"/>"/>\
			<fields class="Array" columns="100px,,,100px,100px,,100px," type="write">\
				<field property="title.tabwrite"/>\
				<field property="pacname.write"/>\
				<field property="content.write"/>\
				<field property="attachments.write"/>\
				<field property="id.hidden"/>\
				<field property="enhId.hidden"/>\
				<field property="seqOrder.hidden"/>\
				<field property="itemTitle.hidden"/>\
			</fields>\
		</template>';
		
	var model = <%
		ctx.setParameter("id", ctx.getParameter("id"));
		ctx.execute("EnhModUser.PreWrite");
	%>;
	
	var t = new ItemTemplate(document.getElementById('main'), template);
	t.setValue(model);
	
	var apply = new KButton(t.layout.bottomCenterArea, <fmt:message key="btn.doc.006"/>);
	apply.onclick = function() {
		if (t.validate('title,content')) {
			var s = t.getChild('attachments');
			s.files = FileFieldEditor.merge(t.getChild('content').getImages(), s.getValue());
			s.toJSON = function() {
				return this.files;
			}
			t.submitInner('/jsl/EnhModUser.DoRegister.json',function(value){
				if(parent){
					parent.tabSortAdminReload(value); // 탭목록을 reload 시켜준다, 글 등록후 생성된 tabid인 value값을 부모함수로 넘겨준다.
				}
			});
		}
	}

	var cancle = new KButton(t.layout.bottomCenterArea, <fmt:message key="btn.pub.cancel"/>);
	cancle.onclick = function() {
		history.back();
	}
});
WebEditor.prototype.onLoaded = function() {
	var component = this;
	if(WebEditor.oEditors.length > 0 && WebEditor.oEditors.getById[this.widget.id]) {
		this.oEditor = WebEditor.oEditors.getById[this.widget.id];
		
		/**
		 * paste 이벤트 핸들
		 */
		this.oEditor = WebEditor.oEditors.getById[this.widget.id];
		
		if(JSV.browser.msieEqualOrOver11 || JSV.browser.chrome ){
			var dd = $(this.oEditor.getWYSIWYGDocument().body);
			dd.bind('paste', this, function(e) {
				var handler = function(file) {
					var reader = new FileReader();
					reader.caller = e.data;
					reader.onload = function(event) {
						var obj = new Object();
						obj.image = event.target.result;
						obj.index = event.target.caller.widget.id;
						if(obj.image != null)
							event.target.caller.imageTrans(obj);
					}
					reader.readAsDataURL(file);	
				};

				// IE
				if (JSV.browser.msie && window && window.clipboardData && window.clipboardData.files) {
					var items = window.clipboardData.files;
					for (var i = 0; i < items.length; ++i) {
						if (items[i].type.indexOf('image/') !== -1) {
							handler(items[i]);
							return false;
						}
					}
				}// Chrome
				else if ( e.originalEvent && e.originalEvent.clipboardData && e.originalEvent.clipboardData.items) {
					var items = e.originalEvent.clipboardData.items;
					for (var i = 0; i < items.length; ++i) {
						var blob = items[i].getAsFile();
						if (!blob || blob == null) {
							return;
						}
						handler(blob);
						return false;
					}
				}
			});
		}

		if (this.isWiki) {
			this.oEditor.cstmParams.itemId = this.itemId;
		}
		if (this.isImage) {
			try {
				this.attachImagesEvent();
				this.parseBuiltInObject();
			} catch (e) {
				//ignore
			}
		}
		$('#modReadFrame', parent.document).css('height', $('body').height() + 4);
	 } else {
		 window.setTimeout(function() { component.onLoaded(); }, 1000);
	 }
}
</script>
<%@ include file="/sys/jsv/template/template.body.jsp" %>
<div id="main"></div>
<%@ include file="/sys/jsv/template/template.tail.jsp" %>