
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


