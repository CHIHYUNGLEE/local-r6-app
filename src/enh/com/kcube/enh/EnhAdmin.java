package com.kcube.enh;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import com.kcube.enh.mod.EnhMod;
import com.kcube.enh.mod.EnhModManager;
import com.kcube.lib.action.Action;
import com.kcube.lib.action.ActionContext;
import com.kcube.lib.event.EventService;
import com.kcube.lib.jdbc.DbService;
import com.kcube.lib.jdbc.DbStorage;
import com.kcube.lib.jdbc.TableState;
import com.kcube.lib.json.JsonWriter;
import com.kcube.lib.sql.SqlSelect;
import com.kcube.lib.tree.TreeState;
import com.kcube.map.FolderCache;
import com.kcube.sys.module.ModuleParam;
import com.kcube.sys.usr.UserPermission;

/**
 * 고도화관리 관련 관리자 Action
 */
public class EnhAdmin
{

	private static EnhStorage _storage = new EnhStorage();
	private static EnhListener _listener = (EnhListener) EventService.getDispatcher(EnhListener.class);
	static DbStorage _adStorage = new DbStorage(Enh.class);
	private static Map<String, String> ATTRIBUTES = new HashMap<String, String>();
	private static Map<String, String> COLUMNS = new HashMap<String, String>();
	static
	{
		ATTRIBUTES.put("rnum", "rnum");
		ATTRIBUTES.put("userid", "id");
		ATTRIBUTES.put("name", "name");
		ATTRIBUTES.put("user_disp", "displayName");
		ATTRIBUTES.put("milg", "mileage");
		ATTRIBUTES.put("rwrd_milg", "rewardMileage");
		ATTRIBUTES.put("vrtl_milg", "virtualMileage");
		ATTRIBUTES.put("login_id", "loginId");
		ATTRIBUTES.put("e_mail", "email");
		ATTRIBUTES.put("dprtid", "dprtId");
		ATTRIBUTES.put("dprt_name", "dprtName");
		ATTRIBUTES.put("gradeid", "gradeId");
		ATTRIBUTES.put("grade_name", "gradeName");
		ATTRIBUTES.put("pstnid", "pstnId");
		ATTRIBUTES.put("pstn_name", "pstnName");
		ATTRIBUTES.put("job_title", "jobTitle");
		ATTRIBUTES.put("empno", "empno");
		ATTRIBUTES.put("last_updt", "lastUpdt");
		ATTRIBUTES.put("flag_code", "flagCode");
		ATTRIBUTES.put("ofce_phn", "ofcePhn");
		ATTRIBUTES.put("mbl_phn", "mobilePhone");
		ATTRIBUTES.put("locale", "locale");
		ATTRIBUTES.put("condition", "condition");
		ATTRIBUTES.put("condition_text", "conditionText");
		ATTRIBUTES.put("thumb_save_code", "thumbCode");
		ATTRIBUTES.put("thumb_save_path", "thumbPath");

		COLUMNS.put("id", "userid");
		COLUMNS.put("empno", "empno");
		COLUMNS.put("name", "name");
		COLUMNS.put("dprtName", "dprt_name");
		COLUMNS.put("gradeName", "grade_name");
		COLUMNS.put("pstnName", "pstn_name");
		COLUMNS.put("mileage", "milg");
		COLUMNS.put("gradeSort", "grade_sort");
		COLUMNS.put("pstnSort", "pstn_sort");
		COLUMNS.put("email", "e_mail");
		COLUMNS.put("locale", "locale");
		COLUMNS.put("ofcePhn", "ofce_phn");
		COLUMNS.put("mobilePhone", "mbl_phn");
	}

	/**
	 * 고도화의 상태값을 변경한다.
	 */
	public static class UpdateStatus extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			Enh server = (Enh) _storage.load(ctx.getLong("id"));
			Enh client = new Enh();
			client.setStatus(ctx.getInt("status"));
			EnhManager.updateStatus(server, client);

