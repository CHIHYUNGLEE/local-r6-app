package com.kcube.enh;

import com.kcube.doc.opn.OpinionManager;
import com.kcube.doc.opn.OpinionReply;
import com.kcube.lib.action.ActionContext;
import com.kcube.lib.jdbc.DbService;
import com.kcube.lib.jdbc.DbStorage;
import com.kcube.lib.json.JsonMapping;
import com.kcube.lib.json.JsonWriter;
import com.kcube.sys.usr.UserService;

/**
 * 고도화관리 의견
 */
public class EnhOpinion
{
	static OpinionReply _opinionReply = new OpinionReply(Enh.Opinion.class);
	static OpinionManager _opinion = new OpinionManager(Enh.class, Enh.Opinion.class, "enhid");

	static JsonMapping _opn = new JsonMapping(Enh.Opinion.class);
	static DbStorage _opnStorage = new DbStorage(Enh.Opinion.class);

	/**
	 * 의견을 등록한다.
	 */
	public static class InsertOpinion extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			Long itemId = ctx.getLong("itemid");
			Enh server = (Enh) _storage.load(itemId);
			Enh.Opinion client = (Enh.Opinion) _opn.unmarshal(ctx.getParameter("opn"));

			Long gid = ctx.getLong("gid", null);

			String content = ctx.getParameter("content");
			Enh.Opinion opn = (Enh.Opinion) _opinion.addOpinion(itemId, gid, content, Enh.Opinion.USER);

			if (client.getRgstUser() == null)
			{
				opn.setRgstUser(UserService.getUser());
				opn.setRgstUserId(UserService.getUser().getUserId());
			}
			else
			{
				opn.setRgstUser(client.getRgstUser());
				opn.setRgstUserId(client.getRgstUser().getUserId());
			}

			EnhHistory.addOpinion(server);
			_opn.marshal(ctx.getWriter(), opn);
		}
	}

	/**
	 * 의견을 수정한다.
	 */
	public static class UpdateOpinion extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			Long id = ctx.getLong("id");
			String content = ctx.getParameter("content");
			Enh.Opinion server = (Enh.Opinion) DbService.load(Enh.Opinion.class, id);
			Enh item = (Enh) _storage.load(server.getItemId());
			EnhPermission.checkOwner(server);
			_opinion.updateOpinion(server, content);
			EnhHistory.updateOpinion(item);
			_opinion.writeUpdate(new JsonWriter(ctx.getWriter()), server);
		}
	}

	/**
	 * 의견을 삭제한다.
	 */
	public static class DeleteOpinion extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			Long id = ctx.getLong("id");
			Enh.Opinion opn = (Enh.Opinion) DbService.load(Enh.Opinion.class, id);
			Enh item = (Enh) _storage.load(opn.getItemId());
			EnhPermission.checkOwner(opn);
			_opinionReply.checkReply(opn);
			_opinion.deleteOpinion(id);
			EnhHistory.deleteOpinion(item, opn);
		}
	}

	/**
	 * 의견 리스트를 조회한다.
	 */
	public static class ViewOpinion extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			Long id = ctx.getLong("id");
			boolean desc = ctx.getBoolean("desc");
			Long opnLastId = ctx.getLong("opnLastId", 0);

			Enh server = (Enh) _storage.load(id);
			EnhPermission.checkUser(server);

			_factory.marshal(ctx.getWriter(), _opinion.getItem(server, opnLastId, desc));
		}
	}

	/**
	 * 지식글에 대한 의견의 갯수를 돌려준다.
	 */
	public static class CountByUser extends EnhAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			Long id = ctx.getLong("id");
			/**
			 * KItem load 시켜 권한체크하는 부분 삭제
			 */
			int totalRows = _opinion.getOpinionsCount(id);
			JsonWriter writer = new JsonWriter(ctx.getWriter());
			writer.startList();
			writer.setAttribute("count", totalRows);
			writer.endList();
		}
	}
}
