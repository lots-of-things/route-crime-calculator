# -*- coding: utf-8 -*-
"""
Created on Tue Apr 21 11:34:45 2015

@author: will
"""

import requests
import json

lat1 = 41.8
lat2 = 41.8369
lon1 = -87.5900
lon2 = -87.6847

urlp = 'https://api.uber.com/v1/estimates/price'

parametersp = {
    'server_token': 'bwloQLsgf7S9WqwiLJRr-In7ijr7vpU_Hz2RjQif',
    'start_latitude': lat1,
    'start_longitude': lon1,
    'end_latitude': lat2,
    'end_longitude': lon2
}

responsep = requests.get(urlp, params=parametersp)

urlt = 'https://api.uber.com/v1/estimates/time'

parameterst = {
    'server_token': 'bwloQLsgf7S9WqwiLJRr-In7ijr7vpU_Hz2RjQif',
    'start_latitude': lat1,
    'start_longitude': lon1
}

responset = requests.get(urlt, params=parameterst)

datap = responsep.json()
datat = responset.json()
print datap["prices"][0]["low_estimate"]
print datap["prices"][0]["high_estimate"]
print datat["times"][0]["estimate"]