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


def check_user_admin(userid):
	_sql = "select role_id from 6s_user where id='%s';"%userid
	count,rets=dbmgr.db_exec(_sql)
	if count == 1:
		return rets[0][0]==role.admin
	else:
		mo.logger.error("cannot find user:%s."%userid)
	return False


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
		_sql = "select distinct d.name,b.name,a.username from 6s_user a left join 6s_role b on a.role_id=b.id left join 6s_authorize c on b.id=c.role_id left join 6s_permission d on c.perm_id=d.id where a.id=%s;"%(uid)
		count,rets=dbmgr.db_exec(_sql)
		if count > 0:
			return True,rets[0][1],rets[0][2],[x[0] for x in rets]
		else:
			mo.logger.error("user:%d get empty perms. "%uid)
	else:
		mo.logger.warn( "user:%d session_id:%d invalid ! "%(uid,session_id) )
	return False,None,None,{}

def set_cookie(resp,userid,sessionid):
	dt = datetime.datetime.now() + datetime.timedelta(hours = int(72))
	resp.set_cookie("6suserid",userid,expires=dt)
	resp.set_cookie("6ssessionid",sessionid,expires=dt)

def get_userinfo_from_cookie(req):
	userid = req.COOKIES.get("6suserid",None)
	if userid == None:
		mo.logger.error("userid is None.")
	sessionid = req.COOKIES.get("6ssessionid",None)
	if sessionid == None:
		mo.logger.error("sessionid is None.")
	return (userid!=None and sessionid!=None),userid,sessionid

#--------------------------


@req_print
def get_activity_sign_user(req):
	args = req.GET
	print "cookies: ",req.COOKIES,req.COOKIES.get("userid",None)
	#check.
	ret,page = check_mysql_arg_jsonobj("page", req.GET.get("page",None), "int")
	if not ret:
		return page
	ret,pagesize = check_mysql_arg_jsonobj("pagesize", req.GET.get("pagesize",None), "int")
	if not ret:
		return pagesize
	ret,actid = check_mysql_arg_jsonobj("actid", req.GET.get("actid",None), "int")
	if not ret:
		return actid

	_json = { "users":[],"pageable":{"page":0,"total":1},"errcode":1,"errmsg":"" }
	_sql = "select a.username_pa,a.username_ch,a.phone,a.age_ch,a.gender from 6s_signup a left join 6s_user b on a.user_id=b.id where a.status=1 and b.status=1 and a.act_id=%d limit %d offset %d;"%(actid,pagesize,pagesize*(page-1) )
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		for i in xrange(count):
			_json["users"].append( {"name":rets[i][1],"phone":rets[i][2],"kid_age":rets[i][3],"kid_gender":rets[i][4]} )

	_sql = "select count(a.id) from 6s_signup a left join 6s_user b on a.user_id=b.id where a.status=1 and b.status=1 and a.act_id=%d;"%actid
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		_json["pageable"]["total"] = int(rets[0][0])/pagesize+1
		_json["pageable"]["page"] = page

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@req_print
def get_export_activity_users(req):
	args = req.GET
	print "cookies: ",req.COOKIES,req.COOKIES.get("userid",None)
	#check.
	ret,actid = check_mysql_arg_jsonobj("actid", req.GET.get("actid",None), "int")
	if not ret:
		return actid

	_sql = "select a.username_pa,a.username_ch,a.phone,a.age_ch,a.gender from 6s_signup a left join 6s_user b on a.user_id=b.id where a.status=1 and b.status=1 and a.act_id=%d;"%actid
	count,rets=dbmgr.db_exec(_sql)
	_stream = ""
	if count > 0:
		_stream += "name,phone,kid_age,kid_gender\r\n"
		for i in xrange(count):
			_stream += "%s,%s,%s,%s\r\n"%(rets[i][1],rets[i][2],rets[i][3],rets[i][4])
		if _stream == "":	
			return response_json_error("有报名用户但没有导出信息.")
	else:
		return response_json_error("没有报名用户.")
	#_jsonobj = json.dumps(_json)
	resp = HttpResponse(_stream, mimetype='text/html')
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

