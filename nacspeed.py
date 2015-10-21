#!/usr/bin/which python3

import csv
import configparser
import sqlite3
import ldap3
import time
import os
import datetime

Config=configparser.ConfigParser()

Config.read("config/config.ini")

if Config['nacspeed']['icanread'] != "true":
	print ("Please edit config.ini")
	exit()
	
def modify_time (filename):
	t = os.path.getmtime(filename)
	return datetime.datetime.fromtimestamp(t)

d = datetime.datetime.now()
for n in range(1,20):
	logfilename = Config['nacspeed']['nsroot'] + "NetSight/appdata/logs/" + d.strftime("nacESE.%Y_%m_%d_") + n.zfill(2) ".log"
	print("Checking " + logfilename + "...")
	if os.path.exists(logfilename):
		initlog = logfilename
print ("Using " + initlog + " for initial logfile")