			JsonWriter jwriter = new JsonWriter(ctx.getWriter());
			jwriter.startList();
			jwriter.setAttribute("status", server.getStatus());
			if (server.getStatus() == Enh.ENHCOM_STATUS)
			{
				jwriter.setAttribute("completeDate", server.getCompleteDate().getTime());
			}
			jwriter.endList();
		}
	}

	/**
	 * 고도화의 역할등록시 팀원, PM의 목록을 가져온다.
	 */
	public static class SelectUserList implements Action
	{
		public void execute(ActionContext ctx) throws Exception
		{
			String enhId = ctx.getParameter("enhId");
			TreeState tr = FolderCache.getTreeState(ctx.getLong("dprtId", null), false);
			TableState ts = new TableState(ctx.getParameter("ts"), COLUMNS);
			ResultSet rs = _storage.getUserList(ts, tr, enhId);
			int totalRows = _storage.getUserCount(ts, tr, enhId);
			final JsonWriter writer = new JsonWriter(ctx.getWriter());
			writer.writeListHeader(totalRows);
			while (rs.next())
			{
				writer.startList();
				writer.setFirstAttr(true);
				writer.writeRow(rs, ATTRIBUTES);
				String path = FolderCache.getPath(new Long(rs.getLong("dprtid")), "\n");
				writer.setFirstAttr(false);
				writer.setAttribute("path", path);
				writer.endList();
			}
			writer.writeListFooter();
		}
	}

	/**
	 * 삭제된 고도화 목록을 출력한다.
	 */
	public static class DeleteListByUser extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			UserPermission.checkAdmin(Enh.class.getName());
			EnhSql sql = new EnhSql(ctx.getParameter("ts"), ctx.getBoolean("isCountDisplay"));

			SqlSelect select = sql.getInvisibleSelect();
			SqlSelect count = sql.getInvisibleCount();

			sql.writeJson(ctx.getWriter(), select, count);
		}
	}

	/**
	 * 등록된 고도화를 소유자 권한으로 삭제한다.
	 */
	public static class DoDeleteByAdmin extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			UserPermission.checkAdmin(Enh.class.getName());
			Long[] ids = ctx.getLongValues("id");
			
			int size = ids.length;
			for (int i = 0; i < size; i++)
			{
				DbService.begin();
				Enh server = (Enh) _storage.loadWithLock(ids[i]);

				// 고도화 폐기 시 해당 enhid에 있는 관련기술(탭)들을 폐기한다.
				Iterator<EnhMod> it = server.getMods().iterator();
				while (it.hasNext())
				{
					EnhMod mod = (EnhMod) DbService.loadWithLock(it.next());
					EnhModManager.delete(mod);
				}
				
				EnhManager.delete(server);
				DbService.commit();
			}
		}
	}
	
	/**
	 * 등록된 고도화를 소유자 권한으로 폐기한다.
	 */
	public static class DoRemoveByAdmin extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			UserPermission.checkAdmin(Enh.class.getName());
			Long[] ids = ctx.getLongValues("id");

			int size = ids.length;
			for (int i = 0; i < size; i++)
			{
				DbService.begin();
				Enh server = (Enh) _storage.loadWithLock(ids[i]);

				// 고도화 폐기 시 해당 enhid에 있는 관련기술(탭)들을 폐기한다.
				Iterator<EnhMod> it = server.getMods().iterator();
				while (it.hasNext())
				{
					EnhMod mod = (EnhMod) DbService.loadWithLock(it.next());
					EnhModManager.remove(mod);
				}
				
				EnhManager.remove(server);
				DbService.commit();
			}
		}
	}

	/**
	 * 관리자 권한으로 삭제된 여러 문서를 동시에 복원한다.
	 */
	public static class DoRecoverByAdmin extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			UserPermission.checkAdmin(Enh.class.getName());
			Long[] ids = ctx.getLongValues("id");
			// ids를 gid로 취급한 id를 가져온다,
			int size = ids.length;
			for (int i = 0; i < size; i++)
			{
				DbService.begin();
				Enh server = (Enh) _adStorage.loadWithLock(ids[i]);

				// cst
				SqlSelect stmt = EnhSql.getAllDeleteMod(server);
				ResultSet rs = stmt.query();
				while (rs.next())
				{
					Long modId = rs.getLong("modid");
					EnhMod mod = (EnhMod) _modstorage.loadOrCreateWithLock(modId);
					int Seq = getRecoverSeq(mod.getEnhId());
					mod.setStatus(EnhMod.REGISTERED_STATUS);
					mod.setLastUpdt(new Date());
					mod.updateVisible(true);
					mod.setSeqOrder(Seq);
					_listener.modregistered(mod);
				}
				// cst

				while (server.isVisible() == false)
				{
					EnhManager.recover(server);
					if (server.getPid() == null)
					{
						break;
					}
					server = (Enh) _adStorage.loadWithLock(server.getPid());
				}
				DbService.commit();
			}
		}
	}

	/**
	 * 삭제된 관련기술 목록을 출력한다.
	 */
	public static class DeleteModListByUser extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			UserPermission.checkAdmin(Enh.class.getName());
			EnhSql sql = new EnhSql(ctx.getLong("tr", null), ctx.getParameter("ts"), ctx.getBoolean("isCountDisplay"));

			SqlSelect select = sql.getModInvisibleSelect();
			SqlSelect count = sql.getModInvisibleCount();

			sql.writeModJson(ctx.getWriter(), select, count);
		}
	}

	/**
	 * 관리자 권한으로 삭제된 여러 관련 기술들을 동시에 복원한다.
	 */
	public static class DoRecoverModByAdmin extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			UserPermission.checkAdmin(Enh.class.getName());
			Long[] ids = ctx.getLongValues("id");

			int size = ids.length;
			for (int i = 0; i < size; i++)
			{
				DbService.begin();
				EnhMod server = (EnhMod) _modstorage.loadWithLock(ids[i]);
				int Seq = getRecoverSeq(server.getEnhId());
				server.setSeqOrder(Seq);
				EnhModManager.recover(server);
				_listener.modregistered(server);
				DbService.commit();
			}
		}
	}

	/**
	 * 관리자가 관련기술 별도 조회페이지에서 폐기한다.
	 */
	public static class DoAdminModRemove extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			UserPermission.checkAdmin(Enh.class.getName());

			Long id = ctx.getLong("modid");
			EnhMod server = (EnhMod) _modstorage.loadWithLock(id);

			server.setRgstUser(server.getLastUser());
			EnhModManager.remove(server);
		}
	}

	/**
	 * 등록된 관련기술을 관리자 권한으로 여러 문서를 동시에 폐기한다.
	 */
	public static class DoRemoveModByAdmin extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			UserPermission.checkAdmin(Enh.class.getName());
			
			Long[] ids = ctx.getLongValues("id");

			int size = ids.length;
			for (int i = 0; i < size; i++)
			{
				DbService.begin();
				EnhMod server = (EnhMod) _modstorage.loadWithLock(ids[i]);
				EnhModManager.remove(server);
				DbService.commit();
			}
		}
	}

	/**
	 * 관련기술(탭)의 등록상태(status=3000) 중 MAX seq_order(정렬)값을 출력해준다.
	 */
	static int getRecoverSeq(Long enhid) throws Exception
	{
		StringBuffer query = new StringBuffer();
		query.append("SELECT MAX(seq_order)+1 cnt FROM enh_item_mod WHERE enhid = ? AND STATUS = 3000 ");

		PreparedStatement pstmt = DbService.prepareStatement(query.toString());
		pstmt.setLong(1, enhid);
		ResultSet rs = pstmt.executeQuery();
		rs.next();
		return rs.getInt(1);
	}
	
	/**
	 * 고도화 목록을 출력한다.
	 */
	public static class ListByUser extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			ModuleParam mp = ctx.getModuleParam();
			UserPermission.setModuleMenu(mp);
			
			EnhSql sql = new EnhSql(ctx.getParameter("ts"), ctx.getBoolean("isCountDisplay"));
			int status = ctx.getInt("status", -1);
			String nYear;
			if (ctx.getParameter("nYear") != null)
			{
				nYear = ctx.getParameter("nYear");
			}
			else
			{
				Calendar today = Calendar.getInstance();
				nYear = Integer.toString(today.get(Calendar.YEAR));
			}
			if ("9999".equals(nYear))
			{
				nYear = null;
			}

			SqlSelect select = sql.getVisibleSelect(status, nYear, true);
			SqlSelect count = sql.getVisibleCount(status, nYear, true);

			sql.writeJson(ctx.getWriter(), select, count);
		}
	}
}
