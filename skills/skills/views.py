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



@csrf_exempt  
def dispatch(req):
  if req.is_ajax():
    #method check and return json.
    print req.GET  #pass args using "url: '/ajax?name=test',"
    my_response = {'ajax_resp':'Hello, webapp World!'}
    datos = json.dumps(my_response)
    return HttpResponse(datos, mimetype='application/json')
  else:
    print req.POST
    #method check and return obj.
    pass
  print req.session.items()
  fp = open('templates/carousel.html')  
  t = Template(fp.read())  
  fp.close()  
  html = t.render(Context({"id":1}))  
  return HttpResponse(html) 


@csrf_exempt  
def search(req):
  fp = open('templates/search.html')  
  t = Template(fp.read())  
  fp.close()  
  html = t.render(Context({"id":1}))  
  return HttpResponse(html) 


@csrf_exempt  
@req_print
def login(req):
  if req.POST.get("log_username",None)==None or req.POST.get("log_password",None)==None:
    return get_html_render('templates/signin.html',{"id":1})
  username = req.POST["log_username"]
  password = req.POST["log_password"]
  _ret,_obj =  check_mysql_arg('templates/signin.html', username, "str")
  if not _ret:
    return _obj
  _ret,_obj =  check_mysql_arg('templates/signin.html', password, "str")
  if not _ret:
    return _obj

  if not User.objects.filter(username=username).exists():
    return get_html_render_error('templates/signin.html',"找不到当前用户，请注册",{}) 
  user = auth.authenticate(username=username, password=password)  
  if user is None:
    return get_html_render_error('templates/signin.html',"账户密码不正确",{}) 
  elif not user.is_active:
    return get_html_render_error('templates/signin.html',"该账户处于下线状态，请联系管理员",{}) 
  auth.login(req,user) 
  return HttpResponseRedirect('/manage/') 


def _header_log(req):
	mo.logger.info("POST:%s, GET:%s, USER:%s"%(str(req.POST),str(req.GET),str(req.user)) )


@csrf_exempt  
@req_print
def register(req):
	obj = TempMgr_manage
	if req.method == 'POST':
		form = DocumentForm(req.POST, req.FILES)
		img = ""
		username = req.POST['username']
		password = req.POST['password']
		phone = req.POST.get('phone','')
		regtype = req.POST.get('regtype','')
		if form.is_valid():
			if User.objects.filter(username=username).exists():
				return get_html_render_error("templates/register.html", "用户%s已存在！"%username, {})

			#_file = "%s_%s"%(str(req.user),str(req.FILES['docfile']))
			#if repeated -->>>  functionList_r8KCzYQ.xml  functionList.xml
			_file = req.FILES['docfile']
			newdoc = Document(docfile=_file)
			upload_path = get_upload_path( str(req.user) )
			img = os.path.join(settings.MEDIA_URL, upload_path, str(_file))
			#rm media/documents/2016/06/26/_file ??????????????????
			newdoc.docfile.field.upload_to = upload_path
			newdoc.save()
		else:
			mo.logger.error("form is invalid!")

		#auth_user -- check user existed or not .
		user = None
		try:
			#phone unique
			_sql = "select id from 6s_user where phone='%s';"%phone
			count,rets=dbmgr.db_exec(_sql)
			if count > 0:
				mo.logger.error( "reg phone %s has existed."%phone )
				return get_html_render_error('templates/register.html',"号码%s已经被注册过！"%phone,{"obj":obj} ) 
			
			user = User.objects.create_user(username,"skills@me.com",password)
			user.save()
			
			_sql = "insert into 6s_user(refid,username,phone,role,img,createtime) values(%d,'%s','%s','%s','%s',now());"%(40,username,phone,regtype,img)
			count,rets=dbmgr.db_exec(_sql)
			print count,rets
			if count != 1:
				#delete 6s_user
				user.delete()
				mo.logger.error("insert user:%s but exec=%d, now delete."%(username,count) )
				return get_html_render('templates/register.html',{"obj":obj} ) 
		except:
			if user != None:
				user.delete()
			_einfo =  str(sys.exc_info())+"; "+str(traceback.format_exc())
			mo.logger.error(_einfo)
			if "Duplicate entry" in _einfo:
				obj.einfo.error = "该名字(%s)已经被注册！"%username
			return get_html_render('templates/register.html',{"obj":obj} ) 
			
		# Redirect to the document list after POST
		#return HttpResponseRedirect(reverse('skills.views.register.business'))
		if regtype == "business":
			mo.logger.info("return page /register/business")
			return HttpResponseRedirect('/register/business') 
		else:
			mo.logger.info("return page /login")
			return HttpResponseRedirect('/login') 
	else:
		print "--4--"
		form = DocumentForm() # A empty, unbound form
	return get_html_render('templates/register.html', {'form': form})






