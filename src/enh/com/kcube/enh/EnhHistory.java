package com.kcube.enh;

import java.util.ArrayList;
import java.util.List;

import com.kcube.doc.hist.HistoryManager;
import com.kcube.doc.opn.Opinion;
import com.kcube.group.mail.GroupMailManager;
import com.kcube.sys.usr.User;

/**
 * 고도화관리 로그 관리
 */
public class EnhHistory
{
	/**
	 * 고도화에 의견이 등록됨.
	 */
	public static final Integer OPINION = new Integer(24000);
	/**
	 * 고도화에 의견이 추가됨.
	 */
	public static final Integer ADD_OPINION = new Integer(24001);
	/**
	 * 고도화에 의견이 삭제됨
	 */
	public static final Integer DEL_OPINION = new Integer(24002);
	/**
	 * 고도화에 의견이 수정됨.
	 */
	public static final Integer UPDATE_OPINION = new Integer(24003);
	/**
	 * 고도화에 대한 의견을 삭제함
	 */
	public static final Integer OPINION_REMOVED = new Integer(24004);

	/**
	 * 의견 추가시 로그를 남긴다.
	 */
	static void addOpinion(Enh item) throws Exception
	{
		HistoryManager.history(ADD_OPINION, item, item.getId());
	}

	/**
	 * 의견 수정시 로그를 남긴다.
	 */
	static void updateOpinion(Enh item) throws Exception
	{
		HistoryManager.history(UPDATE_OPINION, item, item.getId());
	}

	/**
	 * 의견 삭제시 로그를 남긴다.
	 */
	static void deleteOpinion(Enh item) throws Exception
	{
		HistoryManager.history(DEL_OPINION, item, item.getId());
	}

	/**
	 * 의견의 덧글 추가시 로그를 남긴다.
	 */
	static void replyOpinion(Enh item) throws Exception
	{
		HistoryManager.history(OPINION, item);
	}

	/**
	 * 의견 삭제시 로그를 남긴다.
	 */
	static void deleteOpinion(Enh item, Opinion opn) throws Exception
	{
		item.setRefRgstUser(opn.getRgstUser());
		HistoryManager.history(OPINION_REMOVED, item);
	}

	/**
	 * 고도화가 등록되거나 수정 되었을때 멤버들에게 쪽지를 보낸다.
	 */

	public static void alimiMbrs(Enh server, Enh client) throws Exception
	{
		// 기존 멤버 LIST
		List<Enh.Mbr> oldMemberList = server.getMbrs();

		// 새로운 멤버를 클라이언트로부터 받아온 LIST
		List<Enh.Mbr> newMemberList = new ArrayList<Enh.Mbr>();
		newMemberList = client.getMbrs();

		for (Enh.Mbr newMember : newMemberList)
		{
			boolean isNewMember = true;
			for (User oldMember : oldMemberList)
			{
				if (oldMember.getUserId().equals(newMember.getUserId()))
				{
					isNewMember = false;
				}
			}
			if (isNewMember == true)
			{
				// 새로운 팀원에게 알림 발송
				GroupMailManager.sendUser(newMember, EnhNotify.MBRREGIST, server);
			}
			else
			{
				// 기존 팀원에게 고도화 수정 알림 발송
				GroupMailManager.sendUser(newMember, EnhNotify.MODIFY, server);
			}
		}

		// 삭제된 멤버의 업무(TASK)를 삭제 및 고도화 삭제를 팀원에게 알림
		for (User oldMember : oldMemberList)
		{
			boolean isDelete = true;
			for (Enh.Mbr newMember : newMemberList)
			{
				if (oldMember.getUserId().equals(newMember.getUserId()))
				{
					isDelete = false;
				}
			}
			if (isDelete == true)
			{
				GroupMailManager.sendUser(oldMember, EnhNotify.MBRREMOVE, server);
			}
		}
	}

	public static void alimiDeleteMbrs(Enh server) throws Exception
	{
		List<Enh.Mbr> MemberList = server.getMbrs();
		for (User member : MemberList)
		{
			GroupMailManager.sendUser(member, EnhNotify.REMOVE, server);
		}
	}
}