#api/admin/current-activities?page=1&pagesize=3&city=广州市&type=本地活动
#api/admin/current-activities?page=1&pagesize=3
@req_print
def get_publish_activities(req):
	args = req.GET
	ret,page = check_mysql_arg_jsonobj("page", req.GET.get("page",None), "int")
	if not ret:
		return page
	ret,pagesize = check_mysql_arg_jsonobj("pagesize", req.GET.get("pagesize",None), "int")
	if not ret:
		return pagesize
	ret2,city = check_mysql_arg_jsonobj("city", req.GET.get("city",None), "str")
	ret3,acttype = check_mysql_arg_jsonobj("type", req.GET.get("type",None), "str")

	_json = { "activities":[],"pageable":{"page":0,"total":1},"errcode":0,"errmsg":"" }
	ret,userid,sessionid = get_userinfo_from_cookie(req)
	ret,userid,sessionid = True,"1","10101"
	if not ret:
		return response_json_error("必须上传用户基础信息.")
	if not check_session_valid(userid,sessionid):
		return response_json_error("session过期.")
	isadmin = check_user_admin(userid)

	_sql = ""
	if ret2 and ret3:
		_sql = "select a.id,a.title,DATE_FORMAT(a.createtime,'%%Y-%%m-%%d'),a.quantities from 6s_activity a left join 6s_acttype d on a.act_id=d.id where a.status=1 and (%d or a.user_id='%s') and a.position_id between (select id from 6s_position where name ='%s') and (select id+10000 from 6s_position where name ='%s') and a.act_id between (select id from 6s_acttype where name ='%s') and (select id+100 from 6s_acttype where name ='%s') limit %d offset %d;"%(isadmin,userid,city,city,acttype,acttype,pagesize,pagesize*(page-1))
	else:
		_sql = "select id,title,DATE_FORMAT(createtime,'%%Y-%%m-%%d'),quantities from 6s_activity where status=1 and (%d or user_id='%s') limit %d offset %d;"%(isadmin,userid,pagesize,pagesize*(page-1))
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		for i in xrange(count):
			_json["activities"].append( {"actid":rets[i][0],"title":rets[i][1],"publish_time":rets[i][2],"sign_num":rets[i][3]} )

	if ret2 and ret3:
		_sql = "select count(a.id) from 6s_activity a left join 6s_acttype d on a.act_id=d.id where a.status=1 and (%d or a.user_id='%s') and a.position_id between (select id from 6s_position where name ='%s') and (select id+10000 from 6s_position where name ='%s') and a.act_id between (select id from 6s_acttype where name ='%s') and (select id+100 from 6s_acttype where name ='%s');"%(isadmin,userid,city,city,acttype,acttype)
	else:
		_sql = "select count(c.id) from 6s_activity c where c.status =1 and (%d or c.user_id='%s');"%(isadmin,userid)
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		_json["pageable"]["total"] = int(rets[0][0])/pagesize+1
		_json["pageable"]["page"] = page

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@req_print
def get_unpublish_activities(req):
	args = req.GET
	ret,page = check_mysql_arg_jsonobj("page", req.GET.get("page",None), "int")
	if not ret:
		return page
	ret,pagesize = check_mysql_arg_jsonobj("pagesize", req.GET.get("pagesize",None), "int")
	if not ret:
		return pagesize
	_json = { "activities":[],"pageable":{"page":0,"total":1},"errcode":0,"errmsg":"" }
	ret,userid,sessionid = get_userinfo_from_cookie(req)
	ret,userid,sessionid = True,"1","10101"
	if not ret:
		return response_json_error("必须上传用户基础信息.")
	if not check_session_valid(userid,sessionid):
		return response_json_error("session过期.")
	isadmin = check_user_admin(userid)

	_sql = "select c.id,c.title,DATE_FORMAT(c.createtime,'%%Y-%%m-%%d'),c.quantities from 6s_activity c where c.status=2 and (%d or c.user_id='%s') limit %d offset %d;"%(isadmin,userid,pagesize,pagesize*(page-1))
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		for i in xrange(count):
			_json["activities"].append( {"actid":rets[i][0],"title":rets[i][1],"publish_time":rets[i][2],"sign_num":rets[i][3]} )

	_sql = "select count(c.id) from 6s_activity c where c.status=2 and (%d or c.user_id='%s');"%(isadmin,userid)
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		_json["pageable"]["total"] = int(rets[0][0])/pagesize+1
		_json["pageable"]["page"] = page

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
		ret,role,uname,perms = get_perms(rets[0][0],sessionid)
		if ret:
			_json["userid"] = rets[0][0]
			_json["role"] = role
			_json["permissions"] = perms
		else:
			return response_json_error("获取用户权限失败.")
	else:
		_json["errcode"] = 1
		_json["errmsg"] = "登陆失败."
		mo.logger.error("login failed. %s %s "%(phone,passwd) )

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@csrf_exempt
@req_print
def signup_first_step(req):
	args = req.POST
	ret,phone = check_mysql_arg_jsonobj("phone", args.get("phone",None), "str")
	if not ret:
		return phone
	ret,code = check_mysql_arg_jsonobj("code", args.get("code",None), "str")
	if not ret:
		return code
	ret,password = check_mysql_arg_jsonobj("password", args.get("password",None), "str")
	if not ret:
		return password

	_json = { "errcode":0,"errmsg":"" }
	_sql = "select id from 6s_idencode where openid='%s' and code='%s';"%(phone,code)
	count,rets=dbmgr.db_exec(_sql)
	if count == 0:
		return response_json_error("验证码不正确.")
	_sql = "select id from 6s_user where phone='%s';"%phone
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		return response_json_error("该手机号码已经注册过.")
		mo.logger.error("phone:%s has been registered. "%phone)

	_sql = "insert into 6s_user(phone,password,pwdmd5,role_id) values('%s','%s','%s','%d');"%(phone,password,encode_md5(password),role.business)
	count,rets=dbmgr.db_exec(_sql)
	if count == 1:
		mo.logger.info("register ok. %s %s code:%s "%(phone,password,code) )
	else:
		_json["errcode"] = 1
		_json["errmsg"] = "注册失败."
		mo.logger.error("register failed. %s %s code:%s "%(phone,password,code) )
	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@csrf_exempt
