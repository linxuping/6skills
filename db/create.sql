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
DROP TABLE IF EXISTS `6s_collection`;
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
CREATE INDEX idx_6s_position_pid ON 6s_position(pid);
CREATE INDEX idx_6s_position_name ON 6s_position(name);

-- CONSTRAINT `6s_position_idfk_1` FOREIGN KEY (`pid`) REFERENCES `6s_position` (`id`)

insert into 6s_position(id,pid,name) values (100000000,-1,"中国"),(101000000,100000000,"广东省"),(101010000,101000000,"广州市"),(101020000,101000000,"深圳市"),(101010100,101010000,"天河区"),(101010200,101010000,"越秀区"),(101010300,101010000,"番禺区"),(101010400,101010000,"海珠区"),(101010500,101010000,"荔湾区"),(101010600,101010000,"白云区"),(101010700,101010000,"从化区"),(101010800,101010000,"萝岗区"),(101010900,101010000,"南沙区"),(101011000,101010000,"增城区"),(101011100,101010000,"黄埔区"),(101011200,101010000,"花都区"),(101020100,101020000,"宝安区"),(101020200,101020000,"福田区");
insert into 6s_position(id,pid,name) values (101010101,101010100,"岑村"),(101010102,101010100,"长湴"),(101010103,101010100,"长兴"),(101010104,101010100,"车陂"),(101010105,101010100,"程介村"),(101010106,101010100,"东莞庄"),(101010107,101010100,"东圃"),(101010108,101010100,"岗顶"),(101010109,101010100,"广州大道中"),(101010110,101010100,"华景路"),(101010111,101010100,"华景新城"),(101010112,101010100,"黄村"),(101010113,101010100,"黄埔大道西"),(101010114,101010100,"汇景新城"),(101010115,101010100,"骏景路"),(101010116,101010100,"柯木塱"),(101010117,101010100,"猎德"),(101010118,101010100,"林和"),(101010119,101010100,"龙洞"),(101010120,101010100,"龙口东"),(101010121,101010100,"龙口西"),(101010122,101010100,"龙怡路"),(101010123,101010100,"沙河"),(101010124,101010100,"上社"),(101010125,101010100,"沙太南"),(101010126,101010100,"石牌"),(101010127,101010100,"棠德南路"),(101010128,101010100,"棠东"),(101010129,101010100,"棠下"),(101010130,101010100,"天河北"),(101010131,101010100,"天河东路"),(101010132,101010100,"天河公园"),(101010133,101010100,"天河客运站"),(101010134,101010100,"天河南"),(101010135,101010100,"天河南二路"),(101010136,101010100,"天河南一路"),(101010137,101010100,"天河周边"),(101010138,101010100,"天平架"),(101010139,101010100,"天润路"),(101010140,101010100,"体育西路"),(101010141,101010100,"体育中心"),(101010142,101010100,"五山"),(101010143,101010100,"五山路口"),(101010144,101010100,"冼村"),(101010145,101010100,"小新塘"),(101010146,101010100,"燕塘"),(101010147,101010100,"员村"),(101010148,101010100,"员村二横路"),(101010149,101010100,"员村四横路"),(101010150,101010100,"粤垦"),(101010151,101010100,"中山大道"),(101010152,101010100,"珠村"),(101010153,101010100,"珠吉"),(101010154,101010100,"珠江大道"),(101010155,101010100,"珠江新城");
insert into 6s_position(id,pid,name) values (101010401,101010400,"宝岗"),(101010402,101010400,"宝业路"),(101010403,101010400,"滨江东"),(101010404,101010400,"滨江西"),(101010405,101010400,"滨江中"),(101010406,101010400,"昌岗"),(101010407,101010400,"赤岗"),(101010408,101010400,"东晓"),(101010409,101010400,"东晓南"),(101010410,101010400,"革新路"),(101010411,101010400,"工业大道北"),(101010412,101010400,"工业大道南"),(101010413,101010400,"工业大道中"),(101010414,101010400,"广州大道南"),(101010415,101010400,"官洲"),(101010416,101010400,"海幢"),(101010417,101010400,"海珠周边"),(101010418,101010400,"洪德"),(101010419,101010400,"华洲"),(101010420,101010400,"江南大道南"),(101010421,101010400,"江南大道中"),(101010422,101010400,"江南西"),(101010423,101010400,"江燕路"),(101010424,101010400,"客村"),(101010425,101010400,"沥滘"),(101010426,101010400,"南华西"),(101010427,101010400,"南石头"),(101010428,101010400,"南田路"),(101010429,101010400,"南洲"),(101010430,101010400,"琶洲"),(101010431,101010400,"前进路"),(101010432,101010400,"瑞宝"),(101010433,101010400,"上渡路"),(101010434,101010400,"沙园"),(101010435,101010400,"万胜围"),(101010436,101010400,"下渡路"),(101010437,101010400,"晓港"),(101010438,101010400,"新港东"),(101010439,101010400,"新港西"),(101010440,101010400,"新港中"),(101010441,101010400,"怡乐路"),(101010442,101010400,"中大");
insert into 6s_position(id,pid,name) values(101010201,101010200,"百灵路"),(101010202,101010200,"北京路"),(101010203,101010200,"大德路"),(101010204,101010200,"大沙头"),(101010205,101010200,"德政路"),(101010206,101010200,"东川"),(101010207,101010200,"东风东"),(101010208,101010200,"东风路"),(101010209,101010200,"东湖"),(101010210,101010200,"东华路"),(101010211,101010200,"东山口"),(101010212,101010200,"二沙岛"),(101010213,101010200,"共和路"),(101010214,101010200,"公园前"),(101010215,101010200,"广卫"),(101010216,101010200,"海珠北路"),(101010217,101010200,"海珠广场"),(101010218,101010200,"黄花岗"),(101010219,101010200,"环市东"),(101010220,101010200,"惠福西路"),(101010221,101010200,"建设路"),(101010222,101010200,"解放北"),(101010223,101010200,"解放南"),(101010224,101010200,"解放中路"),(101010225,101010200,"流花"),(101010226,101010200,"麓景路"),(101010227,101010200,"梅花村"),(101010228,101010200,"农讲所"),(101010229,101010200,"农林下路"),(101010230,101010200,"盘福路"),(101010231,101010200,"三元里"),(101010232,101010200,"水荫路"),(101010233,101010200,"淘金"),(101010234,101010200,"文明路"),(101010235,101010200,"五羊新城"),(101010236,101010200,"小北"),(101010237,101010200,"西门口"),(101010238,101010200,"杨箕村"),(101010239,101010200,"一德路"),(101010240,101010200,"越秀南"),(101010241,101010200,"越秀周边"),(101010242,101010200,"中山路");
insert into 6s_position(id,pid,name) values (101010601,101010600,"白云大道北"),(101010602,101010600,"白云大道南"),(101010603,101010600,"白云周边"),(101010604,101010600,"大金钟路"),(101010605,101010600,"东平"),(101010606,101010600,"广花"),(101010607,101010600,"广园路"),(101010608,101010600,"广州大道北"),(101010609,101010600,"桂花岗"),(101010610,101010600,"黄边"),(101010611,101010600,"黄石"),(101010612,101010600,"黄庄"),(101010613,101010600,"嘉禾望岗"),(101010614,101010600,"江高镇"),(101010615,101010600,"江夏"),(101010616,101010600,"机场路"),(101010617,101010600,"景泰"),(101010618,101010600,"京溪"),(101010619,101010600,"金沙洲"),(101010620,101010600,"九佛"),(101010621,101010600,"龙归"),(101010622,101010600,"罗冲围"),(101010623,101010600,"梅花园"),(101010624,101010600,"南湖"),(101010625,101010600,"人和"),(101010626,101010600,"三元里"),(101010627,101010600,"沙贝"),(101010628,101010600,"沙太北"),(101010629,101010600,"沙太中"),(101010630,101010600,"石井"),(101010631,101010600,"太和"),(101010632,101010600,"棠景"),(101010633,101010600,"天河北苑"),(101010634,101010600,"同德围"),(101010635,101010600,"同和"),(101010636,101010600,"伍仙桥"),(101010637,101010600,"西槎路"),(101010638,101010600,"新市"),(101010639,101010600,"鸦岗"),(101010640,101010600,"永泰"),(101010641,101010600,"远景路"),(101010642,101010600,"云城西路"),(101010643,101010600,"增槎路"),(101010644,101010600,"钟落潭"),(101010645,101010600,"竹料");
insert into 6s_position(id,pid,name) values (101010501,101010500,"宝华路"),(101010502,101010500,"长寿路"),(101010503,101010500,"陈家祠"),(101010504,101010500,"丛桂路"),(101010505,101010500,"东风西"),(101010506,101010500,"多宝路"),(101010507,101010500,"芳村"),(101010508,101010500,"芳村大道西"),(101010509,101010500,"逢源路"),(101010510,101010500,"光复北路"),(101010511,101010500,"和平西"),(101010512,101010500,"花地湾"),(101010513,101010500,"华林"),(101010514,101010500,"黄岐"),(101010515,101010500,"黄沙"),(101010516,101010500,"环市西"),(101010517,101010500,"惠福路"),(101010518,101010500,"窖口"),(101010519,101010500,"菊树"),(101010520,101010500,"康王路"),(101010521,101010500,"坑口"),(101010522,101010500,"荔湾路"),(101010523,101010500,"荔湾周边"),(101010524,101010500,"龙津"),(101010525,101010500,"龙溪"),(101010526,101010500,"南岸路"),(101010527,101010500,"蓬莱路"),(101010528,101010500,"桥中"),(101010529,101010500,"沙面"),(101010530,101010500,"十甫路"),(101010531,101010500,"文昌南路"),(101010532,101010500,"西村"),(101010533,101010500,"西关"),(101010534,101010500,"西华路"),(101010535,101010500,"西朗"),(101010536,101010500,"西门口"),(101010537,101010500,"盐步"),(101010538,101010500,"站前路"),(101010539,101010500,"中山八路"),(101010540,101010500,"周门");
insert into 6s_position(id,pid,name) values (101010301,101010300,"大石"),(101010302,101010300,"大学城"),(101010303,101010300,"番禺广场"),(101010304,101010300,"番禺周边"),(101010305,101010300,"富豪山庄"),(101010306,101010300,"华南"),(101010307,101010300,"华南碧桂园"),(101010308,101010300,"金山谷"),(101010309,101010300,"洛溪"),(101010310,101010300,"南村镇"),(101010311,101010300,"南浦"),(101010312,101010300,"桥南"),(101010313,101010300,"祈福"),(101010314,101010300,"沙湾"),(101010315,101010300,"石碁"),(101010316,101010300,"石楼"),(101010317,101010300,"市桥"),(101010318,101010300,"市桥北"),(101010319,101010300,"顺德碧桂园"),(101010320,101010300,"厦滘"),(101010321,101010300,"雅居乐"),(101010322,101010300,"亚运城"),(101010323,101010300,"钟村");
insert into 6s_position(id,pid,name) values (101011101,101011100,"大沙地"),(101011102,101011100,"黄埔区府"),(101011103,101011100,"黄埔新村"),(101011104,101011100,"开发区东"),(101011105,101011100,"开发区西"),(101011106,101011100,"庙头"),(101011107,101011100,"石化路"),(101011108,101011100,"文冲"),(101011109,101011100,"下沙"),(101011110,101011100,"夏园"),(101011111,101011100,"渔珠"),(101011112,101011100,"萝岗"),(101011113,101011100,"保利香雪山"),(101011114,101011100,"开创大道北"),(101011115,101011100,"科学城"),(101011116,101011100,"萝岗周边");
insert into 6s_position(id,pid,name) values (101011201,101011200,"花东"),(101011202,101011200,"花都周边"),(101011203,101011200,"建设路"),(101011204,101011200,"镜湖大道"),(101011205,101011200,"旧区"),(101011206,101011200,"清远"),(101011207,101011200,"山前大道"),(101011208,101011200,"狮岭"),(101011209,101011200,"铁路西"),(101011210,101011200,"新区"),(101011211,101011200,"中区");
insert into 6s_position(id,pid,name) values (101011001,101011000,"东进东路"),(101011002,101011000,"东坑三横路"),(101011003,101011000,"东洲大道"),(101011004,101011000,"凤凰城"),(101011005,101011000,"府前路"),(101011006,101011000,"港口大道"),(101011007,101011000,"广园东"),(101011008,101011000,"海关大道"),(101011009,101011000,"汇太东路"),(101011010,101011000,"锦绣御景苑"),(101011011,101011000,"荔城"),(101011012,101011000,"荔城碧桂园"),(101011013,101011000,"荔城富鹏"),(101011014,101011000,"荔城增江"),(101011015,101011000,"荔城中区"),(101011016,101011000,"汽车城大道"),(101011017,101011000,"新塘"),(101011018,101011000,"新塘大道东"),(101011019,101011000,"新塘大道西"),(101011020,101011000,"新塘大道中"),(101011021,101011000,"新塘南"),(101011022,101011000,"永和"),(101011023,101011000,"增城周边"),(101011024,101011000,"中新镇");
insert into 6s_position(id,pid,name) values (101010901,101010900,"大岗"),(101010902,101010900,"东凤"),(101010903,101010900,"东升"),(101010904,101010900,"东涌"),(101010905,101010900,"黄阁"),(101010906,101010900,"进港大道"),(101010907,101010900,"金洲"),(101010908,101010900,"榄核"),(101010909,101010900,"容桂街道"),(101010910,101010900,"万顷沙"),(101010911,101010900,"小榄");
insert into 6s_position(id,pid,name) values (101010701,101010700,"街口"),(101010702,101010700,"中心区"),(101010703,101010700,"太平镇"),(101010704,101010700,"温泉"),(101010705,101010700,"鳌头");

  
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
insert into 6s_acttype(id,pid,name) values (100,-1,"本地活动"),(101,100,"户外活动"),(102,100,"运动拓展"),(103,100,"绘本阅读"),(104,100,"手工DIY"),(105,100,"职业体验"),(106,100,"探索自然"),(107,100,"亲子摄影"),(108,100,"儿童选秀"),(109,100,"教育讲座"),(110,100,"早教体验课"),(111,100,"夏令营"),(112,100,"博物馆"),(113,100,"图书馆"),(114,100,"美术馆"),(115,100,"少年宫"),(116,100,"幼儿游泳馆"),(117,100,"儿童剧场"),(118,100,"儿童公园"),(119,100,"茶文化馆"),(120,100,"国学馆"),(121,100,"艺术展"),(200,-1,"兴趣培养"),(201,200,"绘画"),(202,200,"声乐"),(203,200,"器乐"),(204,200,"体能"),(205,200,"跆拳道"),(206,200,"轮滑"),(207,200,"舞蹈"),(208,200,"书法"),(209,200,"击剑"),(210,200,"乒乓球"),(211,200,"羽毛球"),(212,200,"英语"),(213,200,"足球"),(214,200,"篮球"),(215,200,"棒球"),(216,200,"围棋"),(217,200,"游泳"),(218,200,"国际象棋"),(219,200,"魔术"),(220,200,"瑜伽"),(221,200,"机器人"),(222,200,"创意手工"),(223,200,"烘焙"),(224,200,"建筑"),(225,200,"才艺"),(300,-1,"亲子出游"),(301,300,"国内亲子游"),(302,300,"海外亲子游"),(400,-1,"其他");


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



