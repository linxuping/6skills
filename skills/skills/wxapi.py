# -*- coding: utf-8 -*-
from django.http import HttpResponse,HttpResponseRedirect
from django.template import Template,Context,RequestContext
from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib import auth
import skills.settings as settings
import traceback
import time
import os
import sys
import modules as mo
import dbmgr
import datetime
from common import *
reload(sys)
sys.setdefaultencoding('utf-8')
import json


@req_print
def activities_special_offers(req):
	#check.
	ret,city = check_mysql_arg_jsonobj("city", req.GET.get("city",None), "str")
	if not ret:
		return city
	ret,district = check_mysql_arg_jsonobj("district", req.GET.get("district",None), "str")
	if not ret:
		return district
	ret,age = check_mysql_arg_jsonobj("age", req.GET.get("age",None), "str")
	tmps = age.split("-")
	if (not ret) or len(tmps)!=2 or (not tmps[0].isdigit()) or (not tmps[1].isdigit()):
		return response_json_error( "age invalid! must be *-*" )
	_age_from = int(str(tmps[0]))
	_age_to = int(str(tmps[1]))
	ret,page = check_mysql_arg_jsonobj("page", req.GET.get("page",None), "int")
	if not ret:
		return page
	ret,pagesize = check_mysql_arg_jsonobj("pagesize", req.GET.get("pagesize",None), "int")
	if not ret:
		return pagesize
	ret,pagetype = check_mysql_arg_jsonobj("type", req.GET.get("type",None), "str")
	sql_datefilter = ""
	#1 weekend.
	#1 weekend - 1 month.
	if pagetype == "preview":
		sql_datefilter = "a.time_from>DATE_ADD(NOW(),INTERVAL 2 WEEK) and "
	else:
		sql_datefilter = "a.time_from<=DATE_ADD(NOW(),INTERVAL 2 WEEK) and "

	#exec 
	_json = { "activities":[],"pageable":{"page":0,"total":1},"errcode":0,"errmsg":"" }
	if district == "": #by date
		_sql = "select a.id,imgs_act,title,content,b.name,c.name,age_from,age_to,a.price_child,a.price_adult,a.quantities_remain,img_cover from 6s_activity a left join 6s_preinfo a2 on a.preinfo_id=a2.id left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where %s ((age_from between %d and %d) or (age_to between %d and %d) or (age_from<%d and age_to>%d)) and a.status=1 order by a.createtime desc limit %d offset %d;"%(sql_datefilter,_age_from,_age_to,_age_from,_age_to,_age_from,_age_to,pagesize,pagesize*(page-1) )
	else: #by distr and date
		_sql = "select * from ((select a.id,imgs_act,title,b.name as type,c.name,age_from,age_to,a.price_child as pchild,a.price_adult as padult,a.quantities_remain as qremains,img_cover,DATE_ADD(a.createtime,INTERVAL 6 MONTH),a2.price_child as sortdate from 6s_activity a left join 6s_preinfo a2 on a.preinfo_id=a2.id left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where %s c.pid=(select id from 6s_position where name ='%s') and ((age_from between %d and %d) or (age_to between %d and %d) or (age_from<%d and age_to>%d)) and a.status=1)  union  (select a.id,imgs_act,title,b.name as type,c.name,age_from,age_to,a.price_child as pchild,a.price_adult as padult,a.quantities_remain as qremains,img_cover,a.createtime as sortdate,a2.price_child from 6s_activity a left join 6s_preinfo a2 on a.preinfo_id=a2.id left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where %s c.pid<>(select id from 6s_position where name='%s') and ((age_from between %d and %d) or (age_to between %d and %d) or (age_from<%d and age_to>%d)) and a.status=1)) as tmptable order by sortdate desc limit %d offset %d;"%(sql_datefilter,district,_age_from,_age_to,_age_from,_age_to,_age_from,_age_to,sql_datefilter,district,_age_from,_age_to,_age_from,_age_to,_age_from,_age_to,pagesize,pagesize*(page-1) )
	count,rets=dbmgr.db_exec(_sql)
	if count >= 0:
		for i in range(count):
			lis = rets[i]
			imgs = lis[1].strip("\r\n ").split(" ")
			_json["activities"].append( {"actid":lis[0], "imgs":imgs,"title":lis[2],"tags":lis[3],"area":lis[4],"ages":"%s-%s"%(lis[5],lis[6]),"price_child":(lis[7] if lis[12]==None else lis[12]),"quantities_remain":lis[9],"img_cover":lis[10]} )#,"price_child_pre":lis[11],"preinfo":lis[13]
	else:
		_json["errcode"] = 1
		_json["errmsg"] = "数据操作异常."
		mo.logger.error("db fail. ")

	#if district == "":
	_sql = "select count(a.id) from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where %s ((age_from between %d and %d) or (age_to between %d and %d)) and a.status=1; "%(sql_datefilter,_age_from,_age_to,_age_from,_age_to)
	#else:
	#	_sql = "select count(a.id) from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where %s c.pid=(select id from 6s_position where name ='%s') and ((age_from between %d and %d) or (age_to between %d and %d)) and a.status=1; "%(sql_datefilter,area,_age_from,_age_to,_age_from,_age_to)
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		_json["pageable"]["total"] = int(rets[0][0])/pagesize+1
		_json["pageable"]["page"] = page

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp
	#return HttpResponseRedirect('/test2')


