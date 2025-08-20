package com.kcube.enh;

import java.io.PrintWriter;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Calendar;

import com.kcube.lib.jdbc.DbConfiguration;
import com.kcube.lib.jdbc.DbService;
import com.kcube.lib.jdbc.TableState;
import com.kcube.lib.sql.SqlChooser;
import com.kcube.lib.sql.SqlDate;
import com.kcube.lib.sql.SqlDelete;
import com.kcube.lib.sql.SqlDialect;
import com.kcube.lib.sql.SqlFragment;
import com.kcube.lib.sql.SqlPage;
import com.kcube.lib.sql.SqlSelect;
import com.kcube.lib.sql.SqlTable;
import com.kcube.lib.sql.SqlWriter;
import com.kcube.lib.tree.TreeState;
import com.kcube.space.Space;
import com.kcube.space.menu.SpaceMenu;
import com.kcube.sys.usr.UserService;

/**
 * 고도화관리 기본 SQL
 */
public class EnhSql
{
	private static final SqlTable ENHITEM = new SqlTable("enh_item", "i");
	private static final SqlTable ENHITEMMOD = new SqlTable("enh_item_mod", "m");
	private static final SqlTable MEMBER = new SqlTable("enh_item_mbr", "j");
	private static final SqlTable ENH_JOIN_TASK = new SqlTable("enh_item_join_enh_item_task");
	private static final SqlTable ENHITEMMODLIST = new SqlTable("enh_item_mod_list", "l");

	private static SqlWriter _writer = new SqlWriter().putAll(ENHITEM);
	private static SqlWriter _taskWriter = new SqlWriter().putAll(ENH_JOIN_TASK);
	private static SqlWriter _modwriter = new SqlWriter().putAll(ENHITEMMOD);

	private static EnhMultiSql _multiSql = new EnhMultiSql();

	/**
	 * 앱 관리 APP 연동 관련 추가
	 */
	private static final String enhSelect = "i.enhid,"
		+ "i.enh_name,"
		+ "i.enh_sdate,"
		+ "i.enh_edate,"
		+ "i.userid,"
		+ "i.rgst_name,"
		+ "i.user_disp,"
		+ "i.file_ext,"
		+ "i.opn_cnt,"
		+ "i.status,"
		+ "i.isvisb,"
		+ "i.pm_name,"
		+ "i.pmid,"
		+ "i.pm_disp,"
		+ "i.ofceid,"
		+ "i.ofce_name,"
		+ "a.vrsnid,"
		+ "a.vrsn_name";

	private String _ts;
	private boolean _countVisible;
	private SqlPage _page;

	/**
	 * 생성자
	 */
	public EnhSql() throws Exception
	{
		this(null);
	}

	public EnhSql(String ts) throws Exception
	{
		this(ts, true);
	}

	public EnhSql(String ts, boolean countVisble) throws Exception
	{
		_ts = ts;
		_page = new SqlPage(ENHITEM.aliasToColumn(), _ts);
		_countVisible = countVisble;
	}

	// cst
	public EnhSql(Long folderId, String ts, boolean countVisble) throws Exception
	{
		_ts = ts;
		_page = new SqlPage(ENHITEMMOD.aliasToColumn(), _ts);
		_countVisible = countVisble;
	}

	// cst

	/**
	 * COUNT 문을 실행하지 않고 paging 조건을 추가하여 SELECT 문을 실행한 결과를 JSON으로 출력한다.
	 */

	public void writeJson(PrintWriter writer, SqlSelect select, SqlSelect count) throws Exception
	{
		_writer.setOrder("i.enh_sdate desc, i.rgst_date desc");
		_writer.setTable("enh_item");
		_writer.page(writer, select, count, _ts);
	}

	public void writeTaskListJson(PrintWriter writer, SqlSelect select, SqlSelect count) throws Exception
	{
		_taskWriter.setOrder("i.enh_sdate desc, i.rgst_date desc");
		_taskWriter.setTable("enh_item_join_enh_item_task");
		_taskWriter.page(writer, select, count, _ts);
	}

