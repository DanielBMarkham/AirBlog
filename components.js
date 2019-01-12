var AirBlogBase = Vue.extend({
  methods: {
    LookupRelatedItems(ent, lookupFieldName) {
      return document.AirBlog.RelatedItems(ent, lookupFieldName);
      },
    adjustBrokenImageLinks(src) {
      // "fix" broken links by seeing if they're media tags
      var myImg = $(src.target)[0];
      var oldImgSrcLastSlash = myImg.src.lastIndexOf("/");
      var oldImgSrc = myImg.src.substring(oldImgSrcLastSlash + 1);
      var possibleMatchingMediaItems = document.AirBlog.findMediaItemForAName(
        document.AirBlog.atMedia.records,
        oldImgSrc
      );
      if (possibleMatchingMediaItems.length!=0) {
        var firstMatchingMediaItemFirstAttatchmentLink =
        possibleMatchingMediaItems[0].fields.Attachments[0];
        myImg.src = firstMatchingMediaItemFirstAttatchmentLink.url;
        myImg.setAttribute(
          "class",
          possibleMatchingMediaItems[0].fields.Styles + " "
      );
      } else {}
      $(this).off("error"); // always turn img loading error off after first capture!
    },
    questionItemToLink(item) {
      return (myMediaItems = AirBlog.filterMediaItemListToThoseThatContainThisEntry(
        atMedia,
        myEntry
      ));
    },
    myMediaItems() {
      return (myMediaItems = AirBlog.filterMediaItemListToThoseThatContainThisEntry(
        atMedia,
        myEntry
      ));
    },
    MarkdownContentToHtml(stuff) {
      if (stuff != undefined) {
        var ret = this.$md.render(stuff);
        return ret;
      } else {
        return "";
      }
    },
    MarkdownContentToHtmlRemoveLinks(stuff) {
      const regex = /\[(.*?)\]\((.+?)\)/gm;
      var stuffNoLinks = stuff.replace(regex, "$1");
      var ret = this.$md.render(stuffNoLinks);
      return ret;
    },
    MakeEntityIntoALink(entity, itemType) {
      return document.AirBlog.CreateItemLink(entity, itemType);
    },
    FieldListIntoListOfLinksToTemplates(rec, fieldName, itemType, classesForListWrapper, classesForListItem, classesForAnchorItem) {
      if (rec!=undefined && rec.fields!=undefined && rec.fields[fieldName]!=undefined && rec.fields[fieldName].records!=undefined) {
        var listBegin = "<ul class='"+classesForListWrapper+"'>";
        var listEnd = "</ul>";
        var listItemBegin = "<li class='"+classesForListItem+"'>";
        var listItemEnd = "</li>";
        var selectedItems=document.AirBlog.RelatedItems(rec, fieldName);
        var relatedLinks = selectedItems
          .map(function(elem) {
            var templateLink = document.AirBlog.CreateItemLink(elem, itemType) ;
            return (
              listItemBegin +
              "<a class='"+classesForAnchorItem+"' href ='" +
              templateLink +
              "'> &nbsp;" +
              elem.fields.Name +
              "</a>" +
              listItemEnd
            );
          })
          .join(" \n        ");
        if (0 == relatedLinks.length) {
          return "";
        } else {
          return listBegin + relatedLinks + listEnd;
        }
      }
    }
  },
  filters: {
    //AirTable won't return a field at all if its empty, but Vue wants something
    //even if it's an empty string.
    //So we'll provide a place to get the fields that Vue has to have to work
    EntityId(entity) {
      if(entity!=undefined && entity.id!=undefined){
        return entity.id;
      } else {return "";}
    },
    TemplateFile(entity) {
      return document.AirBlog.EntityFieldOrEmptyString(entity, "TemplateFile");
    },
    PublicDescriptionShort(entity) {
      return document.AirBlog.EntityFieldOrEmptyString(entity, "PublicDescriptionShort");
    },
    PublicDescriptionLong(entity) {
      return document.AirBlog.EntityFieldOrEmptyString(entity, "PublicDescriptionLong");
    },
    RelatedCollectionToSpacedString(entity, fieldName) {
      return document.AirBlog.FieldNameIdArrayToDelimitedString(entity, fieldName, " ");
    },
    LookupItemsAndFieldsAndSeparateBySpace(entity, fieldName, targetFieldName) {
      return document.AirBlog.RelatedItemsByTheirFieldNameDelimited(entity, fieldName, targetFieldName, ' ', ' ');
    },
    DatePretty(value) {
      var dVal = moment(value);
      return dVal.format("YYYY/MM/DD");
    },
    AuthorIdToAuthorName(value) {
      var selectedAuthors = document.AirBlog.LookupAuthors(value);
      var authorNames = selectedAuthors
        .map(function(elem) {
          return elem.fields.Name;
        })
        .join(", ");
      return authorNames;
    },
    MakeTemplateLink(rec, itemType) {
      return rec.fields.TemplateFile + "?" + itemType + "Id=" + rec.id;
    }
  },
  computed: {
    contentToHTML(rec) {
      var ret = this.$md.render(document.AirBlog.atMyEntry.fields.Content);
      return ret;
    }
  },
  mounted: 
    function(){
    $('meta[name=description]').remove();
    $('head').append( '<meta name="description" content=\"' + document.AirBlog.atMyEntry.fields.Excerpt + '\">' );
    $('meta[name=author]').remove();
    $('head').append( '<meta name="author" content=\"' + document.AirBlog.atMyEntry.fields.Author + '\">' );
    $('title').remove();
    $('head').append( '<title>' + document.AirBlog.atMyEntry.fields.Title + '</title>' );
    this.$nextTick(function() {
      var vm=this; // two scopes here, the vue inst and the window calling the error
      $("img").on( "error", (function(event){vm.adjustBrokenImageLinks(event);}) );
      });
  }
});