@req_print
def activities_preview(req):
	area = req.GET.get("area",None)
	area2 = req.GET.get("area2",None)
	age = req.GET.get("age",'0')
	page = req.GET.get("page",'0')
	page_size = req.GET.get("page_size",'0')
	#check.
	ret,area = check_mysql_arg_jsonobj("area", req.GET.get("area",None), "str")
	if not ret:
		return area
	#ret,area2 = check_mysql_arg_jsonobj("area2", req.GET.get("area2",None), "str")
	#if not ret:
	#	return area
	ret,age = check_mysql_arg_jsonobj("age", req.GET.get("age",None), "str")
	if not ret:
		return age
	ret,page = check_mysql_arg_jsonobj("page", req.GET.get("page",None), "int")
	if not ret:
		return page
	ret,pagesize = check_mysql_arg_jsonobj("pagesize", req.GET.get("pagesize",None), "int")
	if not ret:
		return pagesize
	#exec 
	_json = { "activities":[],"pageable":{"page":0,"total":1},"errcode":0,"errmsg":"" }
	_sql = "select a.id,imgs_act,title,content,b.name,c.name,age_from,age_to,price_child,price_adult,quantities_remain from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where c.pid=(select id from 6s_position where name ='%s')  limit %d offset %d;"%(area,pagesize,pagesize*(page-1))
	count,rets=dbmgr.db_exec(_sql)
	if count >= 0:
		for i in range(count):
			lis = rets[i]
			imgs = lis[1].strip("\r\n ").split(" ")
			_json["activities"].append( {"imgs":imgs,"title":lis[2],"content":lis[3],"tags":lis[4],"area":lis[5],"ages":"%s-%s"%(lis[6],lis[7]),"price_child":lis[8],"quantities_remain":lis[10]} )
	else:
		_json["errcode"] = 1
		_json["errmsg"] = "数据操作失败."
		mo.logger.error("activities_preview sql exec count:%d. "%count)

	_sql = "select count(a.id) from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where c.pid=(select id from 6s_position where name ='%s');"%(area)
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		_json["pageable"]["total"] = int(rets[0][0])/pagesize+1
		_json["pageable"]["page"] = page

	_jsonobj = json.dumps(_json)
	return HttpResponse(_jsonobj, mimetype='application/json')
	#return HttpResponseRedirect('/test2') 


