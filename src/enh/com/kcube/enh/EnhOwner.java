package com.kcube.enh;

import java.sql.ResultSet;
import java.util.Date;
import java.util.Iterator;

import com.kcube.enh.mod.EnhMod;
import com.kcube.lib.action.ActionContext;
import com.kcube.lib.event.EventService;
import com.kcube.lib.jdbc.DbService;
import com.kcube.lib.jdbc.DbStorage;
import com.kcube.lib.sql.SqlSelect;

/**
 * 고도화관리 등록자 Action
 */
public class EnhOwner
{
	static DbStorage _storage = new DbStorage(Enh.class);
	private static EnhListener _listener = (EnhListener) EventService.getDispatcher(EnhListener.class);

	/**
	 * 소유자의 권한으로 고도화를 수정한다.
	 */
	public static class DoUpdateByOwner extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			Enh client = unmarshal(ctx);
			Enh server = (Enh) _storage.loadOrCreateWithLock(client.getId());
			EnhPermission.checkEnh(server);
			EnhHistory.alimiMbrs(server, client);

			// cst
			// EnhMod set을 Iterator로 돌려서 ItemTitle를 본 글 제목으로 변경
			Iterator<EnhMod> it = server.getMods().iterator();
			while (it.hasNext())
			{
				EnhMod mod = (EnhMod) DbService.loadWithLock(it.next());
				mod.setItemTitle(client.getEnhName());
			}
			// 2020-05-14 앱 관리 연동으로 인한 추가
			
			// cst
			EnhManager.update(server, client);
		}
	}

	/**
	 * 등록된 고도화를 소유자 권한으로 삭제한다. ENHMOD_ALLDELETE : 9600 (본 글 삭제 시) seq_order : -1 (탭 삭제 시)
	 */
	public static class DoDeleteByOwner extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			Enh server = (Enh) _storage.loadWithLock(ctx.getLong("id"));
			EnhPermission.checkEnh(server);
			EnhHistory.alimiDeleteMbrs(server);

			// 관련기술도 모두 삭제, 팀원이나 역할은 고도화 삭제하면 목록에서 안 보이므로 status 변경하지 않음.
			SqlSelect stmt = EnhSql.getMod(server);
			ResultSet rs = stmt.query();
			while (rs.next())
			{
				Long modId = rs.getLong("modid");
				EnhMod mod = (EnhMod) _modstorage.loadOrCreateWithLock(modId);
				mod.setStatus(EnhMod.ENHMOD_ALLDELETE);
				mod.setLastUpdt(new Date());
				mod.updateVisible(false);
				mod.setSeqOrder(-1); // 본 글 삭제 시 글의 탭들 seq_order값을 -1로 Set한다.
				_listener.moddeleted(mod);
			}
			
			// 2020-05-14 앱 관리 연동으로 인한 추가
			_listener.deleteEnh(server);
			// cst
			EnhManager.delete(server);
		}
	}

	/**
	 * 사용자가 수행한 고도화를 셀렉트 한다.
	 */
	public static class SelectProjectByOwner extends EnhAction
	{
		String mode = "owner";

		public void execute(ActionContext ctx) throws Exception
		{
			String nYear = ctx.getParameter("nYear");
			EnhSql sql = new EnhSql(ctx.getParameter("ts"), ctx.getBoolean("isCountDisplay"));
			SqlSelect select = sql.getProjects(nYear, mode);
			sql.writeTaskListJson(ctx.getWriter(), select, select);
		}
	}

	/**
	 * 사용자가 수행한 업무를 셀렉트 한다.
	 */
	public static class SelectTaskByOwner extends EnhAction
	{
		String mode = "owner";

		public void execute(ActionContext ctx) throws Exception
		{
			String isDel = null; // 삭제된 고도화가 아니므로 null 을 부여함
			long id = 0;
			String enhId = ctx.getParameter("enhId");
			if (enhId != null)
			{
				id = Long.parseLong(enhId);
			}

			String nYear = ctx.getParameter("nYear");

			EnhSql sql = new EnhSql();
			SqlSelect stmt = sql.getTasks(id, nYear, mode, isDel);

			sql.writeTaskListJson(ctx.getWriter(), stmt);
		}
	}

	/**
	 * 사용자가 수행한 업무를 셀렉트 한다.
	 */
	public static class SelectProject extends EnhAction
	{
		String mode = "User";

		public void execute(ActionContext ctx) throws Exception
		{
			// 삭제된 고도화이면 isDel 을 추가한다.
			String isDel = ctx.getParameter("isDel");
			long id = 0;
			String enhId = ctx.getParameter("enhId");
			if (enhId != null)
			{
				id = Long.parseLong(enhId);
			}

			String nYear = ctx.getParameter("nYear");

			EnhSql sql = new EnhSql();
			// 삭제된 고도화 조회인 경우 isDel 값은 null 이 아니다.
			SqlSelect stmt = sql.getTasks(id, nYear, mode, isDel);

			sql.writeTaskListJson(ctx.getWriter(), stmt);
		}
	}

	/**
	 * 사용자가 수행한 업무를 셀렉트 한다.(외부 고도화)
	 */
	public static class SelectGlobalProject extends EnhAction
	{
		String mode = "User";

		public void execute(ActionContext ctx) throws Exception
		{
			String isDel = ctx.getParameter("isDel");
			long id = 0;
			String enhId = ctx.getParameter("enhId");
			if (enhId != null)
			{
				id = Long.parseLong(enhId);
			}

			String nYear = ctx.getParameter("nYear");

			EnhSql sql = new EnhSql();
			// 외주개발자인 경우 쿼리가 다르다.
			SqlSelect stmt = sql.getTasksGlobal(id, nYear, mode, isDel);

			sql.writeTaskListJson(ctx.getWriter(), stmt);
		}
	}
}
