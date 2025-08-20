/**
 * Group Member의 이름을 표시한다.
 * 
 * @class Group Member의 이름을 표시하기 위한 컴퍼넌트
 */
function AnchorMbr() {
}
/**
 * Group Member의 이름 표시를 위한 Anchor Tag를 생성한다.
 * 
 * @param id
 *            사용자 ID
 * @param name
 *            사용자 이름
 */
AnchorMbr.generateAnchor = function(id, name) {
	var anchor = '<a class="AnchorMbr_generateAnchor"  hidefocus="true" onclick="AnchorMbr.showDetail(' + id
			+ ');return false;">' + JSV.getLocaleStr(name) + '</a>';
	return anchor;
}
/**
 * Group Member의 이름 표시를 위한 Anchor Tag를 생성한다.<br>
 * Bold 적용
 * 
 * @param id
 *            사용자 ID
 * @param name
 *            사용자 이름
 */
AnchorMbr.generateBoldAnchor = function(id, name) {
	var anchor = '<a class="AnchorMbr_generateBoldAnchor" hidefocus="true" onclick="AnchorMbr.showDetail(' + id
			+ ');return false;">' + JSV.getLocaleStr(name) + '</a>';
	return anchor;
}
/**
 * Group Member의 프로파일을 보여주기 위한 팝업을 호출한다.
 * 
 * @param id
 *            사용자 ID
 */
AnchorMbr.showDetail = function(id) {
	var u = '/group/gcop/member/gcopEmpDetailPopup.jsp';
	var q = 'userId=' + id;
	var n = 'mbrPopup';
	var f = 'width=481,height=286,scrollbars=no,status=no,toolbar=no,menubar=no,location=no,resizable=no';
	var url = JSV.getContextPath(u, q);
	window.open(url, n, f);
}
