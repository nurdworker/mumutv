#!/bin/bash

domain=$1
domainPath="/var/named/${domain}.zone"

# 도메인 정보 있는지 체크

if [ -e "$domainPath" ]; then
    # 아이피 수집
    grep=$(cat $domainPath | grep -Eo '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}')
    ip=$(echo $grep | cut -d " " -f1)
    echo $ip
else
    echo "false"
fi
