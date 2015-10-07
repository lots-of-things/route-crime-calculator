# -*- coding: utf-8 -*-
"""
Created on Tue Jun  2 00:33:12 2015

@author: will
"""
import csv
import math
import datetime
import numpy as np


binl = 0.005
binh = 4
binm = 3
datX = []
datXtra = [];
datY = []
with open('input/crimes.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',')
    for dat in spamreader:
        try:
            if(dat[4] != 'NARCOTICS' and dat[6] != 'RESIDENCE' and dat[6] != 'APARTMENT' and 'STORE' not in dat[6]):            
                tim = datetime.datetime.strptime(dat[1], "%m/%d/%Y %I:%M:%S %p")
                lat = float(dat[14])
                lng = float(dat[15])
                x = -int(math.floor(lng/binl))
                y = int(math.floor(lat/binl))
                hr = int(math.floor(tim.hour/binh))
                mn = int(math.floor(tim.month/binm))
                datX.append([x,y,hr,mn])
                datXtra.append([dat[4], dat[6]])
                datY.append(1)
#            print str(tim.hour) +' '+str(tim.month) +' '+str(x) +' '+ str(y)
        except:
            pass
        
X = np.array(datX);
y = np.array(datY);
mins = np.min(X,0)
X = X - mins
maxX = np.max(X[:,0])
maxY = np.max(X[:,1])
maxH = np.max(X[:,2])
maxM = np.max(X[:,3])
mult = 3
X2 = np.concatenate([np.random.randint(0,maxX,(len(y)*mult, 1)),np.random.randint(0,maxY,(len(y)*mult, 1)),np.random.randint(0,maxH,(len(y)*mult, 1)),np.random.randint(0,maxM,(len(y)*mult, 1))],1)
N = np.zeros(len(y)*mult)
XX = np.concatenate([X,X2])
yy = np.concatenate([y,N])
