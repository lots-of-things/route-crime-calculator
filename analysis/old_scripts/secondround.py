# -*- coding: utf-8 -*-
"""
Created on Mon Jun  8 12:23:18 2015

@author: will
"""

import json
import sklearn.ensemble as ske
from matplotlib import pyplot as plt
data = []
with open('site/js/data.json', 'rb') as data_file:
    data = json.load(data_file)


datX = [];
datY = [];
for x in data:
    for y in data[x]:
        for m in data[x][y]:
            if(m!='type' and m!='location'):
                mm = int(m)
                if(mm>=0):
                    for h in data[x][y][m]:
                        hh = int(h)                    
                        if(hh>=0):
                            datY.append(data[x][y][m][h])
                            datX.append([int(x), int(y), mm, hh])
newX = np.array(datX);
newy = np.array(datY);

rfr = ske.RandomForestRegressor(n_estimators=100)

samplefrac = 0.25
samples = np.random.rand(newy.shape[0])<samplefrac
X_train = newX[samples, :]
X_test = newX[np.invert(samples), :]
y_train = np.ravel(newy[samples])
y_test = np.ravel(newy[np.invert(samples)])

rfr.fit(X_train,y_train)

out = rfr.predict(X_test)
plt.plot(np.abs(out-y_test))

datAll = datX
al = np.array(datAll);
vals = rfr.predict(al);
bigj = {};
for i in range(len(vals)):
    inp = datAll[i];
    vv = vals[i];
    xx = inp[0];
    yy = inp[1];
    hh = inp[2];
    mm = inp[3];
    if (xx not in bigj):
        bigj[xx]={}
    if (yy not in bigj[xx]):
        bigj[xx][yy]={}
    if (mm not in bigj[xx][yy]):
        bigj[xx][yy][mm]={}
    bigj[xx][yy][mm][hh] = vv
    
for xx in bigj:
    for yy in bigj[xx]:
        summer = 0
        cntr = 0
        for mm in bigj[xx][yy]:
            subsum = 0
            subcnt = 0
            for hh in bigj[xx][yy][mm]:
                summer = summer + bigj[xx][yy][mm][hh]
                subsum = subsum + bigj[xx][yy][mm][hh]
                cntr = cntr+1
                subcnt = subcnt+1
            bigj[xx][yy][mm][-1]=subsum/subcnt
        bigj[xx][yy][-1]=summer/cntr
with open('site/js/pred2.json', 'w') as f:
    json.dump(bigj, f)