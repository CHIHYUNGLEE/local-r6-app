package com.kcube.enh;

import java.sql.ResultSet;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.kcube.doc.file.Attachment;
import com.kcube.enh.Enh.Mbr;
import com.kcube.enh.EnhOwner.SelectProjectByOwner;
import com.kcube.enh.EnhOwner.SelectTaskByOwner;
import com.kcube.lib.action.ActionContext;
import com.kcube.lib.jdbc.DbService;
import com.kcube.lib.json.JsonWriter;
import com.kcube.lib.sql.SqlSelect;
import com.kcube.lib.tree.TreeState;
import com.kcube.map.FolderCache;
import com.kcube.sys.module.ModuleParam;
import com.kcube.sys.usr.UserPermission;
import com.kcube.sys.usr.UserService;

/**
 * 고도화관리 사용자 Action
 */
public class EnhUser
{
	private static Log _log = LogFactory.getLog(EnhUser.class);

	//private static final String HUMAN_BASE_NAME = "com.kcube.ekp.hnm.human.Human";

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
			if (_log.isInfoEnabled())
			{
				_log.info("status:" + status);
				_log.info("nYear:" + nYear);
			}

			SqlSelect select = sql.getVisibleSelect(status, nYear);
			SqlSelect count = sql.getVisibleCount(status, nYear);

