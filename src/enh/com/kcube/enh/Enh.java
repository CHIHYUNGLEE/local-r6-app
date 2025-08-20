package com.kcube.enh;

import java.util.Date;
import java.util.List;
import java.util.Set;

import com.kcube.doc.Item;
import com.kcube.enh.mod.EnhMod;
import com.kcube.lib.sql.SqlSelect;
import com.kcube.sys.usr.User;
import com.kcube.sys.usr.UserService;

/**
 * 고도화관리
 */
public class Enh extends Item
{
	/**
	 * 고도화
	 */
	private static final long serialVersionUID = 6597743182626261483L;
	/**
	 * 고도화 상태 - 삭제
	 */
	public static final int ENHDEL_STATUS = 0;

	/**
	 * 고도화 상태 - 계획
	 */
	public static final int ENHPLAN_STATUS = 3400;

	/**
	 * 고도화 상태 - 진행
	 */
	public static final int ENHING_STATUS = 3600;

	/**
	 * 고도화 상태 - 완료
	 */
	public static final int ENHCOM_STATUS = 3900;

	private User _pmUser;
	private String _enhName;
	private Date _enhSdate;
	private Date _enhEdate;
	private List<Mbr> _mbrs;
	private String _pmName;
	private Long _pmId;
	private String _pmDisp;
	private OrgInfo _officeInfo;
	private Date _completeDate;

	// cst
	private Set<EnhMod> mods;
	private int _enhIdSum;

	/**
	 * ENH_ITEM에 대한 모듈들을 돌려준다.
	 * <p>
	 * Hibernate에 MOD 테이블을 매핑하기위한 bean이다.
	 * <p>
	 * enh_item 매핑안에 mods로 set매핑 되어있다.
	 */
	public Set<EnhMod> getMods()
	{
		return mods;
	}

	public void setMods(Set<EnhMod> mods)
	{
		this.mods = mods;
	}

	public Date getCompleteDate()
	{
		return _completeDate;
	}

	public void setCompleteDate(Date completeDate)
	{
		_completeDate = completeDate;
	}

	public User getPmUser()
	{
		return _pmUser;
	}

	public void setPmUser(User pmUser)
	{
		_pmUser = pmUser;
	}

	public String getEnhName()
	{
		return _enhName;
	}

	public void setEnhName(String enhName)
	{
		_enhName = enhName;
	}

	public Date getEnhSdate()
	{
		return _enhSdate;
	}

	public void setEnhSdate(Date enhSdate)
	{
		_enhSdate = enhSdate;
	}

	public Date getEnhEdate()
	{
		return _enhEdate;
	}

	public void setEnhEdate(Date enhEdate)
	{
		_enhEdate = enhEdate;
	}

	public List<Mbr> getMbrs()
	{
		return _mbrs;
	}

	public void setMbrs(List<Mbr> mbrs)
	{
		_mbrs = mbrs;
	}

	public String getPmDisp()
	{
		return _pmDisp;
	}

	public String getPmName()
	{
		return _pmName;
	}

	public void setPmName(String pmName)
	{
		_pmName = pmName;
	}

	public void setPmDisp(String pmDisp)
	{
		_pmDisp = pmDisp;
	}

	public Long getPmId()
	{
		return _pmId;
	}

	public void setPmId(Long pmId)
	{
		_pmId = pmId;
	}

	public OrgInfo getOfficeInfo()
	{
		return _officeInfo;
	}

	public void setOfficeInfo(OrgInfo officeInfo)
	{
		_officeInfo = officeInfo;
	}

	/**
	 * 첨부파일을 나타내는 클래스이다.
	 */
	public static class Attachment extends com.kcube.doc.file.Attachment
	{
		private static final long serialVersionUID = 2562625263104193942L;
	}

	/**
	 * 고도화의 의견을 나타내는 클래스이다.
	 */
	public static class Opinion extends com.kcube.doc.opn.Opinion
	{
		private static final long serialVersionUID = 3214939120288284277L;
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

	/**
	 * 고도화의 팀원을 나타내는 클래스이다.
	 */
	public static class Mbr extends com.kcube.sys.usr.User
	{
		private static final long serialVersionUID = -4476826589350876869L;
		private int _status;
		private boolean _visible;

		public int getStatus()
		{
			return _status;
		}

		public void setStatus(int status)
		{
			_status = status;
		}

		public boolean isVisible()
		{
			return _visible;
		}

		public void setVisible(boolean visible)
		{
			_visible = visible;
		}
	}

	public static class OrgInfo
	{
		private Long _orgId;
		private String _orgName;

		/**
		 * 기관 일련번호를 돌려준다.
		 */
		public Long getOrgId()
		{
			return _orgId;
		}

		public void setOrgId(Long orgId)
		{
			_orgId = orgId;
		}

		/**
		 * 기관 이름을 돌려준다.
		 */
		public String getOrgName()
		{
			return _orgName;
		}

		public void setOrgName(String orgName)
		{
			_orgName = orgName;
		}
	}

	/**
	 * 팀원(Member) 인지 여부를 돌려준다.
	 */
	public boolean isMbr() throws Exception
	{
		return (null == getMbrs()) ? false : getMbrs().contains(UserService.getUser());
	}

	/**
	 * 고도화의 PM인지를 확인한다.
	 */
	public boolean isCurrentPm()
	{
		Long userId = UserService.getUserId();
		if (userId == null)
		{
			return false;
		}
		User pm = getPmUser();
		if (pm == null)
		{
			return false;
		}
		return (userId.equals(pm.getUserId()));
	}

	/**
	 * 해당 등록 상태인 enhId글의 관련기술(탭) 갯수의 카운트 갯수를 리턴한다.
	 */
	public int getEnhIdSum() throws Exception
	{
		SqlSelect sel = new SqlSelect();
		sel.select("modid");
		sel.from("enh_item_mod");
		sel.where("enhid = ? ", getId());
		sel.where("status = 3000");
		_enhIdSum = sel.count();
		return _enhIdSum;
	}

	public void setEnhIdSum(int enhIdSum) throws Exception
	{
		_enhIdSum = enhIdSum;
	}
}
