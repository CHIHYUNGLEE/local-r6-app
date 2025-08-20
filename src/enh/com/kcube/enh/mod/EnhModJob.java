package com.kcube.enh.mod;

import java.sql.PreparedStatement;

import com.kcube.lib.action.ActionContext;
import com.kcube.lib.jdbc.DbConfiguration;
import com.kcube.lib.jdbc.DbService;

public class EnhModJob
{

	/**
	 * 기능맵 기술목록 최신화 Job MERGE 문 사용 병합될 테이블 ENH_ITEM_MOD_LIST 사용될 테이블 ENH_ITEM_MOD 조건 :
	 * TITLE이 들어있을 때 TITLE이 들어있다면 UPDATE문으로 COUNT를 업데이트해주고 들어있지 않다면 INSERT문으로 새로운 TITLE를
	 * 넣어준다.
	 */
	public static class ModUpdateJob extends EnhModAction
	{
		public void execute(ActionContext ctx) throws Exception
		{
			DbService.begin();
			StringBuffer modquery = new StringBuffer();
			modquery.append("DELETE FROM ENH_ITEM_MOD_LIST ");
			PreparedStatement deletestmt = DbService.prepareStatement(modquery.toString());
			deletestmt.execute();
			DbService.commit();

			DbService.begin();
			StringBuffer query = new StringBuffer();

			if (DbConfiguration.isMySql())
			{
				query.append("INSERT INTO ENH_ITEM_MOD_LIST (TITLE, MOD_COUNT, RGST_DATE, LAST_UPDT) ");
				query.append("	(SELECT ");
				query.append("		TITLE, COUNT(TITLE) AS MOD_COUNT, NOW(), NOW() ");
				query.append("	FROM ");
				query.append("		ENH_ITEM_MOD ");
				query.append("	WHERE ");
				query.append("		STATUS = 3000 ");
				query.append("	GROUP BY ");
				query.append("		TITLE) ");
				query.append(" ON DUPLICATE KEY UPDATE ");
				query.append(" MOD_COUNT = MOD_COUNT, LAST_UPDT = NOW() ");
			}
			else
			{
				query.append("MERGE INTO ENH_ITEM_MOD_LIST S ");
				query
					.append(
						"USING (SELECT TITLE, COUNT(TITLE) AS MOD_COUNT FROM ENH_ITEM_MOD WHERE STATUS = 3000 GROUP BY TITLE ) T ");
				query.append("ON (S.TITLE IN (T.TITLE)) ");
				query.append("WHEN MATCHED THEN ");
				query.append("UPDATE SET ");
				query.append("S.MOD_COUNT = T.MOD_COUNT, ");
				query.append("S.LAST_UPDT = SYSDATE ");
				query.append("WHERE S.TITLE = T.TITLE ");
				query.append("WHEN NOT MATCHED THEN ");
				query.append("INSERT(S.TITLE,S.MOD_COUNT,S.RGST_DATE,S.LAST_UPDT) ");
				query.append("VALUES ");
				query.append("(T.TITLE,T.MOD_COUNT,SYSDATE,SYSDATE) ");
			}

			PreparedStatement stmt = DbService.prepareStatement(query.toString());
			stmt.execute();
			DbService.commit();
		}
	}
}
