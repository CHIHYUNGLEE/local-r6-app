package com.kcube.enh.task;

import com.kcube.doc.ItemPermission;
import com.kcube.enh.Enh;
import com.kcube.enh.EnhPermission;
import com.kcube.lib.jdbc.DbService;
import com.kcube.sys.usr.UserPermission;

/**
 * 고도화관리 역할 권한 처리
 */
public class EnhTaskPermission
{
	/**
	 * 의견 작성자가 아닌경우 상세 화면에 대한 권한이 없을 때 예외가 발생한다.
	 */
	static void checkUser(EnhTask item) throws Exception
	{
		if (!ItemPermission.isUser(item))
		{
			throw new InvalidAuthor();
		}
	}

	/**
	 * 업무를 사용자가 수정 또는 삭제할 권한이 없을때 예외가 발생한다.
	 */
	public static void checkOwner(EnhTask.Opinion opn) throws Exception
	{
		if (!isRgstUser(opn))
		{
			throw new InvalidAuthor();
		}
	}

	/**
	 * 사용자가 업무를 등록할 수 있는 권한(팀원)이 없는때 예외가 발생한다.
	 */
	public static void checkMbr(long enhId) throws Exception
	{
		Enh item = (Enh) DbService.load(Enh.class, enhId);
		if (!item.isMbr()
			&& !EnhPermission.isPm(item)
			&& !EnhPermission.isOwner(item)
			&& !UserPermission.isAdmin(Enh.class.getName()))
		{
			throw new InvalidMember();
		}
	}

	/**
	 * 현재 사용자가 업무 작성자 또는 관리자인지 구분한다.
	 */
	public static boolean isRgstUser(EnhTask.Opinion opn)
	{
		return (opn.isCurrentOwner() || UserPermission.isAdmin(Enh.class.getName()));
	}

	/**
	 * 사용자가 업무를 등록할 수 있는 권한(팀원)이 없는때 예외가 발생한다.
	 */
	public static void checkTask(long enhId, long userId, int taskCode) throws Exception
	{
		if (EnhTaskSql.existTask(enhId, userId, taskCode))
		{
			throw new InvalidTask();
		}
	}

	/**
	 * 업무를 사용자가 수정 또는 삭제할 권한이 없을때 발생한다.
	 */
	public static class InvalidAuthor extends Exception
	{
		private static final long serialVersionUID = 8581353562764673095L;
	}

	/**
	 * 사용자가 고도화 팀원에 등록되지 않아서 업무 등록 권한이 없을때 발생한다.
	 */
	public static class InvalidMember extends Exception
	{
		private static final long serialVersionUID = -712918163458617761L;
	}

	/**
	 * 사용자가 고도화 팀원에 등록되지 않아서 업무 등록 권한이 없을때 발생한다.
	 */
	public static class InvalidTask extends Exception
	{
		private static final long serialVersionUID = -258559572243078264L;
	}

}
