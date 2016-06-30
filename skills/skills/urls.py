from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'skills.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^index/', views.dispatch),
    url(r'^search/', views.search),
    url(r'^login/', views.login),

    url(r'^manage/$', views.manage),
    url(r'^manage/tab/(?P<tab>\w+)/', views.manage),
    #url(r'^manage/tab/(?P<tab>\w+)/(?P<action>\w+)/', views.manage),
    url(r'^manage/(?P<optype>\w+)/', views.manage_update),

    url(r'^activity/(?P<optype>\w+)', views.activity_op),
    url(r'^register/normal/', views.register),

    url(r'^register/business/end/', views.register_business_end),
    url(r'^register/business/', views.register_business,name='list'),
)

