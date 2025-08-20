package com.kcube.enh.mod;

import java.util.Date;
import java.util.List;

/**
 * 탭 리스트를 돌려준다.
 */
public class EnhModList
{
	List<EnhMod> _modList;

	/**
	 * 4개 bean은 <usr.main.jsp>에서 탭목록을 동적으로 Update 하기위한 bean이다.
	 */
	private String _title;
	private Date _rgstDate;
	private Date _lastUpdt;
	private int _modCount;

	/**
	 * 탭 리스트를 돌려준다.
	 */
	public List<EnhMod> getModList()
	{
		return _modList;
	}

	public void setModList(List<EnhMod> modList)
	{
		_modList = modList;
	}

	public String getTitle()
	{
		return _title;
	}

	public void setTitle(String title)
	{
		_title = title;
	}

	public Date getRgstDate()
	{
		return _rgstDate;
	}

	public void setRgstDate(Date rgstDate)
	{
		_rgstDate = rgstDate;
	}

	public Date getLastUpdt()
	{
		return _lastUpdt;
	}

	public void setLastUpdt(Date lastUpdt)
	{
		_lastUpdt = lastUpdt;
	}

	public int getModCount()
	{
		return _modCount;
	}

	public void setModCount(int modCount)
	{
		_modCount = modCount;
	}

}