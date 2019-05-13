import tweepy as tw
from tweepy import OAuthHandler
import couchdb as cb
import re
import json
import time
import socket

from textblob import TextBlob
from nltk.corpus import wordnet as wn
from tweepy.streaming import StreamListener
from tweepy import Stream
from apscheduler.schedulers.blocking import BlockingScheduler
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut


API_KEY = "API-KEY"
API_SECRET_KEY = "SECRET"
ACCESS_TOKEN = "TOKEN"
ACCESS_TOKEN_SECRET = "SECRET"

SEARCH_TOPIC = ["gym","workout","cycling","yoga", "fitness"]
POS_SENTIMENT = 1
NEG_SENTIMENT = -1

SERVER_1 = "103.6.254.21"
SERVER_2 = "103.6.254.69"
SERVER_3 = "103.6.254.60"
SERVER_4 = "103.6.254.12"

UserDb_Design = 'userId'
UserDb_View = 'userId-view'

db = None
dbUser = None

AUS_LAT_MIN = -43.7405
AUS_LON_MIN = 96.8168
AUS_LAT_MAX = -9.142
AUS_LON_MAX =159.1092

class StdOutListener(StreamListener):
    def on_data(self, data):
        data = json.loads(data)
        putJsonInDb(data)
        return True

    def on_error(self, status):
        print("Streaming error status : " + status)
        
def getServer():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    server = s.getsockname()[0]
    s.close()
    return server

def storeInUserDb(document):
    userDoc = {"type": "User_data", "username": {}, "status" : {}}
    userDoc['username'] = document['value']['username']
    userDoc['status'] = 0
    id = str(document['value']['userId'])
    if id not in dbUser:
        dbUser[id] = userDoc

def storeInDb(dbase, idDoc, docu):
    if idDoc not in dbase:
        if docu['value']['place'] is not None:
            geolocator = Nominatim(user_agent="Twitter",timeout=3)
            try:
                location = geolocator.geocode(docu['value']['place'])
                if location:
                    docu['value']['longitude'] = location.longitude
                    docu['value']['latitude'] = location.latitude
            except GeocoderTimedOut as e:
                print("Error: geocode failed with message " + str(e))
        if isValidLoc(docu['value']['longitude'],docu['value']['latitude']):
            storeInUserDb(docu)
            dbase[idDoc] = docu
            return True
    return False
        
def isValidLoc(longitude,latitude):
    if not longitude:
        return False
    if not latitude:
        return False
    if latitude >= AUS_LAT_MIN and latitude <= AUS_LAT_MAX and longitude >= AUS_LON_MIN and longitude <= AUS_LON_MAX :
        return True
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


def getSentiment(text):
    testimonial = TextBlob(removeSChar(text))
    sentiment = testimonial.sentiment.polarity
    if sentiment > 0:
        return POS_SENTIMENT
    elif sentiment < 0:
        return NEG_SENTIMENT
    return 0

def removeSChar(str_text):
    str_text = re.sub(r"(?:\@|https?\://)\S+", "", str_text)
    str_text = re.sub('[^A-Za-z0-9]+', ' ', str_text)
    return str_text.lower()


def isEligible(texts):
    texts = removeSChar(texts)
    searchKey = getSynonyms(SEARCH_TOPIC)
    for word in texts.split(' '):
        if word in searchKey.split():
            return True
    return False

def getPlace(data):
    result = None
    if data['place']:
        result = data['place']['name']
    elif data['user']['location']:
        result = data['user']['location']
    return result

def putJsonInDb(jdata):
    demoDoc = {"type": "twitter_data", "value": {}}
    userMDoc = {"type": "userMention_data", "value": {}}
    if "_rev" in demoDoc: del demoDoc["_rev"]
    idDoc = str(jdata['id'])
    demoDoc['value']['username'] = jdata['user']['name']
    demoDoc['value']['userId'] = jdata['user']['id']
    demoDoc['value']['created_at'] = jdata['created_at']
    demoDoc['value']['placeRaw'] = jdata['place']
    demoDoc['value']['geoRaw'] = jdata['geo']
    demoDoc['value']['coordinatesRaw'] = jdata['coordinates']
    demoDoc['value']['place'] = getPlace(jdata)
    demoDoc['value']['longitude'] = None
    demoDoc['value']['latitude']  = None

    if 'text' in jdata:
        demoDoc['value']['text'] = jdata['text']
    elif 'full_text' in jdata:
        demoDoc['value']['text'] = jdata['full_text']
    else:
        raise
    demoDoc['value']['sentiment'] = str(getSentiment(demoDoc['value']['text']))

    if isEligible(demoDoc['value']['text']):
        # all user mentions in the eligible tweet should go in UserDb
        if jdata['entities']:
            if jdata['entities']['user_mentions']:
                for userT in jdata['entities']['user_mentions']:
                    userMDoc['value']['username'] = userT['name']
                    userMDoc['value']['userId'] = userT['id']
                    storeInUserDb(userMDoc)
        return storeInDb(db,idDoc, demoDoc)
    return False


def harvestTwBySearch(api,SEARCH_TOPIC):
    SEARCH_QUERY_STRING = "place:3f14ce28dc7c4566 "+ getSynonyms(SEARCH_TOPIC) + " -filter:retweets"
    print("Search for str = " + str(SEARCH_QUERY_STRING))
    maxTweets = 2000
    count = 0
    for tweet in tw.Cursor(api.search, q=SEARCH_QUERY_STRING,tweet_mode='extended').items(maxTweets):
        if putJsonInDb(tweet._json):
            count +=1
    print("Done: Tweets added: " + str(count))

def harvestTwByStream(auth):
    l = StdOutListener()
    stream = Stream(auth, l)
    try:
        stream.filter(locations=[AUS_LON_MIN,AUS_LAT_MIN,AUS_LON_MAX,AUS_LAT_MAX], is_async=True) #entire australia and tasmania from AURIN
        time.sleep(500)
    except tw.RateLimitError:
        print("Error while streaming")
    finally:
        stream.disconnect()
    
def harvestTwByUser(api):
    for row in dbUser.view(UserDb_Design+'/'+UserDb_View):
        count2 = 0
        userDoc = dbUser[row['id']]
        if userDoc['status'] == 0:
            userDoc['status'] = 1
            dbUser.save(userDoc)
            try:
                for tweet in tw.Cursor(api.user_timeline,id=row['id']).items(): 
                    if putJsonInDb(tweet._json):
                        count2 +=1    
            except tw.RateLimitError:
                print("Twitter exception")
                time.sleep(300)
            except tw.TweepError as e:
                print("Exception occured : " + e)
            

def harvestor():
    server = getServer()
    couch = cb.Server("http://admin:admin@localhost:5984/")
    dbname = "tweets_prod"
    dbUserName = dbname+"_user"
    global db
    global dbUser

    if dbUserName in couch:
        dbUser = couch[dbUserName]
    else:
        dbUser = couch.create(dbUserName)

    if dbname in couch:
        db = couch[dbname]
    else:
        db = couch.create(dbname)

    auth = OAuthHandler(API_KEY, API_SECRET_KEY)
    auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
    api = tw.API(auth)
    if server == SERVER_1:
        harvestTwBySearch(api,SEARCH_TOPIC)
    elif server == SERVER_3:
        harvestTwByStream(auth)
    elif server == SERVER_4:
        harvestTwByUser(api)


if __name__ == '__main__':
    harvestor()
    scheduler = BlockingScheduler()
    scheduler.add_job(harvestor, 'interval', minutes=10)
    
    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        pass

