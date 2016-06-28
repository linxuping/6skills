import MySQLdb
g_conn,g_cur = None,None


def init_db():
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


def test_db_insert():		#cur.execute('select * from user')
		count=g_cur.execute('select * from 6s_activity')
		print "test_db_insert: ",count
print init_db()
test_db_insert()
		#cur.close()
		#g_conn.close()


