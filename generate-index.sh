#!/bin/bash
# generate the index of examples
function addPath() {
  echo "{"
  echo "\"path\":\"$(dirname $1)/\","
  echo "\"data\": $(cat $1)"
  echo "},"
}

echo "{"
echo "\"WARNING\":\"auto-generated, do not edit!\","
echo "\"examples\": ["
find . -name info.json | sort | while read addPath
do
  addPath $addPath
done  
echo "{}]}"