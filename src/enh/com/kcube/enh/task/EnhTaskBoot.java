package com.kcube.enh.task;

import com.kcube.sys.AppBoot;
import com.kcube.sys.conf.ConfigService;

/**
 * 고도화관리 역할 초기화
 */
public class EnhTaskBoot implements AppBoot
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
		ConfigService.getConfig(EnhTaskNotify.class);
	}
}
