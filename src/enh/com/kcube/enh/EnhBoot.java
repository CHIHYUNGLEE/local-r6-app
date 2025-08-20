package com.kcube.enh;

import com.kcube.enh.mod.EnhModJob;
import com.kcube.enh.mod.EnhModUser;
import com.kcube.enh.task.EnhTaskMember;
import com.kcube.enh.task.EnhTaskOpinion;
import com.kcube.enh.task.EnhTaskOwner;
import com.kcube.enh.task.EnhTaskUser;
import com.kcube.lib.action.ActionService;
import com.kcube.lib.event.EventService;
import com.kcube.sys.AppBoot;
import com.kcube.sys.conf.ConfigService;

/**
 * 고도화관리 초기화
 */
public class EnhBoot implements AppBoot
{

	/**
	 * AppSpring의 Module에 해제될 때 필요한 로직을 수행한다.
	 */
	public void destroy()
	{
	}

	/**
	 * AppSpring의 Module로 등록될 때 초기화를 수행한다.
	 */
	public void init() throws Exception
	{
		ActionService.addAction(new EnhUser());
		ActionService.addAction(new EnhOwner());
		ActionService.addAction(new EnhAdmin());
		ActionService.addAction(new EnhOpinion());
		ActionService.addAction(new EnhTaskUser());
		ActionService.addAction(new EnhTaskMember());
		ActionService.addAction(new EnhTaskOwner());
		ActionService.addAction(new EnhTaskOpinion());
		ActionService.addAction(new EnhModUser());
		ActionService.addAction(new EnhModJob());

		EventService.addListener(new EnhEvent());
		ConfigService.getConfig(EnhNotify.class);
	}
}