select "+------------------ 6s_auth -------------------+";
-- ----------------------------
-- Table structure for 6s_permission 权限
-- ----------------------------
DROP TABLE IF EXISTS `6s_permission`;
CREATE TABLE `6s_permission` (
  `id` int(11) NOT NULL,
  `name` char(128) COMMENT '权限描述',
  PRIMARY KEY (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
insert into 6s_permission(id,name) values (0,"can_do1"),(1,"can_do2"),(2,"can_do3"),(3,"can_do4"),(4,"can_do5");
-- ----------------------------
-- Table structure for 6s_role 角色
-- ----------------------------
DROP TABLE IF EXISTS `6s_role`;
CREATE TABLE `6s_role` (
  `id` int(11) NOT NULL,
  `name` char(128) COMMENT '角色描述',
  PRIMARY KEY (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
insert into 6s_role(id,name) values (0,"admin"),(1,"business"),(2,"visitor");
-- ----------------------------
-- Table structure for 6s_authorize 
-- ----------------------------
DROP TABLE IF EXISTS `6s_authorize`;
CREATE TABLE `6s_authorize` (
  `role_id` int(11) NOT NULL,
  `perm_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
insert into 6s_authorize values (0,0),(0,1),(0,2),(1,1),(1,2),(2,2);


-- ----------------------------
-- Table structure for 6s_user 普通用户、基础信息
-- ----------------------------
select "+------------------ 6s_user -------------------+";
DROP TABLE IF EXISTS `6s_user`;
CREATE TABLE `6s_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `refid` int(11) NOT NULL DEFAULT -1, -- 免登陆免refid
  `username` varchar(127) DEFAULT '' COMMENT '用户名',
  `password` varchar(127) NOT NULL COMMENT '密码',
  `pwdmd5` varchar(127) NOT NULL COMMENT '密码md5',
  `phone` varchar(24) NOT NULL unique COMMENT '联系方式',
  `openid` varchar(24) DEFAULT '' COMMENT 'wx openid',
  `role` enum('admin','business','normal') COMMENT '角色',
  `img` varchar(255) default 'http://121.42.41.241:9900/static/img/head.jpg' COMMENT '图片',
  `createtime` datetime NOT NULL COMMENT '添加时间',
  `up_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '频度',
  `last_modification` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '上次更新时间',
  `status` smallint(6) NOT NULL DEFAULT '1' COMMENT '0 停用,1 可用,2 审核中,3 拒绝,4 禁止发帖',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE INDEX idx_6s_user_refid ON 6s_user(refid);
CREATE INDEX idx_6s_user_username ON 6s_user(username);
CREATE INDEX idx_6s_user_phone ON 6s_user(phone);
CREATE INDEX idx_6s_user_openid ON 6s_user(openid);

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
CREATE INDEX idx_6s_user_business_refid ON 6s_user_business(refid);
CREATE INDEX idx_6s_user_business_name ON 6s_user_business(name);
CREATE INDEX idx_6s_user_business_phone ON 6s_user_business(phone);


delete from auth_user where username='test';
insert into auth_user(username,password) values ("test","test");
insert into 6s_user(id,refid,openid,username,phone,role,img,createtime,status) values (1,1,9901,"test","12011112222",'普通',"http://121.42.41.241:9900/static/img/head.jpg",now(),1);
delete from auth_user where username='test2';
insert into auth_user(username,password) values ("test2","test2");
insert into 6s_user(id,openid,refid,username,phone,role,img,createtime,status) values (1001,9902,1,"test2","13011112222",'普通',"http://121.42.41.241:9900/static/img/head.jpg",now(),2);
delete from auth_user where username='test3';
insert into auth_user(username,password) values ("test3","test3");
insert into 6s_user(id,openid,refid,username,phone,role,img,createtime,status) values (1002,9903,1,"test3","12345612345",'普通',"http://121.42.41.241:9900/static/img/head.jpg",now(),1);

insert into 6s_user_business(refid,company,service_item,img_business_licence,phone_customservice,shop_name,city,region,address,name,phone,email,QQ) values(1001,"comp","tech","blimg.png","12348","shopname","city","region","addr","name","15099991234","email","QQ");
insert into 6s_user_business(refid,company,service_item,img_business_licence,phone_customservice,shop_name,city,region,address,name,phone,email,QQ) values(1002,"comp2","tech2","blimg2.png","12349","shopname2","city2","region","addr","name2","15099991288","email2","QQ2");


-- ----------------------------
-- Table structure for 6s_preinfo 
-- ----------------------------
select "+------------------ 6s_preinfo -------------------+";
DROP TABLE IF EXISTS `6s_preinfo`;
CREATE TABLE `6s_preinfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '',
  `price_child` int(11) NOT NULL DEFAULT -1 COMMENT '价格',
  `price_adult` int(11) NOT NULL DEFAULT -1 COMMENT '价格',
  `time_from` timestamp NULL DEFAULT NULL COMMENT '活动时间-开始，NULL 长期',
  `time_to` timestamp NULL DEFAULT NULL COMMENT '活动时间-结束',
  `quantities` int(11) NOT NULL DEFAULT 0 COMMENT '参与人数',
  `quantities_remain` int(11) NOT NULL DEFAULT 0 COMMENT '剩余人数',
  `content` varchar(255) COMMENT '提醒信息',
  `createtime` datetime NOT NULL COMMENT '添加时间',
  `act_id` int(11) default 0 COMMENT '指派的活动',
  `last_modification` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '上次更新时间',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态.1-上线,0-下线',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
insert into 6s_preinfo(id,price_child,price_adult,time_from,time_to,quantities,quantities_remain,content,createtime) values(101,19,29,"2016-08-10","2016-08-14",12,12,"2周年活动优惠2折.",now());
insert into 6s_preinfo(id,price_child,price_adult,time_from,time_to,quantities,quantities_remain,content,createtime) values(102,19,29,"2016-08-10","2016-08-14",12,12,"2周年活动优惠95折.",now());


-- ----------------------------
-- Table structure for 6s_activity 活动
-- ----------------------------
select "+------------------ 6s_activity -------------------+";
DROP TABLE IF EXISTS `6s_activity`;
CREATE TABLE `6s_activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '',
  `price_child` int(11) NOT NULL DEFAULT -1 COMMENT '价格',
  `price_adult` int(11) NOT NULL DEFAULT -1 COMMENT '价格',
  `title` varchar(255) COMMENT '标题',
  `preinfo` varchar(255) COMMENT '提醒信息-忽略',
  `content` text COMMENT '正文',
  `time_from` timestamp NULL DEFAULT NULL COMMENT '活动时间-开始，NULL 长期',
  `time_to` timestamp NULL DEFAULT NULL COMMENT '活动时间-结束',
  `createtime` datetime NOT NULL COMMENT '添加时间',
  `last_modification` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '上次更新时间',
  `position_id` int(11) NOT NULL COMMENT '集合地点',
  `position_details` varchar(255) COMMENT '详细地址',
  `age_from` smallint(4) NOT NULL DEFAULT 0 COMMENT '年龄',
  `age_to` smallint(4) NOT NULL DEFAULT 0 COMMENT '年龄',
  `quantities` int(11) NOT NULL DEFAULT 0 COMMENT '参与人数',
  `quantities_remain` int(11) NOT NULL DEFAULT 0 COMMENT '剩余人数',
  `mark` float(5,2) NOT NULL DEFAULT 0 COMMENT '评分',
  -- `acttype` enum('教育','体验') COMMENT '参与人数',
  `act_id` int(11) NOT NULL COMMENT '',
  `user_id` int(11) NOT NULL COMMENT '', -- who create or update
  `preinfo_id` int(11) default NULL,
  `imgs_act` varchar(255) DEFAULT '' COMMENT '图片 spirit by empty space',
  `img_cover` varchar(255) DEFAULT '' COMMENT '图片',
  `img_qrcode` varchar(255) DEFAULT NULL COMMENT '二维码',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态.1-上线,0-下线',
  CONSTRAINT `fk_6s_activity_posid` FOREIGN KEY (position_id) REFERENCES 6s_position(id) ON UPDATE CASCADE,
  CONSTRAINT `fk_6s_activity_actid` FOREIGN KEY (act_id) REFERENCES 6s_acttype(id) ON UPDATE CASCADE,
  CONSTRAINT `fk_6s_activity_userid` FOREIGN KEY (user_id) REFERENCES 6s_user(id) ON UPDATE CASCADE,
  CONSTRAINT `fk_6s_activity_preinfoid` FOREIGN KEY (preinfo_id) REFERENCES 6s_preinfo(id) ON UPDATE CASCADE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE INDEX idx_6s_activity_title ON 6s_activity(title);
-- CREATE INDEX idx_6s_activity_preinfo ON 6s_activity(preinfo);
CREATE INDEX idx_6s_activity_act_id ON 6s_activity(act_id);
CREATE INDEX idx_6s_activity_user_id ON 6s_activity(user_id);


insert into 6s_activity(id,price_child,price_adult,title,content,time_from,time_to,position_id,position_details,age_from,age_to,quantities,quantities_remain,act_id,imgs_act,img_cover,user_id,createtime,img_qrcode,preinfo_id) values (1,100,150,"亲子游 驴妈妈「驴悦亲子游」","actcontent","2016-06-01","2016-06-03",101010401,"position details",3,5,4,4,104,"a.jpg b.jpg c.png","http://img1.imgtn.bdimg.com/it/u=4294957488,731282903&fm=21&gp=0.jpg",1,now(),'http://121.42.41.241:9900/static/img/qrcode_test.png',101);
insert into 6s_activity(id,price_child,price_adult,title,content,time_from,time_to,position_id,position_details,age_from,age_to,quantities,quantities_remain,act_id,imgs_act,img_cover,user_id,createtime,img_qrcode,preinfo_id) values (2,103,120,"创意趣味亲子游首选快乐时光","actcontent2","2016-06-02","2016-06-03",101010402,"position details2",4,6,6,6,104,"a2.jpg b2.jpg","http://img1.imgtn.bdimg.com/it/u=4294957488,731282903&fm=21&gp=0.jpg",1,now(),'http://121.42.41.241:9900/static/img/qrcode_test.png',102);
insert into 6s_activity(id,title,time_from,time_to,quantities,quantities_remain,position_id,act_id,user_id,age_from,age_to,price_adult,img_cover,createtime,img_qrcode) values (3,"亲子游 大晴天旅行网 亲子游 完全自由的旅行","2016-06-03","2016-06-30",6,1,101010103,104,1,2,4,90,"http://file.fwjia.com:88/d/file/2010-09-14/03c041e9a7df37d515fcf3dcc8af8861.jpg",now(),'http://121.42.41.241:9900/static/img/qrcode_test.png');
insert into 6s_activity(id,title,time_from,time_to,quantities,quantities_remain,position_id,act_id,user_id,age_from,age_to,price_adult,img_cover,createtime,img_qrcode) values (4,"“互联网+”概念的兴起","2016-06-04","2016-06-30",6,6,101010102,104,1,2,5,124,"http://file.fwjia.com:88/d/file/2010-09-14/03c041e9a7df37d515fcf3dcc8af8861.jpg",now(),'http://121.42.41.241:9900/static/img/qrcode_test.png');
insert into 6s_activity(id,title,time_from,time_to,quantities,quantities_remain,position_id,act_id,user_id,age_from,age_to,price_adult,img_cover,createtime,img_qrcode) values (5,"以80后父母为主力拉动的亲子旅游市场越来越火爆","2016-06-05","2016-06-30",6,0,101010101,104,1,4,6,89,"http://img1.imgtn.bdimg.com/it/u=2539161237,3881183444&fm=21&gp=0.jpg",now(),'http://121.42.41.241:9900/static/img/qrcode_test.png');
insert into 6s_activity(id,title,time_from,time_to,quantities,quantities_remain,position_id,act_id,user_id,age_from,age_to,price_adult,img_cover,createtime,img_qrcode) values (6,"爸爸去哪儿","2016-06-06","2016-06-30",6,6,101010401,104,1,3,6,88,"http://img1.imgtn.bdimg.com/it/u=2539161237,3881183444&fm=21&gp=0.jpg",now(),'http://121.42.41.241:9900/static/img/qrcode_test.png');
insert into 6s_activity(id,title,time_from,time_to,quantities,quantities_remain,position_id,act_id,user_id,age_from,age_to,price_adult,img_cover,createtime,img_qrcode) values (7,"一系列亲子游节目的影响","2016-06-06","2016-06-30",6,6,101010401,104,1,3,6,88,"http://cdn.duitang.com/uploads/blog/201411/21/20141121130437_3UySC.thumb.224_0.jpeg",now(),'http://121.42.41.241:9900/static/img/qrcode_test.png');
insert into 6s_activity(id,title,time_from,time_to,quantities,quantities_remain,position_id,act_id,user_id,age_from,age_to,price_adult,img_cover,createtime,img_qrcode) values (8,"亲子游去哪好，动物王国，海底世界","2016-06-06","2016-06-30",6,6,101010401,104,1,3,6,88,"http://cdn.duitang.com/uploads/blog/201411/21/20141121130437_3UySC.thumb.224_0.jpeg",now(),'http://121.42.41.241:9900/static/img/qrcode_test.png');
insert into 6s_activity(id,title,time_from,time_to,quantities,quantities_remain,position_id,act_id,user_id,age_from,age_to,price_adult,img_cover,createtime,img_qrcode) values (9,"爸爸去哪儿多种经典线路","2016-06-06","2016-06-30",6,6,101010401,104,1,3,6,88,"http://img1.imgtn.bdimg.com/it/u=3319855790,3301229541&fm=21&gp=0.jpg",now(),'http://121.42.41.241:9900/static/img/qrcode_test.png');
insert into 6s_activity(id,title,time_from,time_to,quantities,quantities_remain,position_id,act_id,user_id,age_from,age_to,price_adult,img_cover,createtime) values (10,"途牛推出亲子旅游频道","2016-06-06","2016-06-30",6,6,101010401,104,1,3,6,88,"http://img1.imgtn.bdimg.com/it/u=3319855790,3301229541&fm=21&gp=0.jpg",now());
insert into 6s_activity(id,title,time_from,time_to,quantities,quantities_remain,position_id,act_id,user_id,age_from,age_to,price_adult,img_cover,createtime) values (11,"亲子游线路","2016-06-07","2016-06-30",6,6,101010402,104,1,2,7,90,"http://img1.imgtn.bdimg.com/it/u=3319855790,3301229541&fm=21&gp=0.jpg",now());
#more than 1 week.
insert into 6s_activity(id,title,time_from,time_to,quantities,quantities_remain,position_id,act_id,user_id,age_from,age_to,price_adult,img_cover,content,createtime) values (12,"亲子游攻略",DATE_ADD(NOW(), INTERVAL 4 WEEK),DATE_ADD(NOW(), INTERVAL 5 WEEK),6,6,101010402,104,1,2,7,90,"http://img1.gtimg.com/gd/pics/hv1/123/187/2105/136925433.jpg","more than one week",now());
insert into 6s_activity(id,title,time_from,time_to,quantities,quantities_remain,position_id,act_id,user_id,age_from,age_to,price_adult,img_cover,content,createtime) values (13,"还有各种亲子旅游特价产品",DATE_ADD(NOW(), INTERVAL 4 WEEK),DATE_ADD(NOW(), INTERVAL 5 WEEK),6,6,101010402,104,1,2,7,90,"http://img1.gtimg.com/16/1698/169862/16986270_980x1200_0.jpg","more than one week",now());
insert into 6s_activity(id,title,time_from,time_to,quantities,quantities_remain,position_id,act_id,user_id,age_from,age_to,price_adult,img_cover,content,createtime) values (14,"最低千元起!另外还有迪士尼乐园",DATE_ADD(NOW(), INTERVAL 4 WEEK),DATE_ADD(NOW(), INTERVAL 5 WEEK),6,6,101010402,104,1,2,7,90,"http://img1.gtimg.com/news/pics/hv1/84/186/2105/136925139.jpg","more than one week",now());


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
  `phone` varchar(24) default '' COMMENT '联系方式',
  `createtime` datetime NOT NULL COMMENT '添加时间',
  `last_modification` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '上次更新时间',
  `status` smallint(6) NOT NULL DEFAULT '1' COMMENT '0 停用,1 可用,2 审核中,3 拒绝,4 禁止发帖',
  CONSTRAINT `fk_6s_signup_uid` FOREIGN KEY (user_id) REFERENCES 6s_user(id) ON UPDATE CASCADE,
  CONSTRAINT `fk_6s_signup_actid` FOREIGN KEY (act_id) REFERENCES 6s_activity(id) ON UPDATE CASCADE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE INDEX idx_6s_signup_user_id ON 6s_signup(user_id);
CREATE INDEX idx_6s_signup_act_id ON 6s_signup(act_id);

insert into 6s_signup(user_id,act_id,createtime) values(1,1,now()),(1001,1,now()),(1002,2,now());


-- ----------------------------
-- Table structure for 6s_collection 收藏
-- ----------------------------
select "+------------------ 6s_collection -------------------+";
DROP TABLE IF EXISTS `6s_collection`;
CREATE TABLE `6s_collection` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  -- `user_id` int(11) NOT NULL DEFAULT -1, 
  `openid` varchar(255) NOT NULL, 
  `act_id` int(11) NOT NULL DEFAULT -1, 
  `createtime` datetime NOT NULL COMMENT '添加时间',
  `last_modification` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '上次更新时间',
  `status` smallint(6) NOT NULL DEFAULT '1' COMMENT '0 停用,1 可用,2 审核中,3 拒绝,4 禁止发帖',
  -- CONSTRAINT `fk_6s_collection_uid` FOREIGN KEY (user_id) REFERENCES 6s_user(id) ON UPDATE CASCADE,
  CONSTRAINT `fk_6s_collection_actid` FOREIGN KEY (act_id) REFERENCES 6s_activity(id) ON UPDATE CASCADE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE INDEX idx_6s_collection_openid ON 6s_collection(openid);
CREATE INDEX idx_6s_collection_act_id ON 6s_collection(act_id);

insert into 6s_collection(openid,act_id,createtime) values('9901',1,now()),('9901',2,now()),('9901',3,now());


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
CREATE INDEX idx_6s_idencode_openid ON 6s_idencode(openid);

insert into 6s_idencode(openid,code,createtime) values("2132423435",2435,now());


select "+------------------ 6s_session -------------------+";
-- ----------------------------
-- Table structure for 6s_session 权限
-- ----------------------------
DROP TABLE IF EXISTS `6s_session`;
CREATE TABLE `6s_session` (
  `user_id` int(11) NOT NULL, 
  `session_id` int(11) NOT NULL, 
  `start` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`user_id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
insert into 6s_session(user_id,session_id) values (1,1010101);





	   
