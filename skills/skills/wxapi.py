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
import urllib2
import dbmgr
import nosqlmgr
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
	#ret,district = check_mysql_arg_jsonobj("district", req.GET.get("district",None), "str")
	#if not ret:
	#	return district
	ret,age = check_mysql_arg_jsonobj("age", req.GET.get("age",None), "str")
	tmps = []
	if ret:
		age = "0-100" if age=="*" else age
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
		#sql_datefilter = "a.time_from>DATE_ADD(NOW(),INTERVAL 2 WEEK) and "
		sql_datefilter = "a.preinfo_id is null and "
	else:
		#sql_datefilter = "a.time_from<=DATE_ADD(NOW(),INTERVAL 2 WEEK) and "
		sql_datefilter = "a.preinfo_id>0 and "

	ret,openid = check_mysql_arg_jsonobj("openid", req.GET.get("openid",None), "str")
	position_id = 0
	if ret:
		_sql = "select position_id from 6s_user where openid='%s'"%openid
		count,rets=dbmgr.db_exec(_sql)
		if count>0 and rets[0][0]!=None:
			position_id = int(rets[0][0])
		if position_id == 0:
			position_id = 101010100;

	#exec 
	_json = { "activities":[],"pageable":{"page":0,"total":1},"errcode":0,"errmsg":"" }
	if not ret: #by date
		_sql = "select a.id,imgs_act,title,b.name,c.name,age_from,age_to,a.price_child,a.price_adult,a.quantities_remain,img_cover,a.createtime,a2.price_child from 6s_activity a left join 6s_preinfo a2 on a.preinfo_id=a2.id left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where %s ((age_from between %d and %d) or (age_to between %d and %d) or (age_from<%d and age_to>%d)) and a.status=1 order by a.createtime desc limit %d offset %d;"%(sql_datefilter,_age_from,_age_to,_age_from,_age_to,_age_from,_age_to,pagesize,pagesize*(page-1) )
	else: #by distr and date
		_sql = "select * from ((select a.id,imgs_act,title,b.name as type,c.name,age_from,age_to,a.price_child as pchild,a.price_adult as padult,a.quantities_remain as qremains,img_cover,DATE_ADD(a.createtime,INTERVAL 12 MONTH) as sortdate,a2.price_child from 6s_activity a left join 6s_preinfo a2 on a.preinfo_id=a2.id left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where %s c.pid=%d and ((age_from between %d and %d) or (age_to between %d and %d) or (age_from<%d and age_to>%d)) and a.status=1)  union  (select a.id,imgs_act,title,b.name as type,c.name,age_from,age_to,a.price_child as pchild,a.price_adult as padult,a.quantities_remain as qremains,img_cover,a.createtime as sortdate,a2.price_child from 6s_activity a left join 6s_preinfo a2 on a.preinfo_id=a2.id left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where %s c.pid<>%d and ((age_from between %d and %d) or (age_to between %d and %d) or (age_from<%d and age_to>%d)) and a.status=1)) as tmptable order by sortdate desc limit %d offset %d;"%(sql_datefilter,position_id,_age_from,_age_to,_age_from,_age_to,_age_from,_age_to,sql_datefilter,position_id,_age_from,_age_to,_age_from,_age_to,_age_from,_age_to,pagesize,pagesize*(page-1) )
	count,rets=dbmgr.db_exec(_sql)
	if count >= 0:
		for i in range(count):
			lis = rets[i]
			imgs = lis[1].strip("\r\n ").split(" ")
			_json["activities"].append( {"actid":lis[0], "imgs":imgs,"title":lis[2],"tags":lis[3],"area":lis[4],"ages":"%s-%s"%(lis[5],lis[6]),"price_child":(lis[7] if lis[12]==None else lis[12]),"quantities_remain":lis[9],"img_cover":lis[10]+"?imageMogr2/thumbnail/300x300|imageMogr2/gravity/Center/crop/250x250"} )#,"price_child_pre":lis[11],"preinfo":lis[13]
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
	_sql = "select a.id,imgs_act,title,a.content,b.name,c.name,age_from,age_to,a.price_child,a.price_adult,a.quantities_remain,img_cover,imgs_act,preinfo,DATE_FORMAT(a.time_from,'%%Y-%%m-%%d'),DATE_FORMAT(a.time_to,'%%Y-%%m-%%d'),a2.price_child,a2.price_adult,a2.content,a.position_details from 6s_activity a left join 6s_preinfo a2 on a.preinfo_id=a2.id left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where a.id=%d;"%actid
	count,rets=dbmgr.db_exec(_sql)
	if count == 1:
		for i in range(count):
			lis = rets[i]
			imgs = lis[1].strip("\r\n ").split(" ")
			_json.update( {"actid":lis[0],"imgs":imgs,"title":lis[2],"content":lis[3],"tags":lis[4],"area":lis[5],"ages":"%s-%s"%(lis[6],lis[7]),"price_child":lis[8],"quantities_remain":lis[10],"img_cover":lis[11],"imgs_act":lis[12],"time_from":lis[14],"time_to":lis[15],"price_child_pre":lis[16],"preinfo":lis[18],"position_details":lis[19]} ) 
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
		req.sms_type = settings.sms_type
		req.sms_free_sign_name = "六艺互动"
		req.sms_param = "{\"number\":\"%s\"}" % (code)
		req.rec_num = "%s" % (phone)
		req.sms_template_code = settings.sms_temp_code
		try:
			resp = req.getResponse()
			if resp["alibaba_aliqin_fc_sms_num_send_response"]["result"]["err_code"] == "0":
				mo.logger.info("send sms to %s:%s. "%(phone,code) )
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
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp
	#return HttpResponse(_jsonobj, mimetype='application/json')


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
			_sql = "update 6s_user set phone='%s' where openid='%s';"%(phone,openid)
			count,rets=dbmgr.db_exec(_sql)
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
	if openid == "":
		mo.logger.error("openid is empty. "+REQ_TAG(args))
		return response_json_error( "6sid不能为空.")
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
	_sql = "select time_to>now() from 6s_activity where id=%d;"%(actid)
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		if str(rets[0][0]) == "0":
			mo.logger.error("activity expire. openid:%s actid:%d"%(openid,actid))
			return response_json_error( "活动已经过期不能报名.")
	else:
		mo.logger.error("activity invalid: %d"%(openid,actid))
		return response_json_error( "活动不存在或下线.")
	
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
			
			_wxname = ""
			_sql = "select id,wechat from 6s_user where openid='%s' and status=1;"%openid
			count,rets=dbmgr.db_exec(_sql)
			if count == 1:
				uid = int(rets[0][0])
				_wxname = rets[0][1]
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
							_json["wechat"] = _wxname
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
	_sql = "select wechat,phone,img from 6s_user where openid='%s';"%openid
	count,rets=dbmgr.db_exec(_sql)
	if count == 1 :
		_json["profile"] = { "username":rets[0][0],"phone":rets[0][1],"img":rets[0][2] }
	else:
		_json["errcode"] = 1
		_json["errmsg"] = "找不到当前用户."
		mo.logger.error("cannot find user:%s. "%openid+REQ_TAG(req.GET))

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


