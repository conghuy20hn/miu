/*
SQLyog Ultimate v9.30 
MySQL - 5.5.5-10.1.28-MariaDB : Database - vas_dealer
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`vas_dealer` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;

USE `vas_dealer`;

/*Table structure for table `auth_assignment` */

DROP TABLE IF EXISTS `auth_assignment`;

CREATE TABLE `auth_assignment` (
  `item_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`item_name`,`user_id`),
  CONSTRAINT `auth_assignment_ibfk_1` FOREIGN KEY (`item_name`) REFERENCES `auth_item` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `auth_assignment` */

insert  into `auth_assignment`(`item_name`,`user_id`,`created_at`) values ('admin','1',1448951912),('admin','10',123123123),('admin','4',1448951912),('admin','5',NULL),('ArticleCategoryBackend','4',1452503585),('cp01','11',1549855258),('create-articles','4',1448951912),('create-categories','4',1448951912),('delete-all-articles','4',1448951912),('delete-categories','4',1448951912),('editor','4',1448951912),('index-all-articles','4',1448951912),('index-categories','4',1448951912),('publish-all-articles','4',1448951912),('publish-categories','4',1448951912),('publisher','4',1448951912),('update-all-articles','4',1448951912),('update-categories','4',1448951912),('view-articles','4',1448951913),('view-categories','4',1448951913);

/*Table structure for table `auth_item` */

DROP TABLE IF EXISTS `auth_item`;

CREATE TABLE `auth_item` (
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `type` int(11) NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `rule_name` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `data` text COLLATE utf8_unicode_ci,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`name`),
  KEY `rule_name` (`rule_name`),
  KEY `idx-auth_item-type` (`type`),
  CONSTRAINT `auth_item_ibfk_1` FOREIGN KEY (`rule_name`) REFERENCES `auth_rule` (`name`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `auth_item` */

insert  into `auth_item`(`name`,`type`,`description`,`rule_name`,`data`,`created_at`,`updated_at`) values ('/*',2,NULL,NULL,NULL,1458121556,1458121556),('/admin/*',2,NULL,NULL,NULL,1448951861,1448951861),('/admin/assignment/*',2,NULL,NULL,NULL,1448951859,1448951859),('/admin/assignment/assign',2,NULL,NULL,NULL,1448951859,1448951859),('/admin/assignment/index',2,NULL,NULL,NULL,1448951859,1448951859),('/admin/assignment/search',2,NULL,NULL,NULL,1448951859,1448951859),('/admin/assignment/view',2,NULL,NULL,NULL,1448951859,1448951859),('/admin/default/*',2,NULL,NULL,NULL,1448951859,1448951859),('/admin/default/index',2,NULL,NULL,NULL,1448951859,1448951859),('/admin/filemanager/*',2,'filemanager',NULL,NULL,NULL,NULL),('/admin/menu/*',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/menu/create',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/menu/delete',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/menu/index',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/menu/update',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/menu/view',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/permission/*',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/permission/assign',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/permission/create',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/permission/delete',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/permission/index',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/permission/search',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/permission/update',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/permission/view',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/role/*',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/role/assign',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/role/create',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/role/delete',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/role/index',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/role/search',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/role/update',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/role/view',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/route/*',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/route/assign',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/route/create',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/route/index',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/route/search',2,NULL,NULL,NULL,1448951860,1448951860),('/admin/rule/*',2,NULL,NULL,NULL,1448951861,1448951861),('/admin/rule/create',2,NULL,NULL,NULL,1448951861,1448951861),('/admin/rule/delete',2,NULL,NULL,NULL,1448951861,1448951861),('/admin/rule/index',2,NULL,NULL,NULL,1448951861,1448951861),('/admin/rule/update',2,NULL,NULL,NULL,1448951861,1448951861),('/admin/rule/view',2,NULL,NULL,NULL,1448951861,1448951861),('/api-client/*',2,NULL,NULL,NULL,1451312407,1451312407),('/api-client/create',2,NULL,NULL,NULL,1451312407,1451312407),('/api-client/delete',2,NULL,NULL,NULL,1451312407,1451312407),('/api-client/galleryApi',2,NULL,NULL,NULL,1458120927,1458120927),('/api-client/index',2,NULL,NULL,NULL,1451312407,1451312407),('/api-client/update',2,NULL,NULL,NULL,1451312407,1451312407),('/api-client/view',2,NULL,NULL,NULL,1451312407,1451312407),('/app/*',2,NULL,NULL,NULL,1448951861,1448951861),('/app/galleryApi',2,NULL,NULL,NULL,1451312407,1451312407),('/articles/*',2,NULL,NULL,NULL,1456715090,1456715090),('/articles/attachments/*',2,NULL,NULL,NULL,1456715089,1456715089),('/articles/attachments/create',2,NULL,NULL,NULL,1456715089,1456715089),('/articles/attachments/delete',2,NULL,NULL,NULL,1456715089,1456715089),('/articles/attachments/index',2,NULL,NULL,NULL,1456715088,1456715088),('/articles/attachments/update',2,NULL,NULL,NULL,1456715089,1456715089),('/articles/attachments/view',2,NULL,NULL,NULL,1456715089,1456715089),('/articles/categories/*',2,NULL,NULL,NULL,1456715089,1456715089),('/articles/categories/create',2,NULL,NULL,NULL,1456715089,1456715089),('/articles/categories/delete',2,NULL,NULL,NULL,1456715089,1456715089),('/articles/categories/deleteimage',2,NULL,NULL,NULL,1456715089,1456715089),('/articles/categories/index',2,NULL,NULL,NULL,1456715089,1456715089),('/articles/categories/update',2,NULL,NULL,NULL,1456715089,1456715089),('/articles/categories/view',2,NULL,NULL,NULL,1456715089,1456715089),('/articles/default/*',2,NULL,NULL,NULL,1456715089,1456715089),('/articles/default/index',2,NULL,NULL,NULL,1456715089,1456715089),('/articles/items/*',2,NULL,NULL,NULL,1456715090,1456715090),('/articles/items/create',2,NULL,NULL,NULL,1456715089,1456715089),('/articles/items/delete',2,NULL,NULL,NULL,1456715089,1456715089),('/articles/items/deleteimage',2,NULL,NULL,NULL,1456715089,1456715089),('/articles/items/index',2,NULL,NULL,NULL,1456715089,1456715089),('/articles/items/update',2,NULL,NULL,NULL,1456715089,1456715089),('/articles/items/view',2,NULL,NULL,NULL,1456715089,1456715089),('/banner-item/*',2,NULL,NULL,NULL,1449060312,1449060312),('/banner-item/create',2,NULL,NULL,NULL,1449060311,1449060311),('/banner-item/delete',2,NULL,NULL,NULL,1449060312,1449060312),('/banner-item/index',2,NULL,NULL,NULL,1449060311,1449060311),('/banner-item/s-upload',2,NULL,NULL,NULL,1449060311,1449060311),('/banner-item/update',2,NULL,NULL,NULL,1449060312,1449060312),('/banner-item/view',2,NULL,NULL,NULL,1449060311,1449060311),('/banner/*',2,NULL,NULL,NULL,1449060311,1449060311),('/banner/create',2,NULL,NULL,NULL,1449060311,1449060311),('/banner/delete',2,NULL,NULL,NULL,1449060311,1449060311),('/banner/index',2,NULL,NULL,NULL,1449060311,1449060311),('/banner/update',2,NULL,NULL,NULL,1449060311,1449060311),('/banner/view',2,NULL,NULL,NULL,1449060311,1449060311),('/classified-ad-ban-email/*',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-ad-ban-email/create',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-ad-ban-email/delete',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-ad-ban-email/index',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-ad-ban-email/update',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-ad-ban-email/view',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-ad-ban-ip/*',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-ad-ban-ip/create',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-ad-ban-ip/delete',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-ad-ban-ip/index',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-ad-ban-ip/update',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-ad-ban-ip/view',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-ad-pic/*',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-pic/create',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-pic/delete',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-pic/index',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-ad-pic/update',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-pic/view',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-ad-tag/create',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-tag/delete',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-tag/index',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-tag/update',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-tag/view',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-type/*',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-type/create',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-type/delete',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-type/index',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-type/update',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-type/view',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-valid/*',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-valid/create',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-valid/delete',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-valid/index',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-valid/update',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad-valid/view',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-ad/*',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-ad/create',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-ad/delete',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-ad/index',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-ad/update',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-ad/view',2,NULL,NULL,NULL,1449636105,1449636105),('/classified-category/*',2,NULL,NULL,NULL,1449636107,1449636107),('/classified-category/create',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-category/delete',2,NULL,NULL,NULL,1449636107,1449636107),('/classified-category/index',2,NULL,NULL,NULL,1449636106,1449636106),('/classified-category/update',2,NULL,NULL,NULL,1449636107,1449636107),('/classified-category/view',2,NULL,NULL,NULL,1449636106,1449636106),('/debug/*',2,NULL,NULL,NULL,1448951861,1448951861),('/debug/default/*',2,NULL,NULL,NULL,1448951861,1448951861),('/debug/default/download-mail',2,NULL,NULL,NULL,1448951861,1448951861),('/debug/default/index',2,NULL,NULL,NULL,1448951861,1448951861),('/debug/default/toolbar',2,NULL,NULL,NULL,1448951861,1448951861),('/debug/default/view',2,NULL,NULL,NULL,1448951861,1448951861),('/dl-dealer',2,NULL,NULL,NULL,1549945186,1549945186),('/dl-report',2,NULL,NULL,NULL,1549945055,1549945055),('/dl-service',2,NULL,NULL,NULL,1549945463,1549945463),('/dl-spam-sms',2,NULL,NULL,NULL,1549945683,1549945683),('/gii/*',2,NULL,NULL,NULL,1448951861,1448951861),('/gii/default/*',2,NULL,NULL,NULL,1448951861,1448951861),('/gii/default/action',2,NULL,NULL,NULL,1448951861,1448951861),('/gii/default/diff',2,NULL,NULL,NULL,1448951861,1448951861),('/gii/default/index',2,NULL,NULL,NULL,1448951861,1448951861),('/gii/default/preview',2,NULL,NULL,NULL,1448951861,1448951861),('/gii/default/view',2,NULL,NULL,NULL,1448951861,1448951861),('/gridview/*',2,NULL,NULL,NULL,1448951859,1448951859),('/gridview/export/*',2,NULL,NULL,NULL,1448951859,1448951859),('/gridview/export/download',2,NULL,NULL,NULL,1448951859,1448951859),('/huync2/check',2,NULL,NULL,NULL,1545926113,1545926113),('/hydrometeorology/*',2,NULL,NULL,NULL,1458120927,1458120927),('/hydrometeorology/create',2,NULL,NULL,NULL,1452505575,1452505575),('/hydrometeorology/delete',2,NULL,NULL,NULL,1458120927,1458120927),('/hydrometeorology/galleryApi',2,NULL,NULL,NULL,1458120927,1458120927),('/hydrometeorology/importtide',2,NULL,NULL,NULL,1451871583,1451871583),('/hydrometeorology/index',2,NULL,NULL,NULL,1452505497,1452505497),('/hydrometeorology/update',2,NULL,NULL,NULL,1452505583,1452505583),('/hydrometeorology/view',2,NULL,NULL,NULL,1458120927,1458120927),('/location/*',2,NULL,NULL,NULL,1449636107,1449636107),('/location/create',2,NULL,NULL,NULL,1449636107,1449636107),('/location/delete',2,NULL,NULL,NULL,1449636107,1449636107),('/location/galleryApi',2,NULL,NULL,NULL,1458120927,1458120927),('/location/index',2,NULL,NULL,NULL,1449636107,1449636107),('/location/update',2,NULL,NULL,NULL,1449636107,1449636107),('/location/view',2,NULL,NULL,NULL,1449636107,1449636107),('/markdown/*',2,NULL,NULL,NULL,1448951859,1448951859),('/markdown/parse/*',2,NULL,NULL,NULL,1448951859,1448951859),('/markdown/parse/download',2,NULL,NULL,NULL,1448951859,1448951859),('/markdown/parse/preview',2,NULL,NULL,NULL,1448951859,1448951859),('/member/*',2,NULL,NULL,NULL,1449060312,1449060312),('/member/create',2,NULL,NULL,NULL,1449060312,1449060312),('/member/delete',2,NULL,NULL,NULL,1449060312,1449060312),('/member/index',2,NULL,NULL,NULL,1449060312,1449060312),('/member/update',2,NULL,NULL,NULL,1449060312,1449060312),('/member/view',2,NULL,NULL,NULL,1449060312,1449060312),('/menu/*',2,NULL,NULL,NULL,1449022964,1449022964),('/menu/create',2,NULL,NULL,NULL,1449022964,1449022964),('/menu/delete',2,NULL,NULL,NULL,1449022964,1449022964),('/menu/galleryApi',2,NULL,NULL,NULL,1451312408,1451312408),('/menu/index',2,NULL,NULL,NULL,1449022964,1449022964),('/menu/s-upload',2,NULL,NULL,NULL,1449060312,1449060312),('/menu/update',2,NULL,NULL,NULL,1449022964,1449022964),('/menu/view',2,NULL,NULL,NULL,1449022964,1449022964),('/product-attribute-options/*',2,NULL,NULL,NULL,1449744832,1449744832),('/product-attribute-options/create',2,NULL,NULL,NULL,1449744832,1449744832),('/product-attribute-options/delete',2,NULL,NULL,NULL,1449744832,1449744832),('/product-attribute-options/galleryApi',2,NULL,NULL,NULL,1458120927,1458120927),('/product-attribute-options/index',2,NULL,NULL,NULL,1449744832,1449744832),('/product-attribute-options/update',2,NULL,NULL,NULL,1449744832,1449744832),('/product-attribute-options/view',2,NULL,NULL,NULL,1449744832,1449744832),('/product-attributes/*',2,NULL,NULL,NULL,1449744833,1449744833),('/product-attributes/create',2,NULL,NULL,NULL,1449744833,1449744833),('/product-attributes/delete',2,NULL,NULL,NULL,1449744833,1449744833),('/product-attributes/galleryApi',2,NULL,NULL,NULL,1458120927,1458120927),('/product-attributes/index',2,NULL,NULL,NULL,1449744832,1449744832),('/product-attributes/update',2,NULL,NULL,NULL,1449744833,1449744833),('/product-attributes/view',2,NULL,NULL,NULL,1449744832,1449744832),('/product-cat-user-attribute/*',2,NULL,NULL,NULL,1458120928,1458120928),('/product-cat-user-attribute/create',2,NULL,NULL,NULL,1453362501,1453362501),('/product-cat-user-attribute/delete',2,NULL,NULL,NULL,1453362517,1453362517),('/product-cat-user-attribute/galleryApi',2,NULL,NULL,NULL,1458120928,1458120928),('/product-cat-user-attribute/index',2,NULL,NULL,NULL,1453362796,1453362796),('/product-cat-user-attribute/move-first',2,NULL,NULL,NULL,1458120928,1458120928),('/product-cat-user-attribute/move-last',2,NULL,NULL,NULL,1458120928,1458120928),('/product-cat-user-attribute/move-next',2,NULL,NULL,NULL,1458120928,1458120928),('/product-cat-user-attribute/move-prev',2,NULL,NULL,NULL,1458120928,1458120928),('/product-cat-user-attribute/update',2,NULL,NULL,NULL,1453362509,1453362509),('/product-cat-user-attribute/view',2,NULL,NULL,NULL,1458120928,1458120928),('/product-cat-user/*',2,NULL,NULL,NULL,1458120928,1458120928),('/product-cat-user/create',2,NULL,NULL,NULL,1453362462,1453362462),('/product-cat-user/delete',2,NULL,NULL,NULL,1453362480,1453362480),('/product-cat-user/galleryApi',2,NULL,NULL,NULL,1458120928,1458120928),('/product-cat-user/index',2,NULL,NULL,NULL,1453362785,1453362785),('/product-cat-user/update',2,NULL,NULL,NULL,1453362471,1453362471),('/product-cat-user/view',2,NULL,NULL,NULL,1458120928,1458120928),('/product-categories/*',2,NULL,NULL,NULL,1449744833,1449744833),('/product-categories/create',2,NULL,NULL,NULL,1449744833,1449744833),('/product-categories/delete',2,NULL,NULL,NULL,1449744833,1449744833),('/product-categories/galleryApi',2,NULL,NULL,NULL,1458120928,1458120928),('/product-categories/index',2,NULL,NULL,NULL,1449744833,1449744833),('/product-categories/move-first',2,NULL,NULL,NULL,1458120928,1458120928),('/product-categories/move-last',2,NULL,NULL,NULL,1458120928,1458120928),('/product-categories/move-next',2,NULL,NULL,NULL,1458120928,1458120928),('/product-categories/move-prev',2,NULL,NULL,NULL,1458120928,1458120928),('/product-categories/type',2,NULL,NULL,NULL,1458120928,1458120928),('/product-categories/update',2,NULL,NULL,NULL,1449744833,1449744833),('/product-categories/view',2,NULL,NULL,NULL,1449744833,1449744833),('/product-item-attributes/*',2,NULL,NULL,NULL,1449744833,1449744833),('/product-item-attributes/create',2,NULL,NULL,NULL,1449744833,1449744833),('/product-item-attributes/delete',2,NULL,NULL,NULL,1449744833,1449744833),('/product-item-attributes/galleryApi',2,NULL,NULL,NULL,1458120928,1458120928),('/product-item-attributes/index',2,NULL,NULL,NULL,1449744833,1449744833),('/product-item-attributes/update',2,NULL,NULL,NULL,1449744833,1449744833),('/product-item-attributes/view',2,NULL,NULL,NULL,1449744833,1449744833),('/product-item-pricelist/*',2,NULL,NULL,NULL,1449744833,1449744833),('/product-item-pricelist/create',2,NULL,NULL,NULL,1449744833,1449744833),('/product-item-pricelist/delete',2,NULL,NULL,NULL,1449744833,1449744833),('/product-item-pricelist/exportprice',2,NULL,NULL,NULL,1458120928,1458120928),('/product-item-pricelist/galleryApi',2,NULL,NULL,NULL,1458120928,1458120928),('/product-item-pricelist/importprice',2,NULL,NULL,NULL,1451871660,1451871660),('/product-item-pricelist/index',2,NULL,NULL,NULL,1449744833,1449744833),('/product-item-pricelist/update',2,NULL,NULL,NULL,1449744833,1449744833),('/product-item-pricelist/view',2,NULL,NULL,NULL,1449744833,1449744833),('/product-item-user-attribute/*',2,NULL,NULL,NULL,1449744834,1449744834),('/product-item-user-attribute/create',2,NULL,NULL,NULL,1449744833,1449744833),('/product-item-user-attribute/delete',2,NULL,NULL,NULL,1449744834,1449744834),('/product-item-user-attribute/galleryApi',2,NULL,NULL,NULL,1458120928,1458120928),('/product-item-user-attribute/index',2,NULL,NULL,NULL,1449744833,1449744833),('/product-item-user-attribute/move-first',2,NULL,NULL,NULL,1458120928,1458120928),('/product-item-user-attribute/move-last',2,NULL,NULL,NULL,1458120928,1458120928),('/product-item-user-attribute/move-next',2,NULL,NULL,NULL,1458120928,1458120928),('/product-item-user-attribute/move-prev',2,NULL,NULL,NULL,1458120928,1458120928),('/product-item-user-attribute/update',2,NULL,NULL,NULL,1449744833,1449744833),('/product-item-user-attribute/view',2,NULL,NULL,NULL,1449744833,1449744833),('/product-item-user/*',2,NULL,NULL,NULL,1449744834,1449744834),('/product-item-user/create',2,NULL,NULL,NULL,1449744834,1449744834),('/product-item-user/delete',2,NULL,NULL,NULL,1449744834,1449744834),('/product-item-user/galleryApi',2,NULL,NULL,NULL,1458120928,1458120928),('/product-item-user/index',2,NULL,NULL,NULL,1449744834,1449744834),('/product-item-user/update',2,NULL,NULL,NULL,1449744834,1449744834),('/product-item-user/view',2,NULL,NULL,NULL,1449744834,1449744834),('/product-items/*',2,NULL,NULL,NULL,1449744834,1449744834),('/product-items/create',2,NULL,NULL,NULL,1449744834,1449744834),('/product-items/delete',2,NULL,NULL,NULL,1449744834,1449744834),('/product-items/galleryApi',2,NULL,NULL,NULL,1451312408,1451312408),('/product-items/index',2,NULL,NULL,NULL,1449744834,1449744834),('/product-items/update',2,NULL,NULL,NULL,1449744834,1449744834),('/product-items/view',2,NULL,NULL,NULL,1449744834,1449744834),('/product-price-unit/*',2,NULL,NULL,NULL,1458120928,1458120928),('/product-price-unit/create',2,NULL,NULL,NULL,1453362549,1453362549),('/product-price-unit/delete',2,NULL,NULL,NULL,1453362561,1453362561),('/product-price-unit/galleryApi',2,NULL,NULL,NULL,1458120928,1458120928),('/product-price-unit/index',2,NULL,NULL,NULL,1453362533,1453362533),('/product-price-unit/update',2,NULL,NULL,NULL,1453362556,1453362556),('/product-price-unit/view',2,NULL,NULL,NULL,1458120928,1458120928),('/rank/*',2,NULL,NULL,NULL,1449060312,1449060312),('/rank/create',2,NULL,NULL,NULL,1449060312,1449060312),('/rank/delete',2,NULL,NULL,NULL,1449060312,1449060312),('/rank/index',2,NULL,NULL,NULL,1449060312,1449060312),('/rank/update',2,NULL,NULL,NULL,1449060312,1449060312),('/rank/view',2,NULL,NULL,NULL,1449060312,1449060312),('/site/*',2,NULL,NULL,NULL,1448951861,1448951861),('/site/captcha',2,NULL,NULL,NULL,1448951861,1448951861),('/site/error',2,NULL,NULL,NULL,1448951861,1448951861),('/site/index',2,NULL,NULL,NULL,1448951861,1448951861),('/site/login',2,NULL,NULL,NULL,1448951861,1448951861),('/site/logout',2,NULL,NULL,NULL,1448951861,1448951861),('/upload/*',2,NULL,NULL,NULL,1449636107,1449636107),('/upload/video-upload',2,NULL,NULL,NULL,1449636107,1449636107),('/user/*',2,NULL,NULL,NULL,1448951862,1448951862),('/user/create',2,NULL,NULL,NULL,1448951862,1448951862),('/user/delete',2,NULL,NULL,NULL,1448951862,1448951862),('/user/galleryApi',2,NULL,NULL,NULL,1451312408,1451312408),('/user/index',2,NULL,NULL,NULL,1448951861,1448951861),('/user/update',2,NULL,NULL,NULL,1448951862,1448951862),('/user/view',2,NULL,NULL,NULL,1448951861,1448951861),('/video-category/*',2,NULL,NULL,NULL,1449636107,1449636107),('/video-category/create',2,NULL,NULL,NULL,1449636107,1449636107),('/video-category/delete',2,NULL,NULL,NULL,1449636107,1449636107),('/video-category/galleryApi',2,NULL,NULL,NULL,1458120928,1458120928),('/video-category/index',2,NULL,NULL,NULL,1449636107,1449636107),('/video-category/move-first',2,NULL,NULL,NULL,1458120929,1458120929),('/video-category/move-last',2,NULL,NULL,NULL,1458120929,1458120929),('/video-category/move-next',2,NULL,NULL,NULL,1458120929,1458120929),('/video-category/move-prev',2,NULL,NULL,NULL,1458120929,1458120929),('/video-category/update',2,NULL,NULL,NULL,1449636107,1449636107),('/video-category/view',2,NULL,NULL,NULL,1449636107,1449636107),('/video/*',2,NULL,NULL,NULL,1449636108,1449636108),('/video/create',2,NULL,NULL,NULL,1449636107,1449636107),('/video/delete',2,NULL,NULL,NULL,1449636107,1449636107),('/video/index',2,NULL,NULL,NULL,1449636107,1449636107),('/video/move-first',2,NULL,NULL,NULL,1458120929,1458120929),('/video/move-last',2,NULL,NULL,NULL,1458120929,1458120929),('/video/move-next',2,NULL,NULL,NULL,1458120929,1458120929),('/video/move-prev',2,NULL,NULL,NULL,1458120929,1458120929),('/video/s-upload',2,NULL,NULL,NULL,1451312408,1451312408),('/video/update',2,NULL,NULL,NULL,1449636107,1449636107),('/video/upload',2,NULL,NULL,NULL,1449636107,1449636107),('/video/view',2,NULL,NULL,NULL,1449636107,1449636107),('/vt-article-categories/*',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-categories/create',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-categories/delete',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-categories/galleryApi',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-categories/index',2,NULL,NULL,NULL,1452505749,1452505749),('/vt-article-categories/move-first',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-categories/move-last',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-categories/move-next',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-categories/move-prev',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-categories/update',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-categories/view',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-items/*',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-items/create',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-items/delete',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-items/galleryApiArticle',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-items/index',2,NULL,NULL,NULL,1452505782,1452505782),('/vt-article-items/move-first',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-items/move-last',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-items/move-next',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-items/move-prev',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-items/s-upload',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-items/update',2,NULL,NULL,NULL,1458120929,1458120929),('/vt-article-items/view',2,NULL,NULL,NULL,1458120929,1458120929),('admin',1,'Can create, publish all, update all, delete all, view and admin grid articles',NULL,NULL,1448943583,1448943583),('ArticleCategoryBackend',2,'ArticleCategoryBackend',NULL,NULL,NULL,NULL),('author',1,'Can create and update his articles and view',NULL,NULL,1448943583,1549854200),('cp01',2,'cp01',NULL,NULL,1549854945,1549854945),('create-articles',1,'Can create articles',NULL,NULL,1448943583,1448943583),('create-categories',1,'Can create categories',NULL,NULL,1448943583,1448943583),('delete-all-articles',1,'Can delete all articles',NULL,NULL,1448943583,1448943583),('delete-categories',1,'Can delete all categories',NULL,NULL,1448943583,1448943583),('delete-his-articles',1,'Can delete his articles',NULL,NULL,1448943583,1448943583),('editor',1,'Can create, publish all articles, update all articles, delete his articles, view and admin grid articles',NULL,NULL,1448943583,1448943583),('icafis',2,'icafis',NULL,NULL,1453399831,1549854394),('index-all-articles',1,'Can view all articles admin grid',NULL,NULL,1448943583,1448943583),('index-categories',1,'Can view categories admin grid',NULL,NULL,1448943583,1448943583),('index-his-articles',1,'Can view his articles admin grid',NULL,NULL,1448943583,1448943583),('publish-all-articles',1,'Can publish all articles',NULL,NULL,1448943583,1448943583),('publish-categories',1,'Can publish categories',NULL,NULL,1448943583,1448943583),('publish-his-articles',1,'Can publish his articles',NULL,NULL,1448943583,1448943583),('publisher',1,'Can create, publish his articles, update all articles, view and admin grid his articles',NULL,NULL,1448943583,1448943583),('update-all-articles',1,'Can update all articles',NULL,NULL,1448943583,1448943583),('update-categories',1,'Can update all categories',NULL,NULL,1448943583,1448943583),('update-his-articles',1,'Can update his articles',NULL,NULL,1448943583,1448943583),('view-articles',1,'Can view articles',NULL,NULL,1448943583,1448943583),('view-categories',1,'Can view categories',NULL,NULL,1448943583,1448943583);

/*Table structure for table `auth_item_child` */

DROP TABLE IF EXISTS `auth_item_child`;

CREATE TABLE `auth_item_child` (
  `parent` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `child` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`parent`,`child`),
  KEY `child` (`child`),
  CONSTRAINT `auth_item_child_ibfk_1` FOREIGN KEY (`parent`) REFERENCES `auth_item` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `auth_item_child_ibfk_2` FOREIGN KEY (`child`) REFERENCES `auth_item` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `auth_item_child` */

insert  into `auth_item_child`(`parent`,`child`) values ('admin','/*'),('admin','/admin/*'),('admin','/admin/assignment/*'),('admin','/admin/assignment/assign'),('admin','/admin/assignment/index'),('admin','/admin/assignment/search'),('admin','/admin/assignment/view'),('admin','/admin/default/*'),('admin','/admin/default/index'),('admin','/admin/filemanager/*'),('admin','/admin/menu/*'),('admin','/admin/menu/create'),('admin','/admin/menu/delete'),('admin','/admin/menu/index'),('admin','/admin/menu/update'),('admin','/admin/menu/view'),('admin','/admin/permission/*'),('admin','/admin/permission/assign'),('admin','/admin/permission/create'),('admin','/admin/permission/delete'),('admin','/admin/permission/index'),('admin','/admin/permission/search'),('admin','/admin/permission/update'),('admin','/admin/permission/view'),('admin','/admin/role/*'),('admin','/admin/role/assign'),('admin','/admin/role/create'),('admin','/admin/role/delete'),('admin','/admin/role/index'),('admin','/admin/role/search'),('admin','/admin/role/update'),('admin','/admin/role/view'),('admin','/admin/route/*'),('admin','/admin/route/assign'),('admin','/admin/route/create'),('admin','/admin/route/index'),('admin','/admin/route/search'),('admin','/admin/rule/*'),('admin','/admin/rule/create'),('admin','/admin/rule/delete'),('admin','/admin/rule/index'),('admin','/admin/rule/update'),('admin','/admin/rule/view'),('admin','/api-client/*'),('admin','/api-client/create'),('admin','/api-client/delete'),('admin','/api-client/galleryApi'),('admin','/api-client/index'),('admin','/api-client/update'),('admin','/api-client/view'),('admin','/app/*'),('admin','/app/galleryApi'),('admin','/articles/*'),('admin','/articles/attachments/*'),('admin','/articles/attachments/create'),('admin','/articles/attachments/delete'),('admin','/articles/attachments/index'),('admin','/articles/attachments/update'),('admin','/articles/attachments/view'),('admin','/articles/categories/*'),('admin','/articles/categories/create'),('admin','/articles/categories/delete'),('admin','/articles/categories/deleteimage'),('admin','/articles/categories/index'),('admin','/articles/categories/update'),('admin','/articles/categories/view'),('admin','/articles/default/*'),('admin','/articles/default/index'),('admin','/articles/items/*'),('admin','/articles/items/create'),('admin','/articles/items/delete'),('admin','/articles/items/deleteimage'),('admin','/articles/items/index'),('admin','/articles/items/update'),('admin','/articles/items/view'),('admin','/banner-item/*'),('admin','/banner-item/create'),('admin','/banner-item/delete'),('admin','/banner-item/index'),('admin','/banner-item/s-upload'),('admin','/banner-item/update'),('admin','/banner-item/view'),('admin','/banner/*'),('admin','/banner/create'),('admin','/banner/delete'),('admin','/banner/index'),('admin','/banner/update'),('admin','/banner/view'),('admin','/classified-ad-ban-email/*'),('admin','/classified-ad-ban-email/create'),('admin','/classified-ad-ban-email/delete'),('admin','/classified-ad-ban-email/index'),('admin','/classified-ad-ban-email/update'),('admin','/classified-ad-ban-email/view'),('admin','/classified-ad-ban-ip/*'),('admin','/classified-ad-ban-ip/create'),('admin','/classified-ad-ban-ip/delete'),('admin','/classified-ad-ban-ip/index'),('admin','/classified-ad-ban-ip/update'),('admin','/classified-ad-ban-ip/view'),('admin','/classified-ad-pic/*'),('admin','/classified-ad-pic/create'),('admin','/classified-ad-pic/delete'),('admin','/classified-ad-pic/index'),('admin','/classified-ad-pic/update'),('admin','/classified-ad-pic/view'),('admin','/classified-ad-tag/create'),('admin','/classified-ad-tag/delete'),('admin','/classified-ad-tag/index'),('admin','/classified-ad-tag/update'),('admin','/classified-ad-tag/view'),('admin','/classified-ad-type/*'),('admin','/classified-ad-type/create'),('admin','/classified-ad-type/delete'),('admin','/classified-ad-type/index'),('admin','/classified-ad-type/update'),('admin','/classified-ad-type/view'),('admin','/classified-ad-valid/*'),('admin','/classified-ad-valid/create'),('admin','/classified-ad-valid/delete'),('admin','/classified-ad-valid/index'),('admin','/classified-ad-valid/update'),('admin','/classified-ad-valid/view'),('admin','/classified-ad/*'),('admin','/classified-ad/create'),('admin','/classified-ad/delete'),('admin','/classified-ad/index'),('admin','/classified-ad/update'),('admin','/classified-ad/view'),('admin','/classified-category/*'),('admin','/classified-category/create'),('admin','/classified-category/delete'),('admin','/classified-category/index'),('admin','/classified-category/update'),('admin','/classified-category/view'),('admin','/debug/*'),('admin','/debug/default/*'),('admin','/debug/default/download-mail'),('admin','/debug/default/index'),('admin','/debug/default/toolbar'),('admin','/debug/default/view'),('admin','/gii/*'),('admin','/gii/default/*'),('admin','/gii/default/action'),('admin','/gii/default/diff'),('admin','/gii/default/index'),('admin','/gii/default/preview'),('admin','/gii/default/view'),('admin','/gridview/*'),('admin','/gridview/export/*'),('admin','/gridview/export/download'),('admin','/hydrometeorology/*'),('admin','/hydrometeorology/create'),('admin','/hydrometeorology/delete'),('admin','/hydrometeorology/galleryApi'),('admin','/hydrometeorology/importtide'),('admin','/hydrometeorology/index'),('admin','/hydrometeorology/update'),('admin','/hydrometeorology/view'),('admin','/location/*'),('admin','/location/create'),('admin','/location/delete'),('admin','/location/galleryApi'),('admin','/location/index'),('admin','/location/update'),('admin','/location/view'),('admin','/markdown/*'),('admin','/markdown/parse/*'),('admin','/markdown/parse/download'),('admin','/markdown/parse/preview'),('admin','/member/*'),('admin','/member/create'),('admin','/member/delete'),('admin','/member/index'),('admin','/member/update'),('admin','/member/view'),('admin','/menu/*'),('admin','/menu/create'),('admin','/menu/delete'),('admin','/menu/galleryApi'),('admin','/menu/index'),('admin','/menu/s-upload'),('admin','/menu/update'),('admin','/menu/view'),('admin','/product-attribute-options/*'),('admin','/product-attribute-options/create'),('admin','/product-attribute-options/delete'),('admin','/product-attribute-options/galleryApi'),('admin','/product-attribute-options/index'),('admin','/product-attribute-options/update'),('admin','/product-attribute-options/view'),('admin','/product-attributes/*'),('admin','/product-attributes/create'),('admin','/product-attributes/delete'),('admin','/product-attributes/galleryApi'),('admin','/product-attributes/index'),('admin','/product-attributes/update'),('admin','/product-attributes/view'),('admin','/product-cat-user-attribute/*'),('admin','/product-cat-user-attribute/create'),('admin','/product-cat-user-attribute/delete'),('admin','/product-cat-user-attribute/galleryApi'),('admin','/product-cat-user-attribute/index'),('admin','/product-cat-user-attribute/move-first'),('admin','/product-cat-user-attribute/move-last'),('admin','/product-cat-user-attribute/move-next'),('admin','/product-cat-user-attribute/move-prev'),('admin','/product-cat-user-attribute/update'),('admin','/product-cat-user-attribute/view'),('admin','/product-cat-user/*'),('admin','/product-cat-user/create'),('admin','/product-cat-user/delete'),('admin','/product-cat-user/galleryApi'),('admin','/product-cat-user/index'),('admin','/product-cat-user/update'),('admin','/product-cat-user/view'),('admin','/product-categories/*'),('admin','/product-categories/create'),('admin','/product-categories/delete'),('admin','/product-categories/galleryApi'),('admin','/product-categories/index'),('admin','/product-categories/move-first'),('admin','/product-categories/move-last'),('admin','/product-categories/move-next'),('admin','/product-categories/move-prev'),('admin','/product-categories/type'),('admin','/product-categories/update'),('admin','/product-categories/view'),('admin','/product-item-attributes/*'),('admin','/product-item-attributes/create'),('admin','/product-item-attributes/delete'),('admin','/product-item-attributes/galleryApi'),('admin','/product-item-attributes/index'),('admin','/product-item-attributes/update'),('admin','/product-item-attributes/view'),('admin','/product-item-pricelist/*'),('admin','/product-item-pricelist/create'),('admin','/product-item-pricelist/delete'),('admin','/product-item-pricelist/exportprice'),('admin','/product-item-pricelist/galleryApi'),('admin','/product-item-pricelist/importprice'),('admin','/product-item-pricelist/index'),('admin','/product-item-pricelist/update'),('admin','/product-item-pricelist/view'),('admin','/product-item-user-attribute/*'),('admin','/product-item-user-attribute/create'),('admin','/product-item-user-attribute/delete'),('admin','/product-item-user-attribute/galleryApi'),('admin','/product-item-user-attribute/index'),('admin','/product-item-user-attribute/move-first'),('admin','/product-item-user-attribute/move-last'),('admin','/product-item-user-attribute/move-next'),('admin','/product-item-user-attribute/move-prev'),('admin','/product-item-user-attribute/update'),('admin','/product-item-user-attribute/view'),('admin','/product-item-user/*'),('admin','/product-item-user/create'),('admin','/product-item-user/delete'),('admin','/product-item-user/galleryApi'),('admin','/product-item-user/index'),('admin','/product-item-user/update'),('admin','/product-item-user/view'),('admin','/product-items/*'),('admin','/product-items/create'),('admin','/product-items/delete'),('admin','/product-items/galleryApi'),('admin','/product-items/index'),('admin','/product-items/update'),('admin','/product-items/view'),('admin','/product-price-unit/*'),('admin','/product-price-unit/create'),('admin','/product-price-unit/delete'),('admin','/product-price-unit/galleryApi'),('admin','/product-price-unit/index'),('admin','/product-price-unit/update'),('admin','/product-price-unit/view'),('admin','/rank/*'),('admin','/rank/create'),('admin','/rank/delete'),('admin','/rank/index'),('admin','/rank/update'),('admin','/rank/view'),('admin','/site/*'),('admin','/site/captcha'),('admin','/site/error'),('admin','/site/index'),('admin','/site/login'),('admin','/site/logout'),('admin','/upload/*'),('admin','/upload/video-upload'),('admin','/user/*'),('admin','/user/create'),('admin','/user/delete'),('admin','/user/galleryApi'),('admin','/user/index'),('admin','/user/update'),('admin','/user/view'),('admin','/video-category/*'),('admin','/video-category/create'),('admin','/video-category/delete'),('admin','/video-category/galleryApi'),('admin','/video-category/index'),('admin','/video-category/move-first'),('admin','/video-category/move-last'),('admin','/video-category/move-next'),('admin','/video-category/move-prev'),('admin','/video-category/update'),('admin','/video-category/view'),('admin','/video/*'),('admin','/video/create'),('admin','/video/delete'),('admin','/video/index'),('admin','/video/move-first'),('admin','/video/move-last'),('admin','/video/move-next'),('admin','/video/move-prev'),('admin','/video/s-upload'),('admin','/video/update'),('admin','/video/upload'),('admin','/video/view'),('admin','/vt-article-categories/*'),('admin','/vt-article-categories/create'),('admin','/vt-article-categories/delete'),('admin','/vt-article-categories/galleryApi'),('admin','/vt-article-categories/index'),('admin','/vt-article-categories/move-first'),('admin','/vt-article-categories/move-last'),('admin','/vt-article-categories/move-next'),('admin','/vt-article-categories/move-prev'),('admin','/vt-article-categories/update'),('admin','/vt-article-categories/view'),('admin','/vt-article-items/*'),('admin','/vt-article-items/create'),('admin','/vt-article-items/delete'),('admin','/vt-article-items/galleryApiArticle'),('admin','/vt-article-items/index'),('admin','/vt-article-items/move-first'),('admin','/vt-article-items/move-last'),('admin','/vt-article-items/move-next'),('admin','/vt-article-items/move-prev'),('admin','/vt-article-items/s-upload'),('admin','/vt-article-items/update'),('admin','/vt-article-items/view'),('admin','ArticleCategoryBackend'),('admin','author'),('admin','create-articles'),('admin','create-categories'),('admin','delete-all-articles'),('admin','delete-categories'),('admin','editor'),('admin','icafis'),('admin','index-all-articles'),('admin','index-categories'),('admin','publish-all-articles'),('admin','publish-categories'),('admin','publisher'),('admin','update-all-articles'),('admin','update-categories'),('admin','view-articles'),('admin','view-categories'),('author','create-articles'),('author','index-his-articles'),('author','update-his-articles'),('author','view-articles'),('author','view-categories'),('cp01','/hydrometeorology/importtide'),('cp01','/hydrometeorology/index'),('cp01','/upload/video-upload'),('cp01','/video/*'),('cp01','/video/create'),('cp01','/video/delete'),('cp01','/video/index'),('cp01','/video/move-first'),('cp01','/video/move-last'),('cp01','/video/move-next'),('cp01','/video/move-prev'),('cp01','/video/s-upload'),('cp01','/video/update'),('cp01','/video/upload'),('cp01','/video/view'),('editor','create-articles'),('editor','create-categories'),('editor','delete-his-articles'),('editor','index-all-articles'),('editor','index-categories'),('editor','publish-all-articles'),('editor','update-all-articles'),('editor','update-categories'),('editor','view-articles'),('editor','view-categories'),('publisher','create-articles'),('publisher','index-his-articles'),('publisher','publish-his-articles'),('publisher','update-his-articles'),('publisher','view-articles'),('publisher','view-categories');

/*Table structure for table `auth_rule` */

DROP TABLE IF EXISTS `auth_rule`;

CREATE TABLE `auth_rule` (
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `data` text COLLATE utf8_unicode_ci,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `auth_rule` */

/*Table structure for table `dl_dealer` */

DROP TABLE IF EXISTS `dl_dealer`;

CREATE TABLE `dl_dealer` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `msisdn` varchar(25) NOT NULL,
  `email` varchar(255) NOT NULL,
  `dealer_id` bigint(20) NOT NULL,
  `master_id` bigint(20) NOT NULL,
  `status` bigint(20) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `dl_dealer` */

/*Table structure for table `dl_report` */

DROP TABLE IF EXISTS `dl_report`;

CREATE TABLE `dl_report` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `request_id` bigint(20) NOT NULL,
  `master_id` bigint(20) NOT NULL,
  `agent_id` varchar(255) NOT NULL,
  `transaction_id` bigint(20) NOT NULL,
  `timestamp` varchar(25) NOT NULL,
  `action` varchar(255) NOT NULL,
  `orginal_price` bigint(20) NOT NULL,
  `price` bigint(20) NOT NULL,
  `promotion` bigint(20) NOT NULL,
  `charge_count` bigint(20) NOT NULL,
  `resultcode` bigint(20) NOT NULL,
  `msisdn` varchar(25) NOT NULL,
  `product_code` varchar(255) NOT NULL,
  `channel` varchar(255) NOT NULL,
  `mo` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `dl_report` */

/*Table structure for table `dl_service` */

DROP TABLE IF EXISTS `dl_service`;

CREATE TABLE `dl_service` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sys_id` bigint(20) NOT NULL,
  `master_id` bigint(20) NOT NULL,
  `service_code` varchar(255) NOT NULL,
  `product_code` varchar(255) NOT NULL,
  `price` bigint(20) NOT NULL,
  `cycles` bigint(20) NOT NULL,
  `type` bigint(20) NOT NULL,
  `commission_type` bigint(20) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `dl_service` */

/*Table structure for table `dl_spam_sms` */

DROP TABLE IF EXISTS `dl_spam_sms`;

CREATE TABLE `dl_spam_sms` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `product_code` varchar(255) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `dealer_id` varchar(255) NOT NULL,
  `dealer_name` varchar(255) NOT NULL,
  `start_time` bigint(20) NOT NULL,
  `end_time` bigint(20) NOT NULL,
  `time_wait` bigint(20) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `status` bigint(20) NOT NULL,
  `list_msisdn_test` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `dl_spam_sms` */

/*Table structure for table `dl_spam_sms_msisdn` */

DROP TABLE IF EXISTS `dl_spam_sms_msisdn`;

CREATE TABLE `dl_spam_sms_msisdn` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `msisdn` varchar(25) NOT NULL,
  `spam_sms_id` bigint(20) NOT NULL,
  `transaction_id` bigint(20) NOT NULL,
  `have_commission` bigint(20) NOT NULL,
  `status` bigint(20) NOT NULL,
  `result` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `dl_spam_sms_msisdn` */

/*Table structure for table `menu` */

DROP TABLE IF EXISTS `menu`;

CREATE TABLE `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `parent` int(11) DEFAULT NULL,
  `route` varchar(256) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  `data` text,
  `icon` tinytext,
  `is_active` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `parent` (`parent`),
  KEY `index_name` (`name`),
  CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`parent`) REFERENCES `menu` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8;

/*Data for the table `menu` */

insert  into `menu`(`id`,`name`,`parent`,`route`,`order`,`data`,`icon`,`is_active`) values (1,'Administrator',NULL,NULL,1,NULL,'icon-user',1),(2,'Menu',1,'/menu/index',2,NULL,'icon-list',1),(33,'Quản lý User',1,'/user/index',NULL,NULL,'icon-user-female',1),(51,'Quản lý chuyên mục',NULL,NULL,3,NULL,'icon-folder-alt',1),(52,'Quản lý báo cáo',51,'/dl-report',NULL,NULL,'icon-user-female',1),(53,'Quản lý Dealer',51,'/dl-dealer',NULL,NULL,'icon-user-follow',1),(54,'Quản lý gói cước',51,'/dl-service',NULL,NULL,'icon-notebook',1),(55,'Cấu hình Spam SMS',NULL,'/dl-spam-sms',4,NULL,'icon-shield',1);

/*Table structure for table `migration` */

DROP TABLE IF EXISTS `migration`;

CREATE TABLE `migration` (
  `version` varchar(180) NOT NULL,
  `apply_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `migration` */

/*Table structure for table `tmp` */

DROP TABLE IF EXISTS `tmp`;

CREATE TABLE `tmp` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int(10) unsigned DEFAULT NULL,
  `level` int(10) unsigned DEFAULT NULL,
  `position` int(10) unsigned DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `tmp` */

insert  into `tmp`(`id`,`parent_id`,`level`,`position`,`name`) values (1,0,0,1,'A'),(2,1,1,1,'B'),(3,2,2,1,'B1'),(4,1,1,2,'C'),(5,2,2,2,'B2'),(6,5,3,1,'B21');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `auth_key` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password_reset_token` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `status` smallint(6) NOT NULL DEFAULT '10',
  `created_at` int(11) NOT NULL,
  `updated_at` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `password_reset_token` (`password_reset_token`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `user` */

insert  into `user`(`id`,`username`,`auth_key`,`password_hash`,`password_reset_token`,`email`,`status`,`created_at`,`updated_at`) values (1,'toanhv9','YqTP9CIX_vF-Jr2MPU6vfCF38Tq85JtH','$2y$13$UW//tB2WNXmpCyPl5oPbCeeVecFmdAuVYCeOhndUGfcJgD73f5Msi','15pWl-uBHCScBqf-wpOgwb3z6mX3pNZk_1445425982','toanhv9@viettel.com.vn',1,1445425982,1445425982),(4,'admin','3jlOXzilfAQkLu5EutByiiOAZiTFRsnw','$2y$13$UW//tB2WNXmpCyPl5oPbCeeVecFmdAuVYCeOhndUGfcJgD73f5Msi','uf3QE1gtupQ4YXtKSmYmFDE6DmE2-nQP_1445428656','admin@viettel.com.vn',1,1445428656,1445428656),(5,'huync2','lXrowZF1ZBP--P_MgpMY7lUzZiZwGP2B','$2y$13$UW//tB2WNXmpCyPl5oPbCeeVecFmdAuVYCeOhndUGfcJgD73f5Msi','-xVx124inEAU5oZBXf6hg2YaPebPjQoY_1465261115','huync2@viettel.com.vn',1,1450886401,1465261115),(9,'maintt12','yaL0D1DvCo7m7ikCEtFrJsB6tuYQBUs4','$2y$13$UW//tB2WNXmpCyPl5oPbCeeVecFmdAuVYCeOhndUGfcJgD73f5Msi','zP4HGl1ziXrcx7pzifmnsKAWKxn4Wz0b_1451098970','maintt12@viettel.com.vn',1,1451098970,1451098970),(10,'hoangl','asd','sad','sd','asd',1,123123,123123),(11,'vanht8','6VBhubNf37bMSGpnx-ZUMSTfXBW53FlE','$2y$13$0786LH36r6e3C9KvHgbmquC862T.G6wvxgU/SIWJtYZYoaojVS2De','v_77E4-zo_dnEiL3jvG5fPbVWE1ErqgB_1549854816','vanht8@viettel.com.vn',1,1549854761,1549854816);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
