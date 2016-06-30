# -*- coding: utf-8 -*-
from django.http import HttpResponse,HttpResponseRedirect
from django.template import Template,Context,RequestContext
from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib import auth
import traceback
import time
import sys
import modules as mo
import dbmgr



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



@csrf_exempt  
def dispatch(request):
  if request.is_ajax():
    #method check and return json.
    print request.GET  #pass args using "url: '/ajax?name=test',"
    my_response = {'ajax_resp':'Hello, webapp World!'}
    datos = json.dumps(my_response)
    return HttpResponse(datos, mimetype='application/json')
  else:
    print request.POST
    #method check and return obj.
    pass
  print request.session.items()
  fp = open('templates/carousel.html')  
  t = Template(fp.read())  
  fp.close()  
  html = t.render(Context({"id":1}))  
  return HttpResponse(html) 


@csrf_exempt  
def search(request):
  fp = open('templates/search.html')  
  t = Template(fp.read())  
  fp.close()  
  html = t.render(Context({"id":1}))  
  return HttpResponse(html) 


@csrf_exempt  
def login(request):
  print request.POST
  if request.POST.get("log_username",None) == None:
    print request.session.items()
    fp = open('templates/signin.html')  
    t = Template(fp.read())  
    fp.close()  
    html = t.render(Context({"id":1}))  
    return HttpResponse(html) 
  username = request.POST["log_username"]
  password = request.POST["log_password"]
  user = auth.authenticate(username=username, password=password)  
  if user is not None and user.is_active:
    auth.login(request,user) 
    return HttpResponseRedirect('/register_business') 
  else:
    return HttpResponseRedirect('/login') 







@csrf_exempt  
def register(req):
		print "reqs: ",req.user
		print "args POST: ",req.POST
		print "args GET: ",req.GET
		#Handle file upload
		print "--1--"
		if req.method == 'POST':
				form = DocumentForm(req.POST, req.FILES)
				print "--2--",form.__dict__
				if form.is_valid():
						print "--3--"
						#how to changed the file name ??????????????????
						#_file = "%s_%s"%(str(request.user),str(request.FILES['docfile']))
						#if repeated -->>>  functionList_r8KCzYQ.xml  functionList.xml
						_file = req.FILES['docfile']
						print "----------->",_file
						#rm media/documents/2016/06/26/_file ??????????????????
						newdoc = Document(docfile=_file)
						newdoc.docfile.field.upload_to = "documents/%Y/%m/%d"+"/%s"%str(req.user)
						#newdoc.init_docfile(str(req.user))
						print "new doc: ",newdoc.__dict__
						newdoc.save()

						username = req.POST['username']
						password = req.POST['password']
						phone = req.POST['phone']
						img = _file
						#auth_user -- check user existed or not .
						user = User.objects.create_user(username,"skills@me.com",password)
						user.save()
						#6s_user
						try:
								_sql = "insert into 6s_user(refid,username,phone,role,img) values(%d,'%s','%s','%s','%s');"%(user.id,username,phone,u'normal',img)
								print _sql
								count,rets=dbmgr.db_exec(_sql)
								if count != 1:
										#delete 6s_user
										user.delete()
						except:
								user.delete()

			# Redirect to the document list after POST
			#return HttpResponseRedirect(reverse('skills.views.register.business'))
						return HttpResponseRedirect('/register/business') 
		else:
				print "--4--"
				form = DocumentForm() # A empty, unbound form

	# Load documents for the list page
	#documents = Document.objects.all()
		fp = open('templates/register.html')  
		t = Template(fp.read())  
		fp.close()  
		html = t.render(Context({'form': form}))  
		return HttpResponse(html) 



from myapp.models import Document
from myapp.forms import DocumentForm
from django.core.urlresolvers import reverse

@csrf_exempt  
def register_business(req):
    print "reqs: ",req.user
    print "args POST: ",req.POST
    print "args GET: ",req.GET
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
def activity_op(request, optype):
  print ">>>>>>>>>>> activity_op.",optype
  print request.session.items()
  if optype == "add":
    if request.method == 'POST':
        print "files: ",request.FILES
        form = DocumentForm(request.POST, request.FILES)
        print "--2--",form.__dict__
        if form.is_valid():
            print "--3--"
            #how to changed the file name ??????????????????
            #_file = "%s_%s"%(str(request.user),str(request.FILES['docfile']))
            #if repeated -->>>  functionList_r8KCzYQ.xml  functionList.xml
            for _file in request.FILES.getlist('docfile'):
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
  print "--5--"
  fp = open('templates/activity_add.html')  
  #if request.POST.has_key("actype_normal"):
  #    fp = open('templates/register.html')  
  t = Template(fp.read())  
  fp.close()  
  html = t.render(Context({'form': form}))  
  return HttpResponse(html) 
'''
  fp = open('templates/manage_update.html')  
  t = Template(fp.read())  
  fp.close()  
  html = t.render(Context({"id":1}))  
  return HttpResponse(html) 
'''

@csrf_exempt  
def register_business_end(request):
  print 'templates/register_business_end.html...'  
  fp = open('templates/register_business_end.html')  
  t = Template(fp.read())  
  fp.close()  
  html = t.render(Context({"id":1}))  
  return HttpResponse(html) 




#manage.
class TempMgr_manage(TempMgr_base):
		class _tab:
				activity_published = ""
				activity_nopublish = ""
				user_manage = ""
				user_analyze = ""
				history_analyze = ""
				account_setting = ""
				def init(self):
						self.activity_published,self.activity_nopublish,self.user_manage,self.user_analyze,self.history_analyze,self.account_setting="","","","","",""
		tab = _tab()
		pass

class dbobj:
		pass

g_page_items_limit = 3
@csrf_exempt  
def manage(req, tab="activity_published"):#, action=None
	attrs = req.POST
	print ">> manage.",attrs

	obj = TempMgr_manage
	obj.tab.init()
	#obj.tab.activity_published = "active" 
	print ">>>  ",obj.tab,tab,"active"
	setattr(obj.tab,tab,"active")

	_limit = g_page_items_limit
	_offset = 0
	if attrs.has_key("table_limit") and attrs.has_key("table_offset"):
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
	obj.tableattrs = { "limit":_limit,"offset":_offset}

	fp = open('templates/manage.html')  
	t = Template(fp.read())  
	fp.close()  
	html = t.render(Context({"obj":obj}))  
	return HttpResponse(html) 


@csrf_exempt  
def manage_update(req, optype):
	print ">> manage_update.",optype
	print "get.",req.GET
	print "post.",req.POST

	if optype == "update":
		if req.GET.get("type",None)=="activity" and req.GET.has_key("id"):
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
		if req.GET.get("type",None)=="activity" and req.GET.has_key("id"):
			_id = req.GET["id"] 
			_sql = "select * from 6s_user where status=1 and id=(select id from auth_user where username='%s');"%(str(req.user))
			pass

	fp = open('templates/manage_update.html')  
	t = Template(fp.read())  
	fp.close()  
	html = t.render(Context({"id":1}))  
	return HttpResponse(html) 







