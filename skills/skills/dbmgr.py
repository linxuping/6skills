import MySQLdb
import copy
import time
import sys 
import traceback 
import skills.settings as settings
g_conn = None
#lock

def db_init():
		global g_conn
		ret = None
		for i in range(3):
				try:
						#g_conn=MySQLdb.connect(host='',user='',passwd='',db='',port=)
						print "%s_%s_%s_%s"%(settings.DB_HOST,settings.DB_USERNAME,settings.DB_PASSWORD,settings.DB_NAME)
						g_conn=MySQLdb.connect(host=settings.DB_HOST,user=settings.DB_USERNAME,passwd=settings.DB_PASSWORD,db=settings.DB_NAME,port=settings.DB_PORT,charset='utf8')
						return True,None
				except:
						ret = str(sys.exc_info()) + "; " + str(traceback.format_exc())
						time.sleep(1)
		return False,ret


def db_exec(_sql):
		global g_conn
		_cur=g_conn.cursor()
		count,rets = -1,None
		for i in range(3):
				try:
						print "exec:  ",_sql
						count=_cur.execute(_sql) 
						rets = _cur.fetchall()
						break
				except:
						#log.
						print "retry ",i,str(sys.exc_info()) + "; " + str(traceback.format_exc())
						time.sleep(1)
						print db_init()
		_cur.close()
		g_conn.commit()
		return count,rets

def db_select_test():		#cur.execute('select * from user')
		global g_conn
		_cur=g_conn.cursor()
		count=_cur.execute('select * from 6s_acttype')
		print "test_db_insert: ",count
		rets = _cur.fetchall()
		for ret in rets:
			print ret


print db_init()
#print db_exec("select * from 6s_user where username='test';")
#print db_exec("delete from 6s_user where username='test';")
#print db_exec("insert into 6s_user(refid,username,phone,role,img,createtime) values(1,'test','','normal','',now());")
#db_select_test()
		#cur.close()
		#g_conn.close()