@req_print
def activities_getcollectionstatus(req):
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
	_sql = "select id from 6s_collection where openid='%s' and act_id=%d;"%(openid,actid)
	count,rets=dbmgr.db_exec(_sql)
	if count == 1 :
		_json["status"] = True
	else:
		_json["status"] = False
		#_json["errmsg"] = "未收藏."
		#mo.logger.info("no sign activity openid:%s actid:%d. "%(openid,actid)+REQ_TAG(args))

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
	if openid == "":
		mo.logger.error("openid is empty. "+REQ_TAG(args))
		return response_json_error( "6sid不能为空.")
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
	_sql = "select a.id,b.img_qrcode,b.time_to>now() from 6s_signup a left join 6s_activity b on a.act_id=b.id left join 6s_user c on a.user_id=c.id where c.openid='%s' and a.act_id=%d and a.status=1 and b.status=1;"%(openid,actid)
	count,rets=dbmgr.db_exec(_sql)
	if count == 1 :
		if str(rets[0][2]) == "1":
			_json["status"] = True
		else:
			_json["errmsg"] = "过期"
		_json["qrcode"] = rets[0][1]
	else:
		_sql = "select time_to>now() from 6s_activity where id=%d;"%(actid)
		count,rets=dbmgr.db_exec(_sql)
		if count>0 and str(rets[0][0])=="0":
			_json["errmsg"] = "过期"
		_json["status"] = False
		_json["coll_status"] = False
		#_json["errmsg"] = "未报名."
		#mo.logger.info("no sign activity openid:%s actid:%d. "%(openid,actid)+REQ_TAG(args))
	
	_sql = "select id from 6s_collection where openid='%s' and act_id=%d and status=1;"%(openid,actid)
	count,rets=dbmgr.db_exec(_sql)
	_json["coll_status"] = True if count>0 else False

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


