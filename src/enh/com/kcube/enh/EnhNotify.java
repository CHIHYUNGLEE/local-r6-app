package com.kcube.enh;

/**
 * 고도화관리 통보 내용
 */
public interface EnhNotify
{
	public static final String MBRREGIST = "com.kcube.enh.EnhNotify.mbrRegist";
	public static final String MBRREMOVE = "com.kcube.enh.EnhNotify.mbrRemove";
	public static final String MODIFY = "com.kcube.enh.EnhNotify.modify";
	public static final String REMOVE = "com.kcube.enh.EnhNotify.remove";

	/**
	 * 팀원 등록시 새로운 팀원에게 알림 쪽지 발송
	 */
	public boolean isMbrRegistMail();

	public boolean isMbrRegistMsg();

	public String getMbrRegistTitle();

	public String getMbrRegistContent();

	/**
	 * 팀원 삭제시 새로운 팀원에게 알림 쪽지 발송
	 */
	public boolean isMbrRemoveMail();

	public boolean isMbrRemoveMsg();

	public String getMbrRemoveTitle();

	public String getMbrRemoveContent();

	/**
	 * 고도화 수정시 기존 팀원에게 알림 쪽지 발송
	 */
	public boolean isModifyMail();

	public boolean isModifyMsg();

	public String getModifyTitle();

	public String getModifyContent();

	/**
	 * 고도화 삭제시 모든 팀원에게 알림 쪽지 발송
	 */
	public boolean isRemoveMail();

	public boolean isRemoveMsg();

	public String getRemoveTitle();

	public String getRemoveContent();
}
