package com.kcube.enh;

public interface EnhConfig
{
	/**
	 * 연동 설정한 인맥관리 앱 번호.
	 */
	public Long getHumanAppId();

	/**
	 * 연동 설정한 앱 관리 앱 ID
	 * @return
	 */
	public Long getAppManagerAppId();
}
