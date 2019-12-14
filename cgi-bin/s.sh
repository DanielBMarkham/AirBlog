cd /var/www/tiny-giant-books.com/public_html/cgi-bin
rm Entries.json ||:
rm Tags.json ||:
rm Categories.json ||:
rm Media.json || :
rm Blogs.json || :
rm Authors.json || :
rm Questions.json || :

BLOGID=recCGKQBlTWHqrGCu
BLOGNAME=tgb ## It keys off of that, not the id
APIKEY=keywgflZqjVbH9LsF
##
## wget 'https://api.airtable.com/v0/appQTNunJetOT3r1B/Entries?maxRecords=99&view=Grid%20view&filterByFormula=AND(IS_AFTER(NOW(),{StartDate}),{Approved})&api_key='"${APIKEY}" -OEntries.json || :
##

wget 'https://api.airtable.com/v0/appQTNunJetOT3r1B/Entries?maxRecords=99&view=PublicBlog&filterByFormula=AND(IS_AFTER(NOW(),{StartDate}),{Approved}, FIND("'"${BLOGNAME}"'",ARRAYJOIN({Blog})))&sortField=ID&sortDirection=desc&api_key='"${APIKEY}" -OEntries.json || :

wget 'https://api.airtable.com/v0/appQTNunJetOT3r1B/Tags?maxRecords=99&view=Grid%20view&filterByFormula=AND(IS_AFTER(NOW(),{StartDate}),{Approved}, FIND("'"${BLOGNAME}"'",ARRAYJOIN({Blog})))&api_key='"${APIKEY}" -OTags.json || :

wget 'https://api.airtable.com/v0/appQTNunJetOT3r1B/Categories?maxRecords=99&view=Grid%20view&filterByFormula=AND(IS_AFTER(NOW(),{StartDate}),{Approved}, FIND("'"${BLOGNAME}"'",ARRAYJOIN({Blog})))&api_key='"${APIKEY}" -OCategories.json || :

wget 'https://api.airtable.com/v0/appQTNunJetOT3r1B/Media?maxRecords=99&view=Grid%20view&filterByFormula=AND(IS_AFTER(NOW(),{StartDate}),{Approved}, FIND("'"${BLOGNAME}"'",ARRAYJOIN({Blog})))&api_key='"${APIKEY}" -OMedia.json || :

wget 'https://api.airtable.com/v0/appQTNunJetOT3r1B/Blogs?maxRecords=99&view=Grid%20view&filterByFormula=AND(IS_AFTER(NOW(),{StartDate}),{Approved})&api_key='"${APIKEY}" -OBlogs.json || :

wget 'https://api.airtable.com/v0/appQTNunJetOT3r1B/Authors?maxRecords=99&view=Grid%20view&filterByFormula=AND(IS_AFTER(NOW(),{StartDate}),{Approved}, FIND("'"${BLOGNAME}"'",ARRAYJOIN({Blog})))&api_key='"${APIKEY}" -OAuthors.json || :

wget 'https://api.airtable.com/v0/appQTNunJetOT3r1B/Questions?maxRecords=99&view=Grid%20view&filterByFormula=AND(IS_AFTER(NOW(),{StartDate}),{Approved}, FIND("'"${BLOGNAME}"'",ARRAYJOIN({Blog})))&api_key='"${APIKEY}" -OQuestions.json || :

cp *.json ../ || :

