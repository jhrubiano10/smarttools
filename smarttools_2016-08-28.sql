# ************************************************************
# Sequel Pro SQL dump
# Versión 4500
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.5.42)
# Base de datos: smarttools
# Tiempo de Generación: 2016-08-28 23:04:34 +0000
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



# Volcado de tabla concursos
# ------------------------------------------------------------

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
  `duracion_video` int(10) unsigned DEFAULT '0',
  `nombre_concurso` varchar(200) DEFAULT '0',
  `descripcion` text,
  `banner` varchar(200) DEFAULT '0',
  `url_concurso` varchar(200) DEFAULT '0',
  `fecha_inicial` datetime DEFAULT NULL,
  `fecha_final` datetime DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  PRIMARY KEY (`idconcurso`),
  KEY `idadministrador` (`idadministrador`),
  KEY `estado` (`estado`),
  KEY `publicado` (`publicado`),
  KEY `terminado` (`terminado`),
  KEY `token_concurso` (`token_concurso`),
  KEY `url_concurso` (`url_concurso`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Volcado de tabla concursos_videos
# ------------------------------------------------------------

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
  `fecha_convierte` datetime DEFAULT NULL,
  `fecha_envia_email` datetime DEFAULT NULL,
  `fecha_crea` datetime DEFAULT NULL,
  `fecha_publica_string` varchar(20) DEFAULT NULL,
  `fecha_convierte_string` varchar(20) DEFAULT NULL,
  `fecha_envia_email_string` varchar(20) DEFAULT NULL,
  `fecha_crea_string` varchar(20) DEFAULT NULL,
  `hora_crea_string` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`idvideo`),
  KEY `estado` (`estado`),
  KEY `idconcurso` (`idconcurso`),
  KEY `estado_video` (`estado_video`),
  KEY `email_enviado` (`email_enviado`),
  KEY `idadministrador` (`idadministrador`),
  KEY `token_video` (`token_video`),
  KEY `error_conversion` (`error_conversion`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Volcado de tabla estado_video
# ------------------------------------------------------------

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




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
