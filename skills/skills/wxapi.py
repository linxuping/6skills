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
		sql_datefilter = "time_from>DATE_ADD(NOW(),INTERVAL 2 WEEK) and "
	else:
		sql_datefilter = "time_from<=DATE_ADD(NOW(),INTERVAL 2 WEEK) and "

	#exec 
	_json = { "activities":[],"pageable":{"page":0,"total":1},"errcode":0,"errmsg":"" }
	if district == "": #by date
		_sql = "select a.id,imgs_act,title,content,b.name,c.name,age_from,age_to,price_original,price_current,quantities_remain,img_cover from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where %s ((age_from between %d and %d) or (age_to between %d and %d) or (age_from<%d and age_to>%d)) and a.status=1 order by time_from limit %d offset %d;"%(sql_datefilter,_age_from,_age_to,_age_from,_age_to,_age_from,_age_to,pagesize,pagesize*(page-1) )
	else: #by distr and date
		_sql = "(select a.id,imgs_act,title,content,b.name,c.name,age_from,age_to,price_original,price_current,quantities_remain,img_cover from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where %s c.pid=(select id from 6s_position where name ='%s') and ((age_from between %d and %d) or (age_to between %d and %d) or (age_from<%d and age_to>%d)) and a.status=1 order by time_from)  union  (select a.id,imgs_act,title,content,b.name,c.name,age_from,age_to,price_original,price_current,quantities_remain,img_cover from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where %s c.pid<>(select id from 6s_position where name='%s') and ((age_from between %d and %d) or (age_to between %d and %d) or (age_from<%d and age_to>%d)) and a.status=1 order by time_from)  limit %d offset %d;"%(sql_datefilter,district,_age_from,_age_to,_age_from,_age_to,_age_from,_age_to,sql_datefilter,district,_age_from,_age_to,_age_from,_age_to,_age_from,_age_to,pagesize,pagesize*(page-1) )
	count,rets=dbmgr.db_exec(_sql)
	if count >= 0:
		for i in range(count):
			lis = rets[i]
			imgs = lis[1].strip("\r\n ").split(" ")
			_json["activities"].append( {"actid":lis[0], "imgs":imgs,"title":lis[2],"brief":lis[3],"tags":lis[4],"area":lis[5],"ages":"%s-%s"%(lis[6],lis[7]),"price_original":lis[8],"price_current":lis[9],"quantities_remain":lis[10],"img_cover":lis[11]} )
	else:
		_json["errcode"] = 1
		_json["errmsg"] = get_errtag()+"DB failed."
		pass #error log

	#if district == "":
	_sql = "select count(a.id) from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where ((age_from between %d and %d) or (age_to between %d and %d)) and a.status=1; "%(_age_from,_age_to,_age_from,_age_to)
	#else:
	#	_sql = "select count(a.id) from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where c.pid=(select id from 6s_position where name ='%s') and ((age_from between %d and %d) or (age_to between %d and %d)) and a.status=1; "%(area,_age_from,_age_to,_age_from,_age_to)
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
def activities_special_offers_old(req):
	#check.
	ret,area = check_mysql_arg_jsonobj("area", req.GET.get("area",None), "str")
	if not ret:
		return area
	#ret,area2 = check_mysql_arg_jsonobj("area2", req.GET.get("area2",None), "str")
	#if not ret:
	#	return area
	ret,age = check_mysql_arg_jsonobj("age", req.GET.get("age",None), "str")
	tmps = age.split("_")
	if (not ret) or len(tmps)!=2 or (not tmps[0].isdigit()) or (not tmps[1].isdigit()):
		return response_json_error( "age invalid! must be *_*" )
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
		sql_datefilter = "time_from>DATE_ADD(NOW(),INTERVAL 2 WEEK) and "
	else:
		sql_datefilter = "time_from<=DATE_ADD(NOW(),INTERVAL 2 WEEK) and "

	#exec 
	_json = { "activities":[],"pageable":{"page":0,"total":1},"errcode":0,"errmsg":"" }
	if area == "*":
		_sql = "select a.id,imgs_act,title,content,b.name,c.name,age_from,age_to,price_original,price_current,quantities_remain,img_cover from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where %s ((age_from between %d and %d) or (age_to between %d and %d)) and a.status=1 order by time_from limit %d offset %d;"%(sql_datefilter,_age_from,_age_to,_age_from,_age_to,pagesize,pagesize*(page-1) )
	else:
		_sql = "select a.id,imgs_act,title,content,b.name,c.name,age_from,age_to,price_original,price_current,quantities_remain,img_cover from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where %s c.pid=(select id from 6s_position where name ='%s') and ((age_from between %d and %d) or (age_to between %d and %d)) and a.status=1 order by time_from limit %d offset %d;"%(sql_datefilter,area,_age_from,_age_to,_age_from,_age_to,pagesize,pagesize*(page-1) )
	count,rets=dbmgr.db_exec(_sql)
	if count >= 0:
		for i in range(count):
			lis = rets[i]
			imgs = lis[1].strip("\r\n ").split(" ")
			_json["activities"].append( {"actid":lis[0], "imgs":imgs,"title":lis[2],"brief":lis[3],"tags":lis[4],"area":lis[5],"ages":"%s-%s"%(lis[6],lis[7]),"price_original":lis[8],"price_current":lis[9],"quantities_remain":lis[10],"img_cover":lis[11]} )
	else:
		_json["errcode"] = 1
		_json["errmsg"] = get_errtag()+"DB failed."
		pass #error log

	if area == "*":
		_sql = "select count(a.id) from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where ((age_from between %d and %d) or (age_to between %d and %d)) and a.status=1; "%(_age_from,_age_to,_age_from,_age_to)
	else:
		_sql = "select count(a.id) from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where c.pid=(select id from 6s_position where name ='%s') and ((age_from between %d and %d) or (age_to between %d and %d)) and a.status=1; "%(area,_age_from,_age_to,_age_from,_age_to)
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
	_sql = "select a.id,imgs_act,title,content,b.name,c.name,age_from,age_to,price_original,price_current,quantities_remain from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where c.pid=(select id from 6s_position where name ='%s')  limit %d offset %d;"%(area,pagesize,pagesize*(page-1))
	count,rets=dbmgr.db_exec(_sql)
	if count >= 0:
		for i in range(count):
			lis = rets[i]
			imgs = lis[1].strip("\r\n ").split(" ")
			_json["activities"].append( {"imgs":imgs,"title":lis[2],"brief":lis[3],"tags":lis[4],"area":lis[5],"ages":"%s-%s"%(lis[6],lis[7]),"price_original":lis[8],"price_current":lis[9],"quantities_remain":lis[10]} )
	else:
		_json["errcode"] = 1
		_json["errmsg"] = get_errtag()+"DB failed."
		pass #error log

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
	_sql = "select a.id,imgs_act,title,content,b.name,c.name,age_from,age_to,price_original,price_current,quantities_remain,img_cover,imgs_act,preinfo,DATE_FORMAT(a.time_from,'%%Y-%%m-%%d'),DATE_FORMAT(a.time_to,'%%Y-%%m-%%d') from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where a.id=%d;"%actid
	count,rets=dbmgr.db_exec(_sql)
	if count == 1:
		for i in range(count):
			lis = rets[i]
			imgs = lis[1].strip("\r\n ").split(" ")
			_json.update( {"actid":lis[0],"imgs":imgs,"title":lis[2],"brief":lis[3],"tags":lis[4],"area":lis[5],"ages":"%s-%s"%(lis[6],lis[7]),"price_original":lis[8],"price_current":lis[9],"quantities_remain":lis[10],"img_cover":lis[11],"imgs_act":lis[12],"preinfo":lis[13],"time_from":lis[14],"time_to":lis[15]} ) 
	elif count == 0:
		_json["errcode"] = 1
		_json["errmsg"] = "activity:%d not exist."%actid
	else:
		_json["errcode"] = 1
		_json["errmsg"] = get_errtag()+"DB failed."
		pass #error log

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp
	#return HttpResponseRedirect('/test2') 


