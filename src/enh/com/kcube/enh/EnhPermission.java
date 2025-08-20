package com.kcube.enh;

import com.kcube.doc.ItemPermission;
import com.kcube.enh.mod.EnhMod;
import com.kcube.sys.usr.PermissionDeniedException;
import com.kcube.sys.usr.UserPermission;

/**
 * 고도화관리 권한 처리
 */
public class EnhPermission
{
	/**
	 * 의견 작성자가 아닌경우 상세 화면에 대한 권한이 없을 때 예외가 발생한다.
	 */
	public static void checkUser(Enh item) throws Exception
	{
		if (!ItemPermission.isUser(item))
		{
			throw new InvalidAuthor();
		}
	}

	/**
	 * 의견 작성자가 아닌경우 수정 또는 삭제할 권한이 없을때 예외가 발생한다.
	 */
	public static void checkOwner(Enh.Opinion opn) throws Exception
	{
		if (!isRgstUser(opn))
		{
			throw new InvalidAuthor();
		}
	}

	/**
	 * 현재 사용자가 고도화 작성자 또는 관리자인지 구분한다.
	 */
	public static boolean isRgstUser(Enh.Opinion opn)
	{
		return (opn.isCurrentOwner() || UserPermission.isAdmin(Enh.class.getName()));
	}

	/**
	 * 고도화를 사용자가 수정 또는 삭제할 권한이 없을때 발생한다.
	 */
	public static class InvalidAuthor extends Exception
	{
		private static final long serialVersionUID = -1870641072333932424L;
	}

	/**
	 * 고도화의 PM이 아니면 익셉션 처리
	 * @throws Exception
	 */
	public static void checkPm(Enh enh) throws Exception
	{
		if (!isPm(enh))
		{
			throw new PermissionDeniedException();
		}
	}

	/**
	 * 고도화의 PM인지의 여부를 돌려준다.
	 */
	public static boolean isPm(Enh enh)
	{
		if (enh.isCurrentPm())
		{
			return true;
		}
		return false;
	}

	/**
	 * 고도화의 등록자가 아니면 익셉션 처리
	 * @throws Exception
	 */
	public static void checkOwner(Enh enh) throws Exception
	{
		if (!isOwner(enh))
		{
			throw new PermissionDeniedException();
		}
	}

	/**
	 * 고도화의 PM인지의 여부를 돌려준다.
	 * @throws Exception
	 */
	public static boolean isPmOwner(Long id) throws Exception
	{
		Enh enh = (Enh) EnhAction._storage.load(id);
		if (enh.isCurrentPm())
		{
			return true;
		}
		else if (isOwner(enh))
		{
			return true;
		}
		return false;
	}

	/**
	 * 고도화의 등록자인지의 여부를 돌려준다.
	 */
	public static boolean isOwner(Enh enh)
	{
		if (enh.isCurrentOwner())
		{
			return true;
		}
		return false;
	}

	/**
	 * 고도화에 권한이 없으면 아니면 익셉션 처리(등록자, PM, ADMIN)
	 * @throws Exception
	 */
	public static void checkEnh(Enh enh) throws Exception
	{
		if (!isPm(enh) && !isOwner(enh) && !UserPermission.isAdmin(Enh.class.getName()))
		{
			throw new PermissionDeniedException();
		}
	}

	/**
	 * 고도화의 참여자(팀원)인지의 여부를 돌려준다.
	 * @throws Exception
	 */
	public static boolean isMbr(Long id) throws Exception
	{
		Enh enh = (Enh) EnhAction._storage.load(id);
		if (enh.isMbr())
		{
			return true;
		}
		return false;
	}
	
	/**
	 * 고도화의 참여자(팀원)인지의 여부를 돌려준다.
	 * @throws Exception
	 */
	public static boolean isMbr(Enh enh) throws Exception
	{
		if (enh.isMbr())
		{
			return true;
		}
		return false;
	}

	/**
	 * 탭의 등록자인지의 여부를 돌려준다.
	 */
	public static boolean isModOwner(EnhMod mod)
	{
		if (mod.isCurrentOwner())
		{
			return true;
		}
		return false;
	}

	/**
	 * 고도화에 권한이 없으면 아니면 익셉션 처리(등록자, PM, ADMIN, 참여인원, 탭등록자)
	 * @throws Exception
	 */
	public static void checkEnhMod(EnhMod mod, Enh enh) throws Exception
	{
		if (!isPm(enh)
			&& !isOwner(enh)
			&& !UserPermission.isAdmin(Enh.class.getName())
			&& !isMbr(enh)
			&& !isModOwner(mod))
		{
			throw new PermissionDeniedException();
		}
	}
}