@req_print
def activities_details(req):
	#check.
	ret,actid = check_mysql_arg_jsonobj("actid", req.GET.get("actid",None), "int")
	if not ret:
		return actid

	#exec 
	_json = { "errcode":0,"errmsg":"" }
	_sql = "select a.id,imgs_act,title,a.content,b.name,c.name,age_from,age_to,a.price_child,a.price_adult,a.quantities_remain,img_cover,imgs_act,preinfo,DATE_FORMAT(a.time_from,'%%Y-%%m-%%d'),DATE_FORMAT(a.time_to,'%%Y-%%m-%%d'),a2.price_child,a2.price_adult,a2.content from 6s_activity a left join 6s_preinfo a2 on a.preinfo_id=a2.id left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where a.id=%d;"%actid
	count,rets=dbmgr.db_exec(_sql)
	if count == 1:
		for i in range(count):
			lis = rets[i]
			imgs = lis[1].strip("\r\n ").split(" ")
			_json.update( {"actid":lis[0],"imgs":imgs,"title":lis[2],"content":lis[3],"tags":lis[4],"area":lis[5],"ages":"%s-%s"%(lis[6],lis[7]),"price_child":lis[8],"quantities_remain":lis[10],"img_cover":lis[11],"imgs_act":lis[12],"time_from":lis[14],"time_to":lis[15],"price_child_pre":lis[16],"preinfo":lis[18]} ) 
	elif count == 0:
		_json["errcode"] = 1
		_json["errmsg"] = "activity:%d not exist."%actid
	else:
		_json["errcode"] = 1
		_json["errmsg"] = "数据操作失败."
		mo.logger.error("activities_details sql exec count:%d. "%count)

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp
	#return HttpResponseRedirect('/test2') 


@req_print
def get_authcode(req):
	#check.
	ret,phone = check_mysql_arg_jsonobj("phone", req.GET.get("phone",None), "int")
	if not ret:
		return phone
	ret,openid = check_mysql_arg_jsonobj("openid", req.GET.get("openid",None), "str")
	if not ret:
		return openid

	#exec  1\create 6s_user;2\put identifying code;3\send sms and input
	import random
	code = random.randint(1000,9999)
	_json = { "errcode":0,"errmsg":"" }
	#_sql = "insert into 6s_idencode(openid,code,createtime) values('%s',%d,now()) ON DUPLICATE KEY UPDATE code=VALUES(code);"%(openid, code)
	count,rets=dbmgr.db_exec("delete from 6s_idencode where openid='%s';"%openid)
	_sql = "insert into 6s_idencode(openid,code,createtime) values('%s',%d,now());"%(openid, code)
	count,rets=dbmgr.db_exec(_sql)
	#if count<0 and str(rets).find("UNIQUE KEY is unsafe")!=-1:
	if count < 0:
		_json["errcode"] = 1
		_json["errmsg"] = "数据操作异常."
		mo.logger.error("db fail. ")
	else:
		import top
		top.setDefaultAppInfo(settings.sms_id, settings.sms_secret)
		req = top.api.AlibabaAliqinFcSmsNumSendRequest()

		req.sms_type = "normal"
		req.sms_free_sign_name = "测试"
		req.sms_param = "{\"number\":\"%s\"}" % (code)
		req.rec_num = "%s" % (phone)
		req.sms_template_code = "SMS_13250672"
		try:
			resp = req.getResponse()
			if resp["alibaba_aliqin_fc_sms_num_send_response"]["result"]["err_code"] == "0":
				mo.logger.error("send sms to %s:%s. "%(phone,code) )
				pass
			else:
				_json["errcode"] = 1
				_json["errmsg"] = "验证码发送失败(1)."
				mo.logger.error("send sms fail: %s" % (resp))
		except Exception, e:
			ret = str(sys.exc_info()) + "; " + str(traceback.format_exc()) 
			_json["errcode"] = 1
			_json["errmsg"] = "验证码发送失败(2)."
			mo.logger.error("send sms fail: %s"%ret )
	_jsonobj = json.dumps(_json)
	return HttpResponse(_jsonobj, mimetype='application/json')


