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
done | sed 's/Description of the bottle-1698670792/This product has a much longer description, to check that it is made scrollable and does not break the layout. The quick brown fox oftens runs over the lazy dog, and this helps make the product description much longer than the others, really. But such a long description is not always useful and if you read it up to here you are probably a hero./'
echo "}"