package com.kcube.enh;

import java.util.Date;

import com.kcube.doc.file.AttachmentManager;
import com.kcube.enh.task.EnhTask;
import com.kcube.enh.task.EnhTaskHistory;
import com.kcube.lib.event.EventService;
import com.kcube.lib.jdbc.DbService;
import com.kcube.lib.sql.SqlDelete;
import com.kcube.sys.emp.Employee;
import com.kcube.sys.emp.EmployeeService;
import com.kcube.sys.usr.User;
import com.kcube.sys.usr.UserService;

public class EnhManager
{
	private static AttachmentManager _attachment = new AttachmentManager(true);
	private static EnhListener _listener = (EnhListener) EventService.getDispatcher(EnhListener.class);

	/**
	 * client의 값으로 server의 값을 update한다.
	 */
	static void update(Enh server, Enh client) throws Exception
	{

		User author = client.getAuthor();

		if (author != null)
		{
			server.setAuthor(author);
		}
		else if (server.getAuthor() == null)
		{
			server.setAuthor(UserService.getUser());
		}

		User pmUser = client.getPmUser();

		if (pmUser != null)
		{
			server.setPmUser(pmUser);
		}
		else if (server.getPmUser() == null)
		{
			server.setPmUser(UserService.getUser());
		}

		server.setOfficeInfo(client.getOfficeInfo());
		server.setEnhName(client.getEnhName());
		server.setEnhSdate(client.getEnhSdate());
		server.setEnhEdate(client.getEnhEdate());
		server.setContent(client.getContent());
		server.setLastUpdt(new Date());

		if (!"".equals(server.getMbrs()) && "null".equals(server.getMbrs()))
		{
			EnhSql sql = new EnhSql();
			// 삭제된 멤버의 업무(TASK)를 삭제 및 고도화 삭제를 팀원에게 알림
			for (Enh.Mbr oldMember : server.getMbrs())
			{
				boolean isDelete = true;
				for (Enh.Mbr newMember : client.getMbrs())
				{
					if (oldMember.getUserId().equals(newMember.getUserId()))
					{
						isDelete = false;
					}
				}
				if (isDelete == true)
				{
					sql.deleteMemberTask(client.getId(), oldMember.getUserId());
				}
			}
		}

		// DB에 새로운 팀원 저장
		server.setMbrs(client.getMbrs());

		updateTask(server);

		server.updateAttachments(_attachment.update(client.getAttachments(), server));
		server.updateVisible(server.isVisible());
		// 2020-05-14 앱 관리 연동으로인한 추가
		_listener.modifiedEnh(server);
	}

	static User getPmUser(Long userid) throws Exception
	{
		Employee emp = EmployeeService.getEmployee(userid);

		return emp.getUser();
	}

	/**
	 * 고도화를 등록상태로 한다.
	 */
	static void register(Enh server)
	{
		server.setRgstDate(new Date());
		server.setStatus(Enh.ENHPLAN_STATUS);

		server.updateVisible(true);
	}

	/**
	 * 등록된 고도화를 폐기한다.
	 * <p>
	 * db에서 삭제하고 첨부파일도 삭제한다. 복원할 수 없다.
	 */
	static void remove(Enh server) throws Exception
	{
		_attachment.remove(server.getAttachments());
		// 2020-05-14 앱 관리 연동으로인한 추가
		_listener.removeEnh(server);
		DbService.remove(server);
	}

	/**
	 * 등록된  고도화를 삭제한다.
	 */
	static void delete(Enh server) throws Exception
	{
		server.setStatus(server.getStatus());
		server.setLastUpdt(new Date());
		server.updateVisible(false);
		// 2020-05-14 앱 관리 연동으로인한 추가
		_listener.deleteEnh(server);
	}

	/**
	 * 삭제된 고도화를 복원한다.
	 */
	static void recover(Enh server) throws Exception
	{
		server.setStatus(server.getStatus());
		server.setLastUpdt(new Date());
		server.updateVisible(true);
		// 2020-05-14 앱 관리 연동으로 인한 추가
		_listener.recoverEnh(server);
	}

	/**
	 * 고도화 완료시 완료날짜 등록한다
	 */
	static void updateStatus(Enh server, Enh client) throws Exception
	{
		Date date = (client.getStatus() == Enh.ENHCOM_STATUS) ? client.getCompleteDate() : null;
		server.setCompleteDate(date);
		server.setStatus(client.getStatus());
	}

	/**
	 * 고도화 이름을 돌려준다.
	 */
	public static String selectName(Long id) throws Exception
	{
		EnhSql sql = new EnhSql();
		return sql.getProjectName(id);
	}
	
	/**
	 * 팀원에 따른 역할을 등록/수정한다(역할 등록 창 삭제로 팀원 등록 시 자동으로 등록됨) 
	 * @param enh
	 * @throws Exception
	 */
	static void updateTask(Enh enh) throws Exception
	{
		SqlDelete del = new SqlDelete("ENH_ITEM_TASK");
		del.where("enhid = ?", enh.getId());
		del.execute();
		
		for(User user:enh.getMbrs()) {
			EnhTask task = new EnhTask();
			task.setEnhId(enh.getId());
			task.setAuthor(user);
			task.setTaskSdate(enh.getEnhSdate());
			task.setTaskEdate(enh.getEnhEdate());
			task.setPlanSdate(enh.getEnhSdate());
			task.setPlanEdate(enh.getEnhEdate());
			//task.setPercent(percent); 
			task.setIsVisb(1);
			
			task.setTaskCode(3);//모든 taskcode(역할) 개발(3)으로 셋팅
			task.setReside(1); //모든 상주여부는 비상주(1)로 등록
			task.setTask(enh.getEnhName()); //역할업무는 고도화 제목 넣음
			
			task.setLastUpdt(new Date());
			task.setRgstDate(new Date());
			
			DbService.save(task);
		}
	}
}
