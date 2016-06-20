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

-- ----------------------------
-- Table structure for area 00 00 00 00
-- ----------------------------
DROP TABLE IF EXISTS `area`;
CREATE TABLE `area` (
  `id` int(11) NOT NULL COMMENT '',
  `pid` int(11) NOT NULL DEFAULT -1 COMMENT '',
  `name` char(48) COMMENT '详细描述',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态.1-上线,0-下线',
  `longitude` SMALLINT(4) NOT NULL DEFAULT -1 COMMENT '经度',
  `latitude` SMALLINT(4) NOT NULL DEFAULT -1 COMMENT '纬度1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
-- CONSTRAINT `area_idfk_1` FOREIGN KEY (`pid`) REFERENCES `area` (`id`)

insert into area(id,pid,name) values (100000000,-1,"中国"),(101000000,100000000,"广东省"),(101010000,101000000,"广州市"),(101010100,101010000,"天河区"),(101010200,101010000,"越秀区"),(101010300,101010000,"番禺区"),(101010400,101010000,"海珠区"),(101010500,101010000,"荔湾区"),(101010600,101010000,"白云区"),(101010700,101010000,"从化区"),(101010800,101010000,"萝岗区"),(101010900,101010000,"南沙区"),(101011000,101010000,"增城区");
       


	   
	   
	   
	   