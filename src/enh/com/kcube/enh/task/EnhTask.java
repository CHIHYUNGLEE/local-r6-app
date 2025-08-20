package com.kcube.enh.task;

import java.util.Date;

import com.kcube.doc.Item;
import com.kcube.enh.EnhManager;
import com.kcube.sys.usr.UserService;

/**
 * 고도화관리 역할
 */
public class EnhTask extends Item
{
	private static final long serialVersionUID = -889173561845721411L;
	private long _enhId;
	private String _enhName;
	private Date _taskSdate;
	private Date _taskEdate;
	private Date _planSdate;
	private Date _planEdate;
	private int _taskCode;
	private int _reside;
	private String _task;
	private int _isVisb;
	private int _percent;

	public int getIsVisb()
	{
		return _isVisb;
	}

	public void setIsVisb(int isVisb)
	{
		_isVisb = isVisb;
	}

	public void setEnhId(long enhId)
	{
		_enhId = enhId;
	}

	public long getEnhId()
	{
		return _enhId;
	}

	public String getEnhName() throws Exception
	{
		_enhName = EnhManager.selectName(_enhId);
		return _enhName;
	}

	public void setEnhName(String enhName)
	{
		_enhName = enhName;
	}

	public Date getTaskSdate()
	{
		return _taskSdate;
	}

	public void setTaskSdate(Date taskSdate)
	{
		_taskSdate = taskSdate;
	}

	public Date getTaskEdate()
	{
		return _taskEdate;
	}

	public void setTaskEdate(Date taskEdate)
	{
		_taskEdate = taskEdate;
	}

	public Date getPlanSdate()
	{
		return _planSdate;
	}

	public void setPlanSdate(Date planSdate)
	{
		_planSdate = planSdate;
	}

	public Date getPlanEdate()
	{
		return _planEdate;
	}

	public void setPlanEdate(Date planEdate)
	{
		_planEdate = planEdate;
	}

	public int getTaskCode()
	{
		return _taskCode;
	}

	public void setTaskCode(int taskCode)
	{
		_taskCode = taskCode;
	}

	public int getReside()
	{
		return _reside;
	}

	public void setReside(int reside)
	{
		_reside = reside;
	}

	public String getTask()
	{
		return _task;
	}

	public void setTask(String task)
	{
		_task = task;
	}

	public void setPercent(int percent)
	{
		_percent = percent;
	}

	public int getPercent()
	{
		return _percent;
	}

	/**
	 * 첨부파일을 나타내는 클래스이다.
	 */
	public static class Attachment extends com.kcube.doc.file.Attachment
	{
		private static final long serialVersionUID = -2299899158750267682L;

	}

	/**
	 * 고도화 업무의 의견을 나타내는 클래스이다.
	 */
	public static class Opinion extends com.kcube.doc.opn.Opinion
	{
		private static final long serialVersionUID = -8183581351672502275L;
		/**
		 * 등록자의 UserId
		 */
		private Long _rgstUserId;

		public Long getRgstUserId()
		{
			return _rgstUserId;
		}

		public void setRgstUserId(Long rgstUserId)
		{
			_rgstUserId = rgstUserId;
		}

		/**
		 * 현재 사용자가 의견의 작성자 인지의 여부를 돌려준다.
		 */
		public boolean isCurrentOwner()
		{
			Long userId = UserService.getUserId();
			if (userId == null)
			{
				return false;
			}
			return (userId.equals(getRgstUserId()));
		}
	}
}
