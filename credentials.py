import tweepy as tw
import json

import couchdb as cb

couch = cb.Server("http://admin:admin@localhost:5984/")
dbname = "tweets"
if dbname in couch:
    db = couch[dbname]
else:
    db = couch.create(dbname)

demoDoc = {"type": "data", "created_by": "advait", "value": {}}
APP_KEY = "67ce4LIyBK4hQJH2VzZWhXsFH"
APP_SECRET = "K7bhIwTC6KPzuVjFMsaEADR3fvvOHZt2oEVOm1yqYnte0D0Rxj"
# ACCESS_TOKEN = '953283920-mF2CellfZk1EVHDNCY2nerzPuu4r06JZvtlykJiP'
# ACCESS_TOKEN_SECRET = 'IK2h568xo57yrpWVZidKc7vZayW544JAGGVuv8bSCSYiQ'
SEARCH_QUERY_STRING = "wrath OR anger OR angry OR disgust"
auth = tw.OAuthHandler(APP_KEY, APP_SECRET)
data = {}
api = tw.API(auth)
since_date = "2015-01-01"
data = api.search(q=SEARCH_QUERY_STRING, since_id=since_date, lang="en",geocode="-37.752979,144.947137,10000km",tweet_mode='extended',count=100)
# print(data)
for i in data:
    # print("\n",i.retweet_count,"\n")
    if "_id" in demoDoc: del demoDoc["_id"]
    demoDoc["value"]["username"] = i.user.name
    demoDoc["value"]["retweet_count"] = i.retweet_count
    demoDoc["value"]["text"] = i.full_text
    db.save(demoDoc)
# for item in tw.Cursor(
#     api.search, q=SEARCH_QUERY_STRING, since_id=since_date, lang="en",geocode="37.8136,144.9631,1000km",tweet_mode='extended'
# ).items(100):
#     # data["username"] = item.user.name
#       print(item.created_at)
# #     print(item.text)
#     #   if "_id" in demoDoc:
#     #     del demoDoc["_id"]
#       demoDoc["username"] = item.user.name
#       demoDoc["_id"] = ''
    
# #     # demoDoc["username"] = item.user.name


print(json.dumps(demoDoc))
# # print ("Saved: ", data)
