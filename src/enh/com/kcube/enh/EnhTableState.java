package com.kcube.enh;

import java.util.Map;
import java.util.StringTokenizer;

import com.kcube.lib.jdbc.TableState;
import com.kcube.lib.sql.SqlPage;

public class EnhTableState extends TableState
{
	public EnhTableState(String state, Map<String, String> columns)
	{
		super(state, columns);
	}

	private String _keyColumn;

	public void appendSort(StringBuffer query)
	{
		StringTokenizer st = new StringTokenizer(this._sort, "_");
		int orderCnt = 0;

		String orderColumn;
		String idColumn;
		for (orderColumn = null; st.hasMoreTokens(); ++orderCnt)
		{
			idColumn = st.nextToken();
			orderColumn = (String) this._columns.get(idColumn.substring(1));
			if (orderColumn == null)
			{
				throw new IllegalArgumentException("Unknown sort column " + idColumn.substring(1));
			}

			if ("vrsn_name".equals(orderColumn))
			{
				query.append(
					(idColumn.charAt(0) == 'd')
						? "vrsn_name_first DESC, vrsn_name_middle DESC, vrsn_name_last DESC, i.enhid DESC"
						: "vrsn_name_first ASC, vrsn_name_middle ASC, vrsn_name_last ASC, i.enhid DESC");
			}
			else
			{
				query.append(SqlPage.getRegOrder(orderColumn));
				query.append(idColumn.charAt(0) == 'd' ? " DESC" : " ASC");
			}
			query.append(st.hasMoreTokens() ? ", " : " ");
		}

		idColumn = (String) this._columns.get("id");
		if (idColumn == null && !"itemid".equals(this._keyColumn))
		{
			idColumn = this._keyColumn;
		}

		if (orderCnt == 1 && idColumn != null && !idColumn.equals(orderColumn))
		{
			query.append(", ");
			query.append(idColumn);
			query.append(" ASC");
		}

	}
}