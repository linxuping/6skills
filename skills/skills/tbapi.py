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


def gen_new_sessionid(userid):
	session_id = int(time.time())
	_sql = "select * from 6s_session where user_id='%s';"%userid
	count,rets=dbmgr.db_exec(_sql)
	if count == 0:
		_sql = "insert into from 6s_session(user_id,session_id) values('%s','%d'));"%(userid,session_id)
		count,rets=dbmgr.db_exec(_sql)
		if count != 1:
			mo.logger.error("insert 6s_session failed. userid:%s"%(userid))
	else:
		_sql = "update 6s_session set start=now(),session_id='%s' where user_id=%s;"%(session_id,userid)
		count,rets=dbmgr.db_exec(_sql)
		if count != 1:
			mo.logger.error("update 6s_session failed. userid:%s"%(userid))
	return session_id


def check_user_valid(username, pwdmd5):
	_sql = "select id from 6s_user where username='%s' and pwdmd5='%s';"%(username,pwdmd5)
	count,rets=dbmgr.db_exec(_sql)
	if count == 1:
		_sql = "select * from 6s_session where user_id='%s';"%(rets[0][0])
		count,rets=dbmgr.db_exec(_sql)
		session_id = gen_new_sessionid(rets[0][0])
		return True,session_id
	else:
		return False,None


def check_session_valid(uid, session_id):
	_sql = "select DATE_ADD(start, INTERVAL 3 DAY)>NOW() from 6s_session where user_id='%s' and session_id='%s';"%(uid,session_id)
	count,rets=dbmgr.db_exec(_sql)
	if count == 0:
		mo.logger.error("6s_session userid:%s session_id:%s not find."%(uid,session_id))
	elif count == 1:
		if rets[0][0] == 1:
			return True
	else:
		mo.logger.error("6s_session userid:%s. count=%d"%(userid,count))
	return False


def get_perms(uid, session_id):
	if check_session_valid(uid, session_id):
		_sql = "select distinct d.name,b.name from 6s_user a left join 6s_role b on a.role_id=b.id left join 6s_authorize c on b.id=c.role_id left join 6s_permission d on c.perm_id=d.id where a.id=%s;"%(uid)
		count,rets=dbmgr.db_exec(_sql)
		if count > 0:
			return True,rets[0][1],[x[0] for x in rets]
		else:
			mo.logger.error("user:%d get empty perms. "%uid)
	else:
		mo.logger.warn( "user:%d session_id:%d invalid ! "%(uid,session_id) )
	return False,None,{}

def set_cookie(resp,userid,sessionid):
	dt = datetime.datetime.now() + datetime.timedelta(hours = int(72))
	resp.set_cookie("6suserid",userid,expires=dt)
	resp.set_cookie("6ssessionid",sessionid,expires=dt)

def get_userinfo(req):
	userid = req.COOKIES.get("6suserid",None)
	if userid == None:
		mo.logger.error("userid is None.")
	sessionid = req.COOKIES.get("6ssessionid",None)
	if sessionid == None:
		mo.logger.error("sessionid is None.")
	return (userid!=None and sessionid!=None),userid,sessionid

#--------------------------


@req_print
def activity_sign_user(req):
	args = req.GET
	print "cookies: ",req.COOKIES,req.COOKIES.get("userid",None)
	#check.
	ret,actid = check_mysql_arg_jsonobj("actid", req.GET.get("actid",None), "int")
	if not ret:
		return actid

	_json = { "users":[],"pageable":{"page":0,"total":1},"errcode":1,"errmsg":"" }
	_sql = "select a.username_pa,a.username_ch,a.phone,a.age_ch,a.gender from 6s_signup a left join 6s_user b on a.user_id=b.id where a.status=1 and b.status=1 and a.act_id=%d;"%actid
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		for i in xrange(count):
			_json["users"].append( {"name":rets[i][1],"phone":rets[i][2],"kid_age":rets[i][3],"kid_gender":rets[i][4]} )
	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@csrf_exempt
@req_print
def activity_publish(req):
	args = req.POST
	ret,actid = check_mysql_arg_jsonobj("actid", args.get("actid",None), "int")
	if not ret:
		return actid

	#exec  1\create 6s_user;2\put identifying code;3\send sms and input
	_json = { "errcode":0,"errmsg":"" }
	_sql = "update 6s_signup set status=1 where act_id=%d;"%(actid)
	count,rets=dbmgr.db_exec(_sql)
	if count == 0:
		_json["errcode"] = 1
		_json["errmsg"] = "活动上线状态未更新."
		mo.logger.error("act must be updated. actid:%d"%actid)

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@req_print
def get_publish_activities(req):
	args = req.GET
	_json = { "activities":[],"pageable":{"page":0,"total":1},"errcode":0,"errmsg":"" }
	ret,userid,sessionid = get_userinfo(req)
	ret,userid,sessionid = True,"1","10101"
	if not ret:
		_json["errcode"] = 1 
		_json["errmsg"] = "必须上传用户基础信息."

	_sql = "select c.id,c.title,DATE_FORMAT(c.createtime,'%%Y-%%m-%%d'),c.quantities from 6s_session a left join 6s_signup b on a.user_id=b.user_id left join 6s_activity c on b.act_id=c.id where b.status=1 and c.status =1 and a.user_id='%s' and a.session_id='%s';"%(userid,sessionid)
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		for i in xrange(count):
			_json["activities"].append( {"actid":rets[i][0],"title":rets[i][1],"publish_time":rets[i][2],"sign_num":rets[i][3]} )
	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@req_print
def get_unpublish_activities(req):
	args = req.GET
	_json = { "activities":[],"pageable":{"page":0,"total":1},"errcode":0,"errmsg":"" }
	ret,userid,sessionid = get_userinfo(req)
	ret,userid,sessionid = True,"1","10101"
	if not ret:
		_json["errcode"] = 1 
		_json["errmsg"] = "必须上传用户基础信息."

	_sql = "select c.id,c.title,DATE_FORMAT(c.createtime,'%%Y-%%m-%%d'),c.quantities from 6s_session a left join 6s_signup b on a.user_id=b.user_id left join 6s_activity c on b.act_id=c.id where b.status=1 and c.status=2 and a.user_id='%s' and a.session_id='%s';"%(userid,sessionid)
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		for i in xrange(count):
			_json["activities"].append( {"actid":rets[i][0],"title":rets[i][1],"publish_time":rets[i][2],"sign_num":rets[i][3]} )
	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@csrf_exempt
@req_print
def tbauth(req):
	args = req.POST
	ret,phone = check_mysql_arg_jsonobj("phone", args.get("phone",None), "str")
	if not ret:
		return phone
	ret,passwd = check_mysql_arg_jsonobj("passwd", args.get("passwd",None), "str")
	if not ret:
		return passwd

	_json = { "errcode":0,"errmsg":"" }
	_sql = "select id from 6s_user where phone='%s' and pwdmd5='%s';"%(phone,passwd)
	count,rets=dbmgr.db_exec(_sql)
	if count == 1:
		sessionid = gen_new_sessionid(rets[0][0])
		_json["sessionid"] = sessionid
		ret,role,perms = get_perms(rets[0][0],sessionid)
		if ret:
			_json["userid"] = rets[0][0]
			_json["role"] = role
			_json["permissions"] = perms
	else:
		_json["errcode"] = 1
		_json["errmsg"] = "登陆失败."
		mo.logger.error("login failed. %s %s "%(phone,passwd) )

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp




#--------- GLOBAL INIT ---------#


