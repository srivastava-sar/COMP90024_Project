To set up the cluster and install CouchDB, do the following:
1. run: . ./openrc.sh; ansible-playbook --ask-become-pass nectar.yml
2. manually log into the 4 instances using the IP addresses (ubuntu@x.x.x.x) that are the output of the above code.  
3. run: . ./openrc.sh; ansible-playbook --ask-become-pass nectar-2.yml

References: 
Most of the ansible code (used in nectar.yml) has been sourced from the commands that were shown in lecture 5
Code to install for CouchDB (used in the last part of nectar-2.yml) has been sourced from https://github.com/glynnbird/ansible-install-couchdb
