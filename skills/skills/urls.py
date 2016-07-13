from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

import views
import wxapi

urlpatterns = patterns('',
		#management
		url(r'^admin/', include(admin.site.urls)),
		url(r'^index/', views.dispatch),
		url(r'^search/', views.search),
		url(r'^login/', views.login),

		url(r'^manage/$', views.manage),
		url(r'^manage/tab/(?P<tab>\w+)/', views.manage),
		#url(r'^manage/tab/(?P<tab>\w+)/(?P<action>\w+)/', views.manage),
		url(r'^activity/(?P<optype>\w+)/$', views.activity_op),
		#url(r'^businessman/(?P<optype>\w+)/$', views.businessman_op),

		#url(r'^activity/(?P<optype>\w+)/', views.activity_op),
		url(r'^register/normal/', views.register),

		url(r'^register/business/end/', views.register_business_end),
		url(r'^register/business/', views.register_business,name='list'),

		url(r'^ajax*', views.ajax_process),
		#management END.

		#wxapi
		#activities/special-offers?area=xxx&age=x&page=x&page_size=x 
		url(r'^activities/special-offers', wxapi.activities_special_offers),
		#activities/preview?area=xxx&age=x&page=x&page_size=x 
		url(r'^activities/preview', wxapi.activities_preview),
		#activities/details/{uuid} 
		url(r'^activities/details', wxapi.activities_details),
		#get-auth-code?phone=138xxx 
		url(r'^get-auth-code', wxapi.get_authcode),
		#/auth 
		url(r'^wxauth', wxapi.wxauth_idencode),
		#activities/sign
		url(r'^activities/sign', wxapi.activities_sign),
		#activities/my
		url(r'^activities/my', wxapi.activities_my),
		#acitivities/reset?openid={openid}
		url(r'^activities/reset', wxapi.activities_reset),
		#feedback
		#url(r'^wxfeedback', wxapi.wxfeedback,
		#activities/get-areas
		url(r'^activities/get-areas', wxapi.activities_getareas),
		#
		#wxapi END.
)

