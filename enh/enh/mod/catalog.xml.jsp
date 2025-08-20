<%@ include file="/jspf/head.xml.jsp" %>
<registry>
	<properties>
		<id>
			<hidden component="HiddenFieldEditor" parent="null" id="id"/>
		</id>
		<seqOrder>
			<hidden component="HiddenFieldEditor" parent="null"/>
		</seqOrder>
		<enhId>
			<hidden component="HiddenFieldEditor" parent="null"/>
		</enhId>
		<itemTitle>
			<hidden component="HiddenFieldEditor" parent="null"/>
			<tabRead component="MainTitleViewer" id="readTitle" name="itemTitle">
				<style>
					<title component="TitleViewer" reference="itemTitle">
						<style className="mainTitle_title"/>
					</title>
				</style>
			</tabRead>
		</itemTitle>
		<title>
			<tabwrite component="AutoTextFieldEditor">
				<header label="<fmt:message key="doc.001"/>"/>
				<style maxLength="15"/>
			</tabwrite>
			<tabRead component="TextViewer" id="title" name="title">
				<header label="<fmt:message key="doc.001"/>"/>
			</tabRead>
		</title>
		<pacname>
			<write component="TextFieldEditor" id="pacName" name="pacName">
				<header label="<kfmt:message key="enh.mod.001"/>"/>
				<style maxLength="85" example="<kfmt:message key="enh.mod.002"/>"/>
			</write>
			<read component="TextViewer" id="pacName" name="pacName">
				<header label="<kfmt:message key="enh.mod.001"/>"/>
			</read>
			<tabRead component="TextViewer" id="pacName" name="pacName">
				<header label="<kfmt:message key="enh.mod.001"/>"/>
			</tabRead>
		</pacname>
		<content>
			<write component="WebEditor" hidden="content" id="content">
				<style height="350" name="content" editor="kcube" attachUrl="ImageAction.Download" sessionKey="${sessionKey}"/>
			</write>
			<read component="ContentViewer"></read>
			<tabRead component="ContentViewer" id="content"></tabRead>
		</content>
		<attachments>
			<write component="FileFieldEditor" id="attachments">
				<header label="<fmt:message key="doc.017"/>"/>
				<style sessionKey="${sessionKey}"/>
			</write>
			<modRead component="FileViewer">
				<header label="<fmt:message key="doc.017"/>"/>
				<style inline="/jsl/inline/EnhModUser.DownloadByUser?id=@{id}"
						attach="/jsl/attach/EnhModUser.DownloadByUser?id=@{id}"
						optional="true"/>
			</modRead>
		</attachments>
		<author>
			<tabRead component="EmpHtmlViewer" name="rgstUser" id="rgstUser">
				<header label="<fmt:message key="doc.003"/>"/>
				<style vrtl="<fmt:message key="sys.vrtl.userId"/>"/>
			</tabRead>
		</author>
	</properties>
	<validators>
		<title validator="required"
				message="[<fmt:message key="doc.001"/>] <fmt:message key="doc.016"/>"/>
		<author validator="required"
				message="[<fmt:message key="doc.003"/>] <fmt:message key="doc.016"/>"/>
		<content ref="content"
				message="[<fmt:message key="doc.002"/>] <fmt:message key="doc.016"/>"/>
	</validators>
</registry>
<%@ include file="/jspf/tail.xml.jsp" %>