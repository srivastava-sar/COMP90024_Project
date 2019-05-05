# code contributor Advait Deshpande
import tweepy as tw
from tweepy import OAuthHandler
import json
import re
from textblob import TextBlob
from nltk.corpus import wordnet as wn

from tweepy.streaming import StreamListener
from tweepy import Stream


import time
import couchdb as cb

API_KEY = "e0FF02OSMnexeYt9VlDg"
API_SECRET_KEY = "DPHdMiCwV8KSW6DGVawxRfdCYBY9DP3Av8wjXPz1aU"
ACCESS_TOKEN = "41409872-7IOHMy8v1sNpaZ5GCdcWksVOEyB6KYWCnmybx9Qam"
ACCESS_TOKEN_SECRET = "DkpKAFH297M6DqMK1q66Ckg7QPsMDzjddhdYQon1w"

SEARCH_TOPIC = ["gym","workout","cycling","yoga", "fitness"]
POS_SENTIMENT = 1
NEG_SENTIMENT = -1
SERVER_1 = "localhost"
SERVER_2 = "localhost"
SERVER_3 = "localhost"
SERVER_4 = "localhost"

SERVER_1 = "103.6.254.12"
#SERVER_2 = "103.6.254.60"
SERVER_3 = "103.6.254.69"
SERVER_4 = "103.6.254.21"

# APP_KEY = "67ce4LIyBK4hQJH2VzZWhXsFH"
# API_SECRET_KEY = "K7bhIwTC6KPzuVjFMsaEADR3fvvOHZt2oEVOm1yqYnte0D0Rxj"
# ACCESS_TOKEN = "953283920-mF2CellfZk1EVHDNCY2nerzPuu4r06JZvtlykJiP"
# ACCESS_TOKEN_SECRET = "IK2h568xo57yrpWVZidKc7vZayW544JAGGVuv8bSCSYiQ"

class StdOutListener(StreamListener):
    def on_data(self, data):
        data = json.loads(data)
        putJsonInDb(data)
        return True

    def on_error(self, status):
        print(status)


def getSentiment(text):
    testimonial = TextBlob(removeSChar(text))
    sentiment = testimonial.sentiment.polarity
    if sentiment > 0:
        return POS_SENTIMENT
    elif sentiment < 0:
        return NEG_SENTIMENT
    return 0

def storeInUserDb(document):
    userDoc = {"type": "User_data", "username": {}, "status" : {}}
    userDoc['username'] = document['value']['username']
    userDoc['status'] = 0
    id = str(document['value']['userId'])
    if id not in dbUser:
        dbUser[id] = userDoc
    
    
    

def storeInDb(dbase, idDoc, docu):
    if idDoc not in dbase:
        storeInUserDb(docu)
        dbase[idDoc] = docu
        print("Tweet from = " + docu['value']['username'] + " at " + docu['value']['created_at'] + " has sentiment= "+ docu['value']['sentiment'])
        return True
    return False
        

def removeSChar(str_text):
    str_text = re.sub(r"(?:\@|https?\://)\S+", "", str_text)
    str_text = re.sub('[^A-Za-z0-9]+', ' ', str_text)
    return str_text.lower()


def isEligible(texts):
    texts = removeSChar(texts)
    searchKey = getSynonyms(SEARCH_TOPIC)
    for word in texts.split(' '):
        #TODO ===
        if word in searchKey.split():
            return True
    return False


def putJsonInDb(jdata):
    demoDoc = {"type": "twitter_data", "value": {}}
    if "_rev" in demoDoc: del demoDoc["_rev"]
    idDoc = str(jdata['id'])
    demoDoc['value']['username'] = jdata['user']['name']
    demoDoc['value']['userId'] = jdata['user']['id']
    demoDoc['value']['created_at'] = jdata['created_at']
    #demoDoc['value']['timestamp_ms'] = jdata['timestamp_ms']
    demoDoc['value']['location'] = jdata['user']['location']
    demoDoc['value']['coordinates'] = jdata['coordinates']
    if 'text' in jdata:
        demoDoc['value']['text'] = jdata['text']
    elif 'full_text' in jdata:
        demoDoc['value']['text'] = jdata['full_text']
    else:
        raise   
    demoDoc['value']['sentiment'] = str(getSentiment(demoDoc['value']['text']))

    if isEligible(demoDoc['value']['text']):
        return storeInDb(db, idDoc, demoDoc)
    return False


def getSynonyms(topics):
    result = ''
    for topic in topics:
        str_name = []
        str_name.append(topic.lower())
        listOfSynsets = wn.synsets(topic,"n")
        for syn in listOfSynsets:
            lemma_name = [str(lemma.name()) for lemma in syn.lemmas()]
            for lemma in lemma_name:
                str_name.append(lemma)
        for name in set(str_name):
            result += name + " OR " 
            
    return result[:-3]



def harvestTwBySearch(db,api,SEARCH_TOPIC):
    SEARCH_QUERY_STRING = "place:3f14ce28dc7c4566 "+ getSynonyms(SEARCH_TOPIC) + " -filter:retweets"
    #SEARCH_QUERY_STRING = "place:3f14ce28dc7c4566 gym OR exercise OR exercising OR physical_exercise OR physical_exertion OR workout OR training OR run OR foot_race OR running OR running_play OR running_game OR fit OR yoga -filter:retweets"
    print("Search for str = " + str(SEARCH_QUERY_STRING))
    maxTweets = 10
    count = 0

    for tweet in tw.Cursor(api.search, q=SEARCH_QUERY_STRING,tweet_mode='extended').items(maxTweets):
        if putJsonInDb(tweet._json):
            count +=1
    print("Done: Twitts added: " + str(count))

def harvestTwByStream():
    l = StdOutListener()
    stream = Stream(auth, l)
    #stream.filter(locations=[144.9623,-37.8124,144.9645,-37.7438]) #only melbourne
    stream.filter(locations=[96.8168,-43.7405,159.1092,-9.142]) #entire australia and tasmania from AURIN
    
def harvestTwByUser():
    #http://localhost:5984/_utils/#/database/tweets_v2/_design/view_userId/_view/new-view
    #http://localhost:5984/_utils/#database/tweets_v4_user/_design/userid/_view/userid-view

    for row in dbUser.view('userid/userid-view'):
        count2 = 0
        userDoc = dbUser[row['id']]
        if userDoc['status'] == 0:
            userDoc['status'] = 1
            dbUser.save(userDoc)

            for tweet in tw.Cursor(api.user_timeline,id=row['id']).items(): 
                if putJsonInDb(tweet._json):
                    count2 +=1    
            print(userDoc['username'] + " -> " + str(count2))


if __name__ == '__main__':
    server = SERVER_2
    couch = cb.Server("http://admin:admin@"+server+":5984/")
    dbname = "tweets_v5"
    dbUser = dbname+"_user"

    if dbUser in couch:
        dbUser = couch[dbUser]
    else:
        dbUser = couch.create(dbUser)

    if dbname in couch:
        db = couch[dbname]
    else:
        db = couch.create(dbname)    
        
    auth = OAuthHandler(API_KEY, API_SECRET_KEY)
    auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
    api = tw.API(auth)
    if server == SERVER_1:
        harvestTwBySearch(db,api,SEARCH_TOPIC)
    elif server == SERVER_2:
        harvestTwByStream()
    elif server == SERVER_3:
        harvestTwByUser()

    