#@req_print
#def save_pos_wx(req):
#	lat,lon = "23.127191","113.355747"
#	openid = "oaLbrwTDwNXtyv7YtWhe9wSQXolA"
def save_pos_wx(lat,lon,openid):
	status,ret = get_url_resp( "http://apis.map.qq.com/ws/geocoder/v1/?location=%s,%s&key=%s&get_poi=0"%(lat,lon,settings.txgeokey) )
	province,city,area,street = "","","",""
	try:
		tmpdic = json.loads(ret)
		if not tmpdic.has_key("result") or not tmpdic["result"].has_key("address_component") or not tmpdic["result"]["address_component"].has_key("city"):
			mo.logger.error("no pos: %s"%ret)
			return False
		addr = tmpdic["result"]["address_component"]
		print addr
		province,city,area,street,num = addr["province"],addr["city"],addr["district"],addr["street"],addr["street_number"]
		street = street if num=="" else (street+num) #+"号"
	except:
		mo.logger.error( str(sys.exc_info())+"; "+str(traceback.format_exc()) )
	if area != "":
		_sql = "select id from 6s_position where name='%s';"%area
		count,rets=dbmgr.db_exec(_sql)
		if count > 0:
			pos_id = rets[0][0] #to district
			count,rets=dbmgr.db_exec("select id from 6s_user where openid='%s';"%openid)
			if count == 0:
				count,rets=dbmgr.db_exec("insert into 6s_user(openid,position_id,position_details,createtime) values('%s','%s','%s',now());"%(openid,pos_id,street) )
			else:
				_sql = "update 6s_user set position_id=%s,position_details='%s' where openid='%s';"%(pos_id,street,openid)
				count,rets=dbmgr.db_exec(_sql)
				if count == 0:
					mo.logger.warn("save_pos_wx update posid return 0. openid:%s %s"%(openid,pos_id))
		else:
			mo.logger.error("openid:%s city:%s area:%s cannot be found."%(openid,city,area) )
	pass


@req_print
def get_access_token(req):
	args = req.GET
	ret,openid = check_mysql_arg_jsonobj("openid", req.GET.get("openid",None), "str")
	if not ret:
		return openid

	_url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s"%(settings.appid,settings.appsecret)
	import urllib2
	req = urllib2.Request(_url)
	resp = urllib2.urlopen(req)
	ret = resp.read()
	tmpdic = json.loads(ret)
	print "tmpdic: ",tmpdic
	_json = { "access_token":tmpdic.get("access_token",""),"errcode":0,"errmsg":"" }

	if True:
		_url = "http://apis.map.qq.com/ws/geocoder/v1/?location=23.127191,113.355747&key=%s&get_poi=0"%(settings.txgeokey)
		req = urllib2.Request(_url)
		resp = urllib2.urlopen(req)
		ret = resp.read()
		tmpdic = json.loads(ret)
		print "tmpdic: ",tmpdic

	_jsonobj = json.dumps(tmpdic)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@req_print
