package com.kcube.enh.task;

import com.kcube.lib.action.ActionContext;

/**
 * 고도화관리 역할 등록자 Action
 */
public class EnhTaskOwner
{
	/**
	 * 등록된 고도화 역할을 소유자의 권한으로 수정한다.
	 */
	public static class DoUpdateByOwner extends EnhTaskAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			EnhTask client = unmarshal(ctx);
			Long id = client.getId();
			EnhTask server = (EnhTask) _storage.loadOrCreateWithLock(id);
			EnhTaskPermission.checkMbr(client.getEnhId());
			EnhTaskManager.update(server, client);

			EnhTaskHistory.alimiTask(server);
		}
	}

	/**
	 * 등록된 고도화 역할을  소유자 권한으로 삭제한다.
	 */
	public static class DoRemoveByOwner extends EnhTaskAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			EnhTask server = (EnhTask) _storage.loadWithLock(ctx.getLong("id"));
			EnhTaskPermission.checkMbr(ctx.getLong("enhId"));
			EnhTaskManager.remove(server);
		}
	}
}
