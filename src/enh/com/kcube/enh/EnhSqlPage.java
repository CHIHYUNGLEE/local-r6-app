package com.kcube.enh;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.kcube.lib.sql.SqlFragment;
import com.kcube.lib.sql.SqlPage;

/**
 * 목록 조회에 필요한 조건을 해석한다.
 * <p>
 * constructor에 넘어가는 목록조회 조건의 형태는 다음과 같다.
 * <p>
 * 
 * <pre>
 * 1.10.. : 1페이지, 페이지당 목록 갯수 10
 * 3.20.. : 3페이지, 페이지당 목록 갯수 20
 * 1.10.atitle. : 제목순으로 ascending 정렬
 * 1.10.did. : id 순으로 descending 정렬
 * 1.10.did_atitle. : id 순으로 descending 정렬 후 제목 순으로 ascending 정렬
 * 1.10..kwrd_자바 : keyword 컬럼에 &quot;%자바%&quot;로 like 검색
 * 1.10.did.kwrd_자바 : id 순으로 descending 정렬, keyword 컬럼 검색
 * </pre>
 * <p>
 * title, id, kwrd등을 실제 query에 사용할 컬럼명과 맵핑시켜주는
 * <p>
 * Map 정보를 함께 넘겨주어야 한다.
 */
public class EnhSqlPage extends SqlPage
{
	private String _modSearchColumn;
	private String _modSearchValue;
	private String _modTable;

	public EnhSqlPage(Map<String, String> aliasToColumn, String state)
	{
		this(aliasToColumn, state, true);
	}

	public EnhSqlPage(Map<String, String> aliasToColumn, String state, boolean isBoth)
	{
		super(aliasToColumn, state, isBoth);
		if (state != null)
		{
			int i = state.indexOf('.');
			int j = state.indexOf('.', i + 1);
			int k = state.indexOf('.', j + 1);
			if (i >= 0 && j >= 0 && k >= 0)
			{
				Integer.parseInt(state.substring(0, i));
				Integer.parseInt(state.substring(i + 1, j));
				setModSearch(state.substring(k + 1));
			}
		}
	}

	/**
	 * 테이블명을 지정한다.
	 */
	public void setTable(String table)
	{
		super.setTable(table);
		_modTable = table;
	}

	/**
	 * EnhSqlWriter로부터 _modAliasToColumn에 담겼던 mod=title_t 형식의 변수들로부터 table, alias, column을
	 * Set한다. 태그 검색을 위한 테이블명, 별칭, 컬럼명을 지정한다.
	 */
	public void setTagInfo(String table, String alias, String column)
	{
		super.setTagInfo(table, alias, column);
		setTable(table);
	}

	/**
	 * 1.5..mod_value 형식의 srch값을 substring으로 가공하여 column = mod value = value형식으로 만들어준다.
	 */
	public void setModSearch(String srch)
	{
		int m = srch.indexOf('_');
		if (m > 0)
		{
			String column = srch.substring(0, m);
			String value = srch.substring(m + 1).trim();
			if (value.length() > 0)
			{
				_modSearchColumn = column;
				_modSearchValue = value;
			}
		}
	}

	/**
	 * 검색조건을 돌려준다.
	 * @see SqlPage 변경에 따른 conditions 기존 커스터마이징된 검색에 대한 SqlFragment 처리 추가 - 김경수 (17.05.12)
	 */
	public List<SqlFragment> search()
	{
		List<SqlFragment> conditions = new ArrayList<SqlFragment>();

		if (_modSearchColumn != null && _modSearchValue != null)
		{
			if ("mod".equals(_modSearchColumn))
			{
				// mod 검색 시 테이블과 value값으로 enhid를 뽑아낸다.
				conditions.add(EnhSql.searchMod(_modTable, "enhid", _modSearchValue));
			}
			else
			{
				conditions.addAll(super.search());
			}
		}

		return conditions;
	}
}