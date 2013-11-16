GH_PAGES='gh-pages'

branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
git branch -D $GH_PAGES
git checkout -b $GH_PAGES

npm install
./node_modulse/bower/bin/bower install

git add lib/* -f
git commit -m '+ libs'
git push origin +$GH_PAGES
git checkout $branch
