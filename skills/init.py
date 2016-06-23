from django.core.management import setup_environ 
import PROJECTNAME.settings 
setup_environ(PROJECTNAME.settings)
import os
os.environ['DJANGO_SETTING_MODULE']='PROJECTNAME.settings'

