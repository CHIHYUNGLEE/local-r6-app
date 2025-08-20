package com.kcube.enh.task;

import com.kcube.lib.action.Action;
import com.kcube.lib.action.ActionContext;
import com.kcube.lib.jdbc.DbStorage;
import com.kcube.lib.json.JsonMapping;

/**
 * 고도화관리 역할 관련 기본 Action
 */
public abstract class EnhTaskAction implements Action
{
	static DbStorage _storage = new DbStorage(EnhTask.class);
	static JsonMapping _factory = new JsonMapping(EnhTask.class, "task");

	/**
	 * 클라이언트에서 넘겨받은 Json String을 EnhItemTask Bean에 맵핑(Set)하여 Bean을 리턴한다.
	 */
	EnhTask unmarshal(ActionContext ctx) throws Exception
	{
		EnhTask client = (EnhTask) _factory.unmarshal(ctx.getParameter("item"));
		return client;
	}
}
