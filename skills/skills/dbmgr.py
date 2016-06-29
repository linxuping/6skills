import MySQLdb
import copy
import time
import sys 
import traceback 
import skills.settings as settings
g_conn,g_cur = None,None
#lock

def db_init():
		global g_conn,g_cur
		ret = None
		for i in range(3):
				try:
						#g_conn=MySQLdb.connect(host='localhost',user='',passwd='',db='sixskillsdb',port=3306)
						print settings.DB_HOST,settings.DB_USERNAME,settings.DB_PASSWORD,DB_NAME
						g_conn=MySQLdb.connect(host=settings.DB_HOST,user=settings.DB_USERNAME,passwd=settings.DB_PASSWORD,db=DB_NAME,port=3306)
						g_cur=g_conn.cursor()
						return True,None
				except:
						ret = str(sys.exc_info()) + "; " + str(traceback.format_exc())
						time.sleep(1)
		return False,ret


def db_exec(_sql):
		count,rets = -1,None
		for i in range(3):
				try:
						count=g_cur.execute(_sql) 
						rets = g_cur.fetchall()
				except:
						#log.
						print "retry ",i,str(sys.exc_info()) + "; " + str(traceback.format_exc())
						time.sleep(1)
						db_init()
		return count,rets

def db_select_test():		#cur.execute('select * from user')
		global g_cur
		count=g_cur.execute('select * from 6s_acttype')
		print "test_db_insert: ",count
		rets = g_cur.fetchall()
		for ret in rets:
			print ret


print db_init()
print db_exec("select * from 6s_user where username='test';")
print db_exec("delete from 6s_user where username='test';")
print db_exec("insert into 6s_user(username) values('test');")
#db_select_test()
		#cur.close()
		#g_conn.close()


