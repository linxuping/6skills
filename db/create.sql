/*
Navicat MySQL Data Transfer

Source Server         : 192.168.12.19_新_单账号线上
Source Server Version : 50508
Source Host           : 192.168.12.19:3306
Source Database       : resource

Target Server Type    : MYSQL
Target Server Version : 50508
File Encoding         : 65001

Date: 2016-06-20 16:12:12
*/

-- SET FOREIGN_KEY_CHECKS=0;
-- 6s
drop database skills;
CREATE DATABASE IF NOT EXISTS skills DEFAULT CHARSET utf8 COLLATE utf8_general_ci;
use skills;

DROP TABLE IF EXISTS `6s_activity`;
DROP TABLE IF EXISTS `6s_acttype`;
DROP TABLE IF EXISTS `6s_position`;

-- ----------------------------
-- Table structure for 6s_position
-- ----------------------------
DROP TABLE IF EXISTS `6s_position`;
CREATE TABLE `6s_position` (
  `id` int(11) NOT NULL COMMENT '',
  `pid` int(11) NOT NULL DEFAULT -1 COMMENT '',
  `name` char(128) COMMENT '详细描述',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态.1-上线,0-下线',
  `longitude` SMALLINT(4) NOT NULL DEFAULT -1 COMMENT '经度',
  `latitude` SMALLINT(4) NOT NULL DEFAULT -1 COMMENT '纬度1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
-- CONSTRAINT `6s_position_idfk_1` FOREIGN KEY (`pid`) REFERENCES `6s_position` (`id`)

insert into 6s_position(id,pid,name) values (100000000,-1,"中国"),(101000000,100000000,"广东省"),(101010000,101000000,"广州市"),(101010100,101010000,"天河区"),(101010200,101010000,"越秀区"),(101010300,101010000,"番禺区"),(101010400,101010000,"海珠区"),(101010500,101010000,"荔湾区"),(101010600,101010000,"白云区"),(101010700,101010000,"从化区"),(101010800,101010000,"萝岗区"),(101010900,101010000,"南沙区"),(101011000,101010000,"增城区");
  
/*)
DROP TABLE IF EXISTS `child_type`;
CREATE TABLE `child_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '',
  `age` int(11) NOT NULL DEFAULT -1 COMMENT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
*/
-- ----------------------------
-- Table structure for 6s_position
-- ----------------------------
DROP TABLE IF EXISTS `6s_acttype`;
CREATE TABLE `6s_acttype` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '',
  `pid` int(11) NOT NULL COMMENT '',
  `name` char(128) COMMENT '详细描述',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态.1-上线,0-下线',
  PRIMARY KEY (`id`) 
);
-- CONSTRAINT `fk_actid` FOREIGN KEY (pid) REFERENCES 6s_acttype(id)
insert into 6s_acttype(id,pid,name) values (100,-1,"本地活动"),(200,-1,"亲子出游"),(300,-1,"兴趣培养"),(400,-1,"早教"),(101,100,"户外活动"),(102,100,"创意手工"),(103,100,"绘本故事会"),(104,100,"博物馆"); -- and so on ....

DROP TABLE IF EXISTS `6s_activity`;
CREATE TABLE `6s_activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '',
  `price` int(11) NOT NULL DEFAULT -1 COMMENT '价格',
  `price_adult` int(11) NOT NULL DEFAULT -1 COMMENT 'adult价格',
  `title` varchar(255) COMMENT '标题',
  `preinfo` varchar(255) COMMENT 'youhui xinxi',
  `content` varchar(255) COMMENT '正文',
  `time_from` timestamp NULL DEFAULT NULL COMMENT '活动时间-开始，NULL 长期',
  `time_to` timestamp NULL DEFAULT NULL COMMENT '活动时间-结束',
  `position_id` int(11) NOT NULL COMMENT '地点',
  `position_details` varchar(255) COMMENT '地点 details',
  `age` smallint(4) NOT NULL DEFAULT -1 COMMENT '年龄',
  `quantities` int(11) NOT NULL DEFAULT -1 COMMENT '参与人数',
  -- `acttype` enum('教育','体验') COMMENT '参与人数',
  `act_id` int(11) NOT NULL COMMENT '',
  `imgs` varchar(255) COMMENT '图片 spirit by empty space',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态.1-上线,0-下线',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_posid` FOREIGN KEY (position_id) REFERENCES 6s_position(id) ON UPDATE CASCADE,
  CONSTRAINT `fk_actid` FOREIGN KEY (act_id) REFERENCES 6s_acttype(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into 6s_activity(price,price_adult,title,preinfo,content,time_from,time_to,position_id,position_details,age,quantities,act_id,imgs) values (100,-1,"title","youhui xinxi","content","2016-06-01","2016-06-03",101010800,"position details",16,4,104,"a.jpg b.jpg c.png");

	
DROP TABLE IF EXISTS `6s_user`;
CREATE TABLE `6s_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `refid` int(11) unsigned NOT NULL,
  `username` varchar(127) NOT NULL COMMENT '用户名',
  -- `password` varchar(127) NOT NULL COMMENT '密码',
  `phone` varchar(24) NOT NULL COMMENT '联系方式',
  `role` enum('admin','business','normal') COMMENT '角色',
  `img` varchar(255) COMMENT '图片',
  `up_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '频度',
  `last_modification` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '上次更新时间',
  `status` smallint(6) NOT NULL DEFAULT '1' COMMENT '0 停用, 1 可用',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

delete from auth_user where username='test';
insert into auth_user(username,password) values ("test","test");
insert into 6s_user(refid,username,phone,role,img) values (1,"test","12345",'普通',"/tmp/test.png");





	   
	   
	   
	   
