package com.kcube.enh;

import java.io.PrintWriter;

import com.kcube.lib.sql.SqlSelect;
import com.kcube.lib.sql.SqlTable;
import com.kcube.lib.sql.SqlWriter;
import com.kcube.map.FolderSql;
import com.kcube.sys.module.ModuleParam;

public class EnhOrgSql
{
	private static final SqlTable HN_ORG = new SqlTable("hn_org", "h");
	private static SqlWriter _writer = new SqlWriter(true).putAll(HN_ORG);

	private Long _folderId;
	private String _ts;
	private int _srch;
	private int _type;
	private String _s1;
	private String _s2;
	private Long _moduleId;
	private Long _appId;

	public EnhOrgSql(ModuleParam mp, Long folderId, String ts, int srch, int type, String s1, String s2)
	{
		this._folderId = folderId;
		this._ts = ts;
		this._srch = srch;
		this._type = type;
		this._s1 = s1;
		this._s2 = s2;
		_moduleId = mp.getModuleId();
		_appId = mp.getAppId();
	}

	public SqlSelect getVisibleSelect() throws Exception
	{
		SqlSelect stmt = new SqlSelect();
		stmt.select(HN_ORG, "l");
		stmt.where("h.moduleid = ?", _moduleId);
		stmt.where("h.appid = ?", _appId);
		if (this._type >= 0)
			stmt.where("h.type_code = ?", this._type);
		if (this._srch == 2)
		{
			stmt.where("upper(h.org_name) >= ?", this._s1);

			if ((this._s2 != null) && (!"".equals(this._s2)))
				stmt.where("upper(h.org_name) < ?", this._s2);
		}
		stmt.where(FolderSql.level("h.kmid", "h.level", this._folderId, true));
		return stmt;
	}

	public void writeJson(PrintWriter writer, SqlSelect select, SqlSelect count) throws Exception
	{
		if (this._srch == 1)
		{
			_writer.setOrder("h.rgst_date desc");
		}
		else
		{
			_writer.setOrder("h.org_name");
		}
		_writer.page(writer, select, count, this._ts);
	}
}
