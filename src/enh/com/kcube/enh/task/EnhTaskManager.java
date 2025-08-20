package com.kcube.enh.task;

import java.util.Date;

import com.kcube.doc.file.AttachmentManager;
import com.kcube.lib.jdbc.DbService;
import com.kcube.sys.usr.User;
import com.kcube.sys.usr.UserService;

public class EnhTaskManager
{
	private static AttachmentManager _attachment = new AttachmentManager(true);

	/**
	 * client의 값으로 server의 값을 update한다.
	 */
	public static EnhTask update(EnhTask server, EnhTask client) throws Exception
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
		server.setEnhId(client.getEnhId());
		server.setTaskSdate(client.getTaskSdate());
		server.setTaskEdate(client.getTaskEdate());
		server.setPlanSdate(client.getPlanSdate());
		server.setPlanEdate(client.getPlanEdate());
		server.setPercent(client.getPercent());

		if (client.getTaskSdate() == null || client.getTaskEdate() == null)
		{
			server.setIsVisb(0);
		}
		else
		{
			server.setIsVisb(1);
		}

		server.setTaskCode(client.getTaskCode());
		server.setReside(client.getReside());
		server.setTask(client.getTask());
		server.setContent(client.getContent());
		server.setLastUpdt(new Date());

		server.updateAttachments(_attachment.update(client.getAttachments(), server));

		return server;
	}

	/**
	 * 고도화 팀원의 역할을 등록상태로 한다.
	 */
	public static EnhTask register(EnhTask server)
	{
		server.setRgstDate(new Date());
		return server;
	}

	/**
	 * 고도화 팀원의 역할을 폐기한다.
	 * <p>
	 * db에서 삭제하고 첨부파일도 삭제한다. 복원할 수 없다.
	 */
	public static void remove(EnhTask server) throws Exception
	{
		_attachment.remove(server.getAttachments());
		DbService.remove(server);
	}
}