@csrf_exempt
@req_print
def wxauth_idencode(req):
	args = req.POST
	#check.
	ret,phone = check_mysql_arg_jsonobj("phone", args.get("phone",None), "int")
	if not ret:
		return phone
	ret,openid = check_mysql_arg_jsonobj("openid", args.get("openid",None), "str")
	if not ret:
		return openid
	ret,code = check_mysql_arg_jsonobj("code", args.get("code",None), "int")
	if not ret:
		return code

	#exec  1\create 6s_user;2\put identifying code;3\send sms and input
	_json = { "errcode":0,"errmsg":"" }
	_sql = "select * from 6s_idencode where openid='%s' and code='%s';"%(openid,code)
	count,rets=dbmgr.db_exec(_sql)
	if count == 1:
		#save to 6s_user.
		_sql = "select * from 6s_user where openid='%s';"%(openid)
		count,rets=dbmgr.db_exec(_sql)
		if count == 0:
			_sql = "insert into 6s_user(phone,openid,createtime) values('%s','%s',now());"%(phone,openid)
			count,rets=dbmgr.db_exec(_sql)
			if count == 1:
				pass
			else:
				mo.logger.error("insert user failed.")
				pass
				#if str(rets).find("Duplicate entry ") != -1:
				#	_json["errcode"] = 1
				#	_json["errmsg"] = "用户已经存在！" #?????
				#else:
				#	_json["errcode"] = 1
				#	_json["errmsg"] = get_errtag()+"Add user failed."
	else:
		_json["errcode"] = 1
		_json["errmsg"] = "验证码错误."
		mo.logger.warn("验证码错误.")

	_jsonobj = json.dumps(_json)
	return HttpResponse(_jsonobj, mimetype='application/json')
	#return HttpResponseRedirect('/test2') 


@csrf_exempt
@req_print
def activities_sign(req):
	args = req.POST
	#check.
	ret,phone = check_mysql_arg_jsonobj("phone", args.get("phone",None), "int")
	if not ret:
		return phone
	ret,openid = check_mysql_arg_jsonobj("openid", args.get("openid",None), "str")
	if not ret:
		return openid
	ret,name = check_mysql_arg_jsonobj("name", args.get("name",None), "str")
	if not ret:
		return name
	ret,actid = check_mysql_arg_jsonobj("actid", args.get("actid",None), "int")
	if not ret:
		return actid
	ret,age = check_mysql_arg_jsonobj("age", args.get("age",None), "int")
	if not ret:
		return age
	ret,gender = check_mysql_arg_jsonobj("gender", args.get("gender",None), "str")
	if not ret:
		return gender

	#exec  1\create 6s_user;2\put identifying code;3\send sms and input
	_json = { "errcode":0,"errmsg":"" }
	_sql = "select quantities_remain,img_qrcode from 6s_activity where id=%d and status=1;"%(actid)
	count,rets=dbmgr.db_exec(_sql)
	if count == 1:
		_json["qrcode"] = rets[0][1]
		if int(rets[0][0]) <= 0:
			_json["errcode"] = 1
			_json["errmsg"] = "已经没有剩余名额,可以尝试联系客服看有无名额调配！"
			mo.logger.warn("quantities_remain=%s. act:%d."%(rets[0][0],actid))
		else:
			_sql = "select id from 6s_user where openid='%s';"%openid   #or phone ???
			count,rets=dbmgr.db_exec(_sql)
			if count == 0:
				_sql = "insert into 6s_user(phone,openid,createtime) values('%s','%s',now());"%(phone,openid)
				count,rets=dbmgr.db_exec(_sql)
				if count == 0: #try more.
					count,rets=dbmgr.db_exec(_sql)

			_sql = "select id from 6s_user where openid='%s' and status=1;"%openid
			count,rets=dbmgr.db_exec(_sql)
			if count == 1:
				uid = int(rets[0][0])
				_sql = "select id from 6s_signup where user_id=%d and act_id=%d and status=1;"%(uid,actid)
				count,rets=dbmgr.db_exec(_sql)
				if count == 0: 
					#save to 6s_user.
					_sql = "insert into 6s_signup(user_id,act_id,username_pa,age_ch,phone,gender,createtime) values(%d,%d,'%s',%d,'%s','%s',now());"%(uid,actid,name,age,phone,gender)
					count,rets=dbmgr.db_exec(_sql)
					if count == 1:
						_sql = "update 6s_activity set quantities_remain=quantities_remain-1 where id=%d;"%(actid)
						count,rets=dbmgr.db_exec(_sql)
						if count == 1:
							pass
						else:
							_json["errcode"] = 1
							_json["errmsg"] = "报名剩余人数-1失败！act:%d,u:%d"%(actid,uid)
							mo.logger.error("报名剩余人数-1失败！act:%d,u:%d"%(actid,uid))
					else:
						if str(rets).find("Duplicate entry ") != -1:
							_json["errcode"] = 1
							_json["errmsg"] = "报名信息已经存在！act:%d,u:%d"%(actid,uid)
							mo.logger.error("报名信息已经存在！act:%d,u:%d"%(actid,uid))
						else:
							_json["errcode"] = 2
							_json["errmsg"] = "报名失败. "
							mo.logger.error("报名失败. actid:%d,uid:%d. "%(actid,uid))
				else:
					_json["errcode"] = 3
					_json["errmsg"] = "您已经对该活动报过名."
					mo.logger.error("您已经对该活动报过名.  act:%d,u:%d."%(actid,uid))
			else:
				_json["errcode"] = 4
				_json["errmsg"] = "用户不存在."
				mo.logger.error("用户信息异常. openid:%s count:%d"%(openid,count) )
	else:
		_json["errcode"] = 5
		_json["errmsg"] = "活动不存在."
		mo.logger.error("活动:%d不存在."%actid )

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp
	#return HttpResponseRedirect('/test2') 