var EntryListComponent = {
  template: `
  <div class="ComponentListWrapper">
    <main role="main" class="">
      <div class="articleList">
        <div class="card articleItemOuter" v-for="rec in entries">
          <div class="card-body articleItemInner"
            v-bind:n23Categories='rec | RelatedCollectionToSpacedString("Categories")'
            v-bind:n23Questions='rec | RelatedCollectionToSpacedString("Questions")'
            v-bind:n23Tags='rec | RelatedCollectionToSpacedString("Tags")'
            v-bind:n23Authors='rec | RelatedCollectionToSpacedString("Authors")'
            >
            <h5 class="card-title">
              <a href="#" class="btn btn-sm btn-danger card-filingButton btn-votedown">Down</a>
              {{ rec.fields.Title }}
                <a href="#" class="btn btn-sm btn-success card-filingButton btn-voteup">Up</a>
            </h5>
            <div v-html='FieldListIntoListOfLinksToTemplates(rec, "Questions", "Question", "EntryListQuestions", "", "btn btn-sm btn-info")'></div>
            <ul class='tagCloud'>
              <li v-for="tag in LookupRelatedItems(rec, 'Tags')"><a v-bind:href="MakeEntityIntoALink(tag,'Tag')" v-html="tag.fields.Name"></a></li>
            </ul>
            <p class="card-text text-muted">{{ rec.fields.Excerpt }}</p>
            <div class="entryListBottomLinkRow">
              <div class="entryListBottomLinkBox">
                <a class="card-other-link btn btn-sm btn-warning card-bottomLeftLink" v-bind:href="rec.fields.ReferenceLink" title="Visit original site">
                <i class="fa fa-trophy pull-left"></i>
                Orig</a>
              </div>
              <div class="entryListBottomLinkBox">
                <a href="#" class="btn btn-sm btn-warning card-filingButton card-bottomComLink"  v-bind:href="rec | MakeTemplateLink('Entry')" title="Read and comment">
                <i class="fa fa-bullhorn pull-left"></i>
                Com</a>
              </div>
              <div class="entryListBottomLinkBox">
                <a href="#" class="btn btn-sm btn-warning card-filingButton card-bottomSaveLink" title="Save for later">
                <i class="fa fa-bookmark pull-left"></i>
                Save</a>
              </div>
              <div class="entryListBottomLinkBox">
                <a class="card-source-link btn btn-sm btn-warning card-bottomRightLink"  data-toggle="modal" data-target="#modalArticle"  v-bind:href="rec.id" title="Quickly scan text-only version">
                <i class="fa fa-fighter-jet pull-left"></i>
                Sum</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  `,
  props: ["entries"],
  mixins: [AirBlogBase],
  mounted:
    function() {
      $(".nav-setFilter").on("click", function() {
        // figure out what we're filtering and close the menu
        var id = $(this)[0].getAttribute("n23id");
        var attToFilter = $(this)[0].getAttribute("n23AttToFilter");
        $(".articleItemInner")
          .parent()
          .hide();
        var sel = ".articleItemInner[" + attToFilter + "~='" + id + "']";
        $(sel)
          .parent()
          .show();
        $(".navbar-toggler").collapse("hide");
        $(".navbar-collapse").collapse("hide");
      });

      },

  methods: {
    GetTagLinkById(tagId) {
      var tag = document.AirBlog.SelectTagById(tagId);
      var ret = document.AirBlog.CreateItemLink(tag, "Tag");
      return ret;
    },
    GetTagNameById(tagId) {
      var tag = document.AirBlog.SelectTagById(tagId);
      var ret = tag.fields.Name;
      return ret;
    }
  }
};

