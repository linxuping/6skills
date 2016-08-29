## 公众号接口api

### 1. 限时优惠
**GET**
**URL** /activities/special-offers?area=xxx&age=x&page=x&page_size=x

**返回**

```json
{
	"activities": [
		{
			"img": "http://xxx.jpg",
			"title": "xxx",
			"brief": "简介",
			"tags": "手工div",
			"area": "广州越秀区",
			"ages": "3-8",
			"original_price": "800",
			"current_price": "700",
			"remain": "40"
		},
		...
	],
	"pageable": {
		"page": 0,
		"total": 1
	},
	"errcode": 0,
	"errmsg": ""
}
```

### 2. 活动预告
**GET**
**URL** /activities/preview?area=xxx&age=x&page=x&page_size=x

**返回**
```json
{
	"activities": [
		{
			"img": "http://xxx.jpg",
			"title": "xxx",
			"brief": "简介",
			"tags": "手工div",
			"area": "广州越秀区",
			"ages": "3-8",
			"current_price": "700",
			"remain": "40"
		},
		...
	],
	"pageable": {
		"page": 0,
		"total": 1
	},
	"errcode": 0,
	"errmsg": ""
}
```

### 3. 活动详情

**GET**
**URL** /activities/details/{uuid}

**返回**
```json
{
	"img": "http://xxx.jpg",
	"title": "xxx",
	"brief": "简介",
	"tags": "手工div",
	"area": "广州越秀区",
	"place": "东山番茄苗艺术中心",
	"timestamp": 1468079745610,
	"ages": "3-8",
	"original_price": 800,
	"current_price": 700,
	"remain": "40",
	"introdution": "详情",
	"errcode": 0,
	"errmsg": ""
}
```

### 4. 获取验证码

**GET**
** URL ** /get-auth-code?phone=138xxx

**返回**

```json
{
	"errcode": 0,
	"errmsg": ""
}
```

### 5. 验证码验证
**POST**
**URL** /auth

**参数**
```json
{
	"phone": 138***,
	"code": "code"
}
```
**返回**
```json
{
	"errcode": -1,
	"errmsg": "验证码错误"
}
```

### 6. 活动报名
**POST**
** URL ** /activities/sign

**参数**
```json
{
	"openid": "openid",
	"name": "家长姓名",
	"phone": "手机",
	"age": "儿童年龄",
	"uuid": "活动id",
	"location": "报名时所处位置"
}
```
**返回**
```json
{
	"errcode": 0,
	"errmsg": ""
}
```


### 7. 已报名活动
**GET**
** URL ** /activities/my

**返回**
```json
{
	"activities":[
		{
			"uuid": "活动id",
			"title": "标题",
			"activity_timestamp": 1468079745610,
			"sign_timetamp": 1468079745610,
			"area": "活动地点"
		},
		...
	],
	"pageable": {
		"page": 0,
		"total": 1
	},
	"errcode": 0,
	"errmsg": ""
}
```

### 8. 取消报名
**POST**
**URL** /acitivities/{uuid}/reset?openid={openid}

**返回**
```json
{
	"errcode": 0,
	"errmsg": ""
}
```

### 9. 反馈
**POST**
**URL** /feedback

**参数**
```json
{
	"openid": "openid",
	"content": "反馈内容"
}
```

**返回**
```json
{
	"errcode": 0,
	"errmsg": ""
}
```


##后台管理
### 1. 商户登录
**POST**
** URL ** /api/admin/login

**参数**
```
{
	phone: "135********",
	password: "password"
}
```

**成功返回**
```json
{
	"errcode": 0,
	"errmsg": "",
	"sessionid": "1234567890",
	"role": "用户角色",
	"userid": "",
	"permissions": ["has_perm1","has_perm2"]
}
```

**失败返回**
```
{
	"errcode": 1,
	"errmsg": "errmsg"
}
```

### 2. 商户注册第一步
**POST**
** URL ** /api/admin/signup-first-step

**参数**
```
{
	phone: "phone",
	code: "code",
	password: "password"
}
```

**参数说明**