@req_print
def activities_my(req):
	#check.
	ret,openid = check_mysql_arg_jsonobj("openid", req.GET.get("openid",None), "str")
	if not ret:
		return openid
	ret,page = check_mysql_arg_jsonobj("page", req.GET.get("page",None), "int")
	if not ret:
		return page
	if page < 1:
		page = 1
	ret,pagesize = check_mysql_arg_jsonobj("pagesize", req.GET.get("pagesize",None), "int")
	if not ret:
		return pagesize

	#exec  1\create 6s_user;2\put identifying code;3\send sms and input
	_json = { "activities":[],"pageable":{"page":0,"total":0},"errcode":0,"errmsg":"" }
	_sql = "select a.act_id,c.title,DATE_FORMAT(a.createtime,'%%Y-%%m-%%d'),c.position_details,a.id,DATE_FORMAT(c.time_from,'%%Y-%%m-%%d'),a.id from 6s_signup a left join 6s_user b on a.user_id=b.id left join 6s_activity c on a.act_id=c.id where b.openid='%s' and a.status=1 and b.status=1 and c.status=1 order by a.createtime desc limit %d offset %d;"%(openid,pagesize,pagesize*(page-1))
	count,rets=dbmgr.db_exec(_sql)
	if count >= 0:
		for i in range(count):
			_json["activities"].append( {"actid":rets[i][0],"title":rets[i][1],"time_signup":rets[i][2],"signid":rets[i][4],"time_act":rets[i][5],"signid":rets[i][6]} )
		_sql = "select count(a.act_id) from 6s_signup a left join 6s_user b on a.user_id=b.id left join 6s_activity c on a.act_id=c.id where b.openid='%s' and b.status=1 and c.status=1;"%(openid)
		count,rets=dbmgr.db_exec(_sql)
		if count == 1:
			_json["pageable"]["total"] = int(rets[0][0])
			_json["pageable"]["page"] = page
		else:
			_json["errcode"] = 1
			_json["errmsg"] = "数据操作失败."
			mo.logger.error("get signup count fail. actid:%d"%actid )
	else:
		_json["errcode"] = 1
		_json["errmsg"] = "数据操作失败."
		mo.logger.error("db fail." )

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	makeup_header_cache_ignore(resp)
	return resp
	#return HttpResponseRedirect('/test2') 