var EntryListPlainComponent = {
  template : `
  <div id="tgbArticleListOuter">
    <ul>
      <li v-for="entry in entries" v-cloak>
        <a v-bind:name="entry.id"></a>
        <h2>
          <a v-bind:tite="entry | PublicDescriptionShort" v-bind:href="MakeEntityIntoALink(entry,'Entity')">
          {{entry.fields.Title}}
        </a>
        </h2>
        <p class="text-muted">
          {{entry.fields.Excerpt}}
        </p>
        <p class="text-muted byline">
            By
              <span v-for="author in LookupRelatedItems(entry, 'Authors')">
                {{author.fields.Name}} &nbsp;
              </span>
            on
              <span>
                {{entry.createdTime | DatePretty}}
              </span>
          </p>
          <p>{{entry | LookupItemsAndFieldsAndSeparateBySpace('Tags', 'Name')}}</p>
      </li>
    </ul>
  </div>


  `,
  props: ["entries"],
  mixins: [AirBlogBase],

}

var EntryDetailbriefComponent = {
  template: `
        
  <div>
    <div id="entryContentBrief" v-html="MarkdownContentToHtmlRemoveLinks(entry.fields.Content)">
    </div> 
  </div>

  `,
  props: ["entry"],
  mixins: [AirBlogBase],
  mounted: function() {}
};

var EntryDetailfullComponent = {
  template: `
  <div class="ComponentListWrapper">
    <main role="main" class="">
    <h1>{{entry.fields.Title}}</h1>
    <p class="text-muted byline">
      By 
        <span v-for="author in LookupRelatedItems(entry, 'Authors')">
          {{author.fields.Name}} &nbsp;
        </span>
      on 
        <span>
          {{entry.createdTime | DatePretty}}
        </span>
    </p>
    <ul class='tagCloud'>
      <li v-for="tag in LookupRelatedItems(entry, 'Tags')"><a v-bind:href="MakeEntityIntoALink(tag, 'Tag')" v-html="tag.fields.Name"></a></li>
    </ul>
    <div id="entryContent" v-html="MarkdownContentToHtml(entry.fields.Content)"></div>
    </main>
  </div> 

  `,
  props: ["entry"],
  mixins: [AirBlogBase],
  methods: {
  },
  mounted: function() {
    $("#entryContent")
      .children()
      .last()
      .addClass("lastContentParagraph");
  }
};

var TagDetailComponent = {
  template: `
  <div class="ComponentListWrapper">
    <main role="main" class="">
    <h3>{{tag.fields.Name}}</h3>
    <ul>
      <li v-for="entry in LookupRelatedItems(tag, 'Entries')">
        <a class="simpleEntryListItem" v-bind:href="entry | MakeTemplateLink('Entry')">
          <span>{{entry.fields.Title}}</span>
          <span>{{entry.fields.Excerpt}}</span class="text-muted">
        </a>
      </li>
    </ul>
    </main>
  </div>
  `,
  props: ["tag"],
  mixins: [AirBlogBase],
  methods: {
  }
};

var QuestionDetailComponent = {
  template: `
  <div class="ComponentListWrapper">
    <main role="main" class="">
    <h1>{{question.fields.Name}}</h1>
    <div style="margin-top: 4rem;" v-html="GetFormattedLongDescription(question)"></div>
    <h2>Related Articles</h2>
    <ul>
      <li v-for="question in LookupRelatedItems(question, 'Questions')">
        <a class="simpleEntryListItem" v-bind:href="question | MakeTemplateLink('Entry')">
          <span>{{question.fields.Title}}</span>
          <span>{{question.fields.Excerpt}}</span class="text-muted">
        </a>
      </li>
    </ul>
    <h2>Member Commentary</h2>
    <p></p>
    <h2>Related Questions</h2>
    <p></p>
    </main>
  </div>
  `,
  props: ["question"],
  mixins: [AirBlogBase],
  methods: {
    GetFormattedLongDescription(question) {
      return this.MarkdownContentToHtml(question.fields.PublicDescriptionLong);
    }
  }
};

