package com.kcube.enh;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import com.kcube.lib.jdbc.DbService;
import com.kcube.lib.jdbc.TableState;
import com.kcube.lib.sql.SqlDialect;
import com.kcube.lib.tree.TreeState;
import com.kcube.sys.conf.ConfigService;
import com.kcube.sys.emp.EmployeeConfig;
import com.kcube.sys.i18n.I18NService;

public class EnhStorage
{
	private static EmployeeConfig _config = (EmployeeConfig) ConfigService.getConfig(EmployeeConfig.class);

	/**
	 * 해당 그룹아이디에 포함되는 사용자 정보 리스트를 반환한다.
	 */
	public ResultSet getUserList(TableState ts, TreeState tr, String enhId) throws Exception
	{
		StringBuffer query = new StringBuffer();
		query.append("SELECT A.USERID, A.name, A.user_disp, ");
		query.append("A.grade_name, A.grade_sort, A.pstn_name, A.dprt_name, A.dprtid , ");
		query.append("A.milg, A.rwrd_milg, A.EMPNO, A.vrtl_milg, ");
		query.append("A.e_mail, A.job_title, A.ofce_phn, A.mbl_phn, A.cdtn, ");
		query.append("A.condition_text, A.thumb_save_code, A.thumb_save_path, ");
		query.append(SqlDialect.decode("A.locale", null, "'" + I18NService.getDefaultLocale().toString() + "'", "A.locale"));
		query.append(" locale ");
		query.append("FROM ( ");
		query.append("SELECT PMID FROM ENH_ITEM WHERE ENHID=" + enhId);
		query.append(" UNION SELECT USERID FROM ENH_ITEM_MBR WHERE ENHID = " + enhId);
		query.append(" ) B LEFT OUTER JOIN HR_USER A ON B.PMID = A.USERID ");
		tr.appendAnd(query, "A", "dprtid");
		ts.appendAnd(query);
		ts.appendOrderBy(query, _config.getUserListSort());
		ts.appendRownum(query);
		PreparedStatement pstmt = DbService.prepareStatement(query.toString());
		int index = tr.bind(pstmt, 1);
		index = ts.bindSearch(pstmt, index);
		index = ts.bindRownum(pstmt, index);
		return pstmt.executeQuery();
	}

	public int getUserCount(TableState ts, TreeState tr, String enhId) throws Exception
	{
		StringBuffer query = new StringBuffer();
		query.append("SELECT COUNT(A.userid) ");
		query.append("FROM ( ");
		query.append("SELECT PMID FROM ENH_ITEM WHERE ENHID=" + enhId);
		query.append(" UNION SELECT USERID FROM ENH_ITEM_MBR WHERE ENHID = " + enhId);
		query.append(" ) B LEFT OUTER JOIN HR_USER A ON B.PMID = A.USERID ");
		tr.appendAnd(query, "A", "dprtid");
		ts.appendAnd(query);
		PreparedStatement pstmt = DbService.prepareStatement(query.toString());
		int index = tr.bind(pstmt, 1);
		ts.bindSearch(pstmt, index);

		ResultSet rs = pstmt.executeQuery();
		rs.next();

		return rs.getInt(1);
	}
}