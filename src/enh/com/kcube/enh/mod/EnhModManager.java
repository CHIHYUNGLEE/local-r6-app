package com.kcube.enh.mod;

import java.util.Date;

import com.kcube.doc.file.AttachmentManager;
import com.kcube.lib.jdbc.DbService;
import com.kcube.lib.sql.SqlUpdate;
import com.kcube.sys.usr.User;
import com.kcube.sys.usr.UserService;

public class EnhModManager
{
	private static AttachmentManager _attachment = new AttachmentManager(true);

	/**
	 * 모듈기술을 update한다.
	 */
	static void update(EnhMod server, EnhMod client) throws Exception
	{
		User author = client.getRgstUser();
		if (author != null)
		{
			server.setRgstUser(author);
		}
		else if (server.getRgstUser() == null)
		{
			server.setRgstUser(UserService.getUser());
		}
		server.setLastUser(UserService.getUser());
		server.setEnhId(client.getEnhId());
		server.setTitle(client.getTitle());
		server.setItemTitle(client.getItemTitle());
		server.setPacName(client.getPacName());
		server.setContent(client.getContent());
		server.setSeqOrder(client.getSeqOrder());

		server.setLastUpdt(new Date());
		server.setRgstDate(new Date());
		server.updateAttachments(_attachment.update(client.getAttachments(), server));
		server.updateVisible(server.isVisible());
	}

	/**
	 * 모듈기술을 등록상태로 한다.
	 */
	public static void register(EnhMod server) throws Exception
	{
		server.setStatus(EnhMod.REGISTERED_STATUS);
		server.setLastUpdt(new Date());
		server.setRgstDate(new Date());
		server.updateVisible(true);
	}

	/**
	 * 모듈기술을 삭제상태로 한다. ENHMOD_DELETE : 9500 (탭 별도 삭제 시) seq_order : -1 (탭 삭제 시)
	 */
	public static void delete(EnhMod server) throws Exception
	{
		server.setStatus(EnhMod.ENHMOD_DELETE);
		server.setLastUpdt(new Date());
		server.updateVisible(false);
		int seq = -1;
		server.setSeqOrder(seq);
	}

	/**
	 * 모듈기술이 삭제되면 상위 모듈기술의 seq_order값을 -1한다.
	 */
	public static void setSeq(EnhMod server) throws Exception
	{
		SqlUpdate updt = new SqlUpdate("enh_item_mod l");
		updt.setValue("l.seq_order = l.seq_order - 1");
		updt.where("l.status = 3000");
		updt.where("l.enhid = ? ", server.getEnhId());
		updt.where("l.seq_order > ? ", server.getSeqOrder());
		updt.execute();
	}

	/**
	 * 삭제된 모듈기술을 복원한다.
	 */
	public static void recover(EnhMod server) throws Exception
	{
		server.setStatus(EnhMod.REGISTERED_STATUS);
		server.setLastUpdt(new Date());
		server.updateVisible(true);
	}

	/**
	 * 모듈기술을 폐기한다. (첨부파일 포함)
	 */
	public static void remove(EnhMod server) throws Exception
	{
		_attachment.remove(server.getAttachments());
		DbService.remove(server);
	}

}