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
    url(r'^manage$', views.manage),
    url(r'^manage/update/', views.manage_update),
    url(r'^activity/(?P<optype>\w+)', views.activity_op),
    #url(r'^register/', views.register),
    #url(r'^register_business/', views.register_business,name='list'),
    #url(r'^register/(?P<retype>\w+)', views.register_business,name='list'),
    url(r'^register/normal/', views.register_business),
    url(r'^register/business/', views.register_business,name='list'),
)

