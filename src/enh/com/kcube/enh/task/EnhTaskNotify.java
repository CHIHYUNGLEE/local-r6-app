package com.kcube.enh.task;

/**
 * 고도화관리 역할 통보 내용
 */
public interface EnhTaskNotify
{
	public static final String RoleRegist = "com.kcube.enh.task.EnhTaskNotify.roleRegist";

	/**
	 * PM이 역할 등록시 등록한 팀원에게 알림 쪽지 발송
	 */
	public boolean isRoleRegistMail();

	public boolean isRoleRegistMsg();

	public String getRoleRegistTitle();

	public String getRoleRegistContent();
}