<%@page import="com.kcube.enh.EnhConfig"%>
<%@page import="com.kcube.sys.usr.UserPermission"%>
<%@page import="com.kcube.sys.usr.UserService,com.kcube.sys.conf.module.ModuleConfigService,com.kcube.sys.module.ModuleParam"%>
<%!private static com.kcube.doc.file.AttachmentConfig _attachmentConfig = (com.kcube.doc.file.AttachmentConfig) com.kcube.sys.conf.ConfigService.getConfig(
		com.kcube.doc.file.AttachmentConfig.class);
	
	private static com.kcube.doc.ItemConfig _itemConfig = (com.kcube.doc.ItemConfig) com.kcube.sys.conf.ConfigService.getConfig(
		com.kcube.doc.ItemConfig.class);
	
	private static final EnhConfig _enhConf =
		(EnhConfig)
			com.kcube.sys.conf.ConfigService.getConfig(
				EnhConfig.class);
	
	private boolean isAdmin(ModuleParam mParam)
	{
		return UserPermission.isAppAdmin(mParam);
	}
	
	private void checkAdmin(ModuleParam mParam) throws Exception
	{
		UserPermission.checkAppAdmin(mParam);
	}
	
	/*
	* 설정한 앱 관리 AppId를 돌려준다
	*/
	private Long appManagerAppId() throws Exception 
	{
		return _enhConf.getAppManagerAppId() == null ? new Long(-1) : _enhConf.getAppManagerAppId();
	}
%>