	public void writeTaskListJson(PrintWriter writer, SqlSelect select) throws Exception
	{
		_taskWriter.list(writer, select);
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
	 * 목록표시상태(isvisb=1)인 리스트 SqlStatement를 돌려준다.
	 */
	public SqlSelect getVisibleSelect(int status, String nYear) throws Exception
	{
		return getVisibleSelect(status, nYear, false);
	}
	
	
	public SqlSelect getVisibleSelect(int status, String nYear, boolean isAdmin) throws Exception
	{
		SqlSelect taskStmt = new SqlSelect();
		SqlSelect taskStmt1 = new SqlSelect();
		SqlSelect taskStmt2 = new SqlSelect();

		taskStmt.select("enhid");
		taskStmt.from("enh_item");
		taskStmt1.select("enhid");
		taskStmt1.from("enh_item");
		taskStmt2.select("enhid");
		taskStmt2.from("enh_item");

		if (nYear != null && !isAdmin)
		{
			Calendar c = Calendar.getInstance();
			c.set(Integer.parseInt(nYear), 1, 1);
			java.util.Date d = c.getTime();

			// 현재 년도보다 먼저 시작해서 현재년도 이후에 끝나는 고도화
			taskStmt.where("ENH_SDATE < ?", SqlDate.getFirstOfYear(d));
			taskStmt.where("ENH_EDATE > ?", SqlDate.getLastOfYear(d));

			// 현재 년도에 끝나는 고도화
			taskStmt1.where("ENH_EDATE >= ?", SqlDate.getFirstOfYear(d));
			taskStmt1.where("ENH_EDATE <= ?", SqlDate.getLastOfYear(d));

			// 현재 년도부터 시작하는 고도화
			taskStmt2.where("ENH_SDATE >= ?", SqlDate.getFirstOfYear(d));
			taskStmt2.where("ENH_SDATE <= ?", SqlDate.getLastOfYear(d));

		}
		taskStmt.union(taskStmt1).union(taskStmt2);

		SqlSelect stmt = new SqlSelect();
		stmt.select(ENHITEM, "list");
		
		SqlSelect cntSel = new SqlSelect();
		cntSel.select("count(enhId) as actorCnt");
		cntSel.from("ENH_ITEM_MBR", "M");
		cntSel.where("M.ENHID=I.ENHID");
		
		stmt.select(cntSel, "actorCnt");
		
		stmt.where("i.isvisb = 1");
		if (-1 != status)
		{
			stmt.where("i.status = ?", status);
		}

		stmt.where("i.enhid IN ", taskStmt);

		return stmt;
	}

	/**
	 * 목록표시상태(isvisb=0)인 리스트 SqlStatement를 돌려준다.
	 */
	public SqlSelect getInvisibleSelect() throws Exception
	{
		SqlSelect stmt = new SqlSelect();
		stmt.select(ENHITEM, "list");
		stmt.where("i.isvisb = 0");
		stmt.order("i.enhid desc");

		return stmt;
	}

	/**
	 * 목록표시상태의 카운트 SqlStatement를 돌려준다.
	 */
	public SqlSelect getVisibleCount(int status, String nYear) throws Exception
	{
		return getVisibleCount(status, nYear, false);
	}
	
	public SqlSelect getVisibleCount(int status, String nYear, boolean isAdmin) throws Exception
	{
		SqlSelect taskStmt = new SqlSelect();
		SqlSelect taskStmt1 = new SqlSelect();
		SqlSelect taskStmt2 = new SqlSelect();

		taskStmt.select("enhid");
		taskStmt.from("enh_item");
		taskStmt1.select("enhid");
		taskStmt1.from("enh_item");
		taskStmt2.select("enhid");
		taskStmt2.from("enh_item");

		if (nYear != null && !isAdmin)
		{
			Calendar c = Calendar.getInstance();
			c.set(Integer.parseInt(nYear), 1, 1);
			java.util.Date d = c.getTime();

			// 현재 년도보다 먼저 시작해서 현재년도 이후에 끝나는 고도화
			taskStmt.where("ENH_SDATE < ?", SqlDate.getFirstOfYear(d));
			taskStmt.where("ENH_EDATE > ?", SqlDate.getLastOfYear(d));

			// 현재 년도에 끝나는 고도화
			taskStmt1.where("ENH_EDATE >= ?", SqlDate.getFirstOfYear(d));
			taskStmt1.where("ENH_EDATE <= ?", SqlDate.getLastOfYear(d));

			// 현재 년도부터 시작하는 고도화
			taskStmt2.where("ENH_SDATE >= ?", SqlDate.getFirstOfYear(d));
			taskStmt2.where("ENH_SDATE <= ?", SqlDate.getLastOfYear(d));

		}
		taskStmt.union(taskStmt1).union(taskStmt2);

		SqlSelect stmt = new SqlSelect();
		stmt.select(ENHITEM, "list");
		stmt.where("i.isvisb = 1");
		if (-1 != status)
		{
			stmt.where("i.status = ?", status);
		}
		stmt.where("i.enhid IN ", taskStmt);
		setCountCondition(stmt);
		return stmt;
	}

	/**
	 * 목록표시상태의 카운트 SqlStatement를 돌려준다.
	 */
	public SqlSelect getInvisibleCount() throws Exception
	{
		SqlSelect stmt = new SqlSelect();
		stmt.from(ENHITEM);
		stmt.where("i.isvisb = 0");
		setCountCondition(stmt);
		return stmt;
	}

	/**
	 * 고도화 팀원의 SqlStatement를 돌려준다.
	 */
	public SqlSelect getMemberSelect(Long enhId) throws Exception
	{
		SqlSelect stmt = new SqlSelect();
		stmt.select("*");
		stmt.from(MEMBER);
		stmt.where("j.enhId = ?", enhId);
		return stmt;
	}

	/**
	 * 고도화 팀원이 삭제된 경우 팀원의 업무를 삭제한다.
	 */
	public void deleteMemberTask(long enhId, long userId) throws Exception
	{
		SqlDelete del = new SqlDelete("enh_item_task");
		del.where("enhid= ?", enhId);
		del.where("userid= ?", userId);
		del.execute();
		DbService.commit();
	}

	/**
	 * 해당 연도에 사용자가 수행한 고도화를 또는 전체 고도화를 셀렉트한다.
	 */
	public SqlSelect getProjects(String nYear, String mode)
	{
		Long userid = UserService.getUserId();

		Calendar c = Calendar.getInstance();
		c.set(Integer.parseInt(nYear), 1, 1);
		java.util.Date d = c.getTime();

		SqlSelect taskStmt = new SqlSelect();
		SqlSelect taskStmt1 = new SqlSelect();
		SqlSelect taskStmt2 = new SqlSelect();

		taskStmt.select("enhid");
		taskStmt.from("enh_item_task");
		taskStmt1.select("enhid");
		taskStmt1.from("enh_item_task");
		taskStmt2.select("enhid");
		taskStmt2.from("enh_item_task");

		if (nYear != null)
		{
			// 현재 년도보다 먼저 시작해서 현재년도 이후에 끝나는 고도화
			taskStmt.where("ENH_SDATE < ?", SqlDate.getFirstOfYear(d));
			taskStmt.where("ENH_EDATE > ?", SqlDate.getLastOfYear(d));

			// 현재 년도에 끝나는 고도화
			taskStmt1.where("ENH_SDATE >= ?", SqlDate.getFirstOfYear(d));
			taskStmt1.where("ENH_EDATE <= ?", SqlDate.getLastOfYear(d));

			// 현재 년도부터 시작하는 고도화
			taskStmt2.where("ENH_SDATE >= ?", SqlDate.getFirstOfYear(d));
			taskStmt2.where("ENH_EDATE <= ?", SqlDate.getLastOfYear(d));

			if (mode != null && !mode.equalsIgnoreCase("User"))
			{
				taskStmt.where(" userid = " + userid);
				taskStmt1.where(" userid = " + userid);
				taskStmt2.where(" userid = " + userid);
			}

		}
		taskStmt.union(taskStmt1).union(taskStmt2);

		SqlSelect stmt = new SqlSelect();
		stmt.select(ENHITEM, "list");
		stmt.where("i.enhid IN ", taskStmt);
		stmt.where("i.isVisb=1");

		return stmt;
	}

	/**
	 * 해당 연도에 사용자가 수행한 업무를 또는 전체 업무를 셀렉트한다. 삭제된 고도화인 경우 isDel 값이 null 이 아니다.
	 */
	public SqlSelect getTasks(Long enhId, String nYear, String mode, String isDel) throws Exception
	{
		Long userid = UserService.getUserId();

		Calendar c = Calendar.getInstance();
		c.set(Integer.parseInt(nYear), 1, 1);
		java.util.Date d = c.getTime();

		SqlSelect taskStmt = new SqlSelect();

		// 가동율 계산을 위해 percent 컬럼 추가
		taskStmt.select(
			"enhid, taskId, task_sdate, task_edate, plan_sdate, plan_edate, percent, task_code, userid, user_name, isvisb, reside ");
		taskStmt.from("enh_item_task");

		if (nYear != null)
		{
			Date firstOfYear = SqlDate.getFirstOfYear(d);
			Date lastOfYear = SqlDate.getLastOfYear(d);

			// 현재 년도보다 먼저 시작해서 현재년도 이후에 끝나는 고도화
			taskStmt.where("(task_sdate < ?", firstOfYear);
			taskStmt.where("task_edate > ?)", lastOfYear);
			taskStmt.andOff().where(" OR ");

			// 현재 년도에 끝나는 고도화
			taskStmt.where("(task_edate >= ?", firstOfYear).andOn();
			taskStmt.where("task_edate <= ?)", lastOfYear);
			taskStmt.andOff().where(" OR ");

			// 현재 년도부터 시작하는 고도화
			taskStmt.where("(task_sdate >= ?", firstOfYear).andOn();
			taskStmt.where("task_sdate <= ?)", lastOfYear);
		}

		SqlSelect stmt = new SqlSelect();
		// 가동율 계산을 위해 percent 컬럼 추가
		stmt.select(
			"t.enhid, p.enh_name, p.status, t.taskId, t.task_sdate, t.task_edate, t.plan_sdate, t.plan_edate, t.percent, t.task_code, t.userid, t.user_name, t.reside ");
		stmt.from("enh_item p");
		stmt.from(taskStmt, "t");
		stmt.where("p.enhid=t.enhid");
		stmt.where("t.isVisb=1");
		// 삭제된 고도화인 경우 isVisb 값이 0 인것을 보여준다.
		if (isDel != null)
		{
			stmt.where("p.isVisb=0");
		}
		else
		{
			stmt.where("p.isVisb=1");
		}

		if (mode != null && !mode.equalsIgnoreCase("User"))
		{
			stmt.where(" t.userid= " + userid);
		}

		if (enhId != 0)
		{
			stmt.where(" p.enhid= " + enhId);
		}

		// 조직도 정렬 Level Sql
		SqlSelect kstmt = SqlChooser.getSqlSelect(_multiSql, "getDprtSort");

		SqlSelect ustmt = new SqlSelect();
		ustmt.select(
			"u.USERID, u.NAME, u.dprtid, u.STATUS, u.empno, u.GRADE_SORT, u.level1, u.level2, u.level3, u.level4 ,k.CSORT ");
		ustmt.from("hr_user u");
		ustmt.from(kstmt, "k");
		ustmt.where("u.dprtid=k.kmid");

		// 가동율 계산을 위해 percent 컬럼 추가
		SqlSelect hstmt = new SqlSelect();
		hstmt.select(
			"a.ENHID, a.ENH_NAME, a.STATUS, a.TASKID, a.TASK_SDATE, a.TASK_EDATE, a.PLAN_SDATE, a.PLAN_EDATE, a.PERCENT, a.TASK_CODE, h.USERID, h.NAME, h.dprtid, h.STATUS hStatus, h.CSORT, h.empno, h.GRADE_SORT, h.level1, h.level2, h.level3, h.level4 ");
		hstmt.from(ustmt, "h");
		hstmt.from(stmt, "a");
		hstmt.where("a.userid=h.userid ");
		hstmt.order("GRADE_SORT, CSORT, EMPNO, task_sdate");

		return hstmt;
	}

	/**
	 * 해당 연도에 사용자가 수행한 업무를 또는 전체 업무를 셀렉트한다. 외주개발자 그래프 전용
	 */
	public SqlSelect getTasksGlobal(Long enhId, String nYear, String mode, String isDel)
	{
		Long userid = UserService.getUserId();

		Calendar c = Calendar.getInstance();
		c.set(Integer.parseInt(nYear), 1, 1);
		java.util.Date d = c.getTime();

		SqlSelect taskStmt = new SqlSelect();

		taskStmt.select(
			"enhid, taskId, task_sdate, task_edate, plan_sdate, plan_edate, percent, task_code, userid, user_name, isvisb, reside ");
		taskStmt.from("enh_item_task");

		if (nYear != null)
		{
			Date firstOfYear = SqlDate.getFirstOfYear(d);
			Date lastOfYear = SqlDate.getLastOfYear(d);

			// 현재 년도보다 먼저 시작해서 현재년도 이후에 끝나는 고도화
			taskStmt.where("(task_sdate < ?", firstOfYear);
			taskStmt.where("task_edate > ?)", lastOfYear);

			taskStmt.andOff().where(" OR ");

			// 현재 년도에 끝나는 고도화
			taskStmt.where("(task_edate >= ?", firstOfYear).andOn();
			taskStmt.where("task_edate <= ?)", lastOfYear);

			taskStmt.andOff().where(" OR ");

			// 현재 년도부터 시작하는 고도화
			taskStmt.where("(task_sdate >= ?", firstOfYear).andOn();
			taskStmt.where("task_sdate <= ?)", lastOfYear);
		}

		SqlSelect stmt = new SqlSelect();
		stmt.select(
			"t.enhid, p.enh_name, p.status, t.taskId, t.task_sdate, t.task_edate, t.plan_sdate, t.plan_edate, t.percent, t.task_code, t.userid, t.user_name, t.reside ");
		stmt.from("enh_item p");
		stmt.from(taskStmt, "t");
		stmt.where("p.enhid=t.enhid");
		stmt.where("t.isVisb=1");
		if (isDel != null)
		{
			stmt.where("p.isVisb=0");
		}
		else
		{
			stmt.where("p.isVisb=1");
		}

		if (mode != null && !mode.equalsIgnoreCase("User"))
		{
			stmt.where(" t.userid= " + userid);
		}

		if (enhId != 0)
		{
			stmt.where(" p.enhid= " + enhId);
		}

		SqlSelect ustmt = new SqlSelect();
		ustmt.select("u.USERID, u.NAME");
		ustmt.from("gp_user u");

		SqlSelect hstmt = new SqlSelect();
		hstmt.select(
			"a.ENHID, a.ENH_NAME, a.STATUS, a.TASKID, a.TASK_SDATE, a.TASK_EDATE, a.PLAN_SDATE, a.PLAN_EDATE, a.PERCENT, a.TASK_CODE, h.USERID, h.NAME");
		hstmt.from(ustmt, "h");
		hstmt.from(stmt, "a");
		hstmt.where("a.userid=h.userid ");
		hstmt.order("h.userid asc");

		return hstmt;
	}

	/**
	 * 해당 연도에 부서에서 수행한 업무를 또는 전체 업무를 셀렉트한다.
	 */
	public SqlSelect getDprtTask(Long dprtId, String nYear, TreeState tr) throws Exception
	{
		Calendar c = Calendar.getInstance();
		c.set(Integer.parseInt(nYear), 1, 1);
		java.util.Date d = c.getTime();

		SqlSelect taskStmt = new SqlSelect();

		taskStmt.select(
			"enhid, taskId, task_sdate, task_edate, plan_sdate, plan_edate, percent, task_code, userid, user_name, isvisb ");
		taskStmt.from("enh_item_task");

		if (nYear != null)
		{
			Date firstOfYear = SqlDate.getFirstOfYear(d);
			Date lastOfYear = SqlDate.getLastOfYear(d);

			// 현재 년도보다 먼저 시작해서 현재년도 이후에 끝나는 고도화
			taskStmt.where("(task_sdate < ? ", firstOfYear);
			taskStmt.where("task_edate > ?)", lastOfYear);
			taskStmt.andOff().where(" OR ");

			// 현재 년도에 끝나는 고도화
			taskStmt.where("(task_edate >= ?", firstOfYear).andOn();
			taskStmt.where("task_edate <= ?)", lastOfYear);
			taskStmt.andOff().where(" OR ");

			// 현재 년도부터 시작하는 고도화
			taskStmt.where("(task_sdate >= ?", firstOfYear).andOn();
			taskStmt.where("task_sdate <= ?)", lastOfYear);
		}

		String level = "h.level" + tr.getLevel() + "=?";

		SqlSelect stmt = new SqlSelect();
		stmt.select(
			"t.enhid, p.enh_name, p.status, t.taskId, t.task_sdate, t.task_edate, t.plan_sdate, t.plan_edate, t.percent, t.task_code, t.userid, t.user_name ");
		stmt.from("enh_item p");
		stmt.from(taskStmt, "t");
		stmt.where("p.enhid=t.enhid");
		stmt.where("t.isVisb=1");
		stmt.where("p.isVisb=1");

		// 조직도 정렬 Level Sql
		SqlSelect kstmt = SqlChooser.getSqlSelect(_multiSql, "getDprtSort");

		SqlSelect ustmt = new SqlSelect();
		ustmt.select(
			"u.USERID, u.NAME, u.dprtid, u.STATUS, u.empno, u.GRADE_SORT, u.level1, u.level2, u.level3, u.level4 ,k.CSORT ");
		ustmt.from("hr_user u");
		ustmt.from(kstmt, "k");
		ustmt.where("u.dprtid=k.kmid");

		SqlSelect hstmt = new SqlSelect();
		hstmt.select(
			"a.ENHID, a.ENH_NAME, a.STATUS, a.TASKID, a.TASK_SDATE, a.TASK_EDATE, a.PLAN_SDATE, a.PLAN_EDATE, a.PERCENT, a.TASK_CODE, h.USERID, h.NAME, h.dprtid, h.STATUS hStatus, h.CSORT, h.empno, h.GRADE_SORT, h.level1, h.level2, h.level3, h.level4 ");
//		hstmt.from(ustmt, "h");
		hstmt.from(stmt, "a");
		hstmt.rightOuter(ustmt, "h", "a.userid = h.userid");
//		hstmt.where("a.userid(+) = h.userid ");
		hstmt.where(level, dprtId);
		hstmt.order("CSORT, GRADE_SORT, EMPNO, task_sdate");
		return hstmt;
	}

	/**
	 * 해당 연도에 부서에서 수행한 업무를 또는 전체 업무를 셀렉트한다.
	 * @throws Exception
	 */
	public String getProjectName(Long id) throws Exception
	{
		SqlSelect stmt = new SqlSelect();
		stmt.select("enh_name");
		stmt.from("enh_item");
		stmt.where("enhid = ? ", id);

		ResultSet rs = stmt.query();
		rs.next();
		return rs.getString(1);
	}

	/**
	 * Basename에 해당하는 메뉴 쿼리를 돌려준다.
	 */
	static SqlSelect getMenuListByBaseName(String baseName) throws Exception
	{
		SqlSelect sub = new SqlSelect();
		sub.select("moduleid");
		sub.from("wb_module wm, wb_class wc");
		sub.where("wm.classid = wc.classid");
		sub.where("wm.tenantid = ?", UserService.getTenantId());
		sub.where("wc.isvisb = 1");
		sub.where("wc.base_name = ?", baseName);

		SqlSelect stmt = new SqlSelect();
		stmt.select("m.appid, m.title as name");
		stmt.from("wb_app m, sp sp");
		stmt.where("m.spid = sp.spid");
		stmt.where("m.status = ?", SpaceMenu.REGISTERED_STATUS);
		stmt.where("sp.tenantid = ?", UserService.getTenantId());
		stmt.where("sp.sp_code = ?", Space.TYPE_LIBRARYSPACE);
		stmt.where("moduleid IN", sub);
		return stmt;
	}

	/**
	 * 등록 상태의 MOD 목록(usr.list.jsp?status=2) 리스트 SqlStatement를 돌려준다.
	 */
	public SqlSelect getModSelect(boolean isAdmin) throws Exception
	{
		SqlSelect stmt = new SqlSelect();
		stmt.select(ENHITEMMOD, "list");
		stmt.where("m.isvisb = 1");
		return stmt;
	}

	/**
	 * 등록 상태의 MOD 목록(usr.list.jsp?status=2) 카운트 SqlStatement를 돌려준다.
	 */
	public SqlSelect getModCount(boolean isAdmin) throws Exception
	{
		SqlSelect stmt = new SqlSelect();
		stmt.from(ENHITEMMOD);
		stmt.where("m.isvisb = 1");
		setCountCondition(stmt);
		return stmt;
	}

	/**
	 * 삭제 상태(isvisb=0)인 리스트 SqlStatement를 돌려준다.
	 */
	public SqlSelect getModInvisibleSelect() throws Exception
	{
		SqlSelect stmt = new SqlSelect();
		stmt.select(ENHITEMMOD, "list");
		stmt.from(ENHITEM);
		stmt.where("m.enhid = i.enhid");
		stmt.where("m.status = 9500");
		stmt.where("i.isvisb = 1");
		stmt.order("m.modid desc");
		return stmt;
	}

	/**
	 * 삭제 상태(isvisb=0)인 카운트 SqlStatement를 돌려준다.
	 */
	public SqlSelect getModInvisibleCount() throws Exception
	{
		SqlSelect stmt = new SqlSelect();
		stmt.from(ENHITEMMOD);
		stmt.from(ENHITEM);
		stmt.where("m.enhid = i.enhid");
		stmt.where("m.status = 9500");
		stmt.where("i.isvisb = 1");
		setCountCondition(stmt);
		return stmt;
	}

	/**
	 * MOD에대한 SELECT문을 실행한 결과와 총 건수를 JSON으로 출력한다.
	 */
	public void writeModJson(PrintWriter writer, SqlSelect select, SqlSelect count) throws Exception
	{
		_modwriter.setOrder("m.modid desc");
		_modwriter.setTable("enh_item_mod");
		_modwriter.page(writer, select, count, _ts);
	}

	/**
	 * 관련기술목록(usr.main.jsp) 통계 결과를 돌려준다.
	 */
	public static SqlSelect getModList(int cnt, String title, int order) throws Exception
	{
		SqlSelect stmt = new SqlSelect();
		stmt.select(getRankGrade(cnt));
		stmt.select(ENHITEMMODLIST, "list");
		stmt.order((getOrder(order)));
		return stmt;
	}

	/**
	 * cnt값(표시할 count갯수): 60 MOD_COUNT 갯수가 1개 - rank-3, 2개~3개 - rank-2, 4개이상 - rank-1로 출력
	 */
	public static String getRankGrade(int cnt) throws Exception
	{
		int level1 = cnt / 30;
		int level2 = level1 + 2;
		int level3 = level2 + 5;

		StringBuffer str = new StringBuffer();
		str.append(SqlDialect.decode("sign(l.mod_count - " + level1 + ")", "-1", "3", 
			SqlDialect.decode("sign(l.mod_count - " + level2 + ")", "-1", "2", 
				SqlDialect.decode("sign(l.mod_count - " + level3 + ")", "-1", "1"))) + " rk");
		
		return str.toString();
	}

	/**
	 * 정렬 return 값을 정한다. 현재 order값은 1로 보내서 tab_count로 정렬한다.
	 */
	private static String getOrder(int order)
	{
		switch (order)
		{
			case 1 :
				return "l.mod_count desc";
			case 2 :
				return "l.rgst_date";
			case 3 :
				return "l.last_updt desc";
			default:
				return "dbms_random.value";
		}
	}

	/**
	 * <usr.main.jsp> 등록 목록표시상태(isvisb=1)인 리스트 SqlStatement를 돌려준다.
	 */
	public SqlSelect getMainVisibleSelect(boolean isAdmin) throws Exception
	{
		SqlSelect stmt = new SqlSelect();
		stmt.select(ENHITEM, "list");
		appendWebzine(stmt);
		stmt.where("i.isvisb = 1");
		return stmt;
	}

	/**
	 * Sub쿼리로서, 해당 item의 속하는 mod들의 제목을 합쳐 ,로 나눈 뒤 title_t라는 필드의 데이터로 만든다. title_t라는 필드로 생성
	 * 후 sql.xml에서 alias로 활용할 수 있게 되어 model값에 출력된다. 2015.12.14 ISVISB값이 1인 mod들만 xmlagg구문
	 * 적용하여 메인화면에 나타나게 수정함. 2016.01.14 정렬값(seq_order)값이 변경됐는데 웹진 리스트에는 변경이 되지 않아서 order by
	 * t.seq_order 구문 추가
	 */
	public void appendWebzine(SqlSelect stmt) throws Exception
	{
		StringBuffer query = new StringBuffer();
		if (DbConfiguration.isMySql())
		{
			query.append("(SELECT group_concat(title order by t.seq_order) title ");
			query.append("FROM enh_item_mod t ");
			query.append("WHERE t.isvisb = 1 ");
			query.append("AND n.enhid = t.enhid) title_t ");
		}
		else
		{
			query.append(
				"(SELECT substr(xmlagg(xmlelement(a,', ' || title) order by t.seq_order).extract('//text()'), 3) title ");
			query.append("FROM enh_item_mod t ");
			query.append("WHERE t.isvisb = 1 ");
			query.append("AND n.enhid = t.enhid) title_t ");
		}

		stmt.selectPaging(query.toString());
	}

	/**
	 * 등록 기술목록(usr.main.jsp) 표시상태(isvisb=1)의 카운트 SqlStatement를 돌려준다.
	 */
	public SqlSelect getVisibleCount(boolean isAdmin) throws Exception
	{
		SqlSelect stmt = new SqlSelect();
		stmt.from(ENHITEM);
		stmt.where("i.isvisb = 1");
		setCountCondition(stmt);
		return stmt;
	}

	/**
	 * 메인(usr.main.jsp) 페이지 목록을 페이징하여 출력한다.
	 */
	public void writeWebzine(PrintWriter writer, SqlSelect select, SqlSelect count) throws Exception
	{
		SqlWriter _webwriter = new EnhSqlWriter().putAll(ENHITEM);
		_webwriter.setOrder("i.rgst_date desc");
		_webwriter.setTable("enh_item");
		_webwriter.webzinePage(writer, select, count, _ts);
	}

	/**
	 * Mod 검색 query와 binding에 사용할 SqlFragment를 돌려준다.
	 * <p>
	 * 대소문자를 구분하지 않는다. 탭 테이블명은 xx_xxxx_tag(=enh_item_mod) 와 같은 구조이어야 한다. alias 제거, upper
	 * 기준을 enh_item_mod의 title로 변경
	 */
	public static SqlFragment searchMod(final String table, final String column, final String value)
	{
		return new SqlFragment()
		{
			private String _table = table;
			private String _column = column;
			private String _value = value.toUpperCase();

			public boolean isValid()
			{
				return (_value != null);
			}

			public void make(StringBuffer query)
			{
				query.append(_column);
				query.append(
					" IN ( SELECT "
						+ _column
						+ " FROM "
						+ _table
						+ "_mod " // 테이블명의
									// 끝
									// 명칭(enh_item_mod에서
									// _mod
									// 부분)
						+ " WHERE "
						+ SqlDialect.upper("title") // enh_item_mod에 있는 탭의 제목으로 검색한다.
						+ " like ? "
						+ " AND STATUS = 3000 ) "); // 등록 상태인 관련기술(탭)을 조건으로 걸어놓는다.
			}

			public int bind(PreparedStatement pstmt, int index, int loop) throws Exception
			{
				pstmt.setString(index, '%' + _value + '%');
				return index + 1;
			}
		};
	}

	/**
	 * 본 글 삭제 시 status=3000(등록상태)인 관련기술(탭)들을 돌려준다.
	 * @param enhId
	 * @return
	 */
	public static SqlSelect getMod(Enh server)
	{
		SqlSelect stmt = new SqlSelect();
		stmt.select("modid");
		stmt.from("enh_item_mod");
		stmt.where("status = 3000");
		stmt.where("enhid = ?", server.getId());
		return stmt;
	}

	/**
	 * 본 글 삭제 시 삭제되었던 status=9600인 관련기술(탭)들을 돌려준다.
	 * @param enhId
	 * @return
	 */
	public static SqlSelect getAllDeleteMod(Enh server)
	{
		SqlSelect stmt = new SqlSelect();
		stmt.select("modid");
		stmt.from("enh_item_mod");
		stmt.where("status = 9600");
		stmt.where("enhid = ?", server.getId());
		return stmt;
	}

	/*
	 * 앱 관리 APP 연동 관련 추가 <p> 해당 앱에 등록된 고도화를 버전별로 나타낸 목록의 갯수를 돌려준다
	 * @param itemId
	 * @param status
	 * @param nYear
	 * @param ts
	 * @return
	 * @throws Exception
	 */
	static int getEnhCount(Long itemId, int status, String nYear, TableState ts) throws Exception
	{
		StringBuffer query = new StringBuffer();
		query.append(getEnhListSql(itemId, status, nYear, true));
		ts.appendAnd(query);
		ts.appendOrderBy(
			query.append(" "),
			"a.vrsn_name_first desc, a.vrsn_name_middle desc, a.vrsn_name_last desc, enhid desc ");
		PreparedStatement pstmt = DbService.prepareStatement(query.toString());

		int i = 1;
		if (nYear != null)
		{
			Calendar c = Calendar.getInstance();
			c.set(Integer.parseInt(nYear), 1, 1);
			java.util.Date d = c.getTime();
			java.sql.Date firstDate = SqlDate.getFirstOfYear(d);
			java.sql.Date lastDate = SqlDate.getLastOfYear(d);

			for (int j = 0; j < 3; j++)
			{
				pstmt.setLong(i++, itemId);
				if (status != -1)
				{
					pstmt.setInt(i++, status);
				}
				pstmt.setDate(i++, firstDate);
				pstmt.setDate(i++, lastDate);
			}
		}
		else
		{
			pstmt.setLong(i++, itemId);
			if (status != -1)
			{
				pstmt.setInt(i++, status);
			}
		}
		if (ts.isSearch())
		{
			ts.bindSearch(pstmt, i++);
		}

		ResultSet rs = pstmt.executeQuery();
		rs.next();
		return rs.getInt(1);
	}

	/**
	 * 앱 관리 APP 연동 관련 추가
	 * <p>
	 * 해당 앱에 등록된 고도화를 버전별로 구분하여 목록으로 돌려준다
	 * @param itemId
	 * @param status
	 * @param nYear
	 * @param ts
	 * @return
	 * @throws Exception
	 */
	static ResultSet getEnhList(Long itemId, int status, String nYear, TableState ts) throws Exception
	{
		StringBuffer query = new StringBuffer();
		query.append(getEnhListSql(itemId, status, nYear, false));
		ts.appendAnd(query);
		ts.appendOrderBy(
			query.append(""),
			"a.vrsn_name_first desc, a.vrsn_name_middle desc, a.vrsn_name_last desc, a.enhid desc ");
		ts.appendRownum(query);
		PreparedStatement pstmt = DbService.prepareStatement(query.toString());

		int i = 1;
		if (nYear != null)
		{
			Calendar c = Calendar.getInstance();
			c.set(Integer.parseInt(nYear), 1, 1);
			java.util.Date d = c.getTime();
			Date firstDate = SqlDate.getFirstOfYear(d);
			Date lastDate = SqlDate.getLastOfYear(d);

			for (int j = 0; j < 3; j++)
			{
				pstmt.setLong(i++, itemId);
				if (status != -1)
				{
					pstmt.setInt(i++, status);
				}
				pstmt.setDate(i++, firstDate);
				pstmt.setDate(i++, lastDate);
			}
		}
		else
		{
			pstmt.setLong(i++, itemId);
			if (status != -1)
			{
				pstmt.setInt(i++, status);
			}
		}
		if (ts.isSearch())
		{
			ts.bindSearch(pstmt, i++);
		}
		ts.bindRownum(pstmt, i);
		return pstmt.executeQuery();
	}

	/**
	 * 앱 관리 APP 연동 관련 추가
	 * <p>
	 * 연동 관련 추가 버전과 연동된 고도화 목록을 가져와 연도별 목록을 추출한다.
	 * @param itemid
	 * @param status
	 * @param nYear
	 * @param isCount
	 * @return
	 * @throws Exception
	 */
	static SqlSelect getEnhListSql(Long itemid, int status, String nYear, boolean isCount) throws Exception
	{
		SqlSelect stmt1 = new SqlSelect();
		SqlSelect stmt2 = new SqlSelect();

		if (nYear != null)
		{
			for (int i = 0; i < 3; i++)
			{
				SqlSelect stmt3 = getEnhList(status);
				switch (i)
				{
					case 0 :
						stmt3.where("enh_sdate < ? ");
						stmt3.where("enh_edate > ? ");
						break;
					case 1 :
						stmt3.where("enh_edate >= ? ");
						stmt3.where("enh_edate <= ? ");
						break;
					case 2 :
						stmt3.where("enh_sdate >= ? ");
						stmt3.where("enh_sdate <= ? ");
						break;
				}
				if (i == 0)
					stmt2 = stmt3;
				else
					stmt2.union(stmt3);
			}
		}
		else
		{
			stmt2 = getEnhList(status);
		}
		if (isCount)
		{
			stmt1.select("count(a.enhid)");
		}
		else
		{
			stmt1.select(enhSelect);
		}
		stmt1.from("enh_item i");
		stmt1.from(stmt2, "a");
		stmt1.where("i.enhid = a.enhid ");

		return stmt1;
	}

	/**
	 * 앱 관리 APP 연동 관련 추가
	 * <p>
	 * 버전과 연동된 고도화 목록을 1차적으로 가져온다.
	 * @param status
	 * @return
	 * @throws Exception
	 */
	static SqlSelect getEnhList(int status) throws Exception
	{

		SqlSelect stmt1 = new SqlSelect();
		SqlSelect stmt2 = new SqlSelect();

		stmt2.select("p.* , vrsn_name_first, vrsn_name_middle, vrsn_name_last ");
		stmt2.from("app_item_vrsn_enh p");
		stmt2.from("app_item_vrsn v");
		stmt2.where("v.isvisb = 1");
		stmt2.where("p.isvisb = 1");
		stmt2.where("p.vrsnid = v.vrsnid ");
		stmt2.where("v.itemid= ? ");

		stmt1.select("i.enhid,a.vrsnid,a.vrsn_name,a.enhid , vrsn_name_first, vrsn_name_middle, vrsn_name_last ");
		stmt1.from("enh_item i");
		stmt1.from(stmt2, "a");
		stmt1.where("i.enhid = a.itemid ");
		stmt1.where("i.isvisb = 1");
		if (-1 != status)
		{
			stmt1.where("i.status = ? ");
		}

		return stmt1;
	}

}