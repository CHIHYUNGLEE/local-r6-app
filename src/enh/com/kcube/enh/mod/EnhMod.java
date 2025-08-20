package com.kcube.enh.mod;

import java.util.List;

import com.kcube.doc.Item;
import com.kcube.enh.Enh.Mbr;
import com.kcube.lib.sql.SqlSelect;
import com.kcube.sys.usr.User;
import com.kcube.sys.usr.UserService;

/**
 * 게시판 Bean class
 */
public class EnhMod extends Item
{
	private static final long serialVersionUID = 6697214371772894665L;

	/**
	 * 관련기술 개별 삭제
	 */
	public static final int ENHMOD_DELETE = 9500;

	/**
	 * 관련기술 본 글 삭제
	 */
	public static final int ENHMOD_ALLDELETE = 9600;

	private User _lastUser;
	private Long _enhId;
	private int _seqOrder;
	private String _pacName;
	private List<Mbr> _mbrs;
	private String _itemTitle;

	/**
	 * 본 글의 제목을 돌려준다.
	 */
	public String getItemTitle()
	{
		return _itemTitle;
	}

	public void setItemTitle(String itemTitle)
	{
		_itemTitle = itemTitle;
	}

	/**
	 * 모듈의 enhId를 돌려준다.
	 */
	public Long getEnhId()
	{
		return _enhId;
	}

	public void setEnhId(Long enhId)
	{
		_enhId = enhId;
	}

	/**
	 * 탭에 입력할 패키지명을 돌려준다.
	 */
	public String getPacName()
	{
		return _pacName;
	}

	public void setPacName(String pacName)
	{
		_pacName = pacName;
	}

	/**
	 * 탭의 순서를 돌려준다.
	 */
	public int getSeqOrder()
	{
		return _seqOrder;
	}

	public void setSeqOrder(int seqOrder)
	{
		_seqOrder = seqOrder;
	}

	/**
	 * 탭의 마지막 수정자를 돌려준다.
	 */
	public User getLastUser()
	{
		return _lastUser;
	}

	public void setLastUser(User lastUser)
	{
		_lastUser = lastUser;
	}

	/**
	 * 고도화 참여자들을 돌려준다.
	 */
	public List<Mbr> getMbrs()
	{
		return _mbrs;
	}

	public void setMbrs(List<Mbr> mbrs)
	{
		_mbrs = mbrs;
	}

	/**
	 * 탭 첨부파일을 나타내는 클래스이다.
	 */
	public static class Attachment extends com.kcube.doc.file.Attachment
	{
		private static final long serialVersionUID = -704121704978434294L;
	}

	/**
	 * 고도화 참여자인지 확인한다.(model값으로 넘겨준다.)
	 */
	public boolean isCurrentMember()
	{
		return (null == getMbrs()) ? false : getMbrs().contains(UserService.getUser());
	}

	public void setCurrentMember(boolean currentMember)
	{
	}

	/**
	 * 탭 조회화면에서 고도화 참여자인지 확인한다.(model값으로 넘겨준다.) 고도화 참여자가 아닐 경우 탭의 조회만 가능하다. 본 글의 고도화
	 * 참여자일 경우 탭의 수정, 삭제 권한을 가지게 한다.
	 */
	public boolean isCurrentModMember()
	{
		long enhid = getEnhId();
		SqlSelect sel = new SqlSelect();
		sel.select("userid");
		sel.from("enh_item_mbr");
		sel.where("enhid = ? ", enhid);
		sel.where("userid = ? ", UserService.getUser().getUserId());
		try
		{
			if (sel.count() > 0)
			{
				return true;
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return false;
	}

	public void setCurrentModMember(boolean currentModMember)
	{
	}

	/**
	 * 탭 조회화면에서 본 글 작성자일 경우 탭의 수정, 삭제 권한을 갖게 해준다.
	 */
	public boolean isCurrentParentAuthor()
	{
		long enhid = getEnhId();
		SqlSelect sel = new SqlSelect();
		sel.select("userid");
		sel.from("enh_item");
		sel.where("enhid = ? ", enhid);
		sel.where("userid = ? ", UserService.getUser().getUserId());
		try
		{
			if (sel.count() > 0)
			{
				return true;
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return false;
	}

	public void setCurrentParentAuthor(boolean currentParentAuthor)
	{
	}

	/**
	 * 고도화 참여자(Member) 인지 여부를 돌려준다.
	 */
	public boolean isMbr() throws Exception
	{
		return (null == getMbrs()) ? false : getMbrs().contains(UserService.getUser());
	}

}