@req_print
def signup_second_step(req):
	args = req.POST
	ret,url = check_mysql_arg_jsonobj("url", args.get("url",None), "str")
	if not ret:
		return url
	ret,name = check_mysql_arg_jsonobj("name", args.get("name",None), "str")
	if not ret:
		return name
	ret,description = check_mysql_arg_jsonobj("description", args.get("description",None), "str")
	if not ret:
		return description
	ret,userid,sessionid = get_userinfo_from_cookie(req)
	ret,userid,sessionid = True,"1","10101"
	if not ret:
		return response_json_error("必须上传用户基础信息.")
	if not check_session_valid(userid,sessionid):
		return response_json_error("session过期.")

	_json = { "errcode":0,"errmsg":"" }
	#_sql = "select * from 6s_user_business where refid=%d;"%(userid)
	#count,rets=dbmgr.db_exec(_sql)
	#if count > 0:
	#	mo.logger.error("6s_user_business refid:%d has been registered. "%userid)
	#	return response_json_error("该商户已经注册过.")

	_sql = "update 6s_user set img='%s',username='%s',description='%s' where id=%s;"%(url,name,description,userid)
	count,rets=dbmgr.db_exec(_sql)
	if count == 1:
		mo.logger.info("signup_second_step ok. useid:%s "%userid )
	else:
		_json["errcode"] = 1
		_json["errmsg"] = "更新信息失败."
		mo.logger.error("signup_second_step failed. useid:%s "%userid )
	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@req_print
def get_userinfo(req):
	args = req.GET
	ret,userid,sessionid = get_userinfo_from_cookie(req)
	ret,userid,sessionid = True,"1","10101"
	if not ret:
		return response_json_error("必须上传用户基础信息.")
	if not check_session_valid(userid,sessionid):
		return response_json_error("session过期.")

	_json = { "userinfo":{},"errcode":0,"errmsg":"" }
	ret,role,uname,perms = get_perms(userid,sessionid)
	if ret:
		_json["userinfo"]["name"] = uname
		_json["userinfo"]["role"] = role
		_json["userinfo"]["permissions"] = perms
	else:
		return response_json_error("获取用户权限失败.")

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	#debug...............
	set_cookie(resp,userid,sessionid)
	return resp


@req_print
def get_manager_statistic(req):
	args = req.GET
	ret,userid,sessionid = get_userinfo_from_cookie(req)
	ret,userid,sessionid = True,"1","10101"
	if not ret:
		return response_json_error("必须上传用户基础信息.")
	if not check_session_valid(userid,sessionid):
		return response_json_error("session过期.")

	_json = { "info":{},"errcode":0,"errmsg":"" }
	_sql = "select count(id) from 6s_activity where status=1 and user_id=%s;"%userid
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		_json["info"]["publish"] = int(rets[0][0])
	_sql = "select sum(quantities-quantities_remain) from 6s_activity where status=1 and user_id=%s;"%userid
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		_json["info"]["sign"] = int(rets[0][0])
	_sql = "select count(user_id) from 6s_trace where user_id=%s and method='activities_details';"%userid
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		_json["info"]["page_view"] = int(rets[0][0])


	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@csrf_exempt
