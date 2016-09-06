import redis
import copy
import time
import sys 
import traceback 
import skills.settings as settings
import modules as mo

redis_conn = None  

def redis_init():
		global redis_conn
		ret = None
		for i in range(2):
			try:  
				#mo.logger.info( "[conn_redis]%s_%d %d."%(settings.redis_serer,settings.redis_port,i) )
				redis_conn = redis.StrictRedis(host=settings.redis_serer, port=settings.redis_port, db=0)  
				#redis_conn = redis.StrictRedis(host="127.0.0.1", port=6378, db=0)  
			except Exception, e:  
				ret = str(sys.exc_info()) + "; " + str(traceback.format_exc()) 
				mo.logger.error( ret )
				#print ret 
				time.sleep(0.5)
		return False,ret


def redis_set(key, value, timeout=None):
		global conn_redis
		#starttime = time.time()
		count,rets = -1,None
		ret = None
		for i in range(2):
			try:
				redis_conn.set(key, value)  
				if timeout <> None:
					redis_conn.expire(key, timeout)  
			except:
				ret = "[redis_set error] retry.%d, %s, %s:%s. [%s]"%(i,str(sys.exc_info()),str(traceback.format_exc()),key,value  )
				mo.logger.error( ret )
				#print ret 
				redis_init()
		#endtime = time.time()
		#mo.logger.info("[redis_set] %s:%s, count:%d, time:%.03f."%(_sql,count,float(endtime - starttime) ))
		return ret==None


def redis_get(key):
		global conn_redis
		count,rets = -1,None
		ret = None
		for i in range(2):
			try:
				return redis_conn.get(key)  
			except:
				ret = "[redis_get error] retry.%d, %s, %s. [%s]"%(i,str(sys.exc_info()),str(traceback.format_exc()),key  )
				#print ret
				mo.logger.error( ret )
				redis_init()
		return None


redis_init()
'''
print "set aa" 
redis_set("aa","123")
print "set bb, timeout=2" 
redis_set("bb","123",2)
import time
time.sleep(5)
print "get aa" 
print "aa", redis_get("aa")
print "get bb" 
print "bb", redis_get("bb")
print "test fin." 
'''


