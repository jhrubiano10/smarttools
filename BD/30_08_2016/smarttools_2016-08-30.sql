# ************************************************************
# Sequel Pro SQL dump
# Versi�n 4500
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.5.42)
# Base de datos: smarttools
# Tiempo de Generaci�n: 2016-08-31 03:47:16 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Volcado de tabla administrador_empresa
# ------------------------------------------------------------

DROP TABLE IF EXISTS `administrador_empresa`;

CREATE TABLE `administrador_empresa` (
  `idadministrador` int(10) NOT NULL AUTO_INCREMENT,
  `estado` int(5) unsigned DEFAULT '0',
  `identificacion` varchar(20) DEFAULT '0',
  `nombres` varchar(50) DEFAULT '0',
  `apellidos` varchar(50) DEFAULT '0',
  `email` varchar(50) DEFAULT '0',
  `password` varchar(60) DEFAULT '0',
  `nombre_empresa` varchar(60) DEFAULT '0',
  `fecha` datetime DEFAULT NULL,
  KEY `idadministrador` (`idadministrador`),
  KEY `estado` (`estado`),
  KEY `identificacion` (`identificacion`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

LOCK TABLES `administrador_empresa` WRITE;
/*!40000 ALTER TABLE `administrador_empresa` DISABLE KEYS */;

INSERT INTO `administrador_empresa` (`idadministrador`, `estado`, `identificacion`, `nombres`, `apellidos`, `email`, `password`, `nombre_empresa`, `fecha`)
VALUES
	(9,1,'123','sda','asda','correo@correo.com','$2a$10$7yTLVneXLcFhf8I6q7m9n.0UIN42nNINlBHmn5ZLURa8/Rx1sXzly','Empresa','2016-08-27 00:00:00'),
	(3,1,'1234','sda','asda','correo2@correo.com','$2a$10$g0bM./g.22QIhctQLXwB0.382tgHyiyzigBEPVeWiyfEWVKlSPPAy','Empresa','0000-00-00 00:00:00'),
	(4,1,'12345','sda','asda','correo3@correo.com','$2a$10$5i2ERTGETxoXnHRvcNIjw.l0Fpzt41LS67tOnvhh4WiuS2qI3UGOC','Empresa','2016-08-27 00:00:00'),
	(5,1,'11276127','Jorge','Rubiano','jorge.rubiano.udec@gmail.com','$2a$10$oSbb49KFFb4m9ov0VJSf6.hKVSobzkTlddcpdjLVaVi/FnIvWE4ey','Mi Empresa','2016-08-27 00:00:00'),
	(6,1,'561201152','Camila','Marín','camila_marin1984@hotmail.com','$2a$10$AfcJSRZBjDocyF2X.PR7JuR0kXKwJf1PbuNibeRIwUVMnlrduL3my','Pruebas','2016-08-27 00:00:00'),
	(8,1,'84042356785','Carlos','Muñoz','carlos@correo.com','$2a$10$CSP6kQuqhVS.TzksD5zjkebD4b11V0UodoPFBnAvEc.dU4RB4Mz/W','Carlos INC','2016-08-27 00:00:00'),
	(10,1,'123789','sda','asda','correo@hgcorreo.com','$2a$10$esDYpo1ZLBdvqyWp0d5GRe4/dgwz3zs2W.DYholKe8w0MVEfMmfmm','Empresa','2016-08-27 00:00:00'),
	(11,1,'345345345','Camilo','Medina','camilo@medina.com','$2a$10$zGBMSC3zR.qr3VJ8TLJdv.Ny.VywUhSBJyDhd6jfAXEIfmIwBxxTK','Uniandes','2016-08-28 00:00:00'),
	(12,1,'854734834','María','Sharapova','maria@correo.com','$2a$10$ts0uL10Eu16H96QFEd3Mv.0iPMdfDTgI7UKqgCzcT2OKnYaIjbCRW','María INC.','2016-08-28 00:00:00');

/*!40000 ALTER TABLE `administrador_empresa` ENABLE KEYS */;
UNLOCK TABLES;


# Volcado de tabla concursos
# ------------------------------------------------------------

DROP TABLE IF EXISTS `concursos`;

CREATE TABLE `concursos` (
  `idconcurso` int(10) NOT NULL AUTO_INCREMENT,
  `idadministrador` int(10) unsigned DEFAULT '0',
  `token_concurso` varchar(60) DEFAULT NULL,
  `estado` int(5) unsigned DEFAULT '0',
  `publicado` int(5) unsigned DEFAULT '0',
  `terminado` int(5) unsigned DEFAULT '0',
  `total_videos` int(5) unsigned DEFAULT '0',
  `videos_por_procesar` int(5) unsigned DEFAULT '0',
  `videos_procesados` int(5) unsigned DEFAULT '0',
  `nombre_concurso` varchar(200) DEFAULT '0',
  `descripcion` text,
  `banner` varchar(200) DEFAULT '0',
  `url_concurso` varchar(200) DEFAULT '0',
  `fecha_inicial` datetime DEFAULT NULL,
  `fecha_inicial_string` varchar(20) DEFAULT '0',
  `fecha_inicial_timestamp` varchar(11) DEFAULT '0',
  `fecha_final` datetime DEFAULT NULL,
  `fecha_final_string` varchar(20) DEFAULT '0',
  `fecha_final_timestamp` int(11) DEFAULT '0',
  `fecha_creacion` datetime DEFAULT NULL,
  `fecha_creacion_string` varchar(20) DEFAULT '0',
  `hora_creacion_string` varchar(20) DEFAULT '0',
  PRIMARY KEY (`idconcurso`),
  KEY `idadministrador` (`idadministrador`),
  KEY `estado` (`estado`),
  KEY `publicado` (`publicado`),
  KEY `terminado` (`terminado`),
  KEY `token_concurso` (`token_concurso`),
  KEY `url_concurso` (`url_concurso`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

LOCK TABLES `concursos` WRITE;
/*!40000 ALTER TABLE `concursos` DISABLE KEYS */;

INSERT INTO `concursos` (`idconcurso`, `idadministrador`, `token_concurso`, `estado`, `publicado`, `terminado`, `total_videos`, `videos_por_procesar`, `videos_procesados`, `nombre_concurso`, `descripcion`, `banner`, `url_concurso`, `fecha_inicial`, `fecha_inicial_string`, `fecha_inicial_timestamp`, `fecha_final`, `fecha_final_string`, `fecha_final_timestamp`, `fecha_creacion`, `fecha_creacion_string`, `hora_creacion_string`)
VALUES
	(1,5,'da50c249-ad6d-8849-b514-6c16a745db62',1,1,0,0,0,0,'Un nuevo concurso Jorge EDITADO','<p>Listo ya ha quedado está opción, EDITADO</p>','773617b3-41b6-06b9-8b92-e695f86b3f69.jpeg','un_nuevo_concurso_jorge_editado','2016-08-31 00:00:00','2016-08-31','14726196000','2016-09-02 00:00:00','2016-09-02',2147483647,'2016-08-30 20:01:39','30/08/2016','08:01:39 pm'),
	(2,8,'9a891dac-f26c-ba91-12ff-16e6c00e6050',1,1,0,0,0,0,'De otro usaurio','<p>Listo, para otro usuario, para ver que pasa</p>','3e20ae1b-42b1-3df4-6931-aa1909aeeb90.png','de_otro_usaurio','2016-08-31 00:00:00','2016-08-31','14726196000','2016-09-07 00:00:00','2016-09-07',2147483647,'2016-08-30 20:01:39','30/08/2016','08:01:39 pm'),
	(3,5,'3af40d90-4418-d60b-0d75-0129b9520d8d',1,1,0,0,0,0,'Tomar la foto','<p>Para tomar la foto y ya!</p>','af7429d6-ae39-7e00-53ee-46eea55b029d.png','tomar_la_foto','2016-09-02 00:00:00','2016-09-02','14727924000','2016-09-15 00:00:00','2016-09-15',2147483647,'2016-08-30 22:37:45','30/08/2016','10:37:45 pm');

/*!40000 ALTER TABLE `concursos` ENABLE KEYS */;
UNLOCK TABLES;


# Volcado de tabla concursos_videos
# ------------------------------------------------------------

DROP TABLE IF EXISTS `concursos_videos`;

CREATE TABLE `concursos_videos` (
  `idvideo` int(10) NOT NULL AUTO_INCREMENT,
  `estado` int(5) DEFAULT '0',
  `token_video` varchar(100) DEFAULT NULL,
  `idadministrador` int(10) DEFAULT NULL,
  `idconcurso` int(10) DEFAULT '0',
  `estado_video` int(5) DEFAULT '0',
  `error_conversion` int(5) DEFAULT NULL,
  `email_enviado` int(5) DEFAULT '0',
  `nombre_archivo` varchar(100) DEFAULT '0',
  `token_archivo` varchar(100) DEFAULT '0',
  `extension` varchar(50) DEFAULT '0',
  `titulo_video` varchar(100) DEFAULT '0',
  `nombre_usuario` varchar(200) DEFAULT '0',
  `email` varchar(100) DEFAULT '0',
  `mensaje` text,
  `fecha_publica` datetime DEFAULT NULL,
  `fecha_publica_string` varchar(20) DEFAULT NULL,
  `hora_publica` varchar(20) DEFAULT NULL,
  `fecha_publica_timestamp` int(11) DEFAULT NULL,
  `fecha_convierte` datetime DEFAULT NULL,
  `fecha_convierte_string` varchar(20) DEFAULT NULL,
  `fecha_convierte_timestamp` int(11) DEFAULT NULL,
  `fecha_envia_email` datetime DEFAULT NULL,
  `fecha_envia_email_string` varchar(20) DEFAULT NULL,
  `fecha_envia_email_timestamp` int(11) DEFAULT NULL,
  PRIMARY KEY (`idvideo`),
  KEY `estado` (`estado`),
  KEY `idconcurso` (`idconcurso`),
  KEY `estado_video` (`estado_video`),
  KEY `email_enviado` (`email_enviado`),
  KEY `idadministrador` (`idadministrador`),
  KEY `token_video` (`token_video`),
  KEY `error_conversion` (`error_conversion`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

LOCK TABLES `concursos_videos` WRITE;
/*!40000 ALTER TABLE `concursos_videos` DISABLE KEYS */;

INSERT INTO `concursos_videos` (`idvideo`, `estado`, `token_video`, `idadministrador`, `idconcurso`, `estado_video`, `error_conversion`, `email_enviado`, `nombre_archivo`, `token_archivo`, `extension`, `titulo_video`, `nombre_usuario`, `email`, `mensaje`, `fecha_publica`, `fecha_publica_string`, `hora_publica`, `fecha_publica_timestamp`, `fecha_convierte`, `fecha_convierte_string`, `fecha_convierte_timestamp`, `fecha_envia_email`, `fecha_envia_email_string`, `fecha_envia_email_timestamp`)
VALUES
	(1,1,'c3dda153-398c-2e8a-cb21-5afbf1bc5fcf',5,1,3,0,0,'video_partido.flv','d263a929-1f7f-711c-4ab2-e39afcb825ad','flv','En mp4','Jorge Rubiano','jorge.rubiano.udec@gmail.com','Listo','2016-08-30 20:42:24','30/08/2016','08:42:24 pm',1472607744,'2016-08-30 22:25:39','30/08/2016',1472613939,NULL,NULL,NULL),
	(3,1,'d67aa710-63e1-9ea4-1df2-35a1196b3cbb',5,1,3,0,0,'VideoJuego.mp4','b160b471-9f5a-4650-4237-90fab9a37dec','mp4','En mp4','Pruebas Mp4','correo@correo.com','sdfs','2016-08-30 20:50:00','30/08/2016','08:50:00 pm',1472608200,'2016-08-30 22:25:02','30/08/2016',1472613902,NULL,NULL,NULL),
	(4,1,'237575ca-e28d-06fd-6d0a-9838d60f3e52',5,1,3,1,0,'VideoJuego.mp4','25f6c7f2-206d-f3d8-dfbb-876fc93fd8541','mp4','Un vídeo de Prueba','Jorge Rubiano','camila_marin1984@hotmail.com','dads','2016-08-30 20:54:26','30/08/2016','08:54:26 pm',1472608466,'2016-08-30 22:24:12','30/08/2016',1472613852,NULL,NULL,NULL),
	(5,1,'79a315ef-e829-fda6-a132-3544a791b4f5',5,1,3,0,0,'arte.flv','60179d79-da6d-d428-5547-48e0a7b6e840','flv','Un vídeo de Prueba','Pruebas Mp4','camila_marin1984@hotmail.com','sfsdf','2016-08-30 21:05:04','30/08/2016','09:05:04 pm',1472609104,'2016-08-30 22:24:16','30/08/2016',1472613856,NULL,NULL,NULL),
	(6,1,'d182a219-b661-1046-5441-fe68d7dd74f3',5,1,3,0,0,'video_partido.flv','3d3fc17c-1c21-5169-b8db-667ff76d3b08','flv','En mp4','ss','ostricajh@gmail.com','asdad','2016-08-30 21:05:45','30/08/2016','09:05:45 pm',1472609145,'2016-08-30 22:25:43','30/08/2016',1472613943,NULL,NULL,NULL),
	(7,1,'bcc66380-f4ef-b411-48b0-8d2a380b3d90',5,1,3,0,0,'video_partido.flv','cda9ab73-55fe-964f-479a-0986cf477d20','flv','De nuevo','No creo','camila_marin1984@hotmail.com','Ya casi','2016-08-30 21:12:23','30/08/2016','09:12:23 pm',1472609543,'2016-08-30 22:25:43','30/08/2016',1472613943,NULL,NULL,NULL),
	(8,1,'adce1771-285f-5945-44c1-697d94a0b9c5',5,1,3,0,0,'video_partido.flv','9a25679d-9dde-a5e5-11d4-cebc41af4c12','flv','asda','asda','camila_marin1984@hotmail.com','Listo','2016-08-30 21:24:56','30/08/2016','09:24:56 pm',1472610296,'2016-08-30 22:27:55','30/08/2016',1472614075,NULL,NULL,NULL),
	(9,1,'75f5b82a-be7f-c73c-3830-7b70b9959dfb',5,1,3,0,0,'video_partido.flv','5315811b-f275-4fca-c780-cef3954c2797','flv','Para ver que guarda','Veamos que pasa d enuevo','adsas@campo.com','Y ya quedaría de forma correcta o eso creo...','2016-08-30 21:47:35','30/08/2016','09:47:35 pm',1472611655,'2016-08-30 22:27:54','30/08/2016',1472614074,NULL,NULL,NULL),
	(10,1,'29cfb05f-ce52-43c1-1bb1-5eb2641a3939',5,1,3,0,0,'video_partido.flv','470e6359-19ca-6c21-8346-a9d3cec7723a','flv','Para terminar','Listo ya quedo','correo@correo.com','Ya listo','2016-08-30 21:48:27','30/08/2016','09:48:27 pm',1472611707,'2016-08-30 22:27:56','30/08/2016',1472614076,NULL,NULL,NULL),
	(11,1,'066c84b1-6bd2-e4bd-14df-30c0783eac0d',5,1,3,0,0,'GameIdea01.mov','4808332e-a595-f21a-50b9-881966f3d3db','mov','Uno nuevo para seguir','Ya casi','camila_marin1984@hotmail.com','adasdas','2016-08-30 21:48:27','30/08/2016','09:48:27 pm',1472611707,'2016-08-30 22:26:51','30/08/2016',1472614011,NULL,NULL,NULL),
	(12,1,'590768a3-a088-4739-5ca8-d3c8c96d9519',5,1,3,0,0,'videoSudoku.mov','7232dc75-d7b0-0a46-c96b-d0cdfd7fe003','mov','En mp4','Pruebas Mp4','jorge.rubiano.udec@gmail.com','Ya casi','2016-08-30 21:50:47','30/08/2016','09:50:47 pm',1472611847,'2016-08-30 22:26:49','30/08/2016',1472614009,NULL,NULL,NULL),
	(13,1,'912c84f3-ba5a-d33f-3256-5f12d395c22d',8,2,3,0,0,'robot.avi','d445382b-1ee0-93b4-b7d6-aa96830765f0','avi','El robot','Camila Ramírez','camila.correo@nada.com','Listo veamos como queda esto ya!!','2016-08-30 22:20:14','30/08/2016','10:20:14 pm',1472613614,'2016-08-30 22:30:15','30/08/2016',1472614215,NULL,NULL,NULL),
	(14,1,'347180f3-e8d7-f9db-7e28-69ed748b32de',5,1,3,0,0,'VID-20160207-WA0000.mp4','21f60ff2-0f54-927b-9711-b79a29bb42dd','mp4','Desde el Móvil','Jorge Rubiano','camila_marin1984@hotmail.com','Veamos que pasa','2016-08-30 22:37:45','30/08/2016','10:37:45 pm',1472614665,'2016-08-30 22:39:05','30/08/2016',1472614745,NULL,NULL,NULL);

/*!40000 ALTER TABLE `concursos_videos` ENABLE KEYS */;
UNLOCK TABLES;


# Volcado de tabla estado_video
# ------------------------------------------------------------

DROP TABLE IF EXISTS `estado_video`;

CREATE TABLE `estado_video` (
  `idestado` int(10) NOT NULL AUTO_INCREMENT,
  `estado` int(5) DEFAULT '0',
  `estado_video` int(5) DEFAULT '0',
  `nombre_estado` varchar(100) DEFAULT '0',
  `fecha` datetime DEFAULT NULL,
  PRIMARY KEY (`idestado`),
  KEY `estado` (`estado`),
  KEY `estado_video` (`estado_video`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

LOCK TABLES `estado_video` WRITE;
/*!40000 ALTER TABLE `estado_video` DISABLE KEYS */;

INSERT INTO `estado_video` (`idestado`, `estado`, `estado_video`, `nombre_estado`, `fecha`)
VALUES
	(1,1,1,'En cola','2016-08-26 18:35:43'),
	(2,1,2,'En proceso','2016-08-26 18:35:59'),
	(3,1,3,'Procesado','2016-08-26 18:36:12');

/*!40000 ALTER TABLE `estado_video` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
