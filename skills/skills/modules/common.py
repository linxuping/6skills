#!/usr/bin/env python 
# -*- coding: utf-8 -*-
import time
from mylog import logger

def time_calc(func):
		def wrapper(args, *pargs):
				starttime = time.time()
				#print starttime,time.time() 
				ret = func(args,*pargs)
				endtime = time.time()
				print endtime ,time.time()
				logger.info( "[calc] %s: %s time:%.03f."%(func.func_name,str(args),float(endtime - starttime)) )
				return ret
		return wrapper