@csrf_exempt
@req_print
def activities_reset(req):
	args = req.POST
	#check.
	ret,signid = check_mysql_arg_jsonobj("signid", args.get("signid",None), "int")
	if not ret:
		return signid
	ret,openid = check_mysql_arg_jsonobj("openid", args.get("openid",None), "str")
	if not ret:
		return openid

	#exec  1\create 6s_user;2\put identifying code;3\send sms and input
	_json = { "errcode":0,"errmsg":"" }
	_sql = "update 6s_signup a left join 6s_user b on a.user_id=b.id left join 6s_activity c on a.act_id=c.id set c.quantities_remain=c.quantities_remain+1, a.status=0 where a.id=%d and b.openid='%s';"%(signid,openid)
	count,rets=dbmgr.db_exec(_sql)
	if count == 1:
		pass
	elif count == 0:
		_json["errcode"] = 1
		_json["errmsg"] = "报名信息未更新."
		mo.logger.warn("Nothing update.." )
	else:
		_json["errcode"] = 1
		_json["errmsg"] = "数据操作异常."
		mo.logger.error("db fail." )

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@req_print
def activities_getareas(req):
	#check.
	ret,city = check_mysql_arg_jsonobj("city", req.GET.get("city",None), "str")
	if not ret:
		return city

	#exec  
	_json = { "values":[],"errcode":0,"errmsg":"" }
	_sql = "select name from 6s_position where pid=(select id from 6s_position where name='%s');"%city
	count,rets=dbmgr.db_exec(_sql)
	if count >0 :
		for i in xrange(count):
			_json["values"].append( rets[i][0] )
	else:
		_json["errcode"] = 1
		_json["errmsg"] = "该城市区域未入库."
		mo.logger.error("该城市区域未入库. city:%s"%city )

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@req_print
def activities_getcities(req):
	ret,province = check_mysql_arg_jsonobj("province", req.GET.get("province",None), "str")
	if not ret:
		return province

	#exec  
	_json = { "values":[],"errcode":0,"errmsg":"" }
	_sql = "select name from 6s_position where pid=(select id from 6s_position where name='%s');"%province
	count,rets=dbmgr.db_exec(_sql)
	if count >0 :
		for i in xrange(count):
			_json["values"].append( rets[i][0] )
	else:
		_json["errcode"] = 1
		_json["errmsg"] = "该省区域未入库."
		mo.logger.error("该省区域未入库. province:%s"%province )

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@req_print
def activities_getagesel(req):
	#check.
	#exec  
	_json = { "values":["0-3","4-6","7-12"],"errcode":0,"errmsg":"" }
	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@req_print
def activities_getqrcode(req):
	args = req.GET	
	#check.
	ret,actid = check_mysql_arg_jsonobj("actid", args.get("actid",None), "int")
	if not ret:
		return actid

	#exec  
	_json = { "profile":{},"errcode":0,"errmsg":"" }
	_sql = "select img_qrcode from 6s_activity where id='%d';"%actid
	count,rets=dbmgr.db_exec(_sql)
	if count == 1 :
		_json["profile"] = { "qrcode":rets[0][0] }
	else:
		_json["errcode"] = 1
		_json["errmsg"] = "找不到该活动."
		mo.logger.error("cannot find activity:%d. "%actid+REQ_TAG(args))

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp



@req_print
def activities_getprofile(req):
	#check.
	ret,openid = check_mysql_arg_jsonobj("openid", req.GET.get("openid",None), "str")
	if not ret:
		return openid

	#exec  
	_json = { "profile":{},"errcode":0,"errmsg":"" }
	_sql = "select username,phone,img from 6s_user where openid='%s';"%openid
	count,rets=dbmgr.db_exec(_sql)
	if count == 1 :
		_json["profile"] = { "username":rets[0][0],"phone":rets[0][1],"img":rets[0][2] }
	else:
		_json["errcode"] = 1
		_json["errmsg"] = "找不到当前用户."
		mo.logger.error("cannot find user:%s. "%openid+REQ_TAG(args))

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@req_print
def activities_mycollections(req):
	args = req.GET
	#check.
	ret,openid = check_mysql_arg_jsonobj("openid", req.GET.get("openid",None), "str")
	if not ret:
		return openid
	ret,page = check_mysql_arg_jsonobj("page", req.GET.get("page",None), "int")
	if not ret:
		return page
	if page < 1:
		page = 1
	ret,pagesize = check_mysql_arg_jsonobj("pagesize", req.GET.get("pagesize",None), "int")
	if not ret:
		return pagesize

	#exec  1\create 6s_user;2\put identifying code;3\send sms and input
	_json = { "activities":[],"pageable":{"page":0,"total":0},"errcode":0,"errmsg":"" }
	_sql = "select a.act_id,c.title,DATE_FORMAT(a.createtime,'%%Y-%%m-%%d'),c.position_details,a.id,DATE_FORMAT(c.time_from,'%%Y-%%m-%%d'),a.id from 6s_collection a left join 6s_user b on a.openid=b.openid left join 6s_activity c on a.act_id=c.id where b.openid='%s' and a.status=1 and b.status=1 and c.status=1 order by a.createtime desc limit %d offset %d;"%(openid,pagesize,pagesize*(page-1))
	count,rets=dbmgr.db_exec(_sql)
	if count >= 0:
		for i in range(count):
			_json["activities"].append( {"actid":rets[i][0],"title":rets[i][1],"time_signup":rets[i][2],"signid":rets[i][4],"time_act":rets[i][5],"collid":rets[i][6]} )
		_sql = "select count(a.act_id) from 6s_collection a left join 6s_user b on a.openid=b.openid left join 6s_activity c on a.act_id=c.id where b.openid='%s' and b.status=1 and c.status=1;"%(openid)
		count,rets=dbmgr.db_exec(_sql)
		if count == 1:
			_json["pageable"]["total"] = int(rets[0][0])
			_json["pageable"]["page"] = page
		else:
			_json["errcode"] = 1
			_json["errmsg"] = "数据操作异常."
			mo.logger.error("get collection count failed. "+REQ_TAG(args))
	else:
		_json["errcode"] = 2
		_json["errmsg"] = "数据操作异常."
		mo.logger.error("DB failed."+REQ_TAG(args))

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	makeup_header_cache_ignore(resp)
	return resp


