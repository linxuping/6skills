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
reload(sys)
sys.setdefaultencoding('utf-8')

def req_print(func):
		def wrapper(*args):
				req = args[0]
				mo.logger.info("POST:%s, GET:%s, USER:%s, args:%s"%(str(req.POST),str(req.GET),str(req.user),str(args[1:]) ))
				return func(req)
		return wrapper


#--------------------- COMMON -----------------------
class TempMgr_base:  
  #status & data
  class _status:
    pass
  st = _status
  class _data:
    pass
  da = _data
  class _errinfo:
    error = ""
  einfo = _errinfo
  #methods
  pass
class TempMgr_register(TempMgr_base):  
  pass
class TempMgr_register_business(TempMgr_base):  
  pass
class TempMgr_login(TempMgr_base):  
  pass

class TempMgr_manage(TempMgr_base):
		class _tab:
				def init(self):
						self.activity_published,self.activity_nopublish,self.user_manage,self.user_analyze,self.history_analyze,self.account_setting,self.audit_businessman,self.audit_activity="","","","","","","",""
		tab = _tab()
		pass

class dbobj:
		pass

#render_to_response('current_datetime.html', {'current_date': now})
def _get_html_render(_url, _dic):
		fp = open(_url)  
		t = Template(fp.read())  
		fp.close()  
		html = t.render(Context(_dic))  
		return HttpResponse(html) 
def _get_html_render_error(_url, _msg, _dic={}):
		obj = TempMgr_manage
		obj.tab.init()
		obj.einfo.error = _msg
		_dic["obj"] = obj
		return _get_html_render(_url, _dic)
def _check_mysql_arg(_url, _arg, _type):
		#invoke mysql injection. 
		if _type == "int":
				if not _arg.isdigit():
						return False,_get_html_render_error(_url, "输入值非法(数字)！")
				return True,None
		elif _type == "str":
				if _arg.find('and')!=-1 and _arg.find('=')!=-1 and (_arg.find('\'')!=-1 or _arg.find('\"')!=-1):
						return False,_get_html_render_error(_url, "输入值非法(字符串)！")
				return True,None
		return True,None

#--------------------- AJAX -----------------------
import json
#ajax process.
def ajax_process(req):
	method = req.GET.get("method",None)
	print method
	if not req.is_ajax():
		print "----------- not ajax -------------->"
		return HttpResponse('it is not ajax.')
	
	print "----------- ajax processing -------------->"
	print req.GET  #pass args using "url: '/ajax?name=test',"
	_json = {}
	if method=="get_regions" and req.GET.has_key("city"):
		_json["regions"] = _get_regions( req.GET["city"] )
	_jsonobj = json.dumps(_json)
	return HttpResponse(_jsonobj, mimetype='application/json')
	#return HttpResponseRedirect('/test2') 



#--------------------- GLOBAL -----------------------
def _get_user_status_map():
	user_status_map = {}
	_sql = "select id,name from 6s_actstatus;"
	count,rets=dbmgr.db_exec(_sql)
	print _sql,count,rets
	if count > 0:
		for i in range(count):
			user_status_map[ int(rets[i][0]) ] = rets[i][1]
	else:
		pass #error log
	return user_status_map
def _get_cities():
	_cities = []
	#_sql = "select name from 6s_position where id between 101010000 and 101020000 and pid=101000000;"
	_sql = "select name from 6s_position where pid=101000000;"
	print _sql
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		for i in range(count):
			#print "region: ",rets[i][0]
			_cities.append( {'name':rets[i][0]} )
	return _cities
def _get_regions(_city):
	_regions = []
	#_sql = "select name from 6s_position where id>101010000 and id<101020000;"
	#_sql = "select name from 6s_position where id>(select id from 6s_position where name='%s') and id<(select id+10000 from 6s_position where name='%s');"%(_city,_city)
	_sql = "select name from 6s_position where pid=(select id from 6s_position where name='%s');"%( _city )
	print _sql
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		for i in range(count):
			_regions.append( {'name':rets[i][0]} )
	return _regions

g_user_status_map = {} #{ 0:"停用",1:"可用",2:"审核中",3:"拒绝",4:"禁止发帖" }
g_cities = []
def _global_init():
	global g_user_status_map,g_cities
	g_user_status_map = _get_user_status_map()
	g_cities = _get_cities()
	
_global_init()