def get_js_signature(req):
	#ret,_url = check_mysql_arg_jsonobj("url", req.GET.get("url",None), "str")
	#if not ret:
	if not req.GET.has_key("url"):
		return response_json_error( "invalid args." )
	_url = req.GET["url"]
	print "sig url: ", _url

	if nosqlmgr.redis_get("js_signature") == None:
		return response_json_error( "[TOKEN] get js_signature null." )
	import hashlib
	settings.js_timestamp = int(time.time())
	_str = "jsapi_ticket=%s&noncestr=%s&timestamp=%s&url=%s"%(nosqlmgr.redis_get("js_signature"),settings.js_noncestr,settings.js_timestamp,_url)
	_sig = hashlib.sha1(_str).hexdigest()

	_json = { "appid":settings.appid,"signature":_sig,"noncestr":settings.js_noncestr,"timestamp":settings.js_timestamp,"errcode":0,"errmsg":"" }
	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


'''
def get_wx_user_info():
	ss = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=WjpTHedNlMh8k7xQ0UR1Tpy6iHE-GdtW0lDtfyHDfXJzddqZzln4HBNrZ3v2RDCP9X8r8isOK9cb-q-IYEUOxjdNuNXfeRhq7vht3iXTnM4DICeABAUZT&openid=oaLbrwTDwNXtyv7YtWhe9wSQXolA"
	import urllib2
	req = urllib2.Request(ss)
	resp = urllib2.urlopen(req)
	ret = resp.read()
	tmpdic = json.loads(ret)
	print "tmpdic: ",tmpdic
	pass
'''



import thread
def _update_base_access_token():
	_url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s"%(settings.appid,settings.appsecret)
	status,ret = get_url_resp( _url )
	if not status:
		mo.logger.error( "[TOKEN] %s"%ret )
		return False
	tmpdic = json.loads(ret)
	if tmpdic.has_key("access_token") and tmpdic.has_key("expires_in"):
		mo.logger.info("[TOKEN] update base_access_token: %s"%(tmpdic["access_token"]) )
		nosqlmgr.redis_set( "base_access_token",tmpdic["access_token"],tmpdic["expires_in"] ) 
		return True
	else:
		mo.logger.error("[TOKEN] no base_***_token return: %s"%str(ret))
	return False

def _check_access_token_valid(token, openid, hint):
	_url = "https://api.weixin.qq.com/sns/auth?access_token=%s&openid=%s"%(token, openid)
	status,ret = get_url_resp( _url )
	if not status:
		mo.logger.error( "[TOKEN] %s %s %s"%(hint,openid,ret) )
		return False
	tmpdic = json.loads(ret)
	if tmpdic.has_key("errcode") and tmpdic["errcode"]==0:
		return True
	mo.logger.error("[TOKEN] token invalid: %s %s %s"%(_url,openid,hint))
	return False

def _update_web_access_token(openid, retoken):
	_url = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=%s&grant_type=refresh_token&refresh_token=%s"%(settings.appid, retoken)
	status,ret = get_url_resp( _url )
	if not status:
		mo.logger.error( "[TOKEN] %s"%ret )
		return False
	tmpdic = json.loads(ret)
	if tmpdic.has_key("access_token") and tmpdic.has_key("refresh_token") and tmpdic.has_key("expires_in"):
		mo.logger.info("[TOKEN] update web_ access_token:%s"%tmpdic["access_token"] )
		nosqlmgr.redis_set( "web_access_token_%s"%openid,tmpdic["access_token"], tmpdic["expires_in"] ) 
		mo.logger.info("[TOKEN] upload web_ refresh_token:%s"%tmpdic["refresh_token"] )
		nosqlmgr.redis_set( "web_refresh_token_%s"%openid,tmpdic["refresh_token"] ) 
		return True
	else:
		mo.logger.error("[TOKEN] no web_***_token return: %s"%str(ret))
	return False