from myapp.models import Document
from myapp.forms import DocumentForm
from django.core.urlresolvers import reverse

@csrf_exempt  
def register_business(req):
    print "reqs: ",req.user
    print "args POST: ",req.POST
    print "args GET: ",req.GET
    print "has perm? ",req.user.has_perm("role_businessman"),req.user.is_superuser
    # Handle file upload
    print "--1--"
    if req.method == 'POST':
        form = DocumentForm(req.POST, req.FILES)
        print "--2--",form.__dict__
        if form.is_valid():
            print "--3--"
            #how to changed the file name ??????????????????
            #_file = "%s_%s"%(str(req.user),str(req.FILES['docfile']))
            #if repeated -->>>  functionList_r8KCzYQ.xml  functionList.xml
            _file = req.FILES['docfile']
            print "----------->",_file
            #rm media/documents/2016/06/26/_file ??????????????????
            newdoc = Document(docfile = _file)
            print "new doc: ",newdoc.__dict__
            newdoc.save()

            # Redirect to the document list after POST
            #return HttpResponseRedirect(reverse('skills.views.register.business'))
            return HttpResponseRedirect('/register/business') 
    else:
        print "--4--"
        form = DocumentForm() # A empty, unbound form

    # Load documents for the list page
    #documents = Document.objects.all()
    fp = open('templates/register_business.html')  
    t = Template(fp.read())  
    fp.close()  
    html = t.render(Context({'form': form}))  
    return HttpResponse(html) 



@csrf_exempt  
def activity_add(req, type=None):
	print ">>>>>>>>>>> activity_op."
	print "args POST: ",req.POST
	print "args GET: ",req.GET

	if req.method == 'POST':
		print "files: ",req.FILES
		form = DocumentForm(req.POST, req.FILES)
		print "--2--",form.__dict__
		if form.is_valid():
			print "--3--"
			#how to changed the file name ??????????????????
			#_file = "%s_%s"%(str(req.user),str(req.FILES['docfile']))
			#if repeated -->>>  functionList_r8KCzYQ.xml  functionList.xml
			for _file in req.FILES.getlist('docfile'):
				print "----------->",_file
				#rm media/documents/2016/06/26/_file ??????????????????
				newdoc = Document(docfile = _file)
				print "new doc: ",newdoc.__dict__
				newdoc.save()

			# Redirect to the document list after POST
			#return HttpResponseRedirect(reverse('skills.views.register.business'))
			return HttpResponseRedirect('/index') 
	else:
		print "--4--"
		form = DocumentForm() # A empty, unbound form

	# Load documents for the list page
	#documents = Document.objects.all()
	obj = TempMgr_manage
	obj.tab.init()

	#_sql = "select name from 6s_position where id between 101010000 and 101020000 and pid=101000000;"
	#print _sql
	#count,rets=dbmgr.db_exec(_sql)
	#if count > 0:
	#	obj.cities = []
	#	for i in range(count):
	#		#print "region: ",rets[i][0]
	#		obj.cities.append( {'name':rets[i][0]} )
	#_sql = "select name from 6s_position where id>101010000 and id<101020000;"
	#print _sql
	#count,rets=dbmgr.db_exec(_sql)
	#if count > 0:
	#	obj.regions = []
	#	for i in range(count):
	#		#print "region: ",rets[i][0]
	#		obj.regions.append( {'name':rets[i][0]} )
	obj.cities = _get_cities()
	if len(obj.cities) > 0:
		obj.regions = _get_regions(obj.cities[0]['name'])
	else:
		pass # error log.
	_sql = "select name from 6s_acttype where pid>0;"
	print _sql
	count,rets=dbmgr.db_exec(_sql)
	if count > 0:
		obj.acttypes = []
		for i in range(count):
			#print "region: ",rets[i][0]
			obj.acttypes.append( {'name':rets[i][0]} )

	if type=="modify" and req.GET.has_key("id"):
		obj.act = {}
		#_sql = "select name from 6s_activity where id='%s' and user_id=(select id from 6s_user where username='***');"
		_sql = "select title,preinfo,content,DATE_FORMAT(time_from,'%%Y-%%m-%%d'),DATE_FORMAT(time_to,'%%Y-%%m-%%d'),imgs_act,img_cover from 6s_activity where id='%s';"%req.GET["id"]
		print _sql
		count,rets=dbmgr.db_exec(_sql)
		if count == 1:
			print "6s_activity: ",rets[0],rets[0][3]
			obj.act = { "title":rets[0][0],"preinfo":rets[0][1],"content":rets[0][2],"time_from":rets[0][3],"time_to":rets[0][4],
									"imgs_act":rets[0][5].split(" "),"img_cover":rets[0][6] }	
		print "[INFO]try to modify activity. ",count

	print "--5--"
	#obj.einfo.error = "return by server.";
	fp = open('templates/activity_add.html')  
	t = Template(fp.read())  
	fp.close()  
	html = t.render(Context({'form': form, "obj":obj}))  
	return HttpResponse(html) 




