import MySQLdb
import copy
import time
import sys 
import traceback 
import skills.settings as settings
import modules as mo
g_conn_w = None
g_conn_r = None
#lock


def db_init_w():
		global g_conn_w
		ret = None
		for i in range(3):
				try:
						mo.logger.info( "[conn_w]%s_%s_%s_%s %d."%(settings.DB_HOST,settings.DB_USERNAME,settings.DB_PASSWORD,settings.DB_NAME,i) )
						g_conn_w=MySQLdb.connect(host=settings.DB_HOST,user=settings.DB_USERNAME,passwd=settings.DB_PASSWORD,db=settings.DB_NAME,port=settings.DB_PORT,charset='utf8')
						return True,None
				except:
						ret = str(sys.exc_info()) + "; " + str(traceback.format_exc()) 
						mo.logger.error( ret )
						#time.sleep(1)
		return False,ret

def db_init_r():
		global g_conn_r
		ret = None
		for i in range(3):
				try:
						mo.logger.info( "[conn_r]%s_%s_%s_%s %d."%(settings.DB_HOST2,settings.DB_USERNAME2,settings.DB_PASSWORD2,settings.DB_NAME2,i) )
						g_conn_r=MySQLdb.connect(host=settings.DB_HOST2,user=settings.DB_USERNAME2,passwd=settings.DB_PASSWORD2,db=settings.DB_NAME2,port=settings.DB_PORT2,charset='utf8')
						return True,None
				except:
						ret = str(sys.exc_info()) + "; " + str(traceback.format_exc()) 
						mo.logger.error( ret )
						#time.sleep(1)
		return False,ret


class DBOperation:
	default = "default"
	select = "select"
	insert = "insert"


#@mo.time_calc
def db_exec(_sql, op=DBOperation.default):
		global g_conn_w,g_conn_r
		starttime = time.time()
		count,rets = -1,None
		ret = None
		is_w = (_sql.find("select ")!=0 or _sql.find("6s_trace")!=0 or _sql.find("6s_wx_msg")!=0)
		for i in range(3):
				_cur = None
				try:
						if is_w:
							_cur = g_conn_w.cursor()
						else:
							_cur = g_conn_r.cursor()
						count=_cur.execute(_sql) 
						rets = _cur.fetchall()
						break
				except:
						rets = "[sql error] retry.%d, %s, %s. [%s]"%(i,str(sys.exc_info()),str(traceback.format_exc()),_sql  )
						mo.logger.error( rets )
						if is_w:
							db_init_w()
						else:
							db_init_r()
				finally:
						if _cur != None:
								ret = _cur.lastrowid
								_cur.close()
								if is_w:
									g_conn_w.commit()
								else:
									g_conn_r.commit()
		#mo.logger.info("[sql] %s %d %s. "%(_sql,count,str(rets) ))
		endtime = time.time()
		if not " 6s_trace" in _sql and not " 6s_wx_msg" in _sql:
			if is_w:
				mo.logger.info("[sql_w] %s, count:%d, time:%.03f."%(_sql,count,float(endtime - starttime) ))
			else:
				mo.logger.info("[sql_r] %s, count:%d, time:%.03f."%(_sql,count,float(endtime - starttime) ))
		if op == DBOperation.insert:
			return count,rets,ret
		return count,rets

def db_select_test():		#cur.execute('select * from user')
		global g_conn_w
		_cur=g_conn_w.cursor()
		count=_cur.execute('select * from 6s_acttype')
		print "test_db_insert: ",count
		rets = _cur.fetchall()
		for ret in rets:
			print ret


db_init_w()
db_init_r()
#print db_exec("select * from 6s_user where username='test';")
#print db_exec("delete from 6s_user where username='test';")
#print db_exec("insert into 6s_user(refid,username,phone,role,img,createtime) values(1,'test','','normal','',now());")
#db_select_test()
		#cur.close()
		#g_conn_w.close()