def _update_js_signature():
	actoken = nosqlmgr.redis_get("base_access_token")
	if actoken == None:
		mo.logger.error( "[TOKEN] base_access_token is null." )
	else:
		_url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=%s&type=jsapi"%actoken
		status,ret = get_url_resp( _url )
		if not status:
			mo.logger.error( "[TOKEN] %s"%ret )
			return False
		tmpdic = json.loads(ret)
		if tmpdic.has_key("ticket") and tmpdic.has_key("expires_in"):
			mo.logger.info("[TOKEN] update js_signature:%s %s"%(tmpdic["ticket"],tmpdic["expires_in"]) )
			nosqlmgr.redis_set( "js_signature",tmpdic["ticket"],tmpdic["expires_in"]  ) 
			return True
	return False

def update_access_token():
	while True:
		for i in xrange(3):
			_ttl = int(nosqlmgr.redis_conn.ttl("base_access_token"))
			#_check = _check_access_token_valid(nosqlmgr.redis_get("base_access_token"),settings.mopenid,"base")
			if _ttl>60:
				break
			if _update_base_access_token():
				break
		#TODO.
		for _token in nosqlmgr.redis_conn.keys("web_access_token_*"): #keys web_refresh_token_*: 1234
			_openid = _token.split("web_access_token_")[1]
			_ackey = "web_access_token_" + _openid
			_actoken = nosqlmgr.redis_get(_ackey)
			_rekey = "web_refresh_token_" + _openid
			_retoken = nosqlmgr.redis_get(_rekey)
			if _actoken == None:
				mo.logger.error("[TOKEN] can't find %s in redis."%_ackey)
				continue
			if _retoken == None:
				mo.logger.error("[TOKEN] can't find %s in redis."%_rekey)
				continue
			for i in xrange(3):
				print ">>> ",int(nosqlmgr.redis_conn.ttl(_ackey))>60, _check_access_token_valid(_actoken, _openid, "web")
				if int(nosqlmgr.redis_conn.ttl(_ackey))>60 and _check_access_token_valid(_actoken, _openid, "web"):
					break
				if _update_web_access_token(_openid, _retoken):
					break
		for i in xrange(3):
			_ttl = int(nosqlmgr.redis_conn.ttl("js_signature"))
			if _ttl>60:
				break
			if _update_js_signature():
				break
		time.sleep(55) #1.5
if settings.check_access_token:
	mo.logger.info("[TOKEN] start new thread.")
	thread.start_new_thread( update_access_token,() )


