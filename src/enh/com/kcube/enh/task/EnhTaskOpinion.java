package com.kcube.enh.task;

import com.kcube.doc.opn.OpinionManager;
import com.kcube.doc.opn.OpinionReply;
import com.kcube.enh.Enh;
import com.kcube.lib.action.ActionContext;
import com.kcube.lib.jdbc.DbService;
import com.kcube.lib.json.JsonMapping;
import com.kcube.lib.json.JsonWriter;
import com.kcube.sys.usr.UserService;

/**
 * 고도화관리 역할 의견
 */
public class EnhTaskOpinion
{
	static OpinionReply _opinionReply = new OpinionReply(EnhTask.Opinion.class);
	static OpinionManager _opinion = new OpinionManager(EnhTask.class, EnhTask.Opinion.class, "taskid");

	static JsonMapping _opn = new JsonMapping(EnhTask.Opinion.class);

	/**
	 * 의견을 등록한다.
	 */
	public static class InsertOpinion extends EnhTaskAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			Long itemId = ctx.getLong("itemid");
			EnhTask server = (EnhTask) _storage.load(itemId);
			EnhTask.Opinion client = (EnhTask.Opinion) _opn.unmarshal(ctx.getParameter("opn"));

			Long gid = ctx.getLong("gid", null);

			String content = ctx.getParameter("content");
			EnhTask.Opinion opn = (EnhTask.Opinion) _opinion.addOpinion(itemId, gid, content, Enh.Opinion.USER);

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

			EnhTaskHistory.addOpinion(server);
			_opn.marshal(ctx.getWriter(), opn);
		}
	}

	/**
	 * 의견을 수정한다.
	 */
	public static class UpdateOpinion extends EnhTaskAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			Long id = ctx.getLong("id");
			String content = ctx.getParameter("content");
			EnhTask.Opinion server = (EnhTask.Opinion) DbService.load(EnhTask.Opinion.class, id);
			EnhTask item = (EnhTask) _storage.load(server.getItemId());

			_opinion.updateOpinion(server, content);
			EnhTaskHistory.updateOpinion(item);
			_opinion.writeUpdate(new JsonWriter(ctx.getWriter()), server);
		}
	}

	/**
	 * 의견을 삭제한다.
	 */
	public static class DeleteOpinion extends EnhTaskAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			Long id = ctx.getLong("id");
			EnhTask.Opinion opn = (EnhTask.Opinion) DbService.load(EnhTask.Opinion.class, id);
			EnhTask item = (EnhTask) _storage.load(opn.getItemId());
			EnhTaskPermission.checkOwner(opn);

			_opinionReply.checkReply(opn);
			_opinion.deleteOpinion(id);
			EnhTaskHistory.deleteOpinion(item, opn);
		}
	}

	/**
	 * 의견 리스트를 조회한다.
	 */
	public static class ViewOpinion extends EnhTaskAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			Long id = ctx.getLong("id");
			boolean desc = ctx.getBoolean("desc");
			Long opnLastId = ctx.getLong("opnLastId", 0);

			EnhTask server = (EnhTask) _storage.load(id);
			EnhTaskPermission.checkUser(server);

			_factory.marshal(ctx.getWriter(), _opinion.getItem(server, opnLastId, desc));
		}
	}
}
