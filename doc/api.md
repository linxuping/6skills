

### 0.001 报名信息
**GET**
**URL** /signupinfo/get?openid=1&signid=12

**返回**
```json
{
	"sign_type":3,
	"actid": 2,
	"username_pa":"",
	"kids_name":"",
	"age":"",
	"birthdate":"",
	"phone":"",
	"gender":"",
	"city":"",
	"identity_card":"",
	"program":"",
	"company":"",
	"teacher":"",
	"teacher_phone":"",
	"match_class":"",
	"major":"",
	"awards":"",
	"company_tel":"",
	"errcode": 0,
	"errmsg": ""
}
```

### 0.002. 报名更新
**POST**
** URL ** /activities/sign 重用

### 0.003. 评论
**POST**
** URL ** /sign/comment

**参数**
```json
{
	"actid":3,
	"openid":'',
	"score": 4,
	"comment": 2,
}
```
**返回**
```json
{
	"errcode": 0,
	"errmsg": ""
}
```

### 0.004 评论列表
**GET**
**URL** /sign/comment/list?actid=2

**返回**
```json
{
	"activities": [
		{
			"actid": 1,
			"title": "title",
			"score": 3,
			"comment": "cmt",
			"time": "2016-01-01",
		}
	]
	"errcode": 0,
	"errmsg": ""
}
```




=====================================================================

### 0.01 付款列表
**GET**
**URL** /activities/pay/list?openid=abc

**返回**
```json
{
	"activities": [
		{
			"pid": 1,
			"status: 2,	1可退款、2申请中、3成功申请
			"title::"abc",
			"time": "2016-10-10",
		},
		...
	],
	"errcode": 0,
	"errmsg": ""
}
```

### 0.02 退
**POST**
**URL** /activities/pay/refund

**参数**
```json
{
	"openid": 138,
	"pid": 2,
 	"reason": "shit"
}
```
**返回**
```json
{
	"errcode": 0,
	"errmsg": ""
}
```

### 0.03 商户认证
**POST**
**URL** /business/auth

**参数**
```json
{
	"openid": 138,
	"img_licence": "img1",
	"img_iden": "img2",
 	"business": "yi++",
	"username": "jim",
	"phone": "1234"
}
```
**返回**
```json
{
	"errcode": 0,
	"errmsg": ""
}
```

### 0.04 商户认证状态
**GET**
**URL** /business/authrization/status?openid=1234

**返回**
```json
{
	"status": 0/1/2/3 未认证/认证通过/处理中/认证失败
	"description": "error info",
	"errcode": 0,
	"errmsg": ""
}
```


### 0.1 滚动栏活动
**GET**
**URL** /activities/hot/list

**返回**
```json
{
	"activities": [
		{
			"id": 1,
			"img": "http://xxx.jpg",
		},
		...
	],
	"errcode": 0,
	"errmsg": ""
}
```

### 0.2 wx端活动分类列表 - 运营展示数据，与实际类型有细微差别(返回数据不适合)
**GET**
**URL** /wx/acttypes/list

**返回**
```json
{
	"acttypes": ["11","22",...],
	"errcode": 0,
	"errmsg": ""
}
```

### 0.3 获得我所在的城市de区域列表
**GET**
** URL ** /wx/nearbyareas/list?openid=***

**参数**
```json
{
	"values": ["天河区","海珠区"],
	"errcode": 0,
	"errmsg": "errmsg"
}
```

### 0.4  未付款条目
**GET**
** URL ** activities/unpay/list?openid=***&page=1&pagesize=100

**参数**
```json
{
	"activities": [
		{
			"actid": "2",
			"time_signup": "xxx",
			"title": "简介",
		},
		...
	],
	"errcode": 0,
	"errmsg": "errmsg"
}
```

### 1. 限时优惠
**GET**
**URL** /activities/special-offers?area=xxx&age=x&type=***&city=***&page=x&page_size=x

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
			"remain": "40",
			"readnum": 43
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
	"signnum": 12,
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

