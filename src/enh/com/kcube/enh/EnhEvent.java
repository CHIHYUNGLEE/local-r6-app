package com.kcube.enh;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import com.kcube.doc.Item;
import com.kcube.enh.mod.EnhMod;
import com.kcube.lib.jdbc.DbConfiguration;
import com.kcube.lib.jdbc.DbService;
import com.kcube.lib.sql.SqlDate;
import com.kcube.lib.sql.SqlDelete;
import com.kcube.lib.sql.SqlInsert;
import com.kcube.lib.sql.SqlSelect;
import com.kcube.lib.sql.SqlUpdate;
import com.kcube.sys.conf.ConfigService;

/**
 * 게시판 외부에서 발생하는 각종 event를 처리한다.
 */
public class EnhEvent implements EnhListener
{
	private static final String DELETE_MOD_LIST = "DELETE from enh_item_mod_list WHERE TITLE NOT IN (SELECT TITLE FROM ENH_ITEM_MOD WHERE STATUS = 3000) ";
	private static final String INSERT_STAT_MOD = "MERGE INTO ENH_ITEM_MOD_LIST S "
		+ "USING (SELECT TITLE, COUNT(TITLE) AS MOD_COUNT FROM ENH_ITEM_MOD WHERE STATUS = 3000 GROUP BY TITLE ) T "
		+ "ON (S.TITLE IN (T.TITLE)) "
		+ "WHEN MATCHED THEN "
		+ "UPDATE SET S.MOD_COUNT = T.MOD_COUNT, S.LAST_UPDT = SYSDATE "
		+ "WHERE S.TITLE = T.TITLE "
		+ "WHEN NOT MATCHED THEN "
		+ "INSERT (S.TITLE,S.MOD_COUNT,S.RGST_DATE,S.LAST_UPDT) "
		+ "VALUES (T.TITLE,T.MOD_COUNT,SYSDATE,SYSDATE) ";
	private static final String INSERT_STAT_MOD_MYSQL = "INSERT INTO ENH_ITEM_MOD_LIST (TITLE, MOD_COUNT, RGST_DATE, LAST_UPDT) "
		+ "	(SELECT "
		+ "		TITLE, COUNT(TITLE) AS MOD_COUNT, NOW(), NOW() "
		+ "	FROM "
		+ "		ENH_ITEM_MOD "
		+ "	WHERE "
		+ "		STATUS = 3000 "
		+ "	GROUP BY "
		+ "		TITLE) "
		+ " ON DUPLICATE KEY UPDATE "
		+ " MOD_COUNT = MOD_COUNT, LAST_UPDT = NOW() ";

	private static final String MODEFY_ENH = "UPDATE app_item_vrsn_enh SET enh_name = ? where itemid = ?";
	private static final String DELETE_ENH = "UPDATE app_item_vrsn_enh SET isvisb = ?, status = ?, sort = ? where itemid = ?";
	private static final String RECOVER_ENH = "UPDATE app_item_vrsn_enh SET isvisb = ?, status = ? where itemid = ?";
	private static final String REMOVE_ENH = "DELETE app_item_vrsn_enh where itemid = ?";
	private static EnhConfig _enhConf = (EnhConfig) ConfigService.getConfig(EnhConfig.class);

	/**
	 * 관련기술이 등록된 후 호출 된다.
	 * <p>
	 * ENH_ITEM_MOD_LIST 테이블에서 등록 server title값으로 조회 해당 관련기술 title이 존재한다면 mod_count값을 +1
	 * 업데이트 해당 관련기술 title이 존재하지 않는다면 새롭게 insert해서 관련기술 키워드 추가
	 */
	@Override
	public void modregistered(EnhMod server) throws Exception
	{
		DbService.flush();

		SqlSelect stmt = new SqlSelect();
		stmt.select("t.title, t.mod_count");
		stmt.from("enh_item_mod_list t");
		stmt.where("title = ?", server.getTitle());

		ResultSet rs = stmt.query();
		boolean flag = true; // 상위 쿼리의 결과값을 true, false로 구분한 후 true라면 수정을, false는 insert로
								// 분기한다.
		while (rs.next())
		{
			if (server.getTitle().equals(rs.getString(1)))
			{
				SqlUpdate updt = new SqlUpdate("enh_item_mod_list l");
				updt.setValue("l.mod_count = l.mod_count + 1");
				updt.where("l.title = ?", server.getTitle());
				updt.execute();
				flag = false;
			}
		}
		if (flag)
		{
			if (DbConfiguration.isMySql())
			{
				SqlInsert ins = new SqlInsert("enh_item_mod_list");
				ins.setString("title", server.getTitle());
				ins.setLong("mod_count", 1);
				ins.setTimestamp("rgst_date", SqlDate.getTimestamp());
				ins.setTimestamp("last_updt", SqlDate.getTimestamp());
				ins.execute();
			}
			else
			{
				SqlInsert ins = new SqlInsert("enh_item_mod_list l");
				ins.setString("l.title", server.getTitle());
				ins.setLong("l.mod_count", 1);
				ins.setTimestamp("l.rgst_date", SqlDate.getTimestamp());
				ins.setTimestamp("l.last_updt", SqlDate.getTimestamp());
				ins.execute();
			}
		}
	}