@req_print
def replace_qr(req):
	args = req.POST
	ret,actid = check_mysql_arg_jsonobj("actid", args.get("actid",None), "int")
	if not ret:
		return actid
	ret,qrcode = check_mysql_arg_jsonobj("qrcode", args.get("qrcode",None), "str")
	if not ret:
		return qrcode

	_json = { "errcode":0,"errmsg":"" }
	_sql = "update 6s_activity set img_qrcode='%s' where id=%d;"%(qrcode,actid)
	count,rets=dbmgr.db_exec(_sql)
	if count == 0:
		return response_json_error("二维码未更新.")
	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@csrf_exempt
@req_print
def business_authorize(req):
	args = req.POST
	ret,item = check_mysql_arg_jsonobj("item", args.get("item",None), "str")
	if not ret:
		return item
	ret,hasbusilicense = check_mysql_arg_jsonobj("hasbusilicense", args.get("hasbusilicense",None), "int")
	if not ret:
		return hasbusilicense
	ret,license = check_mysql_arg_jsonobj("license", args.get("license",''), "str")
	if not ret:
		return license
	ret,licensePic = check_mysql_arg_jsonobj("licensePic", args.get("licensePic",''), "str")
	if not ret:
		return licensePic
	ret,identity = check_mysql_arg_jsonobj("identity", args.get("identity",None), "str")
	if not ret:
		return identity
	ret,identityPic = check_mysql_arg_jsonobj("identityPic", args.get("identityPic",None), "str")
	if not ret:
		return identityPic
	ret,companyTel = check_mysql_arg_jsonobj("companyTel", args.get("companyTel",None), "str")
	if not ret:
		return companyTel
	ret,companyName = check_mysql_arg_jsonobj("companyName", args.get("companyName",None), "str")
	if not ret:
		return companyName
	ret,city = check_mysql_arg_jsonobj("city", args.get("city",None), "str")
	if not ret:
		return city
	ret,area = check_mysql_arg_jsonobj("area", args.get("area",None), "str")
	if not ret:
		return area
	ret,address = check_mysql_arg_jsonobj("address", args.get("address",None), "str")
	if not ret:
		return address
	ret,contactName = check_mysql_arg_jsonobj("contactName", args.get("contactName",None), "str")
	if not ret:
		return contactName
	ret,contactName = check_mysql_arg_jsonobj("contactName", args.get("contactName",None), "str")
	if not ret:
		return contactName
	ret,contactTel = check_mysql_arg_jsonobj("contactTel", args.get("contactTel",None), "str")
	if not ret:
		return contactTel
	ret,contactEmail = check_mysql_arg_jsonobj("contactEmail", args.get("contactEmail",None), "str")
	if not ret:
		return contactEmail
	ret,contactQQ = check_mysql_arg_jsonobj("contactQQ", args.get("contactQQ",None), "str")
	if not ret:
		return contactQQ
	ret,contactWechat = check_mysql_arg_jsonobj("contactWechat",args.get("contactWechat",None), "str")
	if not ret:
		return contactWechat
	ret,reset = check_mysql_arg_jsonobj("reset",args.get("reset",NULL), "int")
	ret,userid,sessionid = get_userinfo_from_cookie(req)
	ret,userid,sessionid = True,"1","10101"
	if not ret:
		return response_json_error("必须上传用户基础信息.")
	if not check_session_valid(userid,sessionid):
		return response_json_error("session过期.")

	#check exists.
	_sql = "select id from 6s_acttype where name='%s';"%item
	count,rets=dbmgr.db_exec(_sql)
	if count == 0:
		mo.logger.warn("acttype can't be found: %s. "%item )
	_sql = "select a.id from 6s_position a left join 6s_position b on a.pid=b.id where a.name='%s' and b.name='%s';"%(area,city)
	count,rets=dbmgr.db_exec(_sql)
	if count == 0:
		mo.logger.error("6s_position: %s_%s is invalid. "%(city,area) )
		return response_json_error("暂时不支持'%s:%s'这个地区的活动录入，请联系客服."%(city,area))

	if reset == 1:
		_sql = "delete from 6s_user_business where refid='%s';"%userid
		count,rets=dbmgr.db_exec(_sql)
		_sql = "select count(id) from 6s_user_business where refid='%s';"%userid
		count,rets=dbmgr.db_exec(_sql)
		if count > 0:
			mo.logger.error("6s_user_business refid=%s delete but still exist. "%(userid) )
			return response_json_error("商户信息已存在不能继续进行认证.")

	_sql = "delete from 6s_user_business where refid=%s;"%userid
	count,rets=dbmgr.db_exec(_sql)
	_sql = "insert into 6s_user_business(refid,service_item,license_num,license_pic,identity_num,identity_pic,company_tel,company_name,city,area,address,name,phone,email,qq,wx,createtime) values(%s,'%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s',now()); "%(userid,item,license,licensePic,identity,identityPic,companyTel,companyName,city,area,address,contactName,contactTel,contactEmail,contactQQ,contactWechat)
	count,rets=dbmgr.db_exec(_sql)
	if count == 1:
		pass
	else:
		mo.logger.error("6s_user_business insert fail. userid:%s count:%d"%(userid,count) )
		return response_json_error("认证失败，请联系客服处理.")
	_json = { "errcode":0,"errmsg":"" }
	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@csrf_exempt
