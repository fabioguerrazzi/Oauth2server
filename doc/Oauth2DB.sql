/****** Object:  Database [OAuth2DB]    Script Date: 09/10/2017 12.36.34

Shema and Data for minimal authentication.
Tested:
Basic authentication (POST \auth\token)
Barer auth   		 (GET \users   )

see requests.txt for detailed postman request

Create manually the catalog OAuth2DB on your SQL Server instance

 ******/

USE [OAuth2DB]
GO
/****** Object:  Table [dbo].[AccessTokens]    Script Date: 09/10/2017 12.36.34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AccessTokens](
	[tokenId] [varchar](255) NOT NULL,
	[userId] [varchar](255) NOT NULL,
	[applicationId] [varchar](255) NOT NULL,
	[expires] [datetime] NULL,
	[scope] [varchar](60) NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
 CONSTRAINT [PK_AccessToken] PRIMARY KEY CLUSTERED 
(
	[tokenId] ASC,
	[userId] ASC,
	[applicationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Applications]    Script Date: 09/10/2017 12.36.34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Applications](
	[applicationId] [varchar](255) NOT NULL,
	[description] [varchar](256) NULL,
	[secret] [varchar](255) NULL,
	[redirectUri] [varchar](255) NULL,
	[grantTypes] [varchar](60) NULL,
	[scope] [varchar](60) NULL,
	[createdAt] [datetime] NULL,
	[updateAt] [datetime] NULL,
 CONSTRAINT [PK__Applicat__C93A4C996B476EAC] PRIMARY KEY CLUSTERED 
(
	[applicationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Directories]    Script Date: 09/10/2017 12.36.34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Directories](
	[directoryId] [varchar](255) NOT NULL,
	[description] [varchar](255) NULL,
	[minPasswordLength] [int] NULL,
	[maxPasswordLength] [int] NULL,
	[minLowercaseLength] [int] NULL,
	[minUppercaseLength] [int] NULL,
	[minNumericLength] [int] NULL,
	[minSymbolLength] [int] NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
 CONSTRAINT [PK_Directories] PRIMARY KEY CLUSTERED 
(
	[directoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RefreshTokens]    Script Date: 09/10/2017 12.36.34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RefreshTokens](
	[tokenId] [varchar](255) NOT NULL,
	[userId] [varchar](255) NOT NULL,
	[applicationId] [varchar](255) NOT NULL,
	[expires] [datetime] NULL,
	[scope] [varchar](255) NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
 CONSTRAINT [PK_RefreshToken] PRIMARY KEY CLUSTERED 
(
	[tokenId] ASC,
	[userId] ASC,
	[applicationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SysTable]    Script Date: 09/10/2017 12.36.34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SysTable](
	[uid] [int] IDENTITY(1,1) NOT NULL,
	[parent] [int] NOT NULL,
	[value] [nvarchar](255) NULL,
	[alt] [nvarchar](255) NULL,
 CONSTRAINT [PK_SysTable] PRIMARY KEY CLUSTERED 
(
	[uid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserApplications]    Script Date: 09/10/2017 12.36.34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserApplications](
	[applicationId] [varchar](255) NOT NULL,
	[userId] [varchar](255) NOT NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
 CONSTRAINT [PK_UserApplications] PRIMARY KEY CLUSTERED 
(
	[applicationId] ASC,
	[userId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserDirectories]    Script Date: 09/10/2017 12.36.34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserDirectories](
	[userId] [varchar](255) NOT NULL,
	[directoryId] [varchar](255) NOT NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
 CONSTRAINT [PK_UserDirectories] PRIMARY KEY CLUSTERED 
(
	[userId] ASC,
	[directoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserLogins]    Script Date: 09/10/2017 12.36.34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserLogins](
	[userId] [varchar](255) NOT NULL,
	[loginDate] [datetime] NULL,
	[loginResult] [varchar](255) NULL,
	[ignore] [varchar](3) NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
 CONSTRAINT [PK_UserLogins] PRIMARY KEY CLUSTERED 
(
	[userId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserPasswordTokens]    Script Date: 09/10/2017 12.36.34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserPasswordTokens](
	[userId] [varchar](255) NOT NULL,
	[token] [varchar](255) NOT NULL,
	[expiry] [datetime] NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
 CONSTRAINT [PK_UserPasswordTokens] PRIMARY KEY CLUSTERED 
(
	[userId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 09/10/2017 12.36.34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[userId] [varchar](255) NOT NULL,
	[locationId] [varchar](255) NULL,
	[type] [varchar](255) NOT NULL,
	[firstName] [varchar](255) NOT NULL,
	[lastName] [varchar](255) NULL,
	[email] [varchar](255) NULL,
	[password] [varchar](255) NULL,
	[lastChangedPassword] [datetime] NULL,
	[enabled] [varchar](3) NULL,
	[locked] [varchar](3) NULL,
	[forcePasswordChange] [varchar](3) NULL,
	[created] [datetime] NULL,
	[createdBy] [varchar](255) NULL,
	[lastUpdate] [datetime] NULL,
	[lastUpdateBy] [varchar](255) NULL,
	[gender] [varchar](10) NULL,
	[dateOfBirth] [datetime] NULL,
	[yearOfStudy] [varchar](4) NULL,
	[isEmployee] [varchar](3) NULL,
	[isStudent] [varchar](3) NULL,
	[allowContact] [varchar](3) NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
 CONSTRAINT [PK__Users__1788CC4C165A615D] PRIMARY KEY CLUSTERED 
(
	[userId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserScopes]    Script Date: 09/10/2017 12.36.34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserScopes](
	[userId] [varchar](255) NOT NULL,
	[scopeId] [varchar](255) NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
 CONSTRAINT [PK_UserScopes] PRIMARY KEY CLUSTERED 
(
	[userId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[AccessTokens] ([tokenId], [userId], [applicationId], [expires], [scope], [createdAt], [updatedAt]) VALUES (N'9yfmFxnvWBLkD6R0HMXjJF10cJb8zhKWjzkQTFQZhs4RgfySHEe37gvgM2Xbc9wpeuiMuVrrqqBRRyI0Ta6XZp5aEsOiSjiypkk45id9Puo2wrLu7XEw6fXQqRNmOn639Wgw82Mjo3dMQjOvHjftdsE9XASjhq2rIzvgaaej3lXHOnQrd9Gwk6L5Bq93k0lVLGYta1c0KGjpxg2jeHt20DfkIISmBPsmWre6oIkVk4g6fE1fBbGEodmeQOD94Bc', N'4260208F-FC6D-4A3F-8739-61FAF646FA17', N'sLOPKaEsCsBhNdsTgQLLIT9YyZUSQoyRumnUrb44P3uDlicYtv51Y1k9BtzU4eHW', CAST(N'2017-10-08T10:17:22.657' AS DateTime), N'', NULL, NULL)
INSERT [dbo].[Applications] ([applicationId], [description], [secret], [redirectUri], [grantTypes], [scope], [createdAt], [updateAt]) VALUES (N'sLOPKaEsCsBhNdsTgQLLIT9YyZUSQoyRumnUrb44P3uDlicYtv51Y1k9BtzU4eHW', N'root ', N'c0xPUEthRXNDc0JoTmRzVGdRTExJVDlZeVpVU1FveVJ1bW5VcmI0NFAzdURsaWNZdHY1MVkxazlCdHpVNGVIVzpwTzZHNkhpdFF3VWVHOE5va29vVFpTSVhIRWVidHhPTmllblNESldpZ1k2emJ5am1yMU9STHJ5cmtubG1XU3ZY', N'http://api.google.com', N'password', N'profile', NULL, NULL)
INSERT [dbo].[RefreshTokens] ([tokenId], [userId], [applicationId], [expires], [scope], [createdAt], [updatedAt]) VALUES (N'5HdZrXt0Tbs6OPUwA6Kotb5qet6t7EwlnqAGCvoXuirFeyjyiJat4g2sJbz9A1h1fbgW4bkCI2BbvNQIEIhpRP7ZZOWaNp1o59FCy58cTAAxyDtWZHYkBJFLTv04yAlLXdUQP9MHVtfYAf6BwEi3KWfi3k7eqPIZJPy47hAxrQ5i7Si8M1sZTNHMVNe8kP50O294g8fwr6x1FzrJspq9sUj0PWo6LUhGO56XNnLYbGOpQpVRvInQbZBOXABGdWB', N'4260208F-FC6D-4A3F-8739-61FAF646FA17', N'sLOPKaEsCsBhNdsTgQLLIT9YyZUSQoyRumnUrb44P3uDlicYtv51Y1k9BtzU4eHW', CAST(N'2018-04-07T09:20:11.913' AS DateTime), N'', NULL, NULL)
SET IDENTITY_INSERT [dbo].[SysTable] ON 

INSERT [dbo].[SysTable] ([uid], [parent], [value], [alt]) VALUES (1, 0, N'Sex', NULL)
INSERT [dbo].[SysTable] ([uid], [parent], [value], [alt]) VALUES (2, 1, N'MAL', N'Male')
INSERT [dbo].[SysTable] ([uid], [parent], [value], [alt]) VALUES (3, 1, N'FEM', N'Female')
SET IDENTITY_INSERT [dbo].[SysTable] OFF
INSERT [dbo].[UserApplications] ([applicationId], [userId], [createdAt], [updatedAt]) VALUES (N'sLOPKaEsCsBhNdsTgQLLIT9YyZUSQoyRumnUrb44P3uDlicYtv51Y1k9BtzU4eHW', N'4260208F-FC6D-4A3F-8739-61FAF646FA17', NULL, NULL)
INSERT [dbo].[UserApplications] ([applicationId], [userId], [createdAt], [updatedAt]) VALUES (N'sLOPKaEsCsBhNdsTgQLLIT9YyZUSQoyRumnUrb44P3uDlicYtv51Y1k9BtzU4eHW', N'e33ce889-5221-496b-89a8-f7af68b4bc3b', NULL, NULL)
INSERT [dbo].[UserLogins] ([userId], [loginDate], [loginResult], [ignore], [createdAt], [updatedAt]) VALUES (N'4260208F-FC6D-4A3F-8739-61FAF646FA17', CAST(N'2017-10-08T08:46:16.133' AS DateTime), N'failure', N'No', NULL, NULL)
INSERT [dbo].[Users] ([userId], [locationId], [type], [firstName], [lastName], [email], [password], [lastChangedPassword], [enabled], [locked], [forcePasswordChange], [created], [createdBy], [lastUpdate], [lastUpdateBy], [gender], [dateOfBirth], [yearOfStudy], [isEmployee], [isStudent], [allowContact], [createdAt], [updatedAt]) VALUES (N'4260208F-FC6D-4A3F-8739-61FAF646FA17', N'', N'ADMIN', N'Admin', N'Admin', N'admin@domain.com', N'b49d92b2487d6649ef05a8fcc57318198bc5e01f6fcacbaf5e527ebf16c9e2c4', NULL, N'Yes', N'No', N'No', NULL, NULL, CAST(N'2017-10-08T09:17:16.000' AS DateTime), NULL, NULL, NULL, NULL, N'No', N'No', N'No', NULL, NULL)
INSERT [dbo].[Users] ([userId], [locationId], [type], [firstName], [lastName], [email], [password], [lastChangedPassword], [enabled], [locked], [forcePasswordChange], [created], [createdBy], [lastUpdate], [lastUpdateBy], [gender], [dateOfBirth], [yearOfStudy], [isEmployee], [isStudent], [allowContact], [createdAt], [updatedAt]) VALUES (N'e33ce889-5221-496b-89a8-f7af68b4bc3b', N'', N'USER', N'Simple User', N'McAlliston', N'user@domain.com', N'user', NULL, N'Yes', N'No', N'No', NULL, NULL, NULL, NULL, NULL, NULL, NULL, N'No', N'No', N'No', NULL, NULL)
INSERT [dbo].[UserScopes] ([userId], [scopeId], [createdAt], [updatedAt]) VALUES (N'4260208F-FC6D-4A3F-8739-61FAF646FA17', N'profile', NULL, NULL)
INSERT [dbo].[UserScopes] ([userId], [scopeId], [createdAt], [updatedAt]) VALUES (N'e33ce889-5221-496b-89a8-f7af68b4bc3b', N'profile', NULL, NULL)
SET ANSI_PADDING ON
GO
/****** Object:  Index [IDX_UserName]    Script Date: 09/10/2017 12.36.34 ******/
CREATE NONCLUSTERED INDEX [IDX_UserName] ON [dbo].[Users]
(
	[locationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Applications]  WITH CHECK ADD  CONSTRAINT [FK_Applications_Applications] FOREIGN KEY([applicationId])
REFERENCES [dbo].[Applications] ([applicationId])
GO
ALTER TABLE [dbo].[Applications] CHECK CONSTRAINT [FK_Applications_Applications]
GO
USE [master]
GO
ALTER DATABASE [OAuth2DB] SET  READ_WRITE 
GO