@csrf_exempt  
def register_business_end(req):
  print 'templates/register_business_end.html...'  
  fp = open('templates/register_business_end.html')  
  t = Template(fp.read())  
  fp.close()  
  html = t.render(Context({"id":1}))  
  return HttpResponse(html) 



g_page_items_limit = 3

@req_print
@csrf_exempt  
def manage(req, tab="activity_published"):#, action=None
	attrs = req.POST
	#print ">> manage.",attrs
	#print "args POST: ",req.POST
	#print "args GET: ",req.GET

	obj = TempMgr_manage
	obj.tab.init()
	obj.user = req.user
	#obj.tab.activity_published = "active" 
	print ">>>  ",obj.tab,tab,"active"
	if attrs.has_key("table_tab"):
		setattr(obj.tab,attrs["table_tab"],"active") #click priv next, remember the tab.
	else:
		setattr(obj.tab,tab,"active") #tab change.

	_limit = g_page_items_limit
	_offset = 0
	if attrs.has_key("table_limit") and attrs.has_key("table_offset") and attrs.has_key("table_tab"):
		#save tab status.
		#check int or not.
		_limit = int(attrs["table_limit"])
		_offset = int(attrs["table_offset"])
		if _limit>=0 and _offset>=0:
			action = attrs.get("table_action", None)
			if action == "priv":
				_offset = _offset-_limit
				if _offset <= 0:
					_offest = 0
			elif action == "next":
				_offset = _offset+_limit
	if _limit<=0 or _offset<=0:
		_limit = g_page_items_limit
		_offset = 0

	if tab == "activity_published":
		_sql = "select title,time_from,time_to,quantities,id from 6s_activity where status=1 limit %d offset %d;"%(_limit,_offset)
		print _sql
		count,rets=dbmgr.db_exec(_sql)
		if count > 0:
			obj.actlist = []
			for i in range(count):
				obj.actlist.append( {'title':rets[i][0],'time_from':rets[i][1],'time_to':rets[i][2],'quantities':rets[i][3],'id':rets[i][4]} )
		else:
			_offset = _offset-_limit
			if _offset <= 0:
				_offset = 0
	elif tab == "audit_businessman":
		_sql = "select a.company,b.createtime,b.status from 6s_user_business a left join 6s_user b on a.refid=b.id limit %d offset %d;"%(_limit,_offset)
		print _sql
		count,rets=dbmgr.db_exec(_sql)
		if count > 0:
			obj.audi_mans = []
			for i in range(count):
				obj.audi_mans.append( {'company':rets[i][0],'createtime':rets[i][1],'status':g_user_status_map[rets[i][2]]} )
		else:
			_offset = _offset-_limit
			if _offset <= 0:
				_offset = 0
		obj.select_acts = g_user_status_map.values()
		print "cities:   ",g_cities
		obj.select_cities = g_cities
		pass

	obj.tableattrs = { "limit":_limit,"offset":_offset}

	fp = open('templates/manage.html')  
	t = Template(fp.read())  
	fp.close()  
	html = t.render(Context({"obj":obj}))  
	return HttpResponse(html) 


@csrf_exempt  
def activity_op(req, optype):
	print ">> manage_update.",optype
	print "get.",req.GET
	print "post.",req.POST

	if optype == "update":
		if req.GET.get("type",None)=="modify" and req.GET.has_key("id"):
			return activity_add(req, "modify")
		if req.GET.get("type",None)=="offline" and req.GET.has_key("id"):
			_id = req.GET["id"] 
			_sql = "select * from 6s_user where status=1 and id=(select id from auth_user where username='%s');"%(str(req.user))
			count,rets=dbmgr.db_exec(_sql)
			print _sql,count,rets
			if count == 1:
				_sql = "update 6s_activity set status=0 where status=1 and id=%s and user_id=(select id from auth_user where username='%s');"%(_id,str(req.user))
				count,rets=dbmgr.db_exec(_sql)
				if count == 1:
					print "jump to business page...... "
			else:
				pass #error log.
	elif optype == "delete":
		if req.GET.has_key("id"):
			_id = req.GET["id"] 
			_sql = "select * from 6s_user where status=1 and id=(select id from auth_user where username='%s');"%(str(req.user))
			pass
	elif optype == "add":
			return activity_add(req)

	fp = open('templates/manage_update.html')  
	t = Template(fp.read())  
	fp.close()  
	html = t.render(Context({"id":1}))  
	return HttpResponse(html) 