'''
{"subscribe": 1,
    "openid": "o7Lp5t6n59DeX3U0C7Kric9qEx-Q",
    "nickname": "方倍",
    "sex": 1,
    "language": "zh_CN",
    "city": "深圳",
    "province": "广东",
    "country": "中国",
    "headimgurl": "http://wx.qlogo.cn/mmopen/Kkv3HV30gbEZmoo1rTrP4UjRRqzsibUjT9JClPJy3gzo0NkEqzQ9yTSJzErnsRqoLIct5NdLJgcDMicTEBiaibzLn34JLwficVvl6/0",
    "subscribe_time": 1389684286
}
'''
#@req_print
#def save_user_info_wx(req):
def save_user_info_wx(access_token, openid):
	#access_token = "eZceuhFEvdrsxtSvt-b5HIYP4l_mQe7I5_B3M5KMuZdVa91sSbIKpMJfyX2fg0LpthmTtkuva4Etd0Uz1fBcWyyQLoCT--h5BkRAECbB9OhhP3ot8c9Pnex4l8y_hOS7IMCeADAQUK"
	#openid = "oaLbrwTDwNXtyv7YtWhe9wSQXolA"
	_url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=%s&openid=%s&lang=zh_CN"%(access_token,openid)
	status,ret = get_url_resp( _url )	
	if not status:
		mo.logger.error( ret )
		return False,ret
	tmpdic = json.loads(ret)
	print tmpdic

	if not tmpdic.has_key("openid"):
		mo.logger.error("/usr/info has no openid: %s. %s"%(ret,_url) )
		return False,"no openid"

	#get pos id
	pos_id = "null"
	if tmpdic.has_key("city"):
		city = tmpdic["city"] if "市" in tmpdic["city"] else tmpdic["city"]+"市"
		_sql = "select id from 6s_position where name='%s';"%city
		count,rets=dbmgr.db_exec(_sql)
		if count > 0:
			pos_id = str(int(rets[0][0])+100) #to district
	#update 6s_user
	openid,nickname,sex,headimg = tmpdic["openid"],tmpdic.get("nickname",""),tmpdic.get("sex","1"),tmpdic.get("headimgurl","")
	sex = "male" if sex==1 else "female"
	_sql = "select id from 6s_user where openid='%s';"%(openid)
	count,rets=dbmgr.db_exec(_sql)
	if count == 0:
		_sql = "insert into 6s_user(wechat,gender,img,position_id,openid,createtime) values('%s','%s','%s','%s','%s',now());"%(nickname,sex,headimg,pos_id,openid)
		count,rets=dbmgr.db_exec(_sql)
		if count == 0:
			mo.logger.error("insert 6s_user fail. ret:%s"%rets)
	else:
		#_sql = "update 6s_user set wechat='%s',gender='%s',img='%s',position_id=%s,status=1 where openid='%s';"%(nickname,sex,headimg,pos_id,openid)
		_sql = "update 6s_user set wechat='%s',gender='%s',img='%s',status=1 where openid='%s';"%(nickname,sex,headimg,openid)
		count,rets=dbmgr.db_exec(_sql)
		if count == 0:
			mo.logger.warn("update posid return 0. openid:%s %s"%(openid,ret))
	#save headimg
	if headimg != "":
		status,buf = get_url_resp( headimg )
		if status:
			f = open(settings.headimg_path+r"/"+openid, "wb+")
			f.write(buf)
			f.close()
		else:
			mo.logger.error( buf )
	return True,None


