package com.kcube.enh;

import java.io.PrintWriter;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

import com.kcube.lib.sql.SqlSelect;
import com.kcube.lib.sql.SqlTable;
import com.kcube.lib.sql.SqlWriter;

public class EnhSqlWriter extends SqlWriter
{

	private Map<String, String> _modAliasToColumn = new HashMap<String, String>();
	private Map<String, String> _modColumnToAlias = new HashMap<String, String>();

	private String _modTable;
	private String _modalias;
	private String _modcolumn;
	private String _modOrder;

	/**
	 * Sql.java에서 _writer.setTable를 했던 테이블 정보를 변수에 Set한다. Table정보를 Set해줘야 alias와 column값을
	 * 넣지 않아도 putAll를 통해 alias와 column값을 뽑아낼 수 있다.
	 */
	@Override
	public SqlWriter setTable(String table)
	{
		_modTable = table;
		return super.setTable(table);
	}

	/**
	 * Sql.java에서 페이징처리 시(_writer.setTagInfo("table", "alias", "column"))형식으로 쓸 경우
	 * SqlWriter에서 사용된다. Sql.java에서 _writer.setTable을 쓸 경우 SqlPage에있는 setTagInfo를 쓴다.
	 */
	@Override
	public SqlWriter setTagInfo(String table, String alias, String column)
	{
		_modTable = table;
		_modalias = alias;
		_modcolumn = column;
		return super.setTagInfo(table, alias, column);
	}

	/**
	 * 상속한 table의 Alias와 Column을 넣는다. SqlPage의 putAll에 table 정보를 리턴하여 변수에 담는다.
	 * _modAliasToColumn -> mod=title_t _modColumnToAlias -> title_t=mod
	 */
	@Override
	public SqlWriter putAll(SqlTable table)
	{
		_modAliasToColumn.putAll(table.aliasToColumn());
		_modColumnToAlias.putAll(table.columnToAlias());
		return super.putAll(table);
	}

	/**
	 * 새로운 modOrder변수에 order값을 넣는다.
	 */
	@Override
	public SqlWriter setOrder(String order)
	{
		_modOrder = order;
		return super.setOrder(order);
	}

	@Override
	public void webzinePage(PrintWriter writer, SqlSelect select, SqlSelect count, String page) throws Exception
	{
		webzinePage(writer, select, count, page, false);
	}

	/**
	 * 웹진형식의 페이징 처리를 한다. usr.main.jsp 리스트
	 */
	@Override
	public void webzinePage(PrintWriter writer, SqlSelect select, SqlSelect count, String page, boolean useTimeZone)
		throws Exception
	{
		EnhSqlPage p = new EnhSqlPage(_modAliasToColumn, page, true);
		p.setTagInfo(_modTable, _modalias, _modcolumn); // 태그검색변수 Set
		select.where(p.search()); // 검색조건
		select.order(p.order(_modOrder));

		SqlWriter sqlWriter = new SqlWriter();
		count.where(p.search());
		sqlWriter.countHeader(writer, count);
		ResultSet rs = select.query(p.skip(), p.max());
		while (rs.next())
		{
			sqlWriter.startList(writer, rs.isFirst());
			super.webzineWriteRow(writer, rs, useTimeZone); // 웹진형식 json 그리기
			sqlWriter.endList(writer);
		}
		sqlWriter.footer(writer);
	}
}