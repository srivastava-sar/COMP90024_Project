#Team 46: (Advait Mangesh Deshpande (1005024), Ansh Juneja (1027339), Saransh Srivastava (1031073), Siyu Biyan (984002), Waqar Ul Islam (1065823));
#Cities Analysed: Adelaide, Brisbane, Canberra, Geelong, Gold Coast, Melbourne, Newcastle, Perth, Sydney, Townsville

To set up the cluster and install CouchDB, do the following:
1. run: . ./openrc.sh; ansible-playbook --ask-become-pass nectar.yml
2. manually log into the 4 instances using the IP addresses (ubuntu@xxx.xxx.xxx.xxx) that are the output of the above code.
3. On instance2, copy the directories "public", "src" and the file "package.json" to /home/ubuntu, from the git repository "https://github.com/srivastava-sar/COMP90024_Project/UI_prod"
4. run: . ./openrc.sh; ansible-playbook --ask-become-pass nectar-2.yml

References: 
1. Most of the ansible code (used in nectar.yml) has been sourced from the commands that were shown in lecture 5
2. Code to install and configure for CouchDB (used in the last part of nectar-2.yml) has been sourced from https://github.com/glynnbird/ansible-install-couchdb and https://github.com/kafecho/ansible-couchdb2