名称 | 类型 | 是否必须 | 备注
-----|------|----------|-----
phone | string | Y |
code | string | Y | 验证码
password| string | Y |

**成功返回**
```json
{
	"errcode": 0,
	"errmsg": "",
}
```

### 2.1. 得到uploadtoken
**POST**
** URL ** /api/admin/uploadtoken/get

**参数**
```
{
	key: "key"
}
```

**成功返回**
```json
{
	"token": "42kj34l2k55l2kj342lkj4342lj234lk2j3l",
	"errcode": 0,
	"errmsg": "",
}
```

### 3. 商户注册第二步
**POST**
** URL ** /api/admin/signup-second-step

**参数**
```json
{
	avatar: "url",
	name: "name",
	desc: "description"
}
```

**参数说明**

名称 | 类型 | 是否必须 | 备注
-----|------|----------|-----
avatar|url|N|商户头像
name|string|Y|名称
desc|text|Y|商户简介

**成功返回**
```json
{
	"errcode": 0,
	"errmsg": "",
}
```

### 4. 获取用户权限及用户信息
**POST**
** URL ** /api/admin/get-usrinfo

**成功返回**
```json
{
	"errcode": 0,
	"errmsg": "",
	"userinfo": {
		"name": "谷歌集团",
		"avatar": "http://avatar.jpg",
		"permissions":["per1", "per2", "per3"],
	}
}
```

**失败返回**
```json
{
	"errcode": 1,
	"errmsg": "errmsg"
}
```

### 5. 商户首页统计信息
**GET**
** URL ** /api/admin/manager/statistic

**成功返回**
```json
{
	"errcode": 0,
	"errmsg": "",
	"info": {
		"publish": 8,
		"sign": 200,
		"page_view": 1000
	}
}
```

**失败返回**
```json
{
	"errcode": 1,
	"errmsg": "errmsg"
}
```

### 6. 已发布活动
**GET**
** URL ** /api/admin/current-activities


**成功返回**
```json
{
	"errcode": 0,
	"errmsg": "",
	"activities": [
		{
			"actid": 33,
			"title": "上海迪斯尼",
			"publish_time": 1471365349281,
			"sign_num": 23
		},
		...
	],
	"pageable": {
		"page": 1,
		"total": 4
	}
}
```

**失败返回**
```json
{
	"errcode": 1,
	"errmsg": "errmsg"
}
```

### 7. 未发布活动
**GET**
** URL ** /api/admin/unpublish-activities

**成功返回**
```json
{
	"errcode": 0,
	"errmsg": "",
	"activities": [
		{
			"actid": 33,
			"title": "上海迪斯尼"
		},
		...
	],
	"pageable": {
		"page": 1,
		"total": 4
	}
}
```

**失败返回**
```json
{
	"errcode": 1,
	"errmsg": "errmsg"
}
```


### 7.1 活动下线
**post**
**url** /api/admin/activity/offline
**参数**
```json
{
    "actid":"actid",
}
```

**返回**
```json
{
    "errcode": 0,
    "errmsg": ""
}
```

### 7.2 活动删除
**post**
**url** /api/admin/activity/delete
**参数**
```json
{
    "actid":"actid",
}
```

**返回**
```json
{
    "errcode": 0,
    "errmsg": ""
}
```

### 7.3 活动编辑
**post**
**url** /api/admin/activity/update
**参数**
```json
{
   ????哪个页面？
}
```

**返回**
```json
{
    "errcode": 0,
    "errmsg": ""
}
```

### 8. 活动上线
**POST**
** URL ** /api/admin/activity/publish

**参数**
```json
{
	actid: actid
}
```

**参数说明**

名称 | 类型 | 是否必须 | 备注
-----|------|----------|-----
actid|number|Y|

**成功返回**
```json
{
	"errcode": 0,
	"errmsg": "",
}
```

**失败返回**
```json
{
	"errcode": 1,
	"errmsg": "errmsg"
}
```

### 9. 查看报名信息
**GET**
** URL ** /api/admin/activity-sign-user?actid=3

**参数说明**

名称 | 类型 | 是否必须 | 备注
-----|------|----------|-----
actid|number|Y|

