#!/usr/bin/python
# -*- coding: utf-8 -*-
import time
import os
path_ori = "/home/lxp/6skills/skills/output.log"
path_tar = "/home/lxp/6skills/skills/logs"

while True:
	ts = time.localtime()
	hour = int(ts[3])
	fname = "%4d%.2d%.2d.log"%(ts[0],ts[1],ts[2])
	if hour==3:
		os.system("cp -f %s %s/output.log"%(path_ori, path_tar))
		ret = os.system("cp -f %s %s/%s"%(path_ori, path_tar, fname))
		if ret == 0:
			os.system("echo ''>%s"%(path_ori))
	time.sleep(3600)
