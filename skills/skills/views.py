# -*- coding: utf-8 -*-
from django.http import HttpResponse,HttpResponseRedirect
from django.template import Template,Context,RequestContext
from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_exempt


class TempMgr_base:  
  #data
  #methods
  pass
class TempMgr_register(TempMgr_base):  
  pass
class TempMgr_register_business(TempMgr_base):  
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
    #method check and return obj.
    pass
  print request.session.items()
  fp = open('templates/search.html')  
  t = Template(fp.read())  
  fp.close()  
  html = t.render(Context({"id":1}))  
  return HttpResponse(html) 


@csrf_exempt  
def login(request):
  print request.session.items()
  fp = open('templates/signin.html')  
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