	/**
	 * 관련기술이 수정된 후 호출 된다.
	 * <p>
	 * MERGE문 실행 후 새로운 관련기술 및 관련기술이 있을 경우 MOD_COUNT값 업데이트
	 * <p>
	 * 기존의 수정되기전 관련기술은 ENH_ITEM_MOD_LIST에서 삭제처리
	 */
	@Override
	public void modified(EnhMod server) throws Exception
	{
		DbService.flush(); // 기존의 트랜잭션의 작업을 완료해주고 다음 트랜잭션을 실행하게 해준다.
		DbService.begin();
		insertMod();
		deleteMod();
		DbService.commit();
	}

	/**
	 * 관련기술이 삭제된 후 호출 된다.
	 * <p>
	 * ENH_ITEM_MOD_LIST 테이블에서 등록 server title값으로 조회
	 * <p>
	 * 해당 관련기술 MOD_COUNT가 1이라면 그 관련기술을 remove 처리
	 * <p>
	 * 해당 관련기술 MOD_COUNT가 2 이상이라면 그 관련기술의 mod_count를 -1처리
	 */
	@Override
	public void moddeleted(EnhMod server) throws Exception
	{
		DbService.flush();

		SqlSelect stmt = new SqlSelect();
		stmt.select("t.title, t.mod_count");
		stmt.from("enh_item_mod_list t");
		stmt.where("title = ?", server.getTitle());

		ResultSet rs = stmt.query();
		while (rs.next())
		{
			if (rs.getInt(2) == 1)
			{
				SqlDelete del = new SqlDelete("enh_item_mod_list l");
				del.where("l.title = ?", server.getTitle());
				del.execute();
			}
			else if (rs.getInt(2) >= 2)
			{
				SqlUpdate updt = new SqlUpdate("enh_item_mod_list l");
				updt.setValue("l.mod_count = l.mod_count - 1");
				updt.where("l.title = ?", server.getTitle());
				updt.execute();
			}
		}
	}

	/**
	 * enh_item_mod_list에 없는 관련기술 제목을 enh_item_mod에 삽입한다. 있다면 count를 +1한다.
	 */
	public void insertMod() throws Exception
	{
		PreparedStatement statement = null;
		if (DbConfiguration.isMySql())
		{
			statement = DbService.prepareStatement(INSERT_STAT_MOD_MYSQL);
		}
		else
		{
			statement = DbService.prepareStatement(INSERT_STAT_MOD);

		}
		statement.executeUpdate();
	}

	/**
	 * enh_item_mod에 없는 관련기술 제목을 enh_item_mod_list에서 삭제한다.
	 */
	public void deleteMod() throws Exception
	{
		PreparedStatement statement = DbService.prepareStatement(DELETE_MOD_LIST);
		statement.execute();
	}

	/**
	 * 고도화 관리에서 고도화가 수정시 실행된다.
	 */
	@Override
	public void modifiedEnh(Enh server) throws Exception
	{
		// 앱 관리가 설치되어 있으면 실행한다
		if (!(null == _enhConf.getAppManagerAppId() || -1 == _enhConf.getAppManagerAppId()))
		{
			PreparedStatement pstmt = DbService.prepareStatement(MODEFY_ENH);
			pstmt.setString(1, server.getEnhName());
			pstmt.setLong(2, server.getId());
			pstmt.execute();
		}
	}

