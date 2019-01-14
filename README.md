# AirBlog

AirBlog is a programming demonstration project that answers the question: what's the least amount of code/infrastructure required to create a pluggable, skinnable, severless, blogging platform?

You can see it running on the [Tiny Giant Books website](http://tiny-giant-books.com), along with a few articles and videos describing how/why it was developed.

## Key Features

- **All serverless**. It uses AirTable for a database, plugging into their rich ecosystem for whatever data-type customizations a future user/dev might want. The Javascript engine will pull data either directly from AirTable (not recommended, and not serverless) or from local json files. A very simple shell script updates the local json files regularly. Copy a few files on a thumbdrive or to a cloudshare? You've got the entire operational blog
- **Lightweight**. The actual data part of the web we use everyday is quite small. Much of what we consume in terms of bandwidth is UI crap. 100 blogging entries might run 30k
- **Data access fully separate from UI**. It's in its own JS class. This means if you don't like my selection of web technologies you can use your own. :)
- **Pluggable/Skinnable using Vue.js**. I made the choice to use Vue.js because I was convinced it had a better system for growing out components. So far I haven't see anything to disprove that notion, but it's still a very young system
- **Web layout using Bootstrap**. Most people should know Bootstrap. It makes for a nice default component system when paired with Vue. If you're careful not to override the classes too much, you should be able to buy various Bootstrap themes and widgets and drop them in directly for extra coolness with very little coding
- **Organization system by question, not entry**. Just to do something new, I decided to set up the database so that entries are grouped by question in addition to author, date, tag, etc. I believe this should allow for greater UI end customization. (For instance, when I add commenting, I'll probably add it to the questions, not the blog entries, but you could do this any way you'd like)

## Still To-Do

- Add in meta/social graph support. I put some fillers in each head to remind me of what's required. Just need to codd it up
- Finish up the RelatedItemsBar component. The tag/question line, under the titles of the entries in most places, is whack. I tried several paradigms: navbar, cloud, bulleted list, inline list. I need to pick the best one and make a reusable component
- (Part of the above) Make a vertically-scaling, auto-layout sub-head, for use at the top of long content. Sometimes I'd like stuff stuck just under the menu bar that stays there no matter how far down I scroll. I have that now, but it's not what I want
- (Maybe) Add something like OQL to the data layer. I'm not sure it's needed, but it's worth considering

## Code Budget

|Item|LOC|
|--------|
|Library JS|400|
|Library CSS|500|
|Components (14)|700|

Looks like for new components there's a minimum of 10 lOC. Based on the components written so far, you should easily be able to add new components for 50-200 LOC -- that's html, js, and css. If not, then the underlying library needs updating.

This follows the [2000-200-20 code budget I'm currently using for my side projects.](http://tiny-giant-books.com/Entry2.html?EntryId=rec39SaDeZCZjauRo). See the blog entry and video for more details.


## Notes

As you can see, most of what's on my to-do list is UI bike-shedding, so this was a good place to stop for a bit. Contact me if you're trying it on your own and would like any help or have feedback! I'd be interested in how it works for you.