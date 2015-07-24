# -*- coding: utf-8 -*-
"""
Created on Wed Apr 29 16:09:18 2015

@author: will
"""

import googlemaps
import random as rd
import time
import json
import math
import os
import glob
import datetime
import traceback
api_key = "AIzaSyBlNUbBp2Ked_vCyhH78--Ws7QGKpnbQvI"

gmaps = googlemaps.Client(key=api_key)



lat_s = 41.7
lat_n = 42.0
lon_s = -87.55
lon_n = -87.66
lon_w = 0.22
starts = ['Hyde Park, Chicago', 'Lincoln Park, Chicago', 'University Village, Chicago', 'Logan Square, Chicago', 'Midway International Airport, Cicero Avenue, Chicago, IL', 'OHare International Airport, Chicago, IL', 'Edgewater, Chicago, IL', 'Chicago State University, South King Drive, Chicago, IL']

outfile = open('routes.txt','a')
t=datetime.datetime(2015, 5, 8, 6, 30)
n=0
while n<30000:
    ry = rd.random();
    rx = rd.random();
    y = lat_s + ry*(lat_n-lat_s)
    xr = lon_s + ry*(lon_n-lon_s)
    x = xr - lon_w*rx
    t = time.time()
    destination = gmaps.reverse_geocode((y, x))
    for st in starts:
        try:
            di = gmaps.directions(st,destination[0]['formatted_address'],mode='transit',departure_time=t)
            json.dump(di, outfile)
            outfile.write('\n')
            n = n+1
        except:
            time.sleep(900)
    print destination[0]['formatted_address']
    
    time.sleep(1)    
outfile.close()


#outfile = open('routes.txt','a')
#
#with open('destinationlist.txt','r') as f:
#    for line in f:
#        for st in starts:
#            di = gmaps.directions(st,line,mode='transit')
#            json.dump(di, outfile)
#            outfile.write('\n') 
#outfile.close()
#
#
#concat=[]
#for filename in glob.glob(os.path.join(os.getcwd(),'route_crime/part*')):
#    with open(filename,'r') as f:
#        for line in f:
#            concat.append(json.loads(line))
#outfile = open('site/js/routes.json','w')
#json.dump(concat, outfile)
#outfile.close()