@req_print
def add_preference(req):
	args = req.POST
	ret,description = check_mysql_arg_jsonobj("description", args.get("description",None), "str")
	if not ret:
		return description
	ret,begintime = check_mysql_arg_jsonobj("begintime", args.get("begintime",None), "str")
	if not ret:
		return begintime
	ret,endtime = check_mysql_arg_jsonobj("endtime", args.get("endtime",None), "str")
	if not ret:
		return endtime
	ret,price = check_mysql_arg_jsonobj("discountPrice", args.get("discountPrice",None), "int")
	if not ret:
		return price
	ret,maxnum = check_mysql_arg_jsonobj("maxnum", args.get("maxnum",None), "int")
	if not ret:
		return maxnum
	ret,actid = check_mysql_arg_jsonobj("actid", args.get("actid",None), "int")
	if not ret:
		return actid

	_json = { "errcode":0,"errmsg":"" }
	_sql = "insert into 6s_preinfo(price_child,time_from,time_to,content,quantities) values (%d,'%s','%s','%s',%d);"%(price,begintime,endtime,description,maxnum)
	count,rets,insertid=dbmgr.db_exec(_sql,dbmgr.DBOperation.insert)
	mo.logger.info("add 6s_preinfo result id:%s. "%str(ret) )
	if count == 1:
		_sql = "update 6s_activity set preinfo_id=%d where id=%d"%(insertid,actid)
		count,rets=dbmgr.db_exec(_sql)
		if count != 1:
			_json["errcode"] = 1
			_json["errmsg"] = "活动添加优惠信息失败."
			mo.logger.error("活动添加优惠信息 actid:%d preinfo:%d. "%(actid,insertid) )
		else:
			mo.logger.info("活动添加优惠信息 actid:%d preinfo:%d. "%(actid,insertid) )
	else:
		_json["errcode"] = 1
		_json["errmsg"] = "添加优惠信息失败."
		mo.logger.error("添加优惠信息失败. "+REQ_TAG(args) )

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@req_print
def get_preferencelist(req):
	args = req.GET
	ret,page = check_mysql_arg_jsonobj("page", req.GET.get("page",None), "int")
	if not ret:
		return page
	ret,pagesize = check_mysql_arg_jsonobj("pagesize", req.GET.get("pagesize",None), "int")
	if not ret:
		return pagesize
	ret,userid,sessionid = get_userinfo_from_cookie(req)
	ret,userid,sessionid = True,"1","10101"
	if not ret:
		return response_json_error("必须上传用户基础信息.")
	if not check_session_valid(userid,sessionid):
		return response_json_error("session过期.")
	isadmin = check_user_admin(userid)

	_json = { "preferencelist":[],"pageable":{"page":0,"total":1},"errcode":0,"errmsg":"" }
	_sql = "select a.content,DATE_FORMAT(a.time_from,'%%Y-%%m-%%d'),DATE_FORMAT(a.time_to,'%%Y-%%m-%%d'),if(a.status=1,\"在线\",if(a.status=2,\"未开始\",\"其他\")) from 6s_preinfo a left join 6s_activity b on a.id=b.preinfo_id left join 6s_user c on b.user_id=c.id where (%d or c.id=%s) and a.status>0 limit %d offset %d;;"%(isadmin,userid,pagesize,pagesize*(page-1))
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		for i in xrange(count):
			_json["preferencelist"].append( {"content":rets[i][0],"beginTime":rets[i][1],"endTime":rets[i][2],"status":rets[i][3]} )

	_sql = "select count(a.id) from 6s_preinfo a left join 6s_activity b on a.id=b.preinfo_id left join 6s_user c on b.user_id=c.id where (%d or c.id=%s) and a.status>0;"%(isadmin,userid)
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		_json["pageable"]["total"] = int(rets[0][0])/pagesize+1
		_json["pageable"]["page"] = page

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@req_print
def businessman_list(req):
	args = req.GET
	ret,city = check_mysql_arg_jsonobj("city", req.GET.get("city",None), "str")
	if not ret:
		return city
	ret,status = check_mysql_arg_jsonobj("status", req.GET.get("status",None), "str")
	if not ret:
		return status
	status = mystatus.online if status=="已审" else (mystatus.unaudit if status=="待审" else None)
	if status == None:
		return response_json_error("状态无效.")
	ret,page = check_mysql_arg_jsonobj("page", req.GET.get("page",None), "int")
	if not ret:
		return page
	ret,pagesize = check_mysql_arg_jsonobj("pagesize", req.GET.get("pagesize",None), "int")
	if not ret:
		return pagesize
	ret,userid,sessionid = get_userinfo_from_cookie(req)
	ret,userid,sessionid = True,"1","10101"
	if not ret:
		return response_json_error("必须上传用户基础信息.")
	if not check_session_valid(userid,sessionid):
		return response_json_error("session过期.")
	isadmin = check_user_admin(userid)

	_json = { "businessman":[],"pageable":{"page":0,"total":1},"errcode":0,"errmsg":"" }
	_sql = "select b.username,b.phone,DATE_FORMAT(a.createtime,'%%Y-%%m-%%d') from 6s_user_business a left join 6s_user b on a.refid=b.id where a.status=%d and a.city='%s' limit %d offset %d;"%(status,city,pagesize,pagesize*(page-1))
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		for i in xrange(count):
			_json["businessman"].append( {"adminAccount":rets[i][0],"adminTel":rets[i][1],"applicationTime":rets[i][2]} )

	_sql = "select count(b.id) from 6s_user_business a left join 6s_user b on a.refid=b.id where a.status=%d and a.city='%s';"%(status,city)
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		_json["pageable"]["total"] = int(rets[0][0])/pagesize+1
		_json["pageable"]["page"] = page

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@req_print
def signup_list(req):
	args = req.GET
	ret,city = check_mysql_arg_jsonobj("city", req.GET.get("city",None), "str")
	if not ret:
		return city
	ret,time = check_mysql_arg_jsonobj("time", req.GET.get("time",None), "str")
	if not ret:
		return time
	#ret,status = check_mysql_arg_jsonobj("status", req.GET.get("status",None), "str")
	#if not ret:
	#	return status
	#status = mystatus.online if status=="已审" else (mystatus.unaudit if status=="待审" else None)
	#if status == None:
	#	return response_json_error("状态无效.")
	ret,page = check_mysql_arg_jsonobj("page", req.GET.get("page",None), "int")
	if not ret:
		return page
	ret,pagesize = check_mysql_arg_jsonobj("pagesize", req.GET.get("pagesize",None), "int")
	if not ret:
		return pagesize
	ret,userid,sessionid = get_userinfo_from_cookie(req)
	ret,userid,sessionid = True,"1","10101"
	if not ret:
		return response_json_error("必须上传用户基础信息.")
	if not check_session_valid(userid,sessionid):
		return response_json_error("session过期.")

	_json = { "signup":[],"pageable":{"page":0,"total":1},"errcode":0,"errmsg":"" }
	#TODO .....
	_sql = "select c.title,b.wechat,b.username,b.phone,a.age_ch,if(a.gender='male','男','女') from 6s_signup a left join 6s_user b on a.user_id=b.id left join 6s_activity c on a.act_id=c.id where c.position_id between (select id from 6s_position where name ='%s') and (select id+10000 from 6s_position where name ='%s') and a.createtime between '%s' and date_add('%s',interval 1 day) limit %d offset %d;"%(city,city,time,time,pagesize,pagesize*(page-1))
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		for i in xrange(count):
			_json["signup"].append( {"title":rets[i][0],"wxchat":rets[i][1],"name":rets[i][2],"tel":rets[i][3],"childAge":rets[i][4],"childSex":rets[i][5]} )

	_sql = "select count(c.id) from 6s_signup a left join 6s_user b on a.user_id=b.id left join 6s_activity c on a.act_id=c.id where c.position_id between (select id from 6s_position where name ='%s') and (select id+10000 from 6s_position where name ='%s') and a.createtime between '%s' and date_add('%s',interval 1 day);"%(city,city,time,time)
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		_json["pageable"]["total"] = int(rets[0][0])/pagesize+1
		_json["pageable"]["page"] = page

	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp


