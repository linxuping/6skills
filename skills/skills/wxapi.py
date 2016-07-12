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

def activities_special_offers(req):
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
	_json = { "activities":[],"pageable":{"page":0,"total":1},"errorcode":0,"errormsg":"" }
	print pagesize,page
	_sql = "select a.id,imgs_act,title,content,b.name,c.name,age_from,age_to,price_original,price_current,quantities_remain from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where c.pid=(select id from 6s_position where name ='%s')  limit %d offset %d;"%(area,pagesize,pagesize*(page-1))
	count,rets=dbmgr.db_exec(_sql)
	if count >= 0:
		for i in range(count):
			lis = rets[i]
			imgs = lis[1].strip("\r\n ").split(" ")
			_json["activities"].append( {"imgs":imgs,"title":lis[2],"brief":lis[3],"tags":lis[4],"area":lis[5],"ages":"%s-%s"%(lis[6],lis[7]),"price_original":lis[8],"price_current":lis[9],"quantities_remain":lis[10]} )
	else:
		_json["errorcode"] = 1
		_json["errormsg"] = get_errtag()+"DB failed."
		pass #error log

	_sql = "select count(a.id) from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where c.pid=(select id from 6s_position where name ='%s');"%(area)
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		_json["pageable"]["total"] = int(rets[0][0])/pagesize+1
		_json["pageable"]["page"] = page

	_jsonobj = json.dumps(_json)
	return HttpResponse(_jsonobj, mimetype='application/json')
	#return HttpResponseRedirect('/test2') 


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
	_json = { "activities":[],"pageable":{"page":0,"total":1},"errorcode":0,"errormsg":"" }
	print pagesize,page
	_sql = "select a.id,imgs_act,title,content,b.name,c.name,age_from,age_to,price_original,price_current,quantities_remain from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where c.pid=(select id from 6s_position where name ='%s')  limit %d offset %d;"%(area,pagesize,pagesize*(page-1))
	count,rets=dbmgr.db_exec(_sql)
	if count >= 0:
		for i in range(count):
			lis = rets[i]
			imgs = lis[1].strip("\r\n ").split(" ")
			_json["activities"].append( {"imgs":imgs,"title":lis[2],"brief":lis[3],"tags":lis[4],"area":lis[5],"ages":"%s-%s"%(lis[6],lis[7]),"price_original":lis[8],"price_current":lis[9],"quantities_remain":lis[10]} )
	else:
		_json["errorcode"] = 1
		_json["errormsg"] = get_errtag()+"DB failed."
		pass #error log

	_sql = "select count(a.id) from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where c.pid=(select id from 6s_position where name ='%s');"%(area)
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		_json["pageable"]["total"] = int(rets[0][0])/pagesize+1
		_json["pageable"]["page"] = page

	_jsonobj = json.dumps(_json)
	return HttpResponse(_jsonobj, mimetype='application/json')
	#return HttpResponseRedirect('/test2') 


def activities_details(req):
	#check.
	ret,actid = check_mysql_arg_jsonobj("actid", req.GET.get("actid",None), "int")
	if not ret:
		return actid

	#exec 
	_json = { "errorcode":0,"errormsg":"" }
	_sql = "select a.id,imgs_act,title,content,b.name,c.name,age_from,age_to,price_original,price_current,quantities_remain from 6s_activity a left join 6s_acttype b on a.act_id=b.id left join 6s_position c on a.position_id=c.id where a.id=%d;"%actid
	count,rets=dbmgr.db_exec(_sql)
	if count == 1:
		for i in range(count):
			lis = rets[i]
			imgs = lis[1].strip("\r\n ").split(" ")
			_json.update( {"imgs":imgs,"title":lis[2],"brief":lis[3],"tags":lis[4],"area":lis[5],"ages":"%s-%s"%(lis[6],lis[7]),"price_original":lis[8],"price_current":lis[9],"quantities_remain":lis[10]} ) 
	elif count == 0:
		_json["errorcode"] = 1
		_json["errormsg"] = "activity:%d not exist."%actid
	else:
		_json["errorcode"] = 1
		_json["errormsg"] = get_errtag()+"DB failed."
		pass #error log

	_jsonobj = json.dumps(_json)
	return HttpResponse(_jsonobj, mimetype='application/json')
	#return HttpResponseRedirect('/test2') 


def activities_getauthcode(req):
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
	_json = { "errorcode":0,"errormsg":"" }
	#_sql = "insert into 6s_idencode(openid,code,createtime) values('%s',%d,now()) ON DUPLICATE KEY UPDATE code=VALUES(code);"%(openid, code)
	count,rets=dbmgr.db_exec("delete from 6s_idencode where openid='%s';"%openid)
	_sql = "insert into 6s_idencode(openid,code,createtime) values('%s',%d,now());"%(openid, code)
	count,rets=dbmgr.db_exec(_sql)
	#if count<0 and str(rets).find("UNIQUE KEY is unsafe")!=-1:
	if count < 0:
		_json["errorcode"] = 1
		_json["errormsg"] = get_errtag()+"DB failed."
	else:
		pass  #send sms.
	_jsonobj = json.dumps(_json)
	return HttpResponse(_jsonobj, mimetype='application/json')


def wxauth_idencode(req):
	#check.
	ret,phone = check_mysql_arg_jsonobj("phone", req.GET.get("phone",None), "int")
	if not ret:
		return phone
	ret,openid = check_mysql_arg_jsonobj("openid", req.GET.get("openid",None), "str")
	if not ret:
		return openid
	ret,code = check_mysql_arg_jsonobj("code", req.GET.get("code",None), "int")
	if not ret:
		return code

	#exec  1\create 6s_user;2\put identifying code;3\send sms and input
	_json = { "errorcode":0,"errormsg":"" }
	_sql = "select * from 6s_idencode where openid='%s' and code='%s';"%(openid,code)
	count,rets=dbmgr.db_exec(_sql)
	if count == 1:
		#save to 6s_user.
		_sql = "insert into 6s_user(phone,openid,createtime) values('%s','%s',now());"%(phone,openid)
		count,rets=dbmgr.db_exec(_sql)
		if count == 1:
			pass
		else:
			if str(rets).find("Duplicate entry ") != -1:
				_json["errorcode"] = 1
				_json["errormsg"] = "Phone has existed."
			else:
				_json["errorcode"] = 1
				_json["errormsg"] = get_errtag()+"Add user failed."
	else:
		_json["errorcode"] = 1
		_json["errormsg"] = get_errtag()+"Auth failed."
		pass #error log

	_jsonobj = json.dumps(_json)
	return HttpResponse(_jsonobj, mimetype='application/json')
	#return HttpResponseRedirect('/test2') 


