# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 10.0.20-MariaDB)
# Database: anytv_comments
# Generation Time: 2015-07-29 10:15:16 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL DEFAULT '',
  `username` varchar(50) DEFAULT NULL,
  `topic` varchar(100) NOT NULL DEFAULT '',
  `type` varchar(100) DEFAULT NULL,
  `comment` text NOT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;

INSERT INTO `comments` (`id`, `email`, `username`, `topic`, `type`, `comment`, `date_created`, `date_updated`)
VALUES
	(1,'adinbautista@gmail.com','adin234','_b-CiW-hBjk','gamers_video',' test the API test the API test the API v test the API v test the API test the API test the APItest the API test the API test the API test the API v test the API v test the API test the API test the APItest the API test the API test the API test the API v test the API v test the API test the API test the APItest the API test the API test the API test the API v test the API v test the API test the API test the APItest the API test the API test the API test the API v test the API v test the API test the API test the APItest the API  test the API test the API test the API v test the API v test the API test the API test the APItest the API test the API test the API test the API v test the API v test the API test the API test the APItest the API test the API test the API test the API v test the API v test the API test the API test the APItest the API test the API test the API test the API v test the API v test the API test the API test the APItest the API test the API test the API test the API v test the API v test the API test the API test the APItest the API  test the API test the API test the API v test the API v test the API test the API test the APItest the API test the API test the API test the API v test the API v test the API test the API test the APItest the API test the API test the API test the API v test the API v test the API test the API test the APItest the API test the API test the API test the API v test the API v test the API test the API test the APItest the API test the API test the API test the API v test the API v test the API test the API test the APItest the API  test the API test the API test the API v test the API v test the API test the API test the APItest the API test the API test the API test the API v test the API v test the API test the API test the APItest the API test the API test the API test the API v test the API v test the API test the API test the APItest the API test the API test the API test the API v test the API v test the API test the API test the APItest the API test the API test the API test the API v test the API v test the API test the API test the APItest the API','2015-06-04 15:34:38','2015-06-04 18:20:18'),
	(2,'adinbautista@gmail.com','adin234','_b-CiW-hBjk','gamers_video','test the API again','2015-06-04 15:34:58','2015-06-04 18:05:26'),
	(3,'adinbautista@gmail.com','adin234','_b-CiW-hBjk','gamers_video','test the API again coz changes','2015-06-04 15:39:59','2015-06-04 18:05:26'),
	(4,'adinbautista@gmail.com','adin234','5d4HcIJyvZQ','gamers_video','test the API again coz changes','2015-06-04 15:40:41','2015-06-04 18:05:26'),
	(5,'adinbautista@gmail.com','adin234','5d4HcIJyvZQ','gamers_video','test the API again coz changes','2015-06-04 18:05:05',NULL),
	(6,'adinbautista@gmail.com','adin234','_b-CiW-hBjk','gamers_video','test','2015-06-04 18:49:17',NULL),
	(7,'adinbautista@gmail.com','adin234','_b-CiW-hBjk','gamers_video','adfa','2015-06-04 18:50:46',NULL),
	(8,'adinbautista@gmail.com','adin234','_b-CiW-hBjk','gamers_video','im posting yepey\r\n','2015-06-04 18:51:14',NULL),
	(9,'adinbautista@gmail.com','adin234','_b-CiW-hBjk','gamers_video','im posting yepey\r\n','2015-06-04 18:51:17',NULL),
	(10,'adinbautista@gmail.com','adin234','_b-CiW-hBjk','gamers_video','test123','2015-06-04 19:12:12',NULL),
	(11,'adinbautista@gmail.com','adin234','_b-CiW-hBjk','gamers_video','12345','2015-06-04 19:21:38',NULL),
	(12,'adinbautista@gmail.com','adin234','_b-CiW-hBjk','gamers_video','123456','2015-06-04 19:22:04',NULL),
	(13,'adinbautista@gmail.com','adin234','_b-CiW-hBjk','gamers_video','asdfadfsasdf','2015-06-04 19:22:30',NULL),
	(14,'adinbautista@gmail.com','adin234','_b-CiW-hBjk','gamers_video','asdfadfsasdf','2015-06-04 19:22:54',NULL),
	(15,'adinbautista@gmail.com','adin234','_b-CiW-hBjk','gamers_video','gbghsd gsd f','2015-06-04 19:23:00',NULL),
	(16,'adinbautista@gmail.com','adin234','_b-CiW-hBjk','gamers_video','12312asdf','2015-06-04 19:23:19',NULL),
	(17,'adinbautista@gmail.com','adin234','_b-CiW-hBjk','gamers_video','i am a generous god','2015-06-04 19:23:38',NULL),
	(18,'adinbautista@gmail.com','adin234','_b-CiW-hBjk','gamers_video','adin can post','2015-06-05 11:32:57',NULL),
	(19,'mataps@any.tv','mataps@any.tv','BiEhyeV-pTg','gamers_video','teat','2015-06-05 13:55:08',NULL),
	(20,'mataps@any.tv','mataps@any.tv','BiEhyeV-pTg','gamers_video','test','2015-06-05 13:55:18',NULL),
	(21,'mataps@any.tv','mataps@any.tv','3flSNjZhpoE','gamers_video','test\r\n','2015-06-05 16:55:13',NULL),
	(22,'adinbautista@gmail.com','adinbautista@gmail.com','Ed0L624qpn8','gamers_video','test','2015-06-08 11:59:33',NULL),
	(23,'adinbautista@gmail.com','adinbautista@gmail.com','mrQRVbvTMas','gamers_video','testagain','2015-06-08 12:00:21',NULL),
	(24,'adinbautista@gmail.com','adinbautista@gmail.com','fixB2UbsbN4','gamers_video','test comment','2015-06-10 10:43:16',NULL),
	(25,'adinbautista@gmail.com','adinbautista@gmail.com','0I43ZyK7SYo','gamers_video','test','2015-06-10 14:55:48',NULL),
	(26,'ninz.xp@gmail.com','ninz.xp@gmail.com','0I43ZyK7SYo','gamers_video','12536','2015-06-10 15:01:43',NULL),
	(27,'ninz.xp@gmail.com','ninz.xp@gmail.com','0I43ZyK7SYo','gamers_video','lolwhut\r\n','2015-06-10 15:01:57',NULL),
	(28,'ninz.xp@gmail.com','ninz.xp@gmail.com','0I43ZyK7SYo','gamers_video','no fucking more','2015-06-10 15:02:05',NULL),
	(29,'adinbautista@gmail.com','adinbautista@gmail.com','0I43ZyK7SYo','gamers_video','coz no more. hahahaha','2015-06-10 15:07:11',NULL),
	(30,'jcepeda@any.tv','jcepeda@any.tv','1352','gamers_articles','nice','2015-06-10 15:17:44',NULL),
	(31,'airon@any.tv','airon@any.tv','r7YlgPjuSJ8','gamers_video','adfa','2015-06-11 11:00:22',NULL),
	(32,'airon@any.tv','airon@any.tv','0I43ZyK7SYo','gamers_video','i join the fun','2015-06-11 14:16:54',NULL),
	(33,'adin@any.tv','adin@any.tv','12321','gamers_articles','hallo','2015-06-18 16:16:41',NULL),
	(34,'rob@any.tv','rob@any.tv','12321','gamers_articles','HALLOWS','2015-06-19 17:37:41',NULL),
	(35,'romeroeshleebien@gmail.com','romeroeshleebien@gmail.com','21235','gamers_articles','This is a comment','2015-06-19 17:47:39',NULL),
	(36,'romeroeshleebien@gmail.com','romeroeshleebien@gmail.com','21235','gamers_articles','this is my second comment\r\n','2015-06-19 17:48:02',NULL),
	(37,'romeroeshleebien@gmail.com','romeroeshleebien@gmail.com','21235','gamers_articles','this is a link\r\nhttp://beta.gamers.tm/news/21235','2015-06-19 17:48:14',NULL),
	(38,'romeroeshleebien@gmail.com','romeroeshleebien@gmail.com','21235','gamers_articles','    ','2015-06-19 17:48:27',NULL),
	(39,'romeroeshleebien@gmail.com','romeroeshleebien@gmail.com','21235','gamers_articles','                                         ','2015-06-19 17:48:32',NULL),
	(40,'romeroeshleebien@gmail.com','romeroeshleebien@gmail.com','21235','gamers_articles','\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n','2015-06-19 17:48:37',NULL),
	(41,'romeroeshleebien@gmail.com','romeroeshleebien@gmail.com','21235','gamers_articles','<b>hello</b>','2015-06-19 17:48:54',NULL),
	(42,'romeroeshleebien@gmail.com','romeroeshleebien@gmail.com','1','gamers_articles','                   ','2015-06-19 17:49:21',NULL),
	(43,'romeroeshleebien@gmail.com','romeroeshleebien@gmail.com','12321','gamers_articles','       ','2015-06-19 17:49:32',NULL),
	(44,'romeroeshleebien@gmail.com','romeroeshleebien@gmail.com','12321','gamers_articles','                                                                                                          s','2015-06-19 17:49:43',NULL),
	(45,'romeroeshleebien@gmail.com','romeroeshleebien@gmail.com','12321','gamers_articles','                       ','2015-06-19 17:49:46',NULL),
	(46,'romeroeshleebien@gmail.com','romeroeshleebien@gmail.com','12321','gamers_articles','                 ','2015-06-19 17:50:16',NULL),
	(47,'romeroeshleebien@gmail.com','romeroeshleebien@gmail.com','12321','gamers_articles','                          ','2015-06-19 17:50:21',NULL),
	(48,'rjlagrimas08@gmail.com','rjlagrimas08@gmail.com','JbE0qSKrDZI','gamers_video','asdf','2015-06-19 18:11:41',NULL),
	(49,'rjlagrimas08@gmail.com','rjlagrimas08@gmail.com','JbE0qSKrDZI','gamers_video','asdfadfasdfsadf','2015-06-19 18:11:46',NULL),
	(50,'rjlagrimas08@gmail.com','rjlagrimas08@gmail.com','JbE0qSKrDZI','gamers_video','asdf','2015-06-19 18:15:45',NULL),
	(51,'rjlagrimas08@gmail.com','rjlagrias08@gmail.com','JbE0qSKrDZI','gamers_video','asdf','2015-06-19 18:15:57',NULL),
	(52,'rjlagrimas08@gmail.com','rjlagrimas08@gmail.com','JbE0qSKrDZI','gamers_video','asdf','2015-06-19 18:16:02',NULL),
	(53,'rjlagrimas08@gmail.com','rjlagrimas08@gmail.com','JbE0qSKrDZI','gamers_vide','asdf','2015-06-19 18:16:07',NULL),
	(54,'rjlagrimas08@gmail.com','rjlagrimas08@gmail.com','JbE0qSKrDZI','0','asdf','2015-06-19 18:16:26',NULL),
	(55,'rjlagrimas08@gmail.com','rjlagrimas08@gmail.com','JbE0qSKrDZI','gamers_video','asdfadfasdfsadf','2015-06-19 18:19:02',NULL),
	(56,'rjlagrimas08@gmail.com','rjlagrimas08@gmail.com','JbE0qSKrDZI','gamers_video','asdfadfasdfsadf','2015-06-19 18:19:13',NULL),
	(57,'rjlagrimas08@gmail.com','rjlagrimas08@gmail.com','JbE0qSKrDZI','1','asdfadfasdfsadf','2015-06-19 18:19:40',NULL),
	(58,'rjlagrimas08@gmail.com','rjlagrimas08@gmail.com','JbE0qSKrDZI','9999','asdfadfasdfsadf','2015-06-19 18:22:09',NULL),
	(59,'rjlagrimas08@gmail.com','rjlagrimas08@gmail.com','JbE0qSKrDZI','9999','asdfadfasdfsadf','2015-06-19 18:22:33',NULL),
	(60,'rjlagrimas08@gmail.com','rjlagrimas08@gmail.com','JbE0qSKrDZI','9999','asdfasdf','2015-06-19 18:23:45',NULL),
	(61,'rjlagrimas08@gmail.com','rjlagrimas08@gmail.com','JbE0qSKrDZI','9999','asdfasdf','2015-06-19 18:26:42',NULL),
	(62,'noy1834@gmail.com','NoYoC','12321','gamers_articles','test','2015-06-29 14:20:51',NULL),
	(63,'noy1834@gmail.com','NoYoC','12321','gamers_articles','test','2015-06-29 14:20:52',NULL),
	(64,'noy1834@gmail.com','NoYoC','12321','gamers_articles','tt','2015-06-29 14:20:56',NULL),
	(65,'noy1834@gmail.com','NoYoC','12321','gamers_articles','tttt','2015-06-29 14:21:04',NULL),
	(66,'noy1834@gmail.com','NoYoC','12321','gamers_articles','tttt','2015-06-29 14:21:06',NULL),
	(67,'adin@any.tv','adin@any.tv','1','gamers_articles','wew','2015-07-01 20:35:29',NULL),
	(68,'adinbautista@gmail.com','adinbautista@gmail.com','9sXTpyuUKf4','gamers_video','test','2015-07-02 14:44:34',NULL),
	(69,'wilbert@any.tv','wilbert@any.tv','lipsum','gamers_articles','aa','2015-07-08 16:21:33',NULL),
	(70,'jekri.orlina@any.tv','jekri.orlina@any.tv','12321','gamers_articles','Test. Test. 1. 2. 3.','2015-07-13 18:00:47',NULL),
	(71,'jekri.orlina@any.tv','jekri.orlina@any.tv','12321','gamers_articles',' ','2015-07-13 18:00:58',NULL),
	(72,'jekri.orlina@any.tv','jekri.orlina@any.tv','12321','gamers_articles','       ','2015-07-13 18:01:03',NULL),
	(73,'jekri.orlina@any.tv','jekri.orlina@any.tv','12321','gamers_articles',' test test 1 2 3','2015-07-13 18:10:19',NULL),
	(74,'jekri.orlina@any.tv','jekri.orlina@any.tv','12321','gamers_articles','<strong> As a thousand men </strong>','2015-07-13 18:10:29',NULL),
	(75,'jekri.orlina@any.tv','jekri.orlina@any.tv','12321','gamers_articles','<button class=\"btn-action> HELLO </button>','2015-07-13 18:11:54',NULL),
	(76,'jekri.orlina@any.tv','jekri.orlina@any.tv','12321','gamers_articles','<a href=\"www.youtube.com\">Click here for 1 million dollars!</a>','2015-07-13 18:12:20',NULL),
	(77,'jekri.orlina@any.tv','jekri.orlina@any.tv','1','gamers_articles','<script> while(1===1) { console.log(\"Destroyed.\"); }','2015-07-13 18:13:54',NULL),
	(78,'jekri.orlina@any.tv','jekri.orlina@any.tv','1','gamers_articles','<script> while(1===1) { console.log(\"Destroyed.\"); }','2015-07-13 18:13:58',NULL),
	(79,'jekri.orlina@any.tv','jekri.orlina@any.tv','1','gamers_articles','<script> while(1===1) { console.log(\"Destroyed.\"); }','2015-07-13 18:14:00',NULL),
	(80,'jekri.orlina@any.tv','jekri.orlina@any.tv','1','gamers_articles','<script> while(1===1) { console.log(\"Destroyed.\"); } </script>','2015-07-13 18:14:13',NULL),
	(81,'jekri.orlina@any.tv','jekri.orlina@any.tv','1','gamers_articles','<strong> As a thousand men. </strong>','2015-07-13 18:15:05',NULL),
	(82,'jekri.orlina@any.tv','jekri.orlina@any.tv','1','gamers_articles','<italic> HELLO ITALIC </italic>','2015-07-13 18:15:33',NULL),
	(83,'jekri.orlina@any.tv','jekri.orlina@any.tv','1','gamers_articles','<span class=\"span6\"> <p> YO </p> </span>','2015-07-13 18:15:55',NULL),
	(84,'jekri.orlina@any.tv','jekri.orlina@any.tv','1','gamers_articles','    ','2015-07-13 18:16:19',NULL),
	(85,'noy1834@gmail.com','NoYoC','1','gamers_articles','test','2015-07-14 10:49:42',NULL),
	(86,'jcepeda@any.tv','jcepeda@any.tv','999','gamers_articles','Nice Cake!','2015-07-14 17:51:23',NULL),
	(87,'jcepeda@any.tv','jcepeda@any.tv','36','gamers_articles','wews','2015-07-24 18:28:13',NULL),
	(88,'wilbert@any.tv','wilbert@any.tv','fixB2UbsbN4','gamers_video','hallo\r\n','2015-07-27 17:13:43',NULL);

/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
