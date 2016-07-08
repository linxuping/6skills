#!/usr/bin/env python 
# -*- coding: utf-8 -*-
import datetime
from mylog import logger

def time_calc(func):
		def wrapper(args):
				starttime = datetime.datetime.now()
				ret = func(args)
				endtime = datetime.datetime.now()
				logger.info( "[CALC] %s: %s time:%d."%(func.func_name,str(args),(endtime - starttime).seconds) )
				return ret
		return wrapper