	/**
	 * 고도화 관리에서 고도화가 삭제시 실행된다.
	 */
	@Override
	public void deleteEnh(Enh server) throws Exception
	{
		// 앱 관리가 설치되어 있으면 실행한다
		if (!(null == _enhConf.getAppManagerAppId() || -1 == _enhConf.getAppManagerAppId()))
		{
			PreparedStatement pstmt = DbService.prepareStatement(DELETE_ENH);
			pstmt.setBoolean(1, false);
			pstmt.setInt(2, Item.DELETED_STATUS);
			pstmt.setString(3, null);
			pstmt.setLong(4, server.getId());
			pstmt.executeUpdate();

			// 버전의 적용 고도화 갯수를 갱신
			SqlSelect stmt = new SqlSelect();
			stmt.select("vrsnid");
			stmt.from("app_item_vrsn_enh");
			stmt.where("itemid = ?", server.getId());

			ResultSet rs = stmt.query();

			while (rs.next())
			{
				SqlSelect stmt1 = new SqlSelect();
				stmt1.select("count(*)");
				stmt1.from("app_item_vrsn_enh");
				stmt1.where("vrsnid = ?", rs.getLong("vrsnid"));
				stmt1.where("isvisb = ?", true);
				ResultSet countRs = stmt1.query();
				countRs.next();

				SqlUpdate updt = new SqlUpdate("app_item_vrsn");
				updt.setInt("enh_cnt", countRs.getInt("count(*)"));
				updt.where("vrsnid = ?", rs.getLong("vrsnid"));
				updt.execute();
			}

			// 앱의 적용 고도화 갯수를 갱신
			SqlSelect stmt2 = new SqlSelect();
			stmt2.select("distinct v.itemid");
			stmt2.from("app_item_vrsn v");
			stmt2.from(stmt, "p");
			stmt2.where("v.vrsnid = p.vrsnid");
			ResultSet rs2 = stmt2.query();

			while (rs2.next())
			{
				SqlSelect sub = new SqlSelect();
				sub.select("count(distinct(p.itemid))");
				sub.from("app_item_vrsn_enh p");
				sub.from("app_item_vrsn v");
				sub.where("p.vrsnid = v.vrsnid");
				sub.where("v.isvisb = ?", true);
				sub.where("p.isvisb = ?", true);
				sub.where("v.itemid = ? ", rs2.getLong("itemid"));

				SqlUpdate updt2 = new SqlUpdate("app_item");
				updt2.setValue("enh_cnt", sub);
				updt2.where("itemid = ? ", rs2.getLong("itemid"));
				updt2.execute();
			}
		}
	}

	/**
	 * 고도화 관리에서 고도화가 복원시 실행된다.
	 */
	@Override
	public void recoverEnh(Enh server) throws Exception
	{
		// 앱 관리가 설치되어 있으면 실행한다
		if (!(null == _enhConf.getAppManagerAppId() || -1 == _enhConf.getAppManagerAppId()))
		{
			PreparedStatement pstmt = DbService.prepareStatement(RECOVER_ENH);
			pstmt.setBoolean(1, true);
			pstmt.setInt(2, Item.REGISTERED_STATUS);
			pstmt.setLong(3, server.getId());
			pstmt.executeUpdate();

			// 버전의 적용 고도화 갯수를 갱신
			SqlSelect stmt = new SqlSelect();
			stmt.select("count(*),vrsnid");
			stmt.from("app_item_vrsn_enh");
			stmt
				.where(
					"vrsnid in " + "(select vrsnid " + "from app_item_vrsn_enh " + "where itemid = ? )",
					server.getId());
			stmt.where("isvisb = ?", true);
			stmt.group("vrsnid");

			ResultSet rs = stmt.query();
			while (rs.next())
			{
				SqlUpdate updt = new SqlUpdate("app_item_vrsn");
				updt.setInt("enh_cnt", rs.getInt("count(*)"));
				updt.where("vrsnid = ?", rs.getLong("vrsnid"));
				updt.execute();
			}

			// 앱의 적용 고도화 갯수를 갱신
			SqlSelect stmt2 = new SqlSelect();
			stmt2.select("distinct v.itemid");
			stmt2.from("app_item_vrsn v");
			stmt2.from(stmt, "p");
			stmt2.where("v.vrsnid = p.vrsnid");
			ResultSet rs2 = stmt2.query();

			while (rs2.next())
			{
				SqlSelect sub = new SqlSelect();
				sub.select("count(distinct(p.itemid))");
				sub.from("app_item_vrsn_enh p");
				sub.from("app_item_vrsn v");
				sub.where("p.vrsnid = v.vrsnid");
				sub.where("v.isvisb = ?", true);
				sub.where("p.isvisb = ?", true);
				sub.where("v.itemid = ? ", rs2.getLong("itemid"));

				SqlUpdate updt2 = new SqlUpdate("app_item");
				updt2.setValue("enh_cnt", sub);
				updt2.where("itemid = ? ", rs2.getLong("itemid"));
				updt2.execute();
			}
		}
	}

	/**
	 * 고도화 관리에서 고도화가 폐기시 실행된다.
	 */
	@Override
	public void removeEnh(Enh server) throws Exception
	{
		// 앱 관리가 설치되어 있으면 실행한다
		if (!(null == _enhConf.getAppManagerAppId() || -1 == _enhConf.getAppManagerAppId()))
		{
			PreparedStatement pstmt = DbService.prepareStatement(REMOVE_ENH);
			pstmt.setLong(1, server.getId());
			pstmt.executeUpdate();
		}

	}
}