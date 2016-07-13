/*
Navicat MySQL Data Transfer
Source Server         : 
Source Server Version : 
Source Host           : 192.168.12.19:3306
Source Database       : 
Target Server Type    : MYSQL
Target Server Version : 
File Encoding         : 
Date: 2016-06-20 16:12:12
*/

-- SET FOREIGN_KEY_CHECKS=0;
-- 6s
-- drop database sixskillsdb;
-- CREATE DATABASE IF NOT EXISTS sixskillsdb DEFAULT CHARSET utf8 COLLATE utf8_general_ci;
use sixskillsdb;

select "+------------------ DROP TABLES -------------------+";
DROP TABLE IF EXISTS `6s_signup`;
DROP TABLE IF EXISTS `6s_activity`;
DROP TABLE IF EXISTS `6s_acttype`;
DROP TABLE IF EXISTS `6s_position`;
DROP TABLE IF EXISTS `6s_user_business`;

select "+------------------ 6s_position -------------------+";
-- ----------------------------
-- Table structure for 6s_position 地理位置 广东 广州 天河 棠下 好又多超市附近
-- ----------------------------
DROP TABLE IF EXISTS `6s_position`;
CREATE TABLE `6s_position` (
  `id` int(11) NOT NULL COMMENT '',
  `pid` int(11) NOT NULL DEFAULT -1 COMMENT '',
  `name` char(128) COMMENT '详细描述',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态.1-上线,0-下线',
  `longitude` SMALLINT(4) NOT NULL DEFAULT -1 COMMENT '经度(预留)', 
  `latitude` SMALLINT(4) NOT NULL DEFAULT -1 COMMENT '纬度(预留)', 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
-- CONSTRAINT `6s_position_idfk_1` FOREIGN KEY (`pid`) REFERENCES `6s_position` (`id`)

insert into 6s_position(id,pid,name) values (100000000,-1,"中国"),(101000000,100000000,"广东省"),(101010000,101000000,"广州市"),(101020000,101000000,"深圳市"),(101010100,101010000,"天河区"),(101010101,101010100,"学院"),(101010102,101010100,"棠下"),(101010103,101010100,"天河公园"),(101010200,101010000,"越秀区"),(101010300,101010000,"番禺区"),(101010400,101010000,"海珠区"),(101010401,101010400,"赤岗"),(101010402,101010400,"洛溪"),(101010500,101010000,"荔湾区"),(101010600,101010000,"白云区"),(101010700,101010000,"从化区"),(101010800,101010000,"萝岗区"),(101010900,101010000,"南沙区"),(101011000,101010000,"增城区"),(101020100,101020000,"宝安区"),(101020200,101020000,"福田区");
  
select "+------------------ 6s_acttype -------------------+";
-- ----------------------------
-- Table structure for 6s_acttype 活动类型
-- ----------------------------
DROP TABLE IF EXISTS `6s_acttype`;
CREATE TABLE `6s_acttype` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '',
  `pid` int(11) NOT NULL COMMENT '',
  `name` char(128) COMMENT '详细描述',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态.1-上线,0-下线',
  PRIMARY KEY (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
-- CONSTRAINT `fk_actid` FOREIGN KEY (pid) REFERENCES 6s_acttype(id)
insert into 6s_acttype(id,pid,name) values (100,-1,"本地活动"),(200,-1,"亲子出游"),(300,-1,"兴趣培养"),(400,-1,"早教"),(101,100,"户外活动"),(102,100,"创意手工"),(103,100,"绘本故事会"),(104,100,"博物馆"); -- and so on ....

-- ----------------------------
-- Table structure for 6s_actstatus 活动状态
-- ----------------------------
DROP TABLE IF EXISTS `6s_actstatus`;
CREATE TABLE `6s_actstatus` (
  `id` int(11) NOT NULL,
  `name` char(128) COMMENT '详细描述',
  PRIMARY KEY (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
insert into 6s_actstatus(id,name) values (0,"停用"),(1,"可用"),(2,"审核中"),(3,"拒绝"),(4,"禁止发帖");

-- ----------------------------
-- Table structure for 6s_user 普通用户、基础信息
-- ----------------------------
select "+------------------ 6s_user -------------------+";
DROP TABLE IF EXISTS `6s_user`;
CREATE TABLE `6s_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `refid` int(11) NOT NULL DEFAULT -1, -- 免登陆免refid
  `username` varchar(127) DEFAULT '' COMMENT '用户名',
  -- `password` varchar(127) NOT NULL COMMENT '密码',
  `phone` varchar(24) NOT NULL unique COMMENT '联系方式',
  `openid` varchar(24) NOT NULL unique COMMENT 'wx openid',
  `role` enum('admin','business','normal') COMMENT '角色',
  `img` varchar(255) COMMENT '图片',
  `createtime` datetime NOT NULL COMMENT '添加时间',
  `up_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '频度',
  `last_modification` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '上次更新时间',
  `status` smallint(6) NOT NULL DEFAULT '1' COMMENT '0 停用,1 可用,2 审核中,3 拒绝,4 禁止发帖',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for 6s_user_business 商户
-- ----------------------------
select "+------------------ 6s_user_business -------------------+";
DROP TABLE IF EXISTS `6s_user_business`;
CREATE TABLE `6s_user_business` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `refid` int(11) NOT NULL,
  `company` varchar(127) NOT NULL COMMENT '公司',
  `service_item` varchar(127) NOT NULL COMMENT '服务项目',-- local,travel,interest,tech
  `img_business_licence` varchar(255) COMMENT '营业执照',
  `phone_customservice` varchar(24) NOT NULL COMMENT '公司客服',
  `shop_name` varchar(24) NOT NULL COMMENT '门店名称',
  `city` varchar(24) NOT NULL COMMENT '城市',
  `region` varchar(24) NOT NULL COMMENT '区域',
  `address` varchar(24) NOT NULL COMMENT '信息地址',
  `name` varchar(24) NOT NULL COMMENT '姓名',
  `phone` varchar(24) NOT NULL COMMENT '电话',
  `email` varchar(24) NOT NULL COMMENT '邮箱',
  `QQ` varchar(24) NOT NULL COMMENT 'QQ',
  `last_modification` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '上次更新时间',
  -- `status` smallint(6) NOT NULL DEFAULT '1' COMMENT '0 停用, 1 可用',
  CONSTRAINT `fk_6s_user_business_uid` FOREIGN KEY (refid) REFERENCES 6s_user(id) ON UPDATE CASCADE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


delete from auth_user where username='test';
insert into auth_user(username,password) values ("test","test");
insert into 6s_user(id,refid,openid,username,phone,role,img,createtime,status) values (1,1,9901,"test","12345",'普通',"/tmp/test.png",now(),1);
delete from auth_user where username='test2';
insert into auth_user(username,password) values ("test2","test2");
insert into 6s_user(id,openid,refid,username,phone,role,img,createtime,status) values (1001,9902,1,"test2","12346",'普通',"/tmp/test.png",now(),2);
delete from auth_user where username='test3';
insert into auth_user(username,password) values ("test3","test3");
insert into 6s_user(id,openid,refid,username,phone,role,img,createtime,status) values (1002,9903,1,"test3","12347",'普通',"/tmp/test.png",now(),1);

insert into 6s_user_business(refid,company,service_item,img_business_licence,phone_customservice,shop_name,city,region,address,name,phone,email,QQ) values(1001,"comp","tech","blimg.png","12348","shopname","city","region","addr","name","phone","email","QQ");
insert into 6s_user_business(refid,company,service_item,img_business_licence,phone_customservice,shop_name,city,region,address,name,phone,email,QQ) values(1002,"comp2","tech2","blimg2.png","12349","shopname2","city2","region","addr","name2","phone2","email2","QQ2");

-- ----------------------------
-- Table structure for 6s_activity 活动
-- ----------------------------
select "+------------------ 6s_activity -------------------+";
DROP TABLE IF EXISTS `6s_activity`;
CREATE TABLE `6s_activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '',
  `price_original` int(11) NOT NULL DEFAULT -1 COMMENT '价格',
  `price_current` int(11) NOT NULL DEFAULT -1 COMMENT '价格',
  `title` varchar(255) COMMENT '标题',
  `preinfo` varchar(255) COMMENT '提醒信息',
  `content` varchar(255) COMMENT '正文',
  `time_from` timestamp NULL DEFAULT NULL COMMENT '活动时间-开始，NULL 长期',
  `time_to` timestamp NULL DEFAULT NULL COMMENT '活动时间-结束',
  `position_id` int(11) NOT NULL COMMENT '地点',
  `position_details` varchar(255) COMMENT '详细地址',
  `age_from` smallint(4) NOT NULL DEFAULT -1 COMMENT '年龄',
  `age_to` smallint(4) NOT NULL DEFAULT -1 COMMENT '年龄',
  `quantities` int(11) NOT NULL DEFAULT -1 COMMENT '参与人数',
  `quantities_remain` int(11) NOT NULL DEFAULT -1 COMMENT '剩余人数',
  `mark` float(5,2) NOT NULL DEFAULT 0 COMMENT '评分',
  -- `acttype` enum('教育','体验') COMMENT '参与人数',
  `act_id` int(11) NOT NULL COMMENT '',
  `user_id` int(11) NOT NULL COMMENT '', -- who create or update
  `imgs_act` varchar(255) DEFAULT '' COMMENT '图片 spirit by empty space',
  `img_cover` varchar(255) DEFAULT '' COMMENT '图片',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态.1-上线,0-下线',
  CONSTRAINT `fk_6s_activity_posid` FOREIGN KEY (position_id) REFERENCES 6s_position(id) ON UPDATE CASCADE,
  CONSTRAINT `fk_6s_activity_actid` FOREIGN KEY (act_id) REFERENCES 6s_acttype(id) ON UPDATE CASCADE,
  CONSTRAINT `fk_6s_activity_userid` FOREIGN KEY (user_id) REFERENCES 6s_user(id) ON UPDATE CASCADE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into 6s_activity(id,price_original,price_current,title,preinfo,content,time_from,time_to,position_id,position_details,age_from,age_to,quantities,act_id,imgs_act,img_cover,user_id) values (1,100,-1,"acttitle","youhui xinxi","actcontent","2016-06-01","2016-06-03",101010401,"position details",3,5,4,104,"a.jpg b.jpg c.png","m.jpg",1);
insert into 6s_activity(id,price_original,price_current,title,preinfo,content,time_from,time_to,position_id,position_details,age_from,age_to,quantities,act_id,imgs_act,img_cover,user_id) values (2,103,-1,"acttitle2","youhui xinxi2","actcontent2","2016-06-02","2016-06-03",101010402,"position details2",4,6,6,104,"a2.jpg b2.jpg","n.jpg",1);
insert into 6s_activity(id,title,time_from,time_to,quantities,position_id,act_id,user_id,age_from,age_to) values (3,"atitle3","2016-06-03","2016-06-30",6,101010103,104,1,2,4);
insert into 6s_activity(id,title,time_from,time_to,quantities,position_id,act_id,user_id,age_from,age_to) values (4,"atitle4","2016-06-04","2016-06-30",6,101010102,104,1,2,5);
insert into 6s_activity(id,title,time_from,time_to,quantities,position_id,act_id,user_id,age_from,age_to) values (5,"atitle5","2016-06-05","2016-06-30",6,101010101,104,1,4,6);
insert into 6s_activity(id,title,time_from,time_to,quantities,position_id,act_id,user_id,age_from,age_to) values (6,"atitle6","2016-06-06","2016-06-30",6,101010401,104,1,3,6);
insert into 6s_activity(id,title,time_from,time_to,quantities,position_id,act_id,user_id,age_from,age_to) values (7,"atitle7","2016-06-07","2016-06-30",6,101010402,104,1,2,7);


-- ----------------------------
-- Table structure for 6s_signup 报名
-- ----------------------------
select "+------------------ 6s_signup -------------------+";
DROP TABLE IF EXISTS `6s_signup`;
CREATE TABLE `6s_signup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT -1, 
  `act_id` int(11) NOT NULL DEFAULT -1, 
  `username_pa` varchar(127) DEFAULT '' COMMENT 'parent用户名',
  `username_ch` varchar(127) DEFAULT '' COMMENT '儿童用户名',
  `age_ch` tinyint(2) DEFAULT 0 COMMENT '儿童年龄',
  `createtime` datetime NOT NULL COMMENT '添加时间',
  `last_modification` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '上次更新时间',
  `status` smallint(6) NOT NULL DEFAULT '1' COMMENT '0 停用,1 可用,2 审核中,3 拒绝,4 禁止发帖',
  CONSTRAINT `fk_6s_signup_uid` FOREIGN KEY (user_id) REFERENCES 6s_user(id) ON UPDATE CASCADE,
  CONSTRAINT `fk_6s_signup_actid` FOREIGN KEY (act_id) REFERENCES 6s_activity(id) ON UPDATE CASCADE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into 6s_signup(user_id,act_id,createtime) values(1,1,now()),(1001,1,now()),(1002,2,now());

-- ----------------------------
-- Table structure for 6s_idencode 验证码
-- ----------------------------
select "+------------------ 6s_idencode  -------------------+";
DROP TABLE IF EXISTS `6s_idencode`; 
CREATE TABLE `6s_idencode` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(255) NOT NULL unique, 
  `code` int(11) NOT NULL DEFAULT -1, 
  `createtime` datetime NOT NULL COMMENT '添加时间',
  `last_modification` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '上次更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
insert into 6s_idencode(openid,code,createtime) values("2132423435",2435,now());






	   