var EntryExploreFooter ={
  template: `
  <footer class="footer">
  <nav class="navbar navbar-expand-md navbar-dark fixed-bottom bg-dark">
    <div class="container">
      <a class="nav navbar-left bg-dark text-light dropup-toggle" type="button" data-toggle="collapse" data-target="#togglerExplore" aria-controls="togglerExplore" aria-expanded="false" aria-label="Explore">
        <span>Explore</span>
      </a>

      <div class="nav navbar-dark bg-dark collapse" id="togglerExplore">
        <ul class="dropup nav bg-dark">
          <li v-for="question in LookupRelatedItems(entry,'Questions')" class="dropup-item">
            <a class="nav-link dropup-item bg-dark" v-bind:title="question.fields.PublicDescriptionShort" v-bind:href="MakeEntityIntoALink(question,'Question')">{{ question.fields.Name }}</a>
          </li>
          <li v-for="tag in LookupRelatedItems(entry,'Tags')" class="dropup-item">
            <a class="nav-link dropup-item bg-dark" v-bind:title="tag.fields.PublicDescriptionShort" v-bind:href="MakeEntityIntoALink(tag,'Tag')">{{ tag.fields.Name }}</a>
          </li>
        </ul>
      </div>

      <a class="nav navbar-brand navbar-right bg-dark navbar-dark" >&copy; 2019</a>
    </div>
  </nav>
</footer>
`,
props: ["entry"],
mixins: [AirBlogBase]
}

var PlainFooter = {
  template: `
  <nav class="navbar navbar-expand-md navbar-dark fixed-bottom bg-dark">
    <a class="nav navbar-brand navbar-left navbar-dark bg-dark">&copy; 2019</a>
    <a
      class="nav navbar-brand navbar-right navbar-dark bg-dark"
      href="index.html"
      v-cloak
      >{{ blog.fields.Subtitle }}</a
    >
</nav>

  `,
  props: ["blog"],
  mixins: [AirBlogBase]
}

var NavMenuSubList = {
  template: `
  <div class="bg-dark navbar-dark">
    <a class="nav-item navbar-toggler bg-dark navbar-dark"
    data-toggle="collapse"
    v-bind:data-target="'#togglerMenu'+tablename"
    v-bind:aria-controls="'togglerMain'+tablename"
    aria-expanded="false"
    v-bind:aria-label="tablename+' Nav'">
      {{entityname}}
    </a>
    <div class="dropdown-menu bg-dark navbar-dark"
    v-bind:aria-labelledby="tablename+'DropDown'"
    v-bind:id="'togglerMenu'+tablename">
        <a class="dropdown-item nav-link  bg-dark navbar-dark"
        v-for="rec in itemlist"
        v-bind:atEntityName="entityname"
        v-bind:atTableName="tablename"
        v-bind:atEntityId="rec.id"
        v-bind:href="MakeEntityIntoALink(rec,entityname)">{{ rec.fields.Name }}</a>
    </div>
  </div>
  `,
  props: ["itemlist", "entityname","tablename"],
  mixins: [AirBlogBase]
}

var ModalAboutTheBlog = {
  template: `

  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalAboutTitle">
          {{ atmyblog.fields.Title }}
        </h5>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" v-html="blogDescriptionToHTML"></div>
      <div class="modal-footer">
        <a class="btn btn-success" :href="'mailto:'+atmyblog.fields.ContactEmail">
          <i class="fa fa-comment pull-left"></i> Contact Site Owner</a
        >
        <button
          type="button"
          class="btn btn-secondary"
          data-dismiss="modal"
        >
          Close
        </button>
      </div>
    </div>
  </div>

  `,
  props: ["atmyblog"],
  mixins: [AirBlogBase],
  computed: {
    blogDescriptionToHTML(e) {
      var ret = this.$md.render(
        document.AirBlog.atMyBlog.fields.LongFormDescription
      );
      return ret;
    }
  }
}
export {
  AirBlogBase,
  EntryListComponent,
  EntryDetailbriefComponent,
  EntryDetailfullComponent,
  TagDetailComponent,
  QuestionDetailComponent,
  EntryListPlainComponent,
  EntryExploreFooter,
  PlainFooter,
  NavMenuSubList,
  ModalAboutTheBlog
};
