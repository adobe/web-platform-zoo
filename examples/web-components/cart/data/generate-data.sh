echo "{"
first=1
ls ../images/*.jpg | while read f
do
  if [[ $first -ne 1 ]]
  then
    echo ","
  fi
  first=0
  filename=$(basename $f)
  id=$(echo $filename | sed 's/.jpg//')
  cat=$(echo $id | sed 's/-.*//')
  echo "\"$id\":{"
  echo "\"name\":\"$id\","
  echo "\"category\":\"$cat\","
  echo "\"description\":\"Description of the $id\","
  echo "\"image\":\"$filename\","
  echo "\"price\":\"$(($RANDOM % 23))\""
  echo "}"
done
echo "}"