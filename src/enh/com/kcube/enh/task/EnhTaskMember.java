package com.kcube.enh.task;

import java.util.Date;

import com.kcube.lib.action.ActionContext;
import com.kcube.lib.jdbc.DbService;
import com.kcube.sys.usr.UserService;

/**
 * 고도화관리 역할 팀원 Action
 */
public class EnhTaskMember
{
	/**
	 * 업무를 등록한다.
	 */
	public static class DoRegisterMbr extends EnhTaskAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			EnhTask client = unmarshal(ctx);
			EnhTaskPermission.checkMbr(client.getEnhId());
			EnhTask server = new EnhTask();
			server.setEnhId(client.getEnhId());
			DbService.save(server);
			server = EnhTaskManager.update(server, client);
			server = EnhTaskManager.register(server);
			DbService.save(server);

			EnhTaskHistory.alimiTask(server);
		}
	}

	/**
	 * 업무 등록 이전에 필요한 정보를 생성한다.
	 */
	public static class PreWrite extends EnhTaskAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			EnhTask item = new EnhTask();
			item.setAuthor(UserService.getUser());
			item.setRgstDate(new Date());

			_factory.marshal(ctx.getWriter(), item);
		}
	}
}
