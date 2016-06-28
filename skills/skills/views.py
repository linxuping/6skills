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


import MySQLdb
g_conn,g_cur = None,None
def init_db():
		ret = None
		for i in range(3):
				try:
						g_conn=MySQLdb.connect(host='localhost',user='root',passwd='666666',db='skills',port=3306)
						g_cur=g_conn.cursor()
						return True,None
				except:
						ret = str(sys.exc_info()) + "; " + str(traceback.format_exc())
						time.sleep(1)
		return False,ret
		#cur.execute('select * from user')
		#cur.close()
		#g_conn.close()



class TempMgr_base:  
  #status & data
  class _status:
    pass
  st = _status
  class _data:
    pass
  da = _data
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
def manage(request):
  print ">> manage."
  print request.session.items()
  fp = open('templates/manage.html')  
  t = Template(fp.read())  
  fp.close()  
  html = t.render(Context({"id":1}))  
  return HttpResponse(html) 




@csrf_exempt  
def manage_update(request):
  print ">> manage_update."
  print request.session.items()
  fp = open('templates/manage_update.html')  
  t = Template(fp.read())  
  fp.close()  
  html = t.render(Context({"id":1}))  
  return HttpResponse(html) 




@csrf_exempt  
def register(request):
  print request.session.items()
  fp = open('templates/register.html')  
  t = Template(fp.read())  
  fp.close()  
  html = t.render(Context({"id":1}))  
  return HttpResponse(html) 



from myapp.models import Document
from myapp.forms import DocumentForm
from django.core.urlresolvers import reverse

@csrf_exempt  
def register_business(request):
    print "sessions: ",request.session.items()
    print "reqs: ",request.user,type(request.user),str(request.user)
    print "args POST: ",request.POST
    print "args GET: ",request.GET
    # Handle file upload
    print "--1--"
    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        print "--2--",form.__dict__
        if form.is_valid():
            print "--3--"
            #how to changed the file name ??????????????????
            #_file = "%s_%s"%(str(request.user),str(request.FILES['docfile']))
            #if repeated -->>>  functionList_r8KCzYQ.xml  functionList.xml
            _file = request.FILES['docfile']
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
    if request.POST.has_key("actype_normal"):
        fp = open('templates/register.html')  
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
  if request.POST.has_key("actype_normal"):
      fp = open('templates/register.html')  
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






