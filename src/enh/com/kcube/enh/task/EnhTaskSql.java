package com.kcube.enh.task;

import java.io.PrintWriter;
import java.sql.ResultSet;

import com.kcube.enh.EnhMultiSql;
import com.kcube.lib.sql.SqlChooser;
import com.kcube.lib.sql.SqlPage;
import com.kcube.lib.sql.SqlSelect;
import com.kcube.lib.sql.SqlTable;
import com.kcube.lib.sql.SqlWriter;

/**
 * 고도화관리 역할 기본 SQL
 */
public class EnhTaskSql
{
	private static final SqlTable TASK = new SqlTable("enh_item_task", "i");
	private static SqlWriter _writer = new SqlWriter().putAll(TASK);

	private String _ts;
	private boolean _countVisible;
	private SqlPage _page;

	private static EnhMultiSql _multiSql = new EnhMultiSql();

	/**
	 * 생성자
	 */
	public EnhTaskSql() throws Exception
	{
		this(null);
	}

	public EnhTaskSql(String ts) throws Exception
	{
		this(ts, true);
	}

	public EnhTaskSql(String ts, boolean countVisble) throws Exception
	{
		_ts = ts;
		_page = new SqlPage(TASK.aliasToColumn(), _ts);
		_countVisible = countVisble;
	}

	public void writeJson(PrintWriter writer, SqlSelect select, SqlSelect count) throws Exception
	{
		_writer.setOrder("i.GRADE_SORT");
		_writer.setTable("enh_item_task");
		_writer.page(writer, select, count, _ts);
	}

	/**
	 * 총건수 불필요할 경우 페이징을 위한 카운트만 실시한다.
	 */
	public void setCountCondition(SqlSelect stmt)
	{
		if (!isCountCondition())
		{
			stmt.rownum(_page.getVisibleCount());
		}
	}

	/**
	 * 총건수를 표시하는지 여부를 돌려준다.
	 * <p>
	 * true : 총건수 표시 false : 총건수 표시하지 않음
	 */
	public boolean isCountCondition()
	{
		return (_countVisible || _page.isSearch());
	}

	/**
	 * 목록표시상태 리스트 SqlStatement를 돌려준다.
	 */
	public SqlSelect getSelect(long enhId) throws Exception
	{
		SqlSelect kstmt = SqlChooser.getSqlSelect(_multiSql, "getDprtSort");

		SqlSelect ustmt = new SqlSelect();
		ustmt.select(
			"u.USERID, u.NAME, u.dprtid, u.STATUS, u.empno, u.GRADE_NAME, u.GRADE_SORT, u.level1, u.level2, u.level3, u.level4 ,k.CSORT ");
		ustmt.from("hr_user u");
		ustmt.leftOuter(kstmt, "k", "u.dprtid=k.kmid");

		// ustmt.from(kstmt, "k");
		// ustmt.where("u.dprtid=k.kmid(+)");

		SqlSelect stmt = new SqlSelect();
		stmt.select(
			"i.taskid, i.rgst_date, i.task_sdate, i.task_edate, i.plan_sdate, i.plan_edate, i.userid, i.user_name, i.task, i.opn_cnt, i.enhid, i.task_code ");
		stmt.select(
			"h.GRADE_NAME GRADE_NAME, h.GRADE_SORT GRADE_SORT, h.dprtid, h.empno, i.reside, i.file_ext, csort ");
		stmt.from("enh_item_task i");
		stmt.leftOuter(ustmt, "h", "i.userid = h.userid");
		stmt.where("i.enhid=?", enhId);

		// stmt.from(ustmt, "h");
		// stmt.where("i.userid = h.userid(+)");

		SqlSelect istmt = new SqlSelect();
		istmt.select(
			"i.taskid, i.rgst_date, i.task_sdate, i.task_edate, i.plan_sdate, i.plan_edate, i.userid, i.user_name, i.task, i.opn_cnt, i.enhid, i.task_code ");
		istmt.select("i.GRADE_NAME, i.GRADE_SORT, i.dprtid, i.empno, i.csort, i.reside, i.file_ext ");
		istmt.from(stmt, "i");
		return istmt;
	}

	/**
	 * 목록표시상태의 카운트 SqlStatement를 돌려준다.
	 */
	public SqlSelect getCount(long enhId) throws Exception
	{
		SqlSelect stmt = new SqlSelect();
		stmt.from(TASK);
		stmt.where("i.enhid=?", enhId);
		setCountCondition(stmt);
		return stmt;
	}

	/**
	 * 고도화 ID로 등록된 역할을 돌려준다
	 * @param enhId
	 * @return
	 * @throws Exception
	 */
	public SqlSelect getIdSelect(long enhId) throws Exception
	{
		SqlSelect stmt = new SqlSelect();
		stmt.select("taskid");
		stmt.from("enh_item_task i");
		stmt.where("i.enhid = ?", enhId);
		return stmt;
	}
	
	/**
	 * 목록표시상태의 카운트 SqlStatement를 돌려준다.
	 */
	public static Boolean existTask(long enhId, long userId, int taskCode) throws Exception
	{
		SqlSelect stmt = new SqlSelect();
		stmt.select("count(*) existTask");
		stmt.from("enh_item_task");
		stmt.where("enhid=?", enhId);
		stmt.where("userid=?", userId);
		stmt.where("task_code=?", taskCode);
		ResultSet rs = stmt.query();
		rs.next();
		boolean existTask;
		if (rs.getInt("existTask") == 0)
		{
			existTask = false;
		}
		else
		{
			existTask = true;
		}
		return existTask;
	}

}