### 10. 获取收藏状态
**GET**
**URL** /activities/collection/get_status?openid=9901&actid=1
**返回**
```json
{
	"status": true,
	"errcode": 0,
	"errmsg": ""
}
```


##后台管理2.1
### 1 课程管理
### 1.1 创建活动 newactivity
**POST**
** URL ** /api/admin/activities/add

**参数**
```json
{
	"title":"云南亲子一日游",
	"coverimage":"http://www.xxx.jpg",
	"begintime":"20160602",
	"endtime":"20160602",
	"city":"广州",
	"area":"越秀区",
	"address":"越秀广场",
	"firstacttype": "本地活动",
	"secondacttype": "手工DIY",
	"cost": 0,
	"personnum": 33,
	"agefrom": 3,
	"ageto": 6,
	"qrcode":"http://url.jpg",
	"content":"活动详情活动详情活动详情",
	"args_def":[  //该部分未定，需要重新结构化传输！
		{
			"name":"输入-文本",
			"type":"value",
			"description":""
		},
		{
			"name":"输入-列表型",
			"type":"obj",
			"description":[
				{"item":"1", "price":190, "limit":20}
			]
		}
	]
}
```

**参数说明**

名称 | 类型 | 是否必须 | 备注
-----|------|----------|-----
title|string|Y|活动标题
coverImage|url|Y|封面图
...

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

### 1.2. 已发布课程
**GET**
** URL ** /api/admin/activities/published?page=1&pagesie=100

**成功返回**
```json
{
	"activities": [
		{
			"actid": 8,
			"title": "abc",
			"publish_time": "20161010 12:30",
			"sign_num": 1000
		}
	],
	"errcode": 0,
	"errmsg": ""
}
```

### 1.2.1 课程下线
**POST**
** URL ** /api/admin/activities/offline

**参数**
```
{
	actid: 2,
}
```

**成功返回**
```json
{
	"errcode": 0,
	"errmsg": ""
}
```

### 1.2.2. 查看报名信息
**GET**
** URL ** /api/admin/activity/sign-users?actid=2&page=1&pagesie=100

**成功返回**
```json
{
	"users": [
		{
			"title": "123",
			"name": "Jim",
			"phone": "1234",
			"time": "2016-10-10"
			"amount": "免费",
		}
	],
	"errcode": 0,
	"errmsg": ""
}
```

### 1.2.3. 导出报名信息
**GET**
** URL ** /api/admin/activity/sign-users/export?actid=2&time_from=*&time_to=*

**成功返回**
```json
{
	" content": “content with csv format.”			
	"errcode": 1,
	"errmsg": "errmsg"
}
```

**失败返回**
```json
{
	"errcode": 1,
	"errmsg": "errmsg"
}
```

### 1.2.4. 替换活动微信群二维码
**POST**
** URL ** /api/admim/qr/replace

