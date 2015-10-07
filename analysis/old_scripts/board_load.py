# -*- coding: utf-8 -*-
"""
Created on Mon Jun  8 14:54:56 2015

@author: will
"""
import csv
from ast import literal_eval
# stop_id,on_street,cross_street,routes,boardings,alightings,month_beginning,daytype,location

borX = [];
borY = [];
with open('input/boards.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',')
    for dat in spamreader:
        try:
            loc = literal_eval(dat[8])
            lat = loc[0]
            lng = loc[1]
            x = -int(math.floor(lng/binl))
            y = int(math.floor(lat/binl))
            borX.append([x,y])
            borY.append(float(dat[4])+float(dat[5]))
        except:
            pass
borj = {}
bormax = 0
for i in range(len(borX)):
    inp = borX[i];
    xx = inp[0];
    yy = inp[1];
    val = borY[i]
    if (xx not in borj):
        borj[xx]={}
    if (yy not in borj[xx]):
        borj[xx][yy]=0
    borj[xx][yy]=borj[xx][yy]+val
    if(borj[xx][yy]>bormax):
        bormax = borj[xx][yy]

for xx in borj:
    for yy in borj[xx]:
        borj[xx][yy]=borj[xx][yy]/bormax
        
with open('site/js/pass.json', 'w') as f:
    json.dump(borj, f)