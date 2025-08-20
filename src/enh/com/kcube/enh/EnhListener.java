package com.kcube.enh;

import com.kcube.enh.mod.EnhMod;

/**
 * 탭키워드(usr.main.jsp) 리스너 2020-05-14 modifiedEnh, deleteEnh, recoverEnh추가
 */
public interface EnhListener
{
	/**
	 * 관련기술이 등록, 복원된 후 호출 된다.
	 */
	void modregistered(EnhMod server) throws Exception;

	/**
	 * 관련기술이 수정된 후 호출된다.
	 */
	void modified(EnhMod server) throws Exception;

	/**
	 * 관련기술이 삭제된 후 호출된다.
	 */
	void moddeleted(EnhMod server) throws Exception;

	/**
	 * 고도화가 수정 된 후 호출된다
	 */
	void modifiedEnh(Enh server) throws Exception;

	/**
	 * 고도화가 삭제 된 후 호출된다
	 */
	void deleteEnh(Enh server) throws Exception;

	/**
	 * 고도화가 복원 된 후 호출된다
	 */
	void recoverEnh(Enh server) throws Exception;

	/**
	 * 고도화가 폐기 된 후 호출한다
	 */
	void removeEnh(Enh server) throws Exception;
}
