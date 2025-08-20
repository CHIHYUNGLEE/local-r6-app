package com.kcube.enh.task;

import java.util.Collection;
import java.util.Date;
import java.util.Iterator;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.kcube.doc.file.Attachment;
import com.kcube.lib.action.ActionContext;
import com.kcube.lib.jdbc.DbService;
import com.kcube.lib.json.JsonWriter;
import com.kcube.lib.sql.SqlSelect;
import com.kcube.sys.module.ModuleParam;
import com.kcube.sys.usr.UserPermission;

/**
 * 고도화관리 역할 등록자 Action
 */
public class EnhTaskUser
{
	private static Log _log = LogFactory.getLog(EnhTaskUser.class);

	/**
	 * 업무 목록을 출력한다.
	 */
	public static class ListByUser extends EnhTaskAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			ModuleParam mp = ctx.getModuleParam();
			UserPermission.setModuleMenu(mp);
			
			EnhTaskSql sql = new EnhTaskSql(ctx.getParameter("ts"), ctx.getBoolean("isCountDisplay"));

			// 고도화 ID enhId
			Long id = ctx.getLong("id");
			if (_log.isInfoEnabled())
			{
				_log.info("id:" + id);
			}

			SqlSelect select = sql.getSelect(id);
			SqlSelect count = sql.getCount(id);

			sql.writeJson(ctx.getWriter(), select, count);
		}
	}

	/**
	 * 업무를 조회한다.
	 */
	public static class ReadByUser extends EnhTaskAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			ModuleParam mp = ctx.getModuleParam();
			UserPermission.setModuleMenu(mp);
			
			EnhTask server = (EnhTask) _storage.load(ctx.getLong("id"));
			_factory.marshal(ctx.getWriter(), server);
		}
	}

	/**
	 * 업무의 첨부파일을 다운로드 한다.
	 */
	public static class DownloadByUser extends EnhTaskAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			ModuleParam mp = ctx.getModuleParam();
			UserPermission.setModuleMenu(mp);
			
			EnhTask.Attachment att = (EnhTask.Attachment) DbService.load(EnhTask.Attachment.class, ctx.getLong("id"));
			ctx.store(att);
		}
	}

	/**
	 * 업무목록에서 첨부파일을 조회할 때에 사용할 첨부파일의 목록을 돌려준다.
	 */
	public static class AttachmentList extends EnhTaskAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			ModuleParam mp = ctx.getModuleParam();
			UserPermission.setModuleMenu(mp);
			
			EnhTask server = (EnhTask) _storage.load(ctx.getLong("id"));

			JsonWriter writer = new JsonWriter(ctx.getWriter());
			writer.writeListHeader();
			Collection<? extends Attachment> c = server.getAttachments();
			if (c != null)
			{
				for (Iterator<? extends Attachment> i = c.iterator(); i.hasNext();)
				{
					EnhTask.Attachment att = (EnhTask.Attachment) i.next();
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
	 * 업무 등록 이전에 필요한 정보를 생성한다.
	 */
	public static class PreWrite extends EnhTaskAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			ModuleParam mp = ctx.getModuleParam();
			UserPermission.setModuleMenu(mp);
			
			EnhTask item = new EnhTask();
			item.setRgstDate(new Date());
			item.setEnhId(new Long(ctx.getParameter("enhId")));
			_factory.marshal(ctx.getWriter(), item);
		}
	}
}
