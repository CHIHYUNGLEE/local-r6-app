package com.kcube.enh;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.kcube.lib.sql.SqlChooser;
import com.kcube.lib.sql.SqlSelect;
import com.kcube.lib.sql.SqlType;
import com.kcube.sys.conf.ConfigService;
import com.kcube.sys.emp.EmployeeConfig;

/**
 * MultiDb 처리를 위한 Class
 */
public class EnhMultiSql
{
	private static Log _log = LogFactory.getLog(EnhMultiSql.class);
	private static EmployeeConfig _empConf = (EmployeeConfig) ConfigService.getConfig(EmployeeConfig.class);

	/**
	 * Level 쿼리를 이용하여 조직도 정렬 쿼리를 돌려준다.
	 * <p>
	 * 오라클 및 기타
	 * @return
	 */
	public SqlSelect getDprtSort()
	{
		SqlSelect kstmt = new SqlSelect();
		kstmt.select("KMID, SUBSTR(SYS_CONNECT_BY_PATH(SUBSTR(100000000 + SORT, 2), '|'), 2) CSORT");
		kstmt.from("km");
		kstmt.where("ISVISB = 1 START WITH KMID = ? CONNECT BY PRIOR KMID = PID ", _empConf.getDprtId());
		return kstmt;
	}

	/**
	 * Level 쿼리를 이용하여 조직도 정렬 쿼리를 돌려준다.
	 * <p>
	 * MySQL
	 * @return
	 */
	@SqlType(dbmsType = SqlChooser.MYSQL, methodName = "getDprtSort")
	public SqlSelect getDprtSortMySQL()
	{
		SqlSelect kstmt = new SqlSelect();
		kstmt.select("CONNECT_BY_PRIOR_KM() AS KMID, @LEVEL AS LEV, (@SORT := @SORT+1) CSORT");
		kstmt.from("(SELECT @START_WITH := ?, @ID := @START_WITH, @LEVEL := 0, @SORT := 0 FROM DUAL ) H, KM K");
		kstmt.where("@ID IS NOT NULL AND ISVISB = 1");
		kstmt.setLong(_empConf.getDprtId());

		if (_log.isDebugEnabled())
		{
			_log.debug("getDprtSortMySQL:" + kstmt.toString());
		}
		return kstmt;
	}
}
