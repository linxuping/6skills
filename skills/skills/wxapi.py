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

import json
#ajax process.
def activities_special_offers(req):
	method = req.GET.get("method",None)
	print method
	
	print "----------- ajax processing -------------->"
	print req.GET  #pass args using "url: '/ajax?name=test',"
	_json = { 1:2,3:[4,5] }
	if method=="get_regions" and req.GET.has_key("city"):
		_json["regions"] = _get_regions( req.GET["city"] )
	_jsonobj = json.dumps(_json)
	return HttpResponse(_jsonobj, mimetype='application/json')
	#return HttpResponseRedirect('/test2') 



