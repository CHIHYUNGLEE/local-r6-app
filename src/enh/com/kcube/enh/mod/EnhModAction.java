package com.kcube.enh.mod;

import java.util.HashMap;
import java.util.Map;

import com.kcube.lib.action.Action;
import com.kcube.lib.action.ActionContext;
import com.kcube.lib.jdbc.DbStorage;
import com.kcube.lib.json.JsonMapping;

/**
 * 관련기술(탭) 관련 기본 Action
 */
public abstract class EnhModAction implements Action
{
	static DbStorage _storage = new DbStorage(EnhMod.class);
	static JsonMapping _factory = new JsonMapping(EnhMod.class, "mod"); // 관련기술 초기양식, 조회할
																		// 때 사용
	static JsonMapping _modfactory = new JsonMapping(EnhModList.class); // mod순서를 변경할 때 사용

	static final String FIELD = "modid"
		+ ", enhid"
		+ ", seq_order"
		+ ", title"
		+ ", user_name"
		+ ", user_disp"
		+ ", rgst_date"
		+ ", userid ";

	/**
	 * 관련기술(탭) 리스트들을 반환하기위한 attribute들을 Map에 담는다.
	 */
	static Map<String, String> ATTRIBUTES = new HashMap<String, String>();
	{
		ATTRIBUTES.put("modid", "id");
		ATTRIBUTES.put("enhid", "enhId");
		ATTRIBUTES.put("title", "title");
		ATTRIBUTES.put("userid", "userId");
		ATTRIBUTES.put("user_name", "userName");
		ATTRIBUTES.put("user_disp", "userDisp");
		ATTRIBUTES.put("seq_order", "seqOrder");
		ATTRIBUTES.put("rgst_date", "rgstDate");
	}

	/**
	 * ActionContext에서 Item 객체를 추출한다.
	 * <p>
	 * content가 별도의 parameter로 전달된 경우, xml 값보다 우선한다.
	 */
	EnhMod unmarshal(ActionContext ctx) throws Exception
	{
		EnhMod client = (EnhMod) _factory.unmarshal(ctx.getParameter("item"));
		String content = ctx.getParameter("content");
		if (content != null)
		{
			client.setContent(content);
		}
		return client;
	}
}
