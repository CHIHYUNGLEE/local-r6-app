package com.kcube.enh.mod;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;

import com.kcube.doc.file.Attachment;
import com.kcube.enh.Enh;
import com.kcube.enh.EnhListener;
import com.kcube.enh.EnhPermission;
import com.kcube.enh.EnhSql;
import com.kcube.lib.action.Action;
import com.kcube.lib.action.ActionContext;
import com.kcube.lib.event.EventService;
import com.kcube.lib.jdbc.DbService;
import com.kcube.lib.jdbc.DbStorage;
import com.kcube.lib.json.JsonWriter;
import com.kcube.lib.sql.SqlDialect;
import com.kcube.lib.sql.SqlSelect;
import com.kcube.sys.usr.UserPermission;

public class EnhModUser
{
	static DbStorage _itemstorage = new DbStorage(Enh.class);
	private static EnhListener _listener = (EnhListener) EventService.getDispatcher(EnhListener.class);

	/**
	 * 게시판 관련기술(탭) 목록을 돌려준다.
	 */
	public static class ListModByUser extends EnhModAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			EnhSql sql = new EnhSql(ctx.getParameter("ts"), ctx.getBoolean("isCountDisplay"));

			SqlSelect select = sql.getModSelect(false);
			SqlSelect count = sql.getModCount(false);
			sql.writeModJson(ctx.getWriter(), select, count);
		}
	}

	/**
	 * 쓰기 양식의 초기값을 돌려준다.
	 */
	public static class PreWrite extends EnhModAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			// 부모의 글 제목을 불러오기 위한 Enhitem load
			Enh server = (Enh) _itemstorage.load(ctx.getLong("id"));

			EnhMod item = new EnhMod();
			item.setEnhId(ctx.getLong("id")); // 탭을 등록할 itemId를 Set 해준다. (0부터 시작한다.)
			item.setSeqOrder(getCountByUser(ctx.getLong("id"))); // 탭의 순서값을 Set 해준다.
			item.setRgstDate(new Date());
			item.setItemTitle(server.getEnhName()); // 탭 등록 시 부모의 글 제목을 set 해준다.

			_factory.marshal(ctx.getWriter(), item);
		}
	}

	/**
	 * 새로운 관련기술(탭)을 등록한다.
	 */
	public static class DoRegister extends EnhModAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			EnhMod client = (EnhMod) unmarshal(ctx);
			EnhMod server = (EnhMod) _storage.loadOrCreateWithLock(client.getId());
			client.setRgstDate(new Date());
			EnhModManager.update(server, client);
			EnhModManager.register(server);
			_listener.modregistered(server);
			ctx.getWriter().print(server.getId());
		}
	}

	/**
	 * 관련기술(탭)을 수정한다.
	 */
	public static class DoUpdateByUser extends EnhModAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			EnhMod client = unmarshal(ctx);
			EnhMod server = (EnhMod) _storage.loadOrCreateWithLock(client.getId());

			Enh enh = (Enh) _itemstorage.loadOrCreateWithLock(client.getEnhId());
			EnhPermission.checkEnhMod(server, enh);

			EnhModManager.update(server, client);
			ctx.getWriter().print(server.getId());
			_listener.modified(server);

			ctx.setParameter("enhid", server.getEnhId().toString());
			ctx.setParameter("mod", server.getId().toString());
		}
	}

	/**
	 * 관련기술(탭)을 수정한다. (삭제된 기술목록에서 수정할 때 사용한다)
	 */
	public static class DeleteDoUpdateByUser extends EnhModAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			UserPermission.checkAdmin(Enh.class.getName());
			EnhMod client = unmarshal(ctx);
			EnhMod server = (EnhMod) _storage.loadOrCreateWithLock(client.getId());

			EnhModManager.update(server, client);
			ctx.getWriter().print(server.getId());
		}
	}

	/**
	 * 해당 enhid의 관련기술(탭) 리스트들을 반환한다.
	 */
	public static class ModList extends EnhModAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			Long enhid = ctx.getLong("enhid");
			int totalRows = getCountByUser(enhid);
			ResultSet rs = getListByUser(enhid);
			new JsonWriter(ctx.getWriter()).write(rs, totalRows, ATTRIBUTES);
		}
	}
	
	/**
	 * 해당 enhid의 관련기술(탭) 삭제상태 리스트들을 반환한다.
	 */
	public static class ModDeleteList extends EnhModAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			Long enhid = ctx.getLong("enhid");
			int totalRows = getCountByUser(enhid);
			ResultSet rs = getDelListByUser(enhid);
			new JsonWriter(ctx.getWriter()).write(rs, totalRows, ATTRIBUTES);
		}
	}

	/**
	 * 관련기술(탭)영역 내용을 조회한다.
	 */
	public static class ReadByUser extends EnhModAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			EnhMod server = (EnhMod) _storage.load(ctx.getLong("modid"));
			server.setLastUser(server.getLastUser());
			_factory.marshal(ctx.getWriter(), server);
		}
	}

	/**
	 * 관련기술(탭)의 첨부파일을 다운로드한다.
	 */
	public static class DownloadByUser extends EnhModAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			EnhMod.Attachment att = (EnhMod.Attachment) DbService.load(EnhMod.Attachment.class, ctx.getLong("id"));
			EnhMod server = (EnhMod) att.getItem();
			server.setRgstUser(server.getRgstUser());
			ctx.store(att);
		}
	}

	/**
	 * 고도화 목록에서 첨부파일을 조회할 때에 사용할 첨부파일의 목록을 돌려준다.
	 */
	public static class AttachmentList extends EnhModAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			EnhMod server = (EnhMod) _storage.load(ctx.getLong("id"));

			JsonWriter writer = new JsonWriter(ctx.getWriter());
			writer.writeListHeader();
			Collection<? extends Attachment> c = server.getAttachments();
			if (c != null)
			{
				for (Iterator<? extends Attachment> i = c.iterator(); i.hasNext();)
				{
					EnhMod.Attachment att = (EnhMod.Attachment) i.next();
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
	 * 관련기술(탭) 순서를 변경한다.
	 */
	public static class UpdateModSortAdmin extends EnhModAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			EnhModList modList = (EnhModList) _modfactory.unmarshal(ctx.getParameter("item"));
			for (EnhMod client : modList.getModList())
			{
				EnhMod server = (EnhMod) _storage.loadOrCreateWithLock(client.getId());
				server.setSeqOrder(client.getSeqOrder());
			}
		}
	}

	/**
	 * 관련기술(탭)을 삭제한다.
	 */
	public static class DoRemove extends EnhModAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			Long id = ctx.getLong("modid");
			EnhMod server = (EnhMod) _storage.loadWithLock(id);

			server.setRgstUser(server.getLastUser());

			Enh enh = (Enh) _itemstorage.loadOrCreateWithLock(server.getEnhId());
			EnhPermission.checkEnhMod(server, enh);
			EnhModManager.setSeq(server);
			EnhModManager.delete(server);
			_listener.moddeleted(server);
		}
	}

	/**
	 * 관련기술(탭)의 order(정렬)값을 출력해준다.
	 */
	static int getCountByUser(Long enhid) throws Exception
	{
		StringBuffer query = new StringBuffer();
		query.append("SELECT MAX(seq_order)+1 cnt FROM enh_item_mod WHERE enhid = ? ");

		PreparedStatement pstmt = DbService.prepareStatement(query.toString());
		pstmt.setLong(1, enhid);
		ResultSet rs = pstmt.executeQuery();
		rs.next();
		return rs.getInt(1);
	}

	/**
	 * 해당 itemid의 속해있는 관련기술(탭) 리스트를 출력한다.
	 */
	static ResultSet getListByUser(Long enhid) throws Exception
	{
		StringBuffer query = new StringBuffer();
		query.append("SELECT ");
		query.append(EnhModAction.FIELD);
		query.append("FROM enh_item_mod ");
		query.append("WHERE enhid = ? ");
		query.append("AND isvisb = 1 ");
		query.append("ORDER BY seq_order ");

		PreparedStatement pstmt = DbService.prepareStatement(query.toString());
		pstmt.setLong(1, enhid);
		return pstmt.executeQuery();
	}
	
	/**
	 * 해당 itemid의 속해있는 삭제상태(invisb=0) 관련기술(탭) 리스트를 출력한다.
	 */
	static ResultSet getDelListByUser(Long enhid) throws Exception
	{
		StringBuffer query = new StringBuffer();
		query.append("SELECT ");
		query.append(EnhModAction.FIELD);
		query.append("FROM enh_item_mod ");
		query.append("WHERE enhid = ? ");
		query.append("AND isvisb = 0 ");
		query.append("ORDER BY seq_order ");

		PreparedStatement pstmt = DbService.prepareStatement(query.toString());
		pstmt.setLong(1, enhid);
		return pstmt.executeQuery();
	}

	/**
	 * 고도화에 등록된 관련기술 갯수를 돌려준다.
	 */
	public static class ItemModCount extends EnhModAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			SqlSelect sql = new SqlSelect();
			sql.select("enhid");
			sql.from("enh_item_mod");
			sql.where("enhid = ?", ctx.getLong("enhId"));
			sql.where("isvisb = 1");

			JsonWriter writer = new JsonWriter(ctx.getWriter());
			writer.startList();
			writer.setAttribute("count", sql.count());
			writer.endList();
		}
	}
	
	/**
	 * 고도화에 삭제된 관련기술 갯수를 돌려준다.
	 */
	public static class DelItemModCount extends EnhModAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			SqlSelect sql = new SqlSelect();
			sql.select("enhid");
			sql.from("enh_item_mod");
			sql.where("enhid = ?", ctx.getLong("enhId"));
			sql.where("isvisb = 0");

			JsonWriter writer = new JsonWriter(ctx.getWriter());
			writer.startList();
			writer.setAttribute("count", sql.count());
			writer.endList();
		}
	}
	
	/**
	 * 관련기술 제목 리스트를 Json 형태로 반환한다. (자동완성기능)
	 */
	public static class SelectModLikeName implements Action
	{
		public void execute(ActionContext ctx) throws Exception
		{
			String name = ctx.getParameter("key");
			int cnt = ctx.getInt("count");
			ResultSet rs = getSelectUserByName(name);
			final JsonWriter writer = new JsonWriter(ctx.getWriter());
			writer.writeListHeader(-1);
			int i = 0;
			while (rs.next() && i < cnt)
			{
				writer.startList();
				writer.setAttribute("title", rs.getString("title"));
				writer.endList();
				i++;
			}
			writer.writeListFooter();
		}

		private static ResultSet getSelectUserByName(String name) throws Exception
		{
			SqlSelect sel = new SqlSelect();
			sel.select("l.title");
			sel.from("enh_item_mod_list l");
			sel.where("UPPER(l.title) like ? ", SqlDialect.getSearchValue(name, true));
			return sel.query();
		}
	}
}