@csrf_exempt
@req_print
def default_process(req):
	args = req.GET
	print "------------------->"
	#print "------------------->",req.body
	#print req
	#get_wx_user_info()
	_json = { "status":False,"errcode":0,"errmsg":"" }
	if "echostr" in args and "nonce" in args and "timestamp" in args and "signature" in args:
		signature,timestamp,nonce,echostr = args["signature"],args["timestamp"],args["nonce"],args["echostr"]
		#字典序排序
		list=[settings.token,timestamp,nonce]
		list.sort()
		import hashlib
		sha1=hashlib.sha1()
		map(sha1.update,list)
		hashcode=sha1.hexdigest()
		#sha1加密算法        
		#如果是来自微信的请求，则回复echostr
		if hashcode == signature:
			mo.logger.info("wx join ok, hashcode == signature")
			return HttpResponse(echostr, mimetype='text/plain')
		else:
			mo.logger.error("wx join fail, echostr:%s,nonce:%s,timestamp:%s,signature:%s"%(echostr,nonce,timestamp,signature) )
			return HttpResponse("-1", mimetype='text/plain')

	body = req.body
	if len(body) == 0:
		return HttpResponse("-1", mimetype='text/plain')
	import xml.etree.ElementTree as Etree
	msgxml = None
	try:
		msgxml = Etree.fromstring(body)
	except:
		return HttpResponse("req.body invalid: %s"%str(body), mimetype='text/plain')

	fnode = msgxml.find("FromUserName")
	if fnode == None:
		mo.logger.error( "no openid: %s"%body )
		return HttpResponse("41009", mimetype='text/plain')
	openid = fnode.text
	node_msgtype = msgxml.find("MsgType")
	if node_msgtype == None:
		mo.logger.error( "no msgtype. openid:%s msg:%s"%(openid,body) )
		return HttpResponse("40008", mimetype='text/plain')

	node_ev = msgxml.find("Event")
	if node_ev!=None:
		mo.logger.info("openid:%s, msg:%s_%s, bodylen:%d"%(openid,node_msgtype.text,node_ev.text,len(body)) )
	else:
		mo.logger.info("openid:%s, msg:%s, bodylen:%d"%(openid,node_msgtype.text,len(body)) )

	if node_msgtype.text=="event" and node_ev!=None and node_ev.text=="LOCATION":
		pass
	else:
		_sql = "insert into 6s_wx_msg(openid,type,msg) values('%s','%s','%s');"%(openid,node_msgtype.text,body.replace("\r\n","").replace("\n","")[:500]) 
		count,rets=dbmgr.db_exec(_sql)
		if count == 0:
			mo.logger.error("insert 6s_wx_msg fail. openid:%s msg:%s"%(openid,body) )

	if node_msgtype.text=="event" and node_ev!=None:
		if "subscribe" == node_ev.text:
			access_token = nosqlmgr.redis_get("base_access_token") #get
			save_user_info_wx(access_token, openid)
			#event log
			_rspxml = "<xml><ToUserName><![CDATA[$fromUser]]></ToUserName><FromUserName><![CDATA[$toUser]]></FromUserName><CreateTime>$createTime</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[$content]]></Content><FuncFlag>$funcFlag</FuncFlag></xml>"
			fname = msgxml.find("FromUserName").text
			tname = msgxml.find("ToUserName").text
			_rspxml = "<xml><ToUserName><![CDATA[%s]]></ToUserName><FromUserName><![CDATA[%s]]></FromUserName><CreateTime>%s</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[%s]]></Content><FuncFlag>0</FuncFlag></xml>"%(fname,tname,get_date(),"欢迎关注六艺互动，这里将为您推荐附近好玩有创意的亲子活动。")
			return HttpResponse(_rspxml, mimetype='text/plain')
		elif "unsubscribe" == node_ev.text:
			_sql = "update 6s_user set status=-1 where openid='%s';"%(openid)
			count,rets=dbmgr.db_exec(_sql)
			if count == 0:
				mo.logger.error("openid:%s unsubscribe status to -1 fail."%openid)
			#event log
		elif "LOCATION" == node_ev.text:
			if msgxml.find("Latitude")==None or msgxml.find("Longitude")==None:
				return HttpResponse("-1", mimetype='text/plain')
			lat = msgxml.find("Latitude").text
			lon = msgxml.find("Longitude").text
			#if in redis and not the same just update.
			if nosqlmgr.redis_conn.get("position_%s"%openid) != "%s_%s"%(lat,lon):
				nosqlmgr.redis_conn.set("position_%s"%openid, "%s_%s"%(lat,lon) )
				save_pos_wx(lat,lon,openid)
			pass
		elif "CLICK" == node_ev.text:
			node_key = msgxml.find("EventKey")
			if node_key != None:
				pass
			else:
				return HttpResponse("40019", mimetype='text/plain')
			pass
		elif "VIEW" == node_ev.text:
			return HttpResponse("0", mimetype='text/plain')
			pass
		else:
			#unknown event.
			pass
	elif node_msgtype.text == "text":
		pass
	else:
		pass

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@req_print
def get_openid(req):
	#check.
	ret,code = check_mysql_arg_jsonobj("code", dict(req.GET).get("code",[None])[0], "str")
	if not ret:
		return code

	_json = { "errcode":0,"errmsg":"" }
	if False:
		_json["openid"] = "okgp_wNtQVsu20gRMpJRX50bTJKs"
		_jsonobj = json.dumps(_json)
		resp = HttpResponse(_jsonobj, mimetype='application/json')
		makeup_headers_CORS(resp)
		mo.logger.info("return openid ------------------>")
		return resp

	_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s&grant_type=authorization_code"%(settings.appid,settings.appsecret,code)
	tmpdic = None
	validresp = False
	for i in xrange(2):
		status,ret = get_url_resp( _url )	
		if not status:
			mo.logger.error("get access_token return false: %s"%str(ret))
			return response_json_error( "get access_token return false." )
		tmpdic = json.loads(ret)
		if tmpdic.has_key("errcode") and tmpdic.has_key("errmsg"):
			mo.logger.error("web_access_token fail. refresh_token invalid? %s"%code)
		elif tmpdic.has_key("access_token") and tmpdic.has_key("refresh_token") and tmpdic.has_key("expires_in") and tmpdic.has_key("openid"):
			validresp = True
			break
	
	if validresp:
		nosqlmgr.redis_set("web_access_token_%s"%tmpdic["openid"], tmpdic["access_token"], tmpdic["expires_in"])
		mo.logger.info("[TOKEN] getopenid set %s: %s %s"%("web_access_token_%s"%tmpdic["openid"], tmpdic["access_token"], tmpdic["expires_in"]))
		nosqlmgr.redis_set("web_refresh_token_%s"%tmpdic["openid"], tmpdic["refresh_token"], 8640000) #100 days
		mo.logger.info("[TOKEN] getopenid set %s: %s 8640000"%("web_refresh_token_%s"%tmpdic["openid"], tmpdic["refresh_token"]))
		openid = tmpdic["openid"]
		_json["openid"] = openid
		nickname,sex,headimg = "","male","/static/img/head.jpg"
		_url = "https://api.weixin.qq.com/sns/userinfo?access_token=%s&openid=%s&lang=zh_CN"%(tmpdic["access_token"],openid)
		status,ret = get_url_resp( _url )	
		if not status:
			mo.logger.error("sns/userinfo fail. openid:%s "%openid)
		else:
			tmpdic2 = json.loads(ret)
			if tmpdic2.has_key("nickname") and tmpdic2.has_key("sex") and tmpdic2.has_key("city") and tmpdic2.has_key("headimgurl"):
				nickname,sex,headimg,city = tmpdic2["nickname"],tmpdic2["sex"],tmpdic2["headimgurl"],tmpdic2["city"]
				sex = "male" if sex==1 else "female"
				if city == "":
					city = "广州市"
				else:
					city = city if city.find("市")!=-1 else city+"市"
				_sql = "select id from 6s_position where name='%s';"%city
				count,rets=dbmgr.db_exec(_sql)
				if count >0 :
					pos_id = str(int(rets[0][0])+100)
					_sql = "select id from 6s_user where openid='%s';"%(openid)
					count,rets=dbmgr.db_exec(_sql)
					if count == 0:
						_sql = "insert into 6s_user(wechat,gender,img,position_id,openid,createtime) values('%s','%s','%s','%s','%s',now());"%(nickname,sex,headimg,pos_id,openid)
						count,rets=dbmgr.db_exec(_sql)
						if count == 0:
							mo.logger.error("insert 6s_user fail. ret:%s"%rets)
					else:
						#_sql = "update 6s_user set wechat='%s',gender='%s',img='%s',position_id=%s,status=1 where openid='%s';"%(nickname,sex,headimg,pos_id,openid)
						_sql = "update 6s_user set wechat='%s',gender='%s',img='%s',status=1 where openid='%s';"%(nickname,sex,headimg,openid)
						count,rets=dbmgr.db_exec(_sql)
						if count == 0:
							mo.logger.warn("save_user_info_wx update posid return 0. openid:%s %s"%(openid,ret))
				else:
					_json["errcode"] = 1
					_json["errmsg"] = "invalid city."
					mo.logger.error("invalid city. openid:%s,city:%s"%(openid,city) )
			else:
				mo.logger.error("attrs error. %s  %s  %s"%(openid,_url,ret))
	else:
		mo.logger.error("sns/oauth2/access_token return fail: %s. %s"%(ret,_url) )
		return response_json_error( "no ***_token." )

	mo.logger.info("return openid. %s -> %s"%(code,str(_json)) )
	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


