package com.kcube.enh;

import com.kcube.doc.reply.ReplyManager;
import com.kcube.enh.mod.EnhMod;
import com.kcube.lib.action.Action;
import com.kcube.lib.action.ActionContext;
import com.kcube.lib.jdbc.DbStorage;
import com.kcube.lib.json.JsonMapping;

/**
 * 고도화관리 관련 기본 Action
 */
public abstract class EnhAction implements Action
{
	static DbStorage _storage = new DbStorage(Enh.class);
	static DbStorage _modstorage = new DbStorage(EnhMod.class);
	static ReplyManager _reply = new ReplyManager(Enh.class);
	static JsonMapping _factory = new JsonMapping(Enh.class);

	/**
	 * 클라이언트에서 넘겨받은 Json String을 EnhItem Bean에 맵핑(Set)하여 Bean을 리턴한다.
	 */
	Enh unmarshal(ActionContext ctx) throws Exception
	{
		Enh client = (Enh) _factory.unmarshal(ctx.getParameter("item"));
		return client;
	}
}