@csrf_exempt
@req_print
def activities_reset_collection(req):
	args = req.POST
	#check.
	ret,collid = check_mysql_arg_jsonobj("collid", args.get("collid",None), "int")
	if not ret:
		return collid
	ret,openid = check_mysql_arg_jsonobj("openid", args.get("openid",None), "str")
	if not ret:
		return openid

	#exec  1\create 6s_user;2\put identifying code;3\send sms and input
	_json = { "errcode":0,"errmsg":"" }
	_sql = "delete from 6s_collection where id='%d';"%(collid)   
	count,rets=dbmgr.db_exec(_sql)
	if count == 1:
		pass
	else:
		_json["errcode"] = 1
		_json["errmsg"] = "取消收藏失败."
		mo.logger.error("del collection failed."+REQ_TAG(args))

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@csrf_exempt
@req_print
def activities_collect(req):
	args = req.POST
	#check.
	ret,openid = check_mysql_arg_jsonobj("openid", args.get("openid",None), "str")
	if not ret:
		return openid
	ret,actid = check_mysql_arg_jsonobj("actid", args.get("actid",None), "int")
	if not ret:
		return actid

	#exec  1\create 6s_user;2\put identifying code;3\send sms and input
	_json = { "errcode":0,"errmsg":"" }
	_sql = "select * from 6s_collection where openid='%s' and act_id='%s';"%(openid,actid)   
	count,rets=dbmgr.db_exec(_sql)
	if count == 0:
		_sql = "insert into 6s_collection(act_id,openid,createtime) values('%s','%s',now());"%(actid,openid)
		count,rets=dbmgr.db_exec(_sql)
		if count == 0: #try more.
			count,rets=dbmgr.db_exec(_sql)
			if count == 0:
				_json["errcode"] = 1
				_json["errmsg"] = "收藏失败！"
				mo.logger.error("collect fail.  act:%d,openid:%s."%(actid,openid))
	#mo.logger.info("collect ok.  act:%d,openid:%s."%(actid,openid))
	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@req_print
def activities_getsignupstatus(req):
	args = req.GET
	#check.
	ret,openid = check_mysql_arg_jsonobj("openid", req.GET.get("openid",None), "str")
	if not ret:
		return openid
	ret,actid = check_mysql_arg_jsonobj("actid", req.GET.get("actid",None), "int")
	if not ret:
		return actid

	#exec  
	_json = { "status":False,"errcode":0,"errmsg":"" }
	_sql = "select a.id,b.img_qrcode from 6s_signup a left join 6s_activity b on a.act_id=b.id left join 6s_user c on a.user_id=c.id where c.openid='%s' and a.act_id=%d;"%(openid,actid)
	count,rets=dbmgr.db_exec(_sql)
	if count == 1 :
		_json["status"] = True
		_json["qrcode"] = rets[0][1]
	else:
		_json["status"] = False
		#_json["errmsg"] = "未报名."
		#mo.logger.info("no sign activity openid:%s actid:%d. "%(openid,actid)+REQ_TAG(args))

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


