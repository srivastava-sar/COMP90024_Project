import re
import couchdb as cb


SERVER_4 = "103.6.254.21"

couch = cb.Server("http://admin:admin@103.6.254.21:5984/")

#str = "biansiyu @gmail"

#输出couch中的关键词/变量名？
#for d in couch:
#    print(d)
db = couch["tweets_prod"]
count = 0
for id in db:
    tweet = db[id]
    text = tweet['value']['text']
    #print(re.sub(r"(.*)@([\w]+)(.*)", r"\2" ,text))
    username = re.findall("@([\w]+)", text)
    if username != []:
      print(username)
    #print(text)
    #if (count > 5):
    #  break
    #count += 1


#print(re.findall(r"^(.+?)\@", str))
#print(re.findall("^(.+?)\@(.+)", str))
#print(re.sub(r"@([0-9a-zA-Z_]+)",r"\1" ,str))
#print(re.findall("[a-zA-Z0-9]\@([A-Za-z]+[A-Za-z0-9]+)", str)
#print re.findall(r'<([^>]+)', string)
#user = re.findall(r"@[0-9a-zA-Z_]+)", string)
#print(user)
#print re.findall("[ ]@[0-9a-zA-Z_]+",str)

#user=re.findall("[ ]@[0-9a-zA-Z_]+",str) 
#print(user)

