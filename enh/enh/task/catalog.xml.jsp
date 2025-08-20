<%@ include file="/jspf/head.xml.jsp" %>
<registry>
	<properties>
		<id>
			<list component="TextColumn" width="60px">
				<header label="<fmt:message key="doc.006"/>"/>
				<style attribute="id"/>
			</list>
			<hidden component="HiddenFieldEditor" parent="null" id="id"/>
		</id>
		<enhId>
			<hidden component="HiddenFieldEditor" parent="null" id="enhId"/>
			<read component="TextViewer" name="enhId">
				<header label="<kfmt:message key="enh.task.102"/>" />
			</read>
		</enhId>
		<task>
			<list component="EnhTaskColumn">
				<header label="<kfmt:message key="enh.task.102"/>" sort="task"/>
				<style href="/enh/task/usr.read.jsp?id=@{id}&amp;enhId=@{enhid}" attribute="taskCode" 
						title="task" options="<kfmt:message key="enh.task.options.001"/>" align="left" />
			</list>
			<popupList component="EnhTaskColumn">
				<header label="<kfmt:message key="enh.task.102"/>"/>
				<style href="/enh/task/usr.popup.read.jsp?id=@{id}&amp;enhId=@{enhid}" attribute="taskCode" 
						title="task" options="<kfmt:message key="enh.task.options.001"/>" align="left" />
			</popupList>
			<write component="TextFieldEditor" focus="true">
				<header label="<kfmt:message key="enh.task.102"/>" required="true"/>
				<style maxLength="200"/>
			</write>
			<read component="TextViewer" name="task">
				<header label="<kfmt:message key="enh.task.102"/>" />
			</read>
		</task>
		<taskCode>
			<write component="ComboFieldEditor" id="taskCode" name="taskCode">
				<header label="<kfmt:message key="enh.task.101"/>" required="true"/>
				<style attribute="taskCode" options="<kfmt:message key="enh.task.options.001"/>"/>
			</write>
			<read component="ComboViewer" name="taskCode">
				<header label="<kfmt:message key="enh.task.101"/>" />
				<style attribute="taskCode" options="<kfmt:message key="enh.task.options.001"/>"/>
			</read>
			<hidden component="HiddenFieldsEditor" parent="null" id="taskCode"/>
		</taskCode>
		<author>
			<list component="MbrColumn" width="82px">
				<header label="<kfmt:message key="enh.task.100"/>" earch="userName" sort="userName"/>
				<style id="userId" name="userName" isGlobal="true"/>
			</list>
			<write component="EmpFieldEditor" id="author" name="author">
				<header label="<kfmt:message key="enh.task.100"/>" required="true"/>
				<style vrtl="<fmt:message key="sys.vrtl.userId"/>" popupUrl="/enh/js/EnhEmpFieldEditorDialog.jsp?enhId=@{enhId}"/>
			</write>
			<read component="MbrHtmlViewer">	
				<header label="<kfmt:message key="enh.task.100"/>"/>
				<style isGlobal="true"/>
			</read>
			<hidden name="author.id" component="HiddenFieldEditor" parent="null"/>
		</author>
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
		<period>
			<read component="EnhDateTermViewer" name="taskSdate,taskEdate">
				<header label="<kfmt:message key="enh.task.104"/>"/>
				<style format="<fmt:message key="date.medium"/>"/>
			</read>
			<write component="DateTermEditor" name="taskSdate,taskEdate">
				<header label="<kfmt:message key="enh.task.104"/>"/>
				<style format="<fmt:message key="date.medium"/>" setToday="true"/>
			</write>
		</period>
		<planPeriod>
			<read component="EnhDateTermViewer" name="planSdate,planEdate">
				<header label="<kfmt:message key="enh.task.105"/>"/>
				<style format="<fmt:message key="date.medium"/>"/>
			</read>
			<write component="DateTermEditor" name="planSdate,planEdate">
				<header label="<kfmt:message key="enh.task.105"/>"/>
				<style format="<fmt:message key="date.medium"/>" setToday="true"/>
			</write>
		</planPeriod>
		<planSdate>
			<list component="DateColumn" width="85px">
				<header label="<kfmt:message key="enh.013"/>" sort="planSdate"/>
				<style format="<fmt:message key="date.medium"/>" attribute="planSdate"/>
			</list>
		</planSdate>
		<planEdate>
			<list component="DateColumn" width="85px">
				<header label="<kfmt:message key="enh.014"/>" sort="planEdate"/>
				<style format="<fmt:message key="date.medium"/>" attribute="planEdate"/>
			</list>
		</planEdate>
		<taskSdate>
			<list component="DateColumn" width="70px">
				<header label="<kfmt:message key="enh.005"/>" sort="taskSdate"/>
				<style format="<fmt:message key="date.medium"/>" attribute="taskSdate"/>
			</list>
		</taskSdate>
		<taskEdate>
			<list component="DateColumn" width="70px">
				<header label="<kfmt:message key="enh.006"/>" sort="taskEdate"/>
				<style format="<fmt:message key="date.medium"/>" attribute="taskEdate"/>
			</list>
		</taskEdate>
		<percent>
			<write component="EnhTextFieldEditor" id="percent">
				<header label="<kfmt:message key="enh.task.108"/>" />
				<style maxLength="3"/>
			</write>
			<read component="TextViewer" id="percent" name="percent">
				<header label="<kfmt:message key="enh.task.108"/>" />
			</read>
		</percent>
		<grade>
			<list component="TextColumn"  width="76px">
				<header label="<fmt:message key="hrm.005"/>" sort="gradeSort"/>
				<style attribute="gradeName"/>
			</list>
		</grade>
		<content> 
			<write component="WebEditor" hidden="content" id="content">
				<header label="<kfmt:message key="enh.task.103"/>"/>
				<style height="300" name="content" editor="kcube" isImage="true" isMovie="true"
					path="/lib/com/kcube/jsv/editors/xquared/config/XquaredSimpleConfig.js" sessionKey="${sessionKey}"/>
			</write>
			<read component="ContentViewer"/>
		</content>
		<attachments>
			<list component="FileColumn" width="50px" id="attachments">
				<header label="<fmt:message key="doc.038"/>"/>
				<style select="/jsl/EnhTaskUser.AttachmentList.json?id=@{id}"
						inline="/jsl/inline/EnhTaskUser.DownloadByUser?id=@{id}"
						attach="/jsl/attach/EnhTaskUser.DownloadByUser?id=@{id}"/>
			</list>
			<write component="FileFieldEditor" id="attachments">
				<header label="<fmt:message key="doc.017"/>"/>
				<style sessionKey="${sessionKey}"/>
			</write>
			<read component="FileViewer">
				<header label="<fmt:message key="doc.017"/>"/>
				<style inline="/jsl/inline/EnhTaskUser.DownloadByUser?id=@{id}"
						attach="/jsl/attach/EnhTaskUser.DownloadByUser?id=@{id}"
						optional="true"/>
			</read>
		</attachments>
		<opinions>
			<write component="OpnWriter" id="opnWriter">
				<style itemId="id" actionUrl="/jsl/EnhTaskOpinion.InsertOpinion.json" vrtl="<fmt:message key="sys.vrtl.userId"/>" />
			</write>
			<read component="OpnViewer" observe="opnWriter">
				<style itemId="id" userId="<%=com.kcube.sys.usr.UserService.getUserId()%>"
				actionUrl="/jsl/EnhTaskOpinion.DeleteOpinion.jsl"  vrtl="<fmt:message key="sys.vrtl.userId"/>"
				actionAddUrl="/jsl/EnhTaskOpinion.InsertOpinion.json"
				opnView="EnhTaskOpinion.ViewOpinion" opnUpdate="EnhTaskOpinion.UpdateOpinion"/>
			</read>
		</opinions>
		<currentOwner>
			<hidden component="HiddenFieldEditor" parent="null"/>
		</currentOwner>
		<reside>
			<list component="ComboColumn" width="90px" >
				<header label="<kfmt:message key="enh.task.106"/>" sort="reside"/>
				<style attribute="reside" options="<kfmt:message key="enh.task.option.009"/>"/>		
			</list>
			<write component="ComboFieldEditor" id="reside" name="reside">
				<header label="<kfmt:message key="enh.task.106"/>" required="true"/>
				<style attribute="reside" options="<kfmt:message key="enh.task.option.009"/>"/>
			</write>
			<read component="ComboViewer" name="reside">
				<header label="<kfmt:message key="enh.task.106"/>" />
				<style attribute="reside" options="<kfmt:message key="enh.task.option.009"/>"/>
			</read>
			<hidden component="HiddenFieldsEditor" parent="null" id="reside"/>
		</reside>
	</properties>
	<validators>
		<taskCode validator="required"
				message="[<kfmt:message key="enh.task.101"/>] <fmt:message key="doc.016"/>"/>		
		<task validator="required"
				message="[<kfmt:message key="enh.task.102"/>] <fmt:message key="doc.016"/>"/>
		<author validator="required"
				message="[<kfmt:message key="enh.task.100"/>] <fmt:message key="doc.016"/>"/>
	</validators>
</registry>
<%@ include file="/jspf/tail.xml.jsp" %>