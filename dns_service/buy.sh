#!/bin/bash
domain="$1"
ip="$2"
named_file_path="/etc/named.conf"
zonePath=/var/named/$domain.zone
zonedomain=$domain.zone

count_row=$(($(cat "$named_file_path" | wc -l) - 2))

echo $count_row

if [ -z "$domain" ] || [ -z "$ip" ]; then
    echo "도메인을 제대로 입력하세요. 사용법: $0 <도메인>"
    exit 1
fi

result=$(./check.sh $domain)/
echo $result

if [ "$result" == "canbuy/" ]; then
    echo "Start to sell $domain to cutomer $ip"

    # /etc/named.conf 수정
    new_content="zone \"$domain\" IN {type master;file \"$zonedomain\";allow-update { none; };};"

    sed -i "${count_row}i\\${new_content}" "$named_file_path"

    # zone 파일 생성
    cp /var/named/default.zone /var/named/${1}.zone
    grep=$(cat $zonePath | grep -Eo '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}')

    fake_ip=$(echo $grep | cut -d " " -f1)

    sed -i "s/$fake_ip/$ip/g" $zonePath

    # 네임서버 재시작
    systemctl restart named

elif [ "$result" == "cannot/" ]; then
    echo "Customer $ip can not buy www.$domain"
else
    echo "Unknown result"
fi
