
# Author: Jan Hendrik Metzen <jhm@informatik.uni-bremen.de>
# License: BSD Style.

import numpy as np
np.random.seed(0)

import matplotlib.pyplot as plt

import json

from sklearn.naive_bayes import GaussianNB
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import LinearSVC
from sklearn.calibration import calibration_curve
from sklearn.metrics import roc_curve

#X, y = datasets.make_classification(n_samples=100000, n_features=20,
#                                    n_informative=2, n_redundant=2)

#samplefrac = 0.5  # Samples used for training the models
#samples = np.random.rand(yy.shape[0])<samplefrac
#X_train = XX[samples, :]
#X_test = XX[np.invert(samples), :]
#y_train = np.ravel(yy[samples])
#y_test = np.ravel(yy[np.invert(samples)])
#
## Create classifiers
#lr = LogisticRegression()
#gnb = GaussianNB()
#svc = LinearSVC(C=1.0)
#rfc = RandomForestClassifier(n_estimators=100)


###############################################################################
# Plot calibration plots

#plt.figure(figsize=(10, 10))
#ax1 = plt.subplot2grid((3, 1), (0, 0), rowspan=2)
#ax2 = plt.subplot2grid((3, 1), (2, 0))
#
#ax1.plot([0, 1], [0, 1], "k:", label="Perfectly calibrated")
#for clf, name in [(lr, 'Logistic'),
#                  (gnb, 'Naive Bayes'),
#                  (svc, 'Support Vector Classification'),
#                  (rfc, 'Random Forest')]:
#    clf.fit(X_train, y_train)
#    if hasattr(clf, "predict_proba"):
#        prob_pos = clf.predict_proba(X_test)[:, 1]
#    else:  # use decision function
#        prob_pos = clf.decision_function(X_test)
#        prob_pos = \
#            (prob_pos - prob_pos.min()) / (prob_pos.max() - prob_pos.min())
#    fraction_of_positives, mean_predicted_value = \
#        calibration_curve(y_test, prob_pos, n_bins=10)
#        
#    fpr, tpr ,thres = \
#        roc_curve(y_test, prob_pos)
#
##    ax1.plot(mean_predicted_value, fraction_of_positives, "s-",
##             label="%s" % (name, ))
#    ax1.plot(fpr, tpr, "s-",
#             label="%s" % (name, ))
#    ax2.hist(prob_pos, range=(0, 1), bins=10, label=name,
#             histtype="step", lw=2)
#
#ax1.set_xlabel("False Positives")
#ax1.set_ylabel('True Positives')
#ax1.set_ylim([-0.05, 1.05])
#ax1.legend(loc="lower right")
#
#ax2.set_xlabel("Mean predicted value")
#ax2.set_ylabel("Count")
#ax2.legend(loc="upper center", ncol=2)
#
#plt.tight_layout()
#plt.show()

datAll = [];
for xx in range(maxX):
    for yy in range(maxY):
        for hh in range(maxH):
            for mm in range(maxM):
                datAll.append([xx,yy,hh,mm])
al = np.array(datAll);
vals = rfc.predict_proba(al)[:,1];
bigj = {};
for i in range(len(vals)):
    inp = datAll[i];
    vv = vals[i];
    xx = inp[0]+mins[0];
    yy = inp[1]+mins[1];
    hh = inp[2]+mins[2];
    mm = inp[3]+mins[3];
    if (xx not in bigj):
        bigj[xx]={}
    if (yy not in bigj[xx]):
        bigj[xx][yy]={}
    if (mm not in bigj[xx][yy]):
        bigj[xx][yy][mm]={}
    bigj[xx][yy][mm][hh] = vv

datj = {}
datmax = 0
for i in range(len(datX)):
    inp = datX[i];
    xx = inp[0];
    yy = inp[1];
    hh = inp[2];
    mm = inp[3];
    if (xx not in datj):
        datj[xx]={}
    if (yy not in datj[xx]):
        datj[xx][yy]={}
    if (mm not in datj[xx][yy]):
        datj[xx][yy][mm]={}
    if (hh not in datj[xx][yy][mm]):
        datj[xx][yy][mm][hh] = 1
    else:
        datj[xx][yy][mm][hh] = datj[xx][yy][mm][hh] + 1
        if(datj[xx][yy][mm][hh]>datmax):
            datmax = datj[xx][yy][mm][hh]
            

for xx in datj:
    for yy in datj[xx]:
        summer = 0
        cntr = 0
        for mm in datj[xx][yy]:
            subsum = 0
            subcnt = 0
            for hh in datj[xx][yy][mm]:
                datj[xx][yy][mm][hh] = float(datj[xx][yy][mm][hh])/float(datmax)
                summer = summer + datj[xx][yy][mm][hh]
                subsum = subsum + datj[xx][yy][mm][hh]
                cntr = cntr+1
                subcnt = subcnt+1
            datj[xx][yy][mm][-1]=subsum/subcnt
        datj[xx][yy][-1]=summer/cntr

for i in range(len(datXtra)):
    inp = datX[i];
    xx = inp[0];
    yy = inp[1];
    ty = datXtra[i][0];
    lo = datXtra[i][1];
    if ('type' not in datj[xx][yy]):
        datj[xx][yy]['type']=[]
        datj[xx][yy]['location']=[]
    datj[xx][yy]['type'].append(ty)
    datj[xx][yy]['location'].append(lo)
   
with open('site/js/data.json', 'w') as f:
    json.dump(datj, f)
    
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
with open('site/js/pred.json', 'w') as f:
    json.dump(bigj, f)