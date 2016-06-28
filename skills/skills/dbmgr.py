import MySQLdb
g_conn,g_cur = None,None


def init_db():
		global g_conn,g_cur
		ret = None
		for i in range(3):
				try:
						g_conn=MySQLdb.connect(host='localhost',user='root',passwd='666666',db='skills',port=3306)
						g_cur=g_conn.cursor()
						return True,None
				except:
						ret = str(sys.exc_info()) + "; " + str(traceback.format_exc())
						time.sleep(1)
		return False,ret


def test_db_select():		#cur.execute('select * from user')
		global g_cur
		count=g_cur.execute('select * from 6s_acttype')
		print "test_db_insert: ",count
		rets = g_cur.fetchall()
		for ret in rets:
			print ret


print init_db()
test_db_select()
		#cur.close()
		#g_conn.close()


