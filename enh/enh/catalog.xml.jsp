<%@ include file="/jspf/head.xml.jsp" %>
<registry>
	<properties>
		<id>
			<multiList component="CheckboxColumn" width="60px">
				<header label="<fmt:message key="doc.014"/>" toggle="id"/>
				<style name="id" attribute="id"/>
			</multiList>
			<multiModList component="CheckboxColumn" width="60px">
				<header label="<fmt:message key="doc.014"/>" toggle="id"/>
				<style name="id" attribute="id"/>
			</multiModList>
			<list component="TextColumn" width="60px">
				<header label="<fmt:message key="doc.006"/>"/>
				<style attribute="id"/>
			</list>
			<hidden component="HiddenFieldEditor" parent="null" id="id"/>
		</id>
		<enhId>
			<hidden component="HiddenFieldEditor" parent="null" id="enhId"/>
		</enhId>
		<enhName>
			<list component="TitleColumn" width="700px">
				<header label="<kfmt:message key="enh.001"/>" sort="enhName" search="enhName"/>
				<style href="usr.read.jsp?id=@{id}" attribute="enhName" position="pos" newIcon="rgstDate"
				opnCnt="opnCnt" opnView="EnhOpinion.ViewOpinion" align="left"/>
			</list>
			<modlist component="TitleColumn">
				<header label="<kfmt:message key="enh.mod.007"/>" search="title" sort="title"/>
				<style href="/enh/mod/mod.read.only.jsp?modid=@{id}" attribute="title" position="pos" newIcon="rgstDate"
				opnCnt="opnCnt" opnView="EnhOpinion.ViewOpinion" align="left"/>
			</modlist>
			<admlist component="TitleColumn">
				<header label="<kfmt:message key="enh.001"/>" search="enhName" sort="enhName"/>
				<style href="adm.read.jsp?id=@{id}" attribute="enhName" position="pos" newIcon="rgstDate"
				opnCnt="opnCnt" opnView="EnhOpinion.ViewOpinion" align="center"/>
			</admlist>
			<webzineList component="EnhWebzineColumn">
				<header label="<fmt:message key="doc.001"/>" sort="enhName" search="enhName"/>
				<style href="usr.read.jsp?id=@{id}" newIcon="rgstDate" attribute="enhName,content,mod" contentHighlight="false"
				opnCnt="opnCnt" opnView="EnhOpinion.ViewOpinion"/>
			</webzineList>
			<write component="TextFieldEditor" focus="true">
				<header label="<kfmt:message key="enh.001"/>" required="true"/>
				<style maxLength="100"/>
			</write>
			<read component="MainTitleViewer" id="readTitle" name="enhName">
				<style>
					<title component="TitleViewer" reference="enhName">
						<style className="mainTitle_title"/>
					</title>
					<bottom>
						<rgstDate component="DateViewer" reference="rgstDate" styleType="dateInfo">
							<style format="<fmt:message key="date.longTohour"/>"/>
						</rgstDate>
						<author component="EmpHtmlViewer" reference="author" styleType="authorInfo">
							<style useMainTitle="true"/>
						</author>						
					</bottom>
				</style>
			</read>
		</enhName>
		<itemTitle>
			<modlist component="TitleColumn">
				<header label="<kfmt:message key="enh.001"/>" sort="itemTitle" search="itemTitle"/>
				<style href="usr.read.jsp?id=@{enhid}" attribute="itemTitle" position="pos" rplyIcon="true"
				opnCnt="opnCnt" opnView="EnhOpinion.ViewOpinion"/>
			</modlist>
			<hidden component="HiddenFieldEditor" parent="null"/>
		</itemTitle>
		<author>
			<list component="EmpColumn" width="82px">
				<header label="<fmt:message key="usr.10"/>" sort = "rgstName"/>
				<style id="userId" name="rgstName" vrtl="<fmt:message key="sys.vrtl.userId"/>" />
			</list>
			<modlist component="EmpColumn" width="82px">
				<header label="<fmt:message key="usr.10"/>" sort = "userName"/>
				<style id="userId" name="userName" vrtl="<fmt:message key="sys.vrtl.userId"/>" />
			</modlist>
			<write component="EmpTextFieldEditor" id="auth">
				<header label="<fmt:message key="usr.10"/>" required="true"/>
				<style vrtl="<fmt:message key="sys.vrtl.userId"/>" />
			</write>
			<read component="EmpHtmlViewer" id="id">
				<header label="<fmt:message key="usr.10"/>"/>
				<style vrtl="<fmt:message key="sys.vrtl.userId"/>" />
			</read>
			<hidden name="author.id" component="HiddenFieldEditor" parent="null"/>
		</author>
		<pmUser>
			 <read component="EmpHtmlViewer" id="pmUser">
				<header label="<kfmt:message key="enh.012"/>" />
				<style vrtl="<fmt:message key="sys.vrtl.userId"/>" />
			</read>
			<write component="EmpFieldEditor" id="pmId">
				<header label="<kfmt:message key="enh.012"/>"/>
				<style viewer="EmpTextViewer" nodeName="coauthor" />
			</write>
			<list component="EmpColumn" width="70px">
				<header label="<kfmt:message key="enh.012"/>" search="pmName"  sort="pmName"/>
				<style id="pmId" name="pmName" vrtl="<kfmt:message key="enh.012"/>" attribte="pmName" />
			</list>
		</pmUser>
		<orgInfo>
			<list component="TextColumn" width="140px">
				<header label="<kfmt:message key="enh.003"/>" search="orgName" sort="orgName"/>
				<style attribute="orgName" align="center"/>
			</list>
			<write component="RfrnOrgFieldEditor" parent="layout" id="orgInfo">
				<header label="<kfmt:message key="enh.003"/>" required="true"/>
				<style maxLength=""/>
			</write>
			<read component="RfrnOrgViewer">
				<header label="<kfmt:message key="enh.003"/>"/>
			</read>
		</orgInfo>
		<rgstDate>
			<read component="DateViewer">
				<header label="<fmt:message key="srch.007"/>"/>
				<style format="<fmt:message key="date.long"/>"/>
			</read>
			<list component="DateColumn" width="100px">
				<header label="<fmt:message key="doc.022"/>" sort="rgstDate"/>
				<style format="<fmt:message key="date.medium"/>" attribute="rgstDate"/>
			</list>
		</rgstDate>		
		<mbrs>
			<list component="EnhTaskActorColumn" width="150px">
				<header label="<kfmt:message key="enh.002"/>"/>
			</list>
			<write component="EmpsCompositeEditor" id="mbrs">
				<header label="<kfmt:message key="enh.002"/>"/>
				<style editor="EmpsFieldEditor" viewer="ListViewer" nodeName="actors" multiple="true" isWindowPopup="true"/>
			</write>
			<read component="EnhTaskEmpsViewer" id="mbrs">
				<header label="<kfmt:message key="enh.002"/>"/>
				<style attribute="id" userId="<%= com.kcube.sys.usr.UserService.getUserId() %>"/>
			</read>
		</mbrs>
		<period>
			<list component="DateTermColumn" width="150px">
				<header label="<kfmt:message key="enh.004"/>" sort="enhSdate"/>
				<style format="<fmt:message key="date.medium"/>" strtTime="enhSdate" endTime="enhEdate"/>
			</list>
			<read component="EnhDateTermViewer" name="enhSdate,enhEdate">
				<header label="<kfmt:message key="enh.004"/>"/>
				<style format="<fmt:message key="date.medium"/>"/>
			</read>
			<write component="DateTermEditor" name="enhSdate,enhEdate" id="period">
				<header label="<kfmt:message key="enh.004"/>"/>
				<style format="<fmt:message key="date.medium"/>" setToday="true"/>
			</write>
		</period>
		<enhSdate>
			<list component="DateColumn" width="70px">
				<header label="<kfmt:message key="enh.005"/>" sort = "enhSdate"/>
				<style format="<fmt:message key="date.medium"/>" attribute="enhSdate"/>
			</list>
		</enhSdate>
		<enhEdate>
			<list component="DateColumn" width="70px">
				<header label="<kfmt:message key="enh.006"/>" sort = "enhEdate"/>
				<style format="<fmt:message key="date.medium"/>" attribute="enhEdate"/>
			</list>
		</enhEdate>
		<content> 
			<write component="WebEditor" hidden="content" id="content">
				<header label="<kfmt:message key="enh.007"/>"/>
				<style height="300" name="content" editor="kcube" isImage="true" isMovie="true"
					path="/lib/com/kcube/jsv/editors/xquared/config/XquaredSimpleConfig.js" sessionKey="${sessionKey}"/>
			</write>
			<read component="ContentViewer"/>
		</content>
		<attachments>
			<list component="FileColumn" width="50px" id="attachments">
				<header label="<fmt:message key="doc.038"/>"/>
				<style select="/jsl/EnhUser.AttachmentList.json?id=@{id}"
						inline="/jsl/inline/EnhUser.DownloadByUser?id=@{id}"
						attach="/jsl/attach/EnhUser.DownloadByUser?id=@{id}"/>
			</list>
			<modlist component="FileColumn" width="50px" id="attachments">
				<header label="<kfmt:message key="enh.mod.009"/>"/>
				<style select="/jsl/EnhModUser.AttachmentList.json?id=@{id}"
						inline="/jsl/inline/EnhModUser.DownloadByUser?id=@{id}"
						attach="/jsl/attach/EnhModUser.DownloadByUser?id=@{id}"/>
			</modlist>
			<write component="FileFieldEditor" id="attachments">
				<header label="<fmt:message key="doc.017"/>"/>
				<style sessionKey="${sessionKey}"/>
			</write>
			<read component="FileViewer">
				<header label="<fmt:message key="doc.017"/>"/>
				<style inline="/jsl/inline/EnhUser.DownloadByUser?id=@{id}"
						attach="/jsl/attach/EnhUser.DownloadByUser?id=@{id}"
						optional="true"/>
			</read>
			<modRead component="FileViewer">
				<header label="<fmt:message key="doc.017"/>"/>
				<style inline="/jsl/inline/EnhModUser.DownloadByUser?id=@{id}"
						attach="/jsl/attach/EnhModUser.DownloadByUser?id=@{id}"
						optional="true"/>
			</modRead>
		</attachments>
		<opinions>
			<write component="OpnWriter" id="opnWriter">
				<style itemId="id" actionUrl="/jsl/EnhOpinion.InsertOpinion.json" vrtl="<fmt:message key="sys.vrtl.userId"/>" />
			</write>
			<read component="OpnViewer" observe="opnWriter">
				<style itemId="id" userId="<%=com.kcube.sys.usr.UserService.getUserId()%>"
				actionUrl="/jsl/EnhOpinion.DeleteOpinion.jsl"  vrtl="<fmt:message key="sys.vrtl.userId"/>"
				actionAddUrl="/jsl/EnhOpinion.InsertOpinion.json"
				opnView="EnhOpinion.ViewOpinion" opnUpdate="EnhOpinion.UpdateOpinion" isFold="true"/>
			</read>
		</opinions>
		<status>
			<read component="EnhTaskStatusFieldEditor" id="status">
				<header label="<kfmt:message key="enh.016"/>" />
				<style attribute="id" completeDate="completeDate"/>
			</read>
			<list component="EnhTaskStatusColumn" width="80px">
				<header label="<kfmt:message key="enh.016"/>" sort = "status"/>
				<style attribute="status" completeDate="completeDate" />
			</list>
			<hidden component="HiddenFieldEditor" parent="null"/>
		</status>
		<currentPm>
			<hidden component="HiddenFieldEditor" parent="null"/>
		</currentPm>
		<mods>
			<search>
				<header label="<kfmt:message key="enh.mod.007"/>" search="mod"/>
			</search>
		</mods>
		<tablist>
			<opinion url="/enh/mod/mod.tab.opinion.jsp?id=@{id}">
				<header label="<kfmt:message key="enh.019"/>"/>
				<style counter="/jsl/EnhOpinion.CountByUser.json?id=@{id}"/>
			</opinion>
			<Mod url="/enh/mod/mod.jsp?id=@{id}">
				<header label="<kfmt:message key="enh.017"/>"/>
				<style counter="/jsl/EnhModUser.ItemModCount.json?enhId=@{id}"/>
			</Mod>
			<admOpinion url="/enh/mod/mod.tab.opinion.jsp?id=@{id}">
				<header label="<kfmt:message key="enh.019"/>"/>
				<style counter="/jsl/EnhOpinion.CountByUser.json?id=@{id}"/>
			</admOpinion>
			<admMod url="/enh/mod/adm.mod.jsp?id=@{id}">
				<header label="<kfmt:message key="enh.017"/>"/>
				<style counter="/jsl/EnhModUser.DelItemModCount.json?enhId=@{id}"/>
			</admMod>
		</tablist>
	</properties>	
	<validators>
		<enhName validator="required"
				message="[<fmt:message key="doc.001"/>] <fmt:message key="doc.016"/>"/>
		<orgInfo ref="orgInfo"
				message="[<kfmt:message key="enh.003"/>] <fmt:message key="doc.016"/>"/>		
	</validators>
</registry>
<%@ include file="/jspf/tail.xml.jsp" %>