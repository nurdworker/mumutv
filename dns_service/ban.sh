#!/bin/bash

domain=$1
domainPath=/var/named/$domain.zone
echo $domainPath

grep=$(cat $domainPath | grep -Eo '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}')

ip=$(echo $grep | cut -d " " -f1)

sed -i "s/$ip/211.183.3.112/g" $domainPath

systemctl restart named
