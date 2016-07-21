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
import socket
reload(sys)
sys.setdefaultencoding('utf-8')

def get_errtag():
		return "[errno:%s_%s]"%(socket.gethostname(),time.strftime('%m%d_%H%M%S'))

def req_print(func):
		def wrapper(*args):
				req = args[0]
				mo.logger.info("POST:%s, GET:%s, USER:%s, args:%s"%(str(req.POST),str(req.GET),str(req.user),str(args[1:]) ))
				return func(req)
		return wrapper

def get_upload_path(user):
	path = datetime.datetime.now().strftime("documents/%Y/%m/%d"+"/%s"%user)
	mo.logger.info("[upload] %s"%path)
	return path


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
def get_html_render(_url, _dic):
		fp = open(_url)  
		t = Template(fp.read())  
		fp.close()  
		html = t.render(Context(_dic))  
		return HttpResponse(html) 
def get_html_render_error(_url, _msg, _dic={}):
		obj = TempMgr_manage
		obj.tab.init()
		obj.einfo.error = _msg
		_dic["obj"] = obj
		mo.logger.error("[error page] %s"%_msg)
		return get_html_render(_url, _dic)


def check_mysql_arg(_url, _arg, _type):
		#invoke mysql injection. 
		if _type == "int":
				if not _arg.isdigit():
						return False,get_html_render_error(_url, "输入值非法(数字)！")
				return True,None
		elif _type == "str":
				if _arg.find('and')!=-1 and _arg.find('=')!=-1 and (_arg.find('\'')!=-1 or _arg.find('\"')!=-1):
						return False,get_html_render_error(_url, "输入值非法(字符串)！")
				return True,None
		return True,None

def _check_mysql_arg_json(_name, _arg, _type):
		#invoke mysql injection. 
		if _arg == None:
				return False,{ "errcode":1, "errmsg":"参数%s不能为空."%_name }
		if _type == "int":
				if not _arg.isdigit():
						return False,{ "errcode":1, "errmsg":"非法参数(i-%s)"%str(_arg) }
				return True,int(_arg)
		elif _type == "str":
				if _arg.find('and')!=-1 and _arg.find('=')!=-1 and (_arg.find('\'')!=-1 or _arg.find('\"')!=-1):
						return False,{ "errcode":1, "errmsg":"非法参数(s-%s)"%str(_arg) }
				return True,_arg
		return False,{ "errcode":1, "errmsg":"未知判断类型(%s)."%str(_type) }
def check_mysql_arg_jsonobj(_name, _arg, _type):
	ret,output = _check_mysql_arg_json(_name, _arg, _type)
	if ret:
		return ret,output
	_jsonobj = json.dumps(output)
	return ret,HttpResponse(_jsonobj, mimetype='application/json')

def response_json(_dic):
		return HttpResponse(json.dumps(_dic), mimetype='application/json')
def response_json_error(_msg):
		return HttpResponse(json.dumps({"errcode":1, "errmsg":_msg}), mimetype='application/json')

BFE_URL = "http://121.42.41.241:9901"
def makeup_headers_CORS(resp):
		resp._headers["Access-Control-Allow-Origin"] = ("Access-Control-Allow-Origin", "%s"%BFE_URL)
		resp._headers["Access-Control-Allow-Methods"] = ("Access-Control-Allow-Methods", "POST, PUT, DELETE, GET, OPTIONS")
		resp._headers["Access-Control-Request-Method"] = ("Access-Control-Request-Method", "*")
		resp._headers["Access-Control-Allow-Headers"] = ("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
		resp._headers["Access-Control-Max-Age"] = ("Access-Control-Max-Age", "1728000")
		resp._headers["Access-Control-Allow-Credentials"] = ("Access-Control-Allow-Credentials", 'true')
		resp._headers["P3P"] = ("P3P", "CP=\"CAO PSA OUR COR\"")

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
	mo.logger.info( "%s. %s. %s"%(_sql,str(count),str(rets)) )
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
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		for i in range(count):
			_regions.append( {'name':rets[i][0]} )
	return _regions
def get_table_size(_table):
	_sql = "select count(id) from %s;"%( _table )
	count,rets=dbmgr.db_exec(_sql)
	if count == 1:
			return int(rets[0][0])
	return -1

g_user_status_map = {} #{ 0:"停用",1:"可用",2:"审核中",3:"拒绝",4:"禁止发帖" }
g_cities = []
def _global_init():
	global g_user_status_map,g_cities
	g_user_status_map = _get_user_status_map()
	g_cities = _get_cities()
	
_global_init()




