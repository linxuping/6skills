"""
Django settings for skills project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'x$p%ac(otm3+mz@m9@_h&_zd8ymm=e08y&-am_6ssr7bn_nm^y'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'myapp',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'skills.urls'

WSGI_APPLICATION = 'skills.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases
'''
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
'''
#W R+
DB_HOST = '127.0.0.1'
DB_NAME = 'sixskillsdb'
DB_USERNAME = 'root'
DB_PASSWORD = 'sixskillslinxuping'
DB_PORT = 3306
#R
DB_HOST2 = '127.0.0.1'
DB_NAME2 = 'sixskillsdb'
DB_USERNAME2 = 'root'
DB_PASSWORD2 = 'sixskillslinxuping'
DB_PORT2 = 3306
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': DB_NAME,
        'USER':DB_USERNAME,
        'PASSWORD':DB_PASSWORD,
        'HOST':DB_HOST,
        'PORT':DB_PORT,
    }
}


# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

#TIME_ZONE = 'UTC'
TIME_ZONE = 'Etc/GMT-8'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static").replace('\\','/'),
)

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

MEDIA_URL = '/media/'

access_key = '-YQ_Z6KbcOw1oGbhSM9au01otcr8UWvK5O4FfyiK'
secret_key = 'wDhQo8wTEuESIN2dMYd5pEBl_Yoe5RsX0x4dThxa'
#sms_id = "23449926" #liuyihudong
#sms_secret = "029e868b396272e5fdf8ad7778aeb6d0"
sms_id = "23467864"
sms_secret = "b10ef84bb962534c0a7dcfbbfa5d4bba"
sms_type = "normal"
sms_temp_code = "SMS_14330272"
BFE_URL = "http://www.6skills.com"
#appid = "wx1cdf2c4bb014681e" #liuyihudong
#appsecret = "694b093484ee85bc8537459f066f5cdf" 
appid = "wxe6d40d1e6b8d010e"
appsecret = "9560d101dc228aa5aab838312cbb0287" 
token = "luckysixskills"
txgeokey = "WFABZ-PI4WP-Y76DD-LMDLF-LW5MT-3FFUS"
redis_server = "127.0.0.1"
redis_port = 6379
headimg_path = "/home/lxp/6skills/skills/static/imgs/head"
check_access_token = True
mopenid = "okgp_wNtQVsu20gRMpJRX50bTJKs"
redis_pwd = "redislinxuping"
js_noncestr = "zhongqiu@home88"
js_timestamp = "1414587457"
pay_key = "oi8enva8asidhfazlixucyv98w3l83nb" 
pay_mchid = "1395115702"
pay_cb = "http://www.6skills.com/wxpay/"
pay_st = "MD5"


#save func
def check_marg_safe(_arg):
	_arg = _arg.lower()
	_checklist = [ " and "," or ","drop ","=","\'","\"",";","select " ]
	if _arg.endswith("\\"):
		return False
	for cl in _checklist:
		if cl in _arg:
			return False
	return True

