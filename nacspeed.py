import csv
import configparser
import sqlite3
import ldap3

Config=configparser.ConfigParser()

Config.read("config/config.ini")

if Config['nacspeed']['icanread'] == False:
	print ("Please edit config.ini")
	exit()


