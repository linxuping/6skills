## 公众号需要接口

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


