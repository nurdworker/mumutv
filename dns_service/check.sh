#!/bin/bash

file_path="/etc/named.conf"
search_string=$1

if grep -q "$search_string" "$file_path"; then
    echo "cannot"
else
    echo "canbuy"
fi
