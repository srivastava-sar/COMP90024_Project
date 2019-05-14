from geopy.geocoders import Nominatim

def getPlaceFromCoord(jdata):
    result = None
    if 'city' in jdata:
        result = jdata['city']
    elif 'county' in jdata:
        result = jdata['county']
    elif 'state' in jdata:
        result = jdata['state']
    else:
        result = jdata['country']
    return result.lower()


def getSentimentData2():
    
    POS_Count = 0
    NEG_Count = 0
    Neu_Count = 0
    result = {}
    geolocator = Nominatim(user_agent="TwitterAnalysis", timeout = 3)
    query = SentimentView_Design+'/'+Sentiment_View  
    for row in db.view(query,group=True):
        if row['value']:
            #print(str(row['key']) + "==>" + str(row['value']))
            latitude = row['key'][0]
            longitude = row['key'][1]
            sentiment = row['key'][2]
            value = row['value']
            lat_long = str(latitude) + ", " + str(longitude)
            location = geolocator.reverse(lat_long)
            place = getPlaceFromCoord(location.raw['address'])
            if (place,sentiment) not in result.keys():
                result[(place,sentiment)] = value
            else:
                result[(place,sentiment)] += value
    print(str(result))
    
    dict_pos = {}
    dict_neg = {}
    dict_net = {}
    for (place, sentiment) in result.keys():
        if int(sentiment) == -1:
            dict_neg[place] = result[(place,sentiment)]
        elif int(sentiment) == 0:
            dict_net[place] = result[(place,sentiment)]
        elif int(sentiment) == 1:
            dict_pos[place] = result[(place,sentiment)]
            
    with open('TwitterSentiment.csv', mode='w', newline='') as sentiment_file:

        sentiment_writer = csv.writer(sentiment_file)
        sentiment_writer.writerow(["City","NEG_Count", "POS_Count", "Neu_Count"])
        pos = None
        neg = None
        net = None
        for place in cities_list:
            if place in dict_pos:
                pos = dict_pos[place]
            else:
                pos = 0
            if place in dict_net:
                net = dict_net[place]
            else:
                net = 0
            if place in dict_neg:
                neg = dict_neg[place]
            else:
                neg = 0
            sentiment_writer.writerow([place,neg,pos,net])
        
        
from tweepy import OAuthHandler
import json
import re
from textblob import TextBlob
from nltk.corpus import wordnet as wn
from tweepy.streaming import StreamListener
from tweepy import Stream
from apscheduler.schedulers.blocking import BlockingScheduler
import csv

import time
import couchdb as cb

tweetsSentiment = {}

cities_list = ["adelaide", "brisbane", "gosford", "gold coast", "city of melbourne","newcastle","perth","canberra","wollongong","sydney","geelong","gold coast", "northern territory", "townsville"]

POS_SENTIMENT = 1
NEG_SENTIMENT = -1

SERVER_1 = "103.6.254.21"
SERVER_2 = "103.6.254.69"
SERVER_3 = "103.6.254.60"
SERVER_4 = "103.6.254.12"

SentimentView_Design = 'location_v1'
Sentiment_View = 'newplace'

db = None
dbUser = None

def Connection():
    server = SERVER_4
    couch = cb.Server("http://admin:admin@103.6.254.21:5984/")
    dbname = "tweets_prod_v3"
    dbUserName = dbname+"_user"
    global db
    global dbUser


    if dbname in couch:
        db = couch[dbname]
    else:
        db = couch.create(dbname)
     
    
  
    getSentimentData2()
   

if __name__ == '__main__':

    Connection();