**参数**
```json
{
	"actid": 3,
	"qrcode": "http://qrcode.jpg"
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

### 1.3. 未发布课程
**GET**
** URL ** /api/admin/activities/unpublish?page=1&pagesie=100

**成功返回**
```json
{
	"activities": [
		{
			"actid": 8,
			"title": "abc",
		}
	],
	"errcode": 0,
	"errmsg": ""
}
```

### 1.3.1. 上线
**POST**
** URL ** /api/admim/activity/online

**参数**
```json
{
	"actid": 3,
}
```

### 1.3.2. 删除
**POST**
** URL ** /api/admim/activity/delete

**参数**
```json
{
	"actid": 3,
}
```

### 2 商户认证审核 
### 2.1 商户列表
**GET**
** URL ** /api/admim/business/list?time_from=*&time_to=*&page=1&pagesize=100

**参数**
```json
{
	"business": [
		{
			"id": 2,
			"name": *,
			"phone": *,
			"time": *
		},
	]
	"errcode": 0,
	"errmsg": ""
}
```

### 2.2. 认证
**POST**
** URL ** /api/admim/business/auth

**参数**
```json
{
	"id": 3,
	"type": "pass or deny",
	"description": "sdf"
}
```

### 2.3 商户详情
**GET**
** URL ** /api/admim/business/detail?id=2

**参数**
```json
{
	"img_licence": "",
 	"img_iden": "",
	"business": "",
	"name": "",
	"phone": "",
	"errcode": 0,
	"errmsg": ""
}
```

### 3 退款审核 
### 3.1 退款列表
**GET**
** URL ** /api/admim/activity/refund-list?time_from=*&time_to=*&page=1&pagesize=100

**参数**
```json
{
	"name": "",
 	"username": "",
	"phone": "",
	"time": "",
	"reason": "",
	"errcode": 0,
	"errmsg": ""
}
```

### 4 课程报名统计
### 4.1 列表
**GET**
** URL ** /api/admim/activity/refund-list?time_from=*&time_to=*&page=1&pagesize=100

**参数**
```json
{
	"name": "",
 	"username": "",
	"phone": "",
	"time": "",
	"errcode": 0,
	"errmsg": ""
}
```

### 4.2. 导出完整报名表
**GET**
** URL ** /api/admin/activity/sign-users/export






### ----------------------------------- LXP LINE -----------------------------------------------





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
	"info": {
		"publish": 8,
		"sign": 200,
		"page_view": 1000
	},
	"errcode": 0,
	"errmsg": ""
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
** URL ** /api/admin/current-activities?page=1&pagesize=8


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
** URL ** /api/admin/unpublish-activities?page=1&pagesize=8

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
** URL ** /api/admin/activity-sign-user?actid=3&page=1&oagesize=10

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

### 12.1.1. 获取市区列表
**GET**
** URL ** /api/admin/get-areas?city=广州市

**参数**
```json
{
	"values": ["天河区",],
	"errcode": 0,
	"errmsg": "errmsg"
}
```

### 12.2. 获取一级活动分类
**GET**
** URL ** /api/admin/get-acttypes?level=1

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
** URL ** /api/admin/get-acttypes?level=2&type=tt


### 13.1. 获取未优惠的活动列表
**GET**
** URL ** 重用 /api/admin/current-activities?nopref=1&page=1&pagesize=9999
** desc ** nopref没有优惠、pagesize=9999加载全部

### 13. 添加优惠 addpreference
**POST**
** URL ** /api/admin/activities/preference/add TODO.discountPrice

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
**url** /api/admin/activities/preference/list?page=x&page_size=x

**返回**
```json
{
    "preferencelist": [
        {
            "activity": "act1",
            "preinfo": "preinfo1",
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

### 15.1. 商户状态-是否审核中
**GET**
** URL ** /api/admin/business/getstatus TODO

**成功返回**
```json
{
	"status": "输入，待审，成功",
	"errcode": 0,
	"errmsg": "",
}
```

### 15.2. 商户验证 - 重新申请
**POST**
** URL ** 重用 /api/admin/business/authorize
**参数**
```json
{
    "reset":"1",
    ... ...
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


### 21. 审核认证列表 superadmin authorization
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

### 22.获取认证信息
**get**
**url** /api/admin/business/authinfo/get TODO
**返回**
```json
{
	"info": {
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
	},
	"errcode": 0,
	"errmsg": ""
}
```

### 22.1 认证 通过
**post**
**url**/api/admin/authorization/pass TODO

**参数**
```json
{
    "business_id":2
}
```

**返回**
```json
{
    "errcode": 0,
    "errmsg": ""
}
```

### 22.2 认证 不通过
**post**
**url**/api/admin/authorization/reject TODO

**参数**
```json
{
    "business_id":2,
    "description": "abc"
}
```

**返回**
```json
{
    "errcode": 0,
    "errmsg": ""
}
```

### 23.所有报名信息
**get**
** URL ** 重用 /api/admin/activity-sign-user?city=cc&time=tt&page=1&oagesize=10 不带actid参数


### 24.导出所有报名信息
**POST**
** URL ** /api/admin/export-activity-users 不带actid参数
