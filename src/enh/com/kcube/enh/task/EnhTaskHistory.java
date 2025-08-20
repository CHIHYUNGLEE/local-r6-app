package com.kcube.enh.task;

import com.kcube.doc.hist.HistoryManager;
import com.kcube.doc.opn.Opinion;
import com.kcube.enh.Enh;
import com.kcube.group.mail.GroupMailManager;

/**
 * 고도화관리 역할 로그 관리
 */
public class EnhTaskHistory
{
	/**
	 * 고도화 역할에 의견이 등록됨.
	 */
	public static final Integer OPINION = new Integer(24005);
	/**
	 * 고도화 역할에 의견이 추가됨.
	 */
	public static final Integer ADD_OPINION = new Integer(24006);
	/**
	 * 고도화 역할에 의견이 삭제됨
	 */
	public static final Integer DEL_OPINION = new Integer(24007);
	/**
	 * 고도화 역할에 의견이 수정됨.
	 */
	public static final Integer UPDATE_OPINION = new Integer(24008);
	/**
	 * 고도화 역할에 대한 의견을 삭제함
	 */
	public static final Integer OPINION_REMOVED = new Integer(24009);

	/**
	 * 의견 추가시 로그를 남긴다.
	 */
	static void addOpinion(EnhTask item) throws Exception
	{
		HistoryManager.history(ADD_OPINION, item, item.getId());
	}

	/**
	 * 의견 수정시 로그를 남긴다.
	 */
	static void updateOpinion(EnhTask item) throws Exception
	{
		HistoryManager.history(UPDATE_OPINION, item, item.getId());
	}

	/**
	 * 의견 삭제시 로그를 남긴다.
	 */
	static void deleteOpinion(EnhTask item) throws Exception
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
	static void deleteOpinion(EnhTask item, Opinion opn) throws Exception
	{
		item.setRefRgstUser(opn.getRgstUser());
		HistoryManager.history(OPINION_REMOVED, item);
	}

	/**
	 * 고도화에 관련 업무를 등록했을때 쪽지를 보낸다.
	 */
	public static void alimiTask(EnhTask server) throws Exception
	{
		GroupMailManager.sendUser(server.getAuthor(), EnhTaskNotify.RoleRegist, server);
	}
}