@csrf_exempt
@req_print
def account_set(req):
	args = req.POST
	ret,favicon = check_mysql_arg_jsonobj("favicon", args.get("favicon",None), "str")
	if not ret:
		return favicon
	ret,accountName = check_mysql_arg_jsonobj("accountName", args.get("accountName",None), "str")
	if not ret:
		return accountName
	ret,password = check_mysql_arg_jsonobj("newPwd", args.get("newPwd",None), "str")
	if not ret:
		return password
	ret,userid,sessionid = get_userinfo_from_cookie(req)
	ret,userid,sessionid = True,"1","10101"
	if not ret:
		return response_json_error("必须上传用户基础信息.")
	if not check_session_valid(userid,sessionid):
		return response_json_error("session过期.")

	_json = { "errcode":0,"errmsg":"" }
	_sql = "update 6s_user set img='%s',password='%s',pwdmd5='%s' where id=%s;"%(favicon,password,encode_md5(password),userid)
	count,rets=dbmgr.db_exec(_sql)
	if count == 1:
		pass
	elif count == 0:
		mo.logger.warn("6s_user no update. "+REQ_TAG(args) )
	else:
		mo.logger.error("6s_user no update. "+REQ_TAG(args) )
		return response_json_error("用户信息未更新.")
	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp

'''
@req_print
def super_home(req):
	args = req.GET
	ret,userid,sessionid = get_userinfo_from_cookie(req)
	ret,userid,sessionid = True,"1","10101"
	if not ret:
		return response_json_error("必须上传用户基础信息.")
	if not check_session_valid(userid,sessionid):
		return response_json_error("session过期.")

	_json = { "preferencelist":[],"pageable":{"page":0,"total":1},"errcode":0,"errmsg":"" }
	_sql = "select a.content,DATE_FORMAT(a.time_from,'%%Y-%%m-%%d'),DATE_FORMAT(a.time_to,'%%Y-%%m-%%d'),if(a.status=1,\"在线\",if(a.status=2,\"未开始\",\"其他\")) from 6s_preinfo a left join 6s_activity b on a.id=b.preinfo_id left join 6s_user c on b.user_id=c.id where c.id=%s and a.status>0;"%userid
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		for i in xrange(count):
			_json["preferencelist"].append( {"content":rets[i][0],"time_from":rets[i][1],"time_to":rets[i][2],"status":rets[i][3]} )
	_jsonobj = json.dumps(_json)
	resp = HttpResponse(_jsonobj, mimetype='application/json')
	makeup_headers_CORS(resp)
	return resp
'''



from qiniu import Auth
'''
返回上传文件时需要的token。输入为key字符串，输出为token字符串
key为文件的唯一标识，为避免重复，建议由2部分组成，前半部分为商户的唯一标识手机号，后半部分为文件名
例如：key = '13912345678/my-python-logo.png'
前端获取token后，上传本地文件，上传成功后的url格式为http://img.6skills.com/key

'''
@req_print
def get_uploadtoken(req):
	args = req.GET
	#check.
	ret,key = check_mysql_arg_jsonobj("key", args.get("key",None), "str")
	if not ret:
		return key

	q = Auth(settings.access_key, settings.secret_key)
	bucket_name = 'sixskills'

	#超时过期时间为3600
	token = q.upload_token(bucket_name, key, 3600)
	mo.logger.info("get_uploadtoken key:%s token:%s "%(key,token) )
	_json = {"token": "", "errcode": 0, "errmsg": ""}
	_json["token"] = token
	_jsonobj = json.dumps(_json)
	return HttpResponse(_jsonobj, mimetype='application/json')

#--------- GLOBAL INIT ---------#