			sql.writeJson(ctx.getWriter(), select, count);
		}
	}

	/**
	 * 고도화를 조회한다.
	 */
	public static class ReadByUser extends EnhAction
	{

		public void execute(ActionContext ctx) throws Exception
		{
			ModuleParam mp = ctx.getModuleParam();
			UserPermission.setModuleMenu(mp);
			
			Enh server = (Enh) _storage.load(ctx.getLong("id"));
			_factory.marshal(ctx.getWriter(), server);
		}
	}

	/**
	 * 고도화를 등록한다.
	 */
	public static class DoRegister extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			ModuleParam mp = ctx.getModuleParam();
			UserPermission.setModuleMenu(mp);
			
			Enh client = unmarshal(ctx);
			Enh server = (Enh) _storage.loadOrCreateWithLock(client.getId());
			EnhManager.update(server, client);
			EnhManager.register(server);
		
			ctx.setParameter("enhid", server.getId().toString());
		}
	}

	/**
	 * 고도화 등록 이전에 필요한 정보를 생성한다.
	 */
	public static class PreWrite extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			ModuleParam mp = ctx.getModuleParam();
			UserPermission.setModuleMenu(mp);
			
			Enh item = new Enh();
			item.setAuthor(UserService.getUser());
			item.setRgstDate(new Date());

			_factory.marshal(ctx.getWriter(), item);
		}
	}

	/**
	 * 고도화의 첨부파일을 다운로드 한다.
	 */
	public static class DownloadByUser extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			ModuleParam mp = ctx.getModuleParam();
			UserPermission.setModuleMenu(mp);
			
			Enh.Attachment att = (Enh.Attachment) DbService.load(Enh.Attachment.class, ctx.getLong("id"));
			ctx.store(att);
		}
	}

	/**
	 * 고도화 목록에서 첨부파일을 조회할 때에 사용할 첨부파일의 목록을 돌려준다.
	 */
	public static class AttachmentList extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			ModuleParam mp = ctx.getModuleParam();
			UserPermission.setModuleMenu(mp);
			
			Enh server = (Enh) _storage.load(ctx.getLong("id"));

			JsonWriter writer = new JsonWriter(ctx.getWriter());
			writer.writeListHeader();
			Collection<? extends Attachment> c = server.getAttachments();
			if (c != null)
			{
				for (Iterator<? extends Attachment> i = c.iterator(); i.hasNext();)
				{
					Enh.Attachment att = (Enh.Attachment) i.next();
					writer.startList();
					writer.setFirstAttr(true);
					writer.setAttribute("id", att.getId());
					writer.setAttribute("filename", att.getFilename());
					writer.setAttribute("size", att.getFilesize());
					writer.endList();
				}
			}
			writer.writeListFooter();
		}
	}

	/**
	 * 해당년도에 부서에서 수행한 업무를 셀렉트 한다.
	 */
	public static class SelectDprtTaskByUser extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			ModuleParam mp = ctx.getModuleParam();
			UserPermission.setModuleMenu(mp);
			
			TreeState tr = FolderCache.getTreeState(ctx.getLong("dprtId", null), false);

			long dprtId = 0;
			String dprtNo = ctx.getParameter("dprtId");
			if (dprtNo != null)
			{
				dprtId = Long.parseLong(dprtNo);
			}

			String nYear = ctx.getParameter("nYear");

			EnhSql sql = new EnhSql();
			SqlSelect stmt = sql.getDprtTask(dprtId, nYear, tr);

			sql.writeTaskListJson(ctx.getWriter(), stmt);
		}
	}

	/**
	 * 고도화의 팀원 목록을 돌려준다.
	 */
	public static class GetMbrs extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			Long itemid = ctx.getLong("id");
			Enh server = (Enh) _storage.load(itemid);
			JsonWriter writer = new JsonWriter(ctx.getWriter());
			writer.writeListHeader();
			for (Mbr mbr : server.getMbrs())
			{
				writer.startList();
				writer.setAttribute("id", mbr.getUserId());
				writer.setAttribute("name", mbr.getName());
				writer.endList();
			}
			writer.writeListFooter();
		}
	}
	
	/**
	 * 해당년도에 수행된 업무를 셀렉트 한다.
	 */
	public static class SelectTaskByUser extends SelectTaskByOwner
	{
		public void execute(ActionContext ctx) throws Exception
		{
			ModuleParam mp = ctx.getModuleParam();
			UserPermission.setModuleMenu(mp);
			
			super.mode = "User";
			super.execute(ctx);
		}
	}

	/**
	 * 기관 정보 목록을 출력한다.
	 */
	public static class EnhOrgListByUser extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			ModuleParam mp = ctx.getModuleParam();
			UserPermission.setModuleMenu(mp);
			
			EnhOrgSql sql = new EnhOrgSql(
				mp, ctx.getLong("tr", null), ctx.getParameter("ts"), ctx.getInt("srch", 1), ctx.getInt("type", -1),
				ctx.getParameter("s1"), ctx.getParameter("s2"));
			sql.writeJson(ctx.getWriter(), sql.getVisibleSelect(), sql.getVisibleSelect());
		}
	}

	/**
	 * 해당년도에 수행된 고도화를 셀렉트 한다.
	 */
	public static class SelectProjectByUser extends SelectProjectByOwner
	{
		public void execute(ActionContext ctx) throws Exception
		{
			ModuleParam mp = ctx.getModuleParam();
			UserPermission.setModuleMenu(mp);
			
			super.mode = "User";
			super.execute(ctx);
		}
	}

	/**
	 * 메인(usr.main.jsp) 게시판 목록을 돌려준다.
	 */
	public static class ModListByUser extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			ModuleParam mp = ctx.getModuleParam();
			UserPermission.setModuleMenu(mp);
			
			EnhSql sql = new EnhSql(ctx.getParameter("ts"), ctx.getBoolean("isCountDisplay"));

			SqlSelect select = sql.getMainVisibleSelect(false);

			SqlSelect count = sql.getVisibleCount(false);
			sql.writeWebzine(ctx.getWriter(), select, count);
		}
	}

	/**
	 * 앱 관리 APP 연동 관련 추가
	 * <p>
	 * 해당 앱의 고도화 목록을 반환한다.
	 */
	public static class EnhList extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			ModuleParam mp = ctx.getModuleParam();
			UserPermission.setModuleMenu(mp);
			
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
			Long itemId = ctx.getLong("itemId");
			EnhTableState ts = new EnhTableState(ctx.getParameter("ts"), COLUMNS);
			ResultSet rs = EnhSql.getEnhList(itemId, status, nYear, ts);
			int totalRows = EnhSql.getEnhCount(itemId, status, nYear, ts);
			new JsonWriter(ctx.getWriter()).write(rs, totalRows, ATTRIBUTES);
		}

		static Map<String, String> ATTRIBUTES = new HashMap<String, String>();
		static Map<String, String> COLUMNS = new HashMap<String, String>();

		{
			ATTRIBUTES.put("vrsnid", "vrsnId");
			ATTRIBUTES.put("vrsn_name", "vrsnName");
			ATTRIBUTES.put("enhid", "enhId");
			ATTRIBUTES.put("enh_name", "enhName");
			ATTRIBUTES.put("enh_sdate", "enhSdate");
			ATTRIBUTES.put("enh_edate", "enhEdate");
			ATTRIBUTES.put("userid", "userId");
			ATTRIBUTES.put("rgst_name", "rgstName");
			ATTRIBUTES.put("user_disp", "userDisp");
			ATTRIBUTES.put("file_ext", "fileExt");
			ATTRIBUTES.put("opn_cnt", "opnCnt");
			ATTRIBUTES.put("status", "status");
			ATTRIBUTES.put("isvisb", "isvisb");
			ATTRIBUTES.put("pm_name", "pmName");
			ATTRIBUTES.put("pmid", "pmId");
			ATTRIBUTES.put("pm_disp", "pmDisp");
			ATTRIBUTES.put("ofceid", "orgId");
			ATTRIBUTES.put("ofce_name", "orgName");

			COLUMNS.put("vrsnId", "vrsnid");
			COLUMNS.put("vrsnName", "vrsn_name");
			COLUMNS.put("status", "status");
			COLUMNS.put("enhName", "enh_name");
			COLUMNS.put("orgName", "ofce_name");
			COLUMNS.put("pmName", "pm_name");
			COLUMNS.put("rgstName", "rgst_name");
			COLUMNS.put("enhSdate", "enh_sdate");
		}
	}
}