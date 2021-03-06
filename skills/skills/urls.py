from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

import views
import wxapi
import tbapi

urlpatterns = patterns('',
		#management
		url(r'^admin/$', include(admin.site.urls)),
		url(r'^index/$', views.dispatch),
		url(r'^search/$', views.search),
		url(r'^login/$', views.login),

		url(r'^manage/$', views.manage),
		url(r'^manage/tab/(?P<tab>\w+)/$', views.manage),
		#url(r'^manage/tab/(?P<tab>\w+)/(?P<action>\w+)/$', views.manage),
		url(r'^activity/(?P<optype>\w+)/$', views.activity_op),
		#url(r'^businessman/(?P<optype>\w+)/$', views.businessman_op),

		#url(r'^activity/(?P<optype>\w+)/', views.activity_op),
		url(r'^register/normal/$', views.register),

		url(r'^register/business/end/$', views.register_business_end),
		url(r'^register/business/$', views.register_business,name='list'),

		url(r'^ajax*$', views.ajax_process),
		#management END.

		#wxapi
		#activities/special-offers?area=xxx&age=x&page=x&page_size=x 
		url(r'^activities/special-offers$', wxapi.activities_special_offers),
		#activities/preview?area=xxx&age=x&page=x&page_size=x 
		url(r'^activities/preview$', wxapi.activities_preview),
		#activities/details/{uuid} 
		url(r'^activities/details$', wxapi.activities_details),
		#get-auth-code?phone=138xxx 
		url(r'^get-auth-code$', wxapi.get_authcode),
		#/auth 
		url(r'^wxauth$', wxapi.wxauth_idencode),
		#activities/sign
		url(r'^activities/sign$', wxapi.activities_sign),
		#activities/my
		url(r'^activities/my$', wxapi.activities_my),
		#acitivities/reset?openid={openid}
		url(r'^activities/reset$', wxapi.activities_reset),
		#feedback
		#url(r'^wxfeedback$', wxapi.wxfeedback,
		#activities/get-areas
		url(r'^api/admin/get-areas$', wxapi.activities_getareas),
		url(r'^activities/get-agesel$', wxapi.activities_getagesel),
		url(r'^activities/get_profile$', wxapi.activities_getprofile),
		url(r'^activities/get_qrcode$', wxapi.activities_getqrcode),
		#activities/mycollections
		url(r'^activities/mycollections$', wxapi.activities_mycollections),
		#acitivities/reset_collection?openid={openid}
		url(r'^activities/reset_collection$', wxapi.activities_reset_collection),
		url(r'^activities/collection/get_status$', wxapi.activities_getcollectionstatus),
		#activities/collect
		url(r'^activities/collect$', wxapi.activities_collect),
		url(r'^activities/get_signup_status$', wxapi.activities_getsignupstatus),
		url(r'^activities/unpay/list$', wxapi.activities_myunpay_list),
		#
		#wxapi END.
		
		#tbapi.
		#0818.
		url(r'^api/admin/activity-sign-user$', tbapi.get_activity_sign_user),
		url(r'^api/admin/activity/publish$', tbapi.activity_publish),
		url(r'^api/admin/current-activities$', tbapi.get_publish_activities),
		url(r'^api/admin/unpublish-activities$', tbapi.get_unpublish_activities),
		url(r'^api/admin/login$', tbapi.tbauth),
		url(r'^api/admin/signup-first-step$', tbapi.signup_first_step),
		url(r'^api/admin/signup-second-step$', tbapi.signup_second_step),

		url(r'^api/admin/uploadtoken/get$', tbapi.get_uploadtoken),
		url(r'^api/admin/get-userinfo$', tbapi.get_userinfo),
		url(r'^api/admin/manager/statistic$', tbapi.get_manager_statistic),
		url(r'^api/admin/export-activity-users$', tbapi.get_export_activity_users),
		url(r'^api/admin/replace-qr$', tbapi.replace_qr),
		#0822.
		url(r'^api/admin/activities/preference/add$', tbapi.add_preference),
		url(r'^api/admin/activities/preference/list$', tbapi.get_preferencelist),
		#0823
		url(r'^api/admin/business/authorize$', tbapi.business_authorize),
		url(r'^api/admin/account/set$', tbapi.account_set),
		url(r'^api/admin/get-cities$', wxapi.activities_getcities),
		#0824
		url(r'^api/superadmin/businessman/list$', tbapi.businessman_list),
		url(r'^api/superadmin/signup/list$', tbapi.signup_list),
		#0830
		url(r'^api/admin/get-acttypes$', tbapi.get_acttypes),
		url(r'^api/admin/activities/add$', tbapi.add_activity),
		#url(r'^api/admin/replace-qr$', tbapi.replace_qr),
		#tbapi END.
		url(r'^$', wxapi.default_process),
		url(r'^get_access_token$', wxapi.get_access_token),
		url(r'^wx_test$', wxapi.save_pos_wx),
		url(r'^get_6sid$', wxapi.get_openid),
		url(r'^get_js_signature$', wxapi.get_js_signature),
		#0926
		url(r'^wx/acttypes/list$', wxapi.get_wx_acttypes),
		#0928
		url(r'^activities/hot/list$', wxapi.get_hot_activities),
		url(r'^wx/nearbyareas/list$', wxapi.get_nearbyareas),
		url(r'^wxpay/$', wxapi.wxpay),
		url(r'^testwxpay$', wxapi.testwxpay),
		url(r'^get_wx_payinfo$', wxapi.get_wx_payinfo),
		#lxp
		#url(r'^lxpbuild$', wxapi.lxpbuild),
		#url(r'^lxpback$', wxapi.lxpback),
)

