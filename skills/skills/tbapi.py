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
	if count == 0:
		_sql = "insert into from 6s_session(user_id,session_id) values('%s','%d'));"%(userid,session_id)
		count,rets=dbmgr.db_exec(_sql)
		if count != 1:
			mo.logger.error("insert 6s_session failed. userid:%s"%(userid))
	else:
		_sql = "update 6s_session set start=now() where user_id=%s;"%(userid)
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
	_sql = "select DATE_ADD(start, INTERVAL 3 DAY)<NOW() from 6s_session where user_id='%s' and session_id='%s';"%(uid,session_id)
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
		_sql = "select distinct d.name from 6s_user a left join 6s_role b on a.role_id=b.id left join 6s_authorize c on b.id=c.role_id left join 6s_permission d on c.perm_id=d.id where uid=%s;"%(uid)
		count,rets=dbmgr.db_exec(_sql)
		if count > 0:
			return True,[x[0] for x in rets]
		else:
			mo.logger.error("user:%d get empty perms. "%userid)
	else:
		mo.logger.warn( "user:%d session_id:%d invalid ! "%(uid,session_id) )
	return False,{}






#--------- GLOBAL INIT ---------#


