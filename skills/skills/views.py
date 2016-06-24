# -*- coding: utf-8 -*-
from django.http import HttpResponse,HttpResponseRedirect
from django.template import Template,Context,RequestContext
from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib import auth

class TempMgr_base:  
  #data
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
    return HttpResponseRedirect('/index') 
  else:
    return HttpResponseRedirect('/login') 


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
    print request.session.items()
    # Handle file upload
    print "--1--"
    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        print "--2--",form.__dict__
        if form.is_valid():
            print "--3--"
            newdoc = Document(docfile = request.FILES['docfile'])
            newdoc.save()

            # Redirect to the document list after POST
            return HttpResponseRedirect(reverse('skills.views.register_business'))
    else:
        print "--4--"
        form = DocumentForm() # A empty, unbound form

    # Load documents for the list page
    documents = Document.objects.all()

    # Render list page with the documents and the form
    #return render_to_response(
    #    'templates/register_business.html',
    #    {'documents': documents, 'form': form},
    #    context_instance=RequestContext(request)
    #)
    fp = open('templates/register_business.html')  
    t = Template(fp.read())  
    fp.close()  
    html = t.render(Context({'documents': documents, 'form': form}))  
    return HttpResponse(html) 







