# COMP90024_Project
#Team 46: (Advait Mangesh Deshpande (1005024), Ansh Juneja (1027339), Saransh Srivastava (1031073), Siyu Biyan (984002), Waqar Ul Islam (1065823));
#Cities Analysed: Adelaide, Brisbane, Canberra, Geelong, Gold Coast, Melbourne, Newcastle, Perth, Sydney, Townsville


 The focus of this assignment is to explore the Seven Deadly Sins (https://en.wikipedia.org/wiki/Seven_deadly_sins) through social media analytics. We extracted physical fitness sentiments from Twitter using text analysis and classified cities in Australia having positive sentiments.

We compared this data with AURIN open source datasets and presented in a react based UI. The video is included in the git repository.

Youtube Link to UI:
https://youtu.be/oAbC0Xkhoyo


For nectar setup, please refer to README.md in nectar folder

To start harvesting tweets from different nectar instances, run the following command after ansible script successful execution:

$ python twitter_harvest_prod.py


Files included:
1. analysis.R : creates charts of the analysis of twitter data
2. data/location/user.json : Map-reduce view files
3. nectar: nectar instances installation and setup folder
4. twitter_analysis.py : extracting twitter analytics
5. twitter_harvestor_prod.py : main harvesting file
6. UI_prod: UI framework