**成功返回**
```json
{
	"errcode": 0,
	"errmsg": "",
	"users": [
		{
			"avatar": "avatar",
			"wx_nickname": "三炮",
			"name": "张三",
			"phone": "138****",
			"kid_age": 4,
			"kid_gender": "男"
		},
		...
	],
	"pageable": {
		"page": 2,
		"total": 4
	}
}
```

**失败返回**
```json
{
	"errcode": 1,
	"errmsg": "errmsg"
}
```

### 10. 导出报名信息
**POST**
** URL ** /api/admin/export-activity-users

**参数**
```json
{
	actid: 2
}
```

**成功返回**
字节流

**失败返回**
```json
{
	"errcode": 1,
	"errmsg": "errmsg"
}
```

### 11. 替换活动微信群二维码
**POST**
** URL ** /api/admin/replace-qr

**参数**
```json
{
	"actid": 3,
	"qrcode": "http://qrcode.jpg"
}
```

**参数说明**

名称 | 类型 | 是否必须 | 备注
-----|------|----------|-----
actid|number|Y|
qrcode|url|Y|二维码url

**成功返回**
```json
{
	"errcode": 0,
	"errmsg": "",
}
```

**失败返回**
```json
{
	"errcode": 1,
	"errmsg": "errmsg"
}
```

### 12.1. 获取城市列表
**GET**
** URL ** /api/admin/get-cities?province=广东省

**参数**
```json
{
	"values": ["广州市","东莞市"],
	"errcode": 0,
	"errmsg": "errmsg"
}
```

### 12.2. 获取一级活动分类
**GET**
** URL ** /api/admin/get-acttypes?level=1 TODO

**参数**
```json
{
	"values": ["t1","t2"],
	"errcode": 0,
	"errmsg": "errmsg"
}
```

### 12.3. 获取二级活动分类
**GET**
** URL ** /api/admin/get-acttypes?level=2 TODO

### 12. 创建活动 newactivity
**POST**
** URL ** /api/admin/activities/add TODO

**参数**
```json
{
	"title":"云南亲子一日游",
	"coverImage":"http://www.xxx.jpg",
	"beginTime":"20160602",
	"endTime":"20160602",
	"city":"广州",
	"area":"越秀区",
	"address":"越秀广场",
	"firstClassification": 3333,
	"secondClassification": 3333,
	"isFree": false,
	"kidFee": 300,
	"adultFee": 300,
	"personNum": 33,
	"ageGroup": "3-6",
	"qrcode":"http://url.jpg",
	"details":"活动详情活动详情活动详情"
}
```

**参数说明**

名称 | 类型 | 是否必须 | 备注
-----|------|----------|-----
title|string|Y|活动标题
coverImage|url|Y|封面图
beginTime|string|Y|活动开始时间
endTime|string|Y|活动结束时间
city|string|Y|活动集合地点城市
area|string|Y|活动集合地点区域
address|string|Y|活动集合地点具体地址
firstClassification|number|Y|活动一级分类
secondClassification|number|Y|活动二级分类
isFree|boolean|Y|是否收费
kidFee|string|N|收费时必须
adultFee|string|N|收费时必须
personNum|number|Y|人数限制
ageGroup|string|Y|适合的年龄段
qrcode|url|N|活动微信群二维码
details|text|Y|活动详情

**成功返回**
```json
{
	"errcode": 0,
	"errmsg": "",
}
```

**失败返回**
```json
{
	"errcode": 1,
	"errmsg": "errmsg"
}
```

### 13. 添加优惠 addpreference
**POST**
** URL ** /api/admin/activities/preference/add

**参数**
```json
{
	"description": "",
	"beginTime:": "2016-08-12",
	"endTime": "2016-09-30",
	"maxnum": 20,
	"actid": 20,
	"discountPrice": "40.00"
}
```

**参数说明**

名称 | 类型 | 是否必须 | 备注
-----|------|----------|-----
description|string|Y|优惠信息说明
beginTime|string|Y|优惠开始时间
endTime|string|Y|优惠结束时间
maxnum|number|Y|优惠报名人数限制
actid|number|N|活动
discountPrice|string|Y|折后价