@req_print
def get_authcode(req):
	#check.
	#ret,phone = check_mysql_arg_jsonobj("phone", req.GET.get("phone",None), "int")
	#if not ret:
	#	return phone
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
		_json["errmsg"] = get_errtag()+"DB failed."
	else:
		pass  #send sms.
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
		pass #error log

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

	#exec  1\create 6s_user;2\put identifying code;3\send sms and input
	_json = { "errcode":0,"errmsg":"" }
	_sql = "select quantities_remain from 6s_activity where id=%d and status=1;"%(actid)
	count,rets=dbmgr.db_exec(_sql)
	if count == 1:
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
					_sql = "insert into 6s_signup(user_id,act_id,username_pa,age_ch,createtime) values(%d,%d,'%s',%d,now());"%(uid,actid,name,age)
					count,rets=dbmgr.db_exec(_sql)
					if count == 1:
						_sql = "update 6s_activity set quantities_remain=quantities_remain-1 where id=%d;"%(actid)
						count,rets=dbmgr.db_exec(_sql)
						if count == 1:
							pass
						else:
							_json["errcode"] = 1
							_json["errmsg"] = "报名剩余人数-1失败！act:%d,u:%d"%(actid,uid)
					else:
						if str(rets).find("Duplicate entry ") != -1:
							_json["errcode"] = 1
							_json["errmsg"] = "报名信息已经存在！act:%d,u:%d"%(actid,uid)
						else:
							_json["errcode"] = 2
							_json["errmsg"] = get_errtag()+"报名失败. act:%d,u:%d"%(actid,uid)
				else:
					_json["errcode"] = 3
					_json["errmsg"] = "您已经对该活动报过名."
					mo.logger.warn("signup again.  act:%d,u:%d."%(actid,uid))
			else:
				_json["errcode"] = 4
				_json["errmsg"] = get_errtag()+"User with phone:%s not exist."%phone
	else:
		_json["errcode"] = 5
		_json["errmsg"] = "活动:%d不存在."%actid
		pass #error log

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
	_sql = "select a.act_id,c.title,DATE_FORMAT(a.createtime,'%%Y-%%m-%%d'),c.position_details,a.id,DATE_FORMAT(c.time_from,'%%Y-%%m-%%d'),a.id from 6s_signup a left join 6s_user b on a.user_id=b.id left join 6s_activity c on a.act_id=c.id where b.openid='%s' and a.status=1 and b.status=1 and c.status=1 limit %d offset %d;"%(openid,pagesize,pagesize*(page-1))
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
			_json["errmsg"] = get_errtag()+"get signup count failed."
	else:
		_json["errcode"] = 1
		_json["errmsg"] = get_errtag()+"DB failed."
		pass #error log

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
		_json["errmsg"] = get_errtag()+"Nothing update."
	else:
		_json["errcode"] = 1
		_json["errmsg"] = get_errtag()+"DB failed."

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
		_json["errmsg"] = get_errtag()+"DB failed."

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
		_json["errmsg"] = get_errtag()+"DB failed."

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