**成功返回**
```json
{
	"errcode": 0,
	"errmsg": "",
}
```

**失败返回**
```json
{
	"errcode": 1,
	"errmsg": "errmsg"
}
```

### 14.优惠活动列表
**get**
**url** /api/admin/activities/preference/list?area=xxx&age=x&page=x&page_size=x

**返回**
```json
{
    "preferencelist": [
        {
            "content": 33,
            "beginTime": 1471535651971,
            "endTime": 1471535651971,
            "status": "状态",
        },
        ...
    ],
    "pageable": {
        "page": 0,
        "total": 1
    },
    "errcode": 0,
    "errmsg": ""
}
```

### 15. 商户验证
**POST**
** URL ** /api/admin/business/authorize

**参数**
```json
{
	"item":"服务项目",
    "hasbusilicense":"是否有营业执照",
    "license":"营业执照号",
    "licensePic":"营业执照照片",
    "identity":"身份证号"，
    "identityPic":"身份证图片",
    "companyTel":"公司客服电话",
    "companyName":"门店名称",
    "city":"城市",
    "area":"区域",
    "address":"详细地址",
    "contactName":"联系人姓名",
    "contactTel":"联系人电话",
    "contactEmail":"联系人邮箱",
    "contactQQ":"联系人QQ号",
    "contactWechat":"联系人微信号"
}
```

**成功返回**
```json
{
	"errcode": 0,
	"errmsg": "",
}
```

**失败返回**
```json
{
	"errcode": 1,
	"errmsg": "errmsg"
}
```

### 16.信息设置 account_setting
**post**
**url**/api/admin/account/set

**参数**
```json
{
    "favicon":"头像",
    "accountName":"商户的名称",
    "newPwd":"修改密码后的新密码"
}
```

**返回**
```json
{
    "errcode": 0,
    "errmsg": ""
}
```

### 17.管理员主页 superadmin home
**重用 current-activities unpublish-activities**


### 18.活动 superadmin-activity
**get**
**重用url**/api/admin/current-activities? city=a&type=b&page=1&pagesize=1

**返回**
```json
{
    "city":"筛选条件"
    "activities":[
        {
	    "activityName":"活动名称",
	    "onlinetime":"活动上线时间",
	    "classification":"类型",
	    "status":"当前状态",
        },
	...
    ],
    "pageable": {
        "page": 0,
        "total": 1
    },
    "errcode": 0,
    "errmsg": ""
}
```

### 18.1.活动下线
**post**
**url** 重用/api/admin/activity/offline

### 18.2.活动删除
**post**
**url** 重用/api/admin/activity/delete

### 19.添加优惠 superadmin addpreference
**post**
**url** 重用 /api/admin/activities/preference/add


### 20.优惠列表 preferencelist
**get**
**url** 重用 /api/admin/activities/preference/list?area=xxx&age=x&page=x&page_size=x


### 21. 审核认证 superadmin authorization
**get**
**url** /api/superadmin/businessman/list?city=city&status=audit&page=1&pagesize=10
**返回**
```json
{
    "businessman":[
    {
        "adminAccount":"商户账号",
        "adminTel":"商户手机号",
        "applicationTime":"申请日期",
    },
    ...
    ],
    "pageable": {
        "page": 0,
        "total": 1
    },
    "errcode": 0,
    "errmsg": ""
}
```

### 22.认证 superadmin authorization
**post**
**url** 重用 /api/admin/business/authorize


### 23.报名信息 superadmin-signup/list
**post**
**url** /api/superadmin/signup/list?city=city&time=time&page=1&pagesize=100
**返回**
```json
{
    "signup": [
    	{
		    "title":"活动",
		    "wechat":"用户微信号",
		    "name":"用户姓名",
		    "tel":"用户的电话号码",
		    "childAge":"儿童年龄",
		    "childSex":"儿童性别"
	    }
    ],
    "pageable": {
        "page": 0,
        "total": 1
    },
    errcode: 0,
    errmsg: ""
}
```
