var AirBlogBase = Vue.extend({
      methods : {
        adjustBrokenImageLinks(src) {
          // "fix" broken links by seeing if they're media tags
          var myImg=$(src.target)[0];
          var oldImgSrcLastSlash=myImg.src.lastIndexOf("/");
          var oldImgSrc=myImg.src.substring(oldImgSrcLastSlash+1);
          var possibleMatchingMediaItems=AirBlog.findMediaItemForAName(AirBlog.atMedia.records, oldImgSrc);
          var firstMatchingMediaItemFirstAttatchmentLink=possibleMatchingMediaItems[0].fields.Attachments[0];
          myImg.src=firstMatchingMediaItemFirstAttatchmentLink.url;
          myImg.setAttribute("class", possibleMatchingMediaItems[0].fields.Styles+" ");
          $(this).off("error"); // always turn img loading error off after first capture!
        },
        questionItemToLink(item) {
        return myMediaItems=AirBlog.filterMediaItemListToThoseThatContainThisEntry(atMedia, myEntry);
        },
        myMediaItems() {
        return myMediaItems=AirBlog.filterMediaItemListToThoseThatContainThisEntry(atMedia, myEntry);
        },
        MarkdownContentToHtml(stuff){
          if (stuff!=undefined){            
          var ret = this.$md.render(stuff);
          return ret;
          } else {
            return "";
          }
        },
        MarkdownContentToHtmlRemoveLinks(stuff){
          const regex = /\[(.*?)\]\((.+?)\)/gm;
          var stuffNoLinks=stuff.replace(regex,'$1');
          var ret = this.$md.render(stuffNoLinks);
          return ret;
        }
      }
      ,
  filters : {
      EntryTagIDListToSpacedString(entry){
        return document.AirBlog.FieldNameIdArrayToDelimitedString(entry, "Tags", " ");
      },
      EntryCategoryIDListToSpacedString(entry){
        return document.AirBlog.FieldNameIdArrayToDelimitedString(entry, "Categories", " ");
      },
      EntryQuestionIDListToSpacedString(entry){
        return document.AirBlog.FieldNameIdArrayToDelimitedString(entry, "Questions", " ");
      },
      EntryAuthorIDListToSpacedString(entry){
        return document.AirBlog.FieldNameIdArrayToDelimitedString(entry, "Authors", " ");
      },
      DatePretty(value) {
      var dVal=moment(value);
      return dVal.format("YYYY/MM/DD");
      },
      MakeEntityIntoALink(entity){
        return "foo";
      },
      AuthorIdToAuthorName(value) {
        var selectedAuthors=document.AirBlog.LookupAuthors(value);
        var authorNames=selectedAuthors.map(function(elem){return elem.fields.Name;}).join(", ");
        return authorNames;
      },          
      QuestionIdToQuestion(value) {
        var selectedQuestions=document.AirBlog.LookupQuestions(value);
        var questionNames=selectedQuestions.map(function(elem){return elem.fields.Name;}).join(", ");
        return questionNames;
      },
      QuestionIdToQuestionTitle(value) {
        if (value){
          var selectedQuestions=document.AirBlog.LookupQuestions(value);
          var questionNames=selectedQuestions.map(function(elem){return elem.fields.Name;}).join(", ");
          return questionNames;          
        }
      },
      QuestionIdToQuestionLink(value) {
        if (value){
          var selectedQuestions=document.AirBlog.LookupQuestions(value);
          var questionLinks=selectedQuestions.map(function(elem){
            var templateLink=elem.fields.TemplateFile + "&" + "QuestionId=" + elem.id;
            return "<a href ='" + templateLink + "'>" + elem.fields.Name + "</a>";

            }).join(", ");
          return questionLinks;          
        }
      },          
      MakeTemplateLink(rec, itemType) {
        return rec.fields.TemplateFile + "?"+itemType+"Id=" + rec.id;
      }
    },
    computed: {
      contentToHTML(rec) {
        var ret=this.$md.render(document.AirBlog.atMyEntry.fields.Content);
        return ret;
      }
      // foobar(value) {
      //   if (value){
      //     var selectedQuestions=document.AirBlog.LookupQuestions(value);
      //     var questionLinks=selectedQuestions.map(function(elem){
      //       var templateLink=elem.fields.TemplateFile + "&" + "QuestionId=" + elem.id;
      //       return "<a href ='" + templateLink + "'> &nbsp;" + elem.fields.Name + "</a>";

      //       }).join(", ");
      //     return questionLinks;          
      //   }
      // }
    }
  });

var EntryListComponent = {
  template: `
  <div class="ComponentListWrapper">
    <main role="main" class="">
      <div class="articleList">
        <div class="card articleItemOuter" v-for="rec in entries">
          <div class="card-body articleItemInner" 
            v-bind:n23Categories="rec | EntryCategoryIDListToSpacedString"
            v-bind:n23Questions="rec | EntryQuestionIDListToSpacedString"
            v-bind:n23Tags="rec | EntryTagIDListToSpacedString"
            v-bind:n23Authors="rec | EntryAuthorIDListToSpacedString"
            >
            <h5 class="card-title">
              <a href="#" class="btn btn-sm btn-danger card-filingButton btn-votedown">Down</a>
              {{ rec.fields.Title }}
                <a href="#" class="btn btn-sm btn-success card-filingButton btn-voteup">Up</a>
            </h5>
            <div v-html="QuestionListToQuestionTemplatesHtml(rec)"></div>
            <ul class='tagCloud'>
              <li v-for="tag in TagsForThisEntry(rec)"><a v-bind:href="CreateEntityLink(tag)" v-html="tag.fields.Name"></a></li>
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
  props: ['entries'],
  mixins: [AirBlogBase],
  mounted: function() {
      $('.nav-setFilter').on('click', function(){
        // figure out what we're filtering and close the menu
          var id=$(this)[0].getAttribute("n23id");
          var attToFilter=$(this)[0].getAttribute("n23AttToFilter");
          $(".articleItemInner").parent().hide();
          var sel=".articleItemInner["+attToFilter+"~='" +id+"']";
          $(sel).parent().show();
          $('.navbar-toggler').collapse('hide');
          $('.navbar-collapse').collapse('hide');
      });
    },
  methods: {
    CreateEntityLink(ent){
      var ret=document.AirBlog.CreateItemLink(ent, "Tag");
      return ret;
    },
    AuthorsForThisEntry(entry) {
      return document.AirBlog.AuthorsForAnEntry(entry);
    },
    TagsForThisEntry(entry) {
      return document.AirBlog.LookupTags(entry.fields.Tags);
    },
    GetTagLinkById(tagId){
      var tag=document.AirBlog.SelectTagById(tagId);
      var ret=document.AirBlog.CreateItemLink(tag, "Tag");
      return ret;
    },
    GetTagNameById(tagId){
      var tag=document.AirBlog.SelectTagById(tagId);
      var ret=tag.fields.Name;
      return ret;
    },
    GetTagPublicDescriptionShortById(tagId){
      var tag=document.AirBlog.SelectTagById(tagId);
      if (tag!=undefined && tag.fields!=undefined && tag.fields.PublicDescriptionShort!=undefined){
        var ret=tag.fields.PublicDescriptionShort;
        return ret;
      } else {
        return "";
      }
    },
      QuestionListToQuestionTemplatesHtml(rec) {
        if (rec){
          var listBegin="<ul class='EntryListQuestions'>";
          var listEnd="</ul>";
          var listItemBegin="<li>";
          var listItemEnd="</li>";
          var selectedQuestions=document.AirBlog.LookupQuestions(rec.fields.Questions);
          var questionLinks=selectedQuestions.map(function(elem){
            var templateLink=elem.fields.TemplateFile + "?" + "QuestionId=" + elem.id;
            return listItemBegin+"<a class='btn btn-sm btn-info' href ='" + templateLink + "'> &nbsp;" + elem.fields.Name + "</a>"+listItemEnd;

            }).join(" \n        ");
          if (0==questionLinks.length) {
            return "";
          } else {
            return listBegin+questionLinks+listEnd;          
          }
        }
      },    
      TagListToTagTemplatesHtml(rec) {
        if (rec){
          var listBegin="<ul class='EntryListTags'>";
          var listEnd="</ul>";
          var listItemBegin="<li>";
          var listItemEnd="</li>";
          var selectedTags=document.AirBlog.LookupTags(rec.fields.Tags);
          var tagLinks=selectedTags.map(function(elem){
            var templateLink=elem.fields.TemplateFile + "&" + "TagId=" + elem.id;
            return listItemBegin+"<a href ='" + templateLink + "'> &nbsp;" + elem.fields.Name + "</a>"+listItemEnd;

            }).join(" \n        ");
          if (0==tagLinks.length) {
            return "";
          } else {
            return listBegin+tagLinks+listEnd;          
          }
        }
      },    

  }
}

var EntryDetailbriefComponent = {
  template: `
        
  <div>
    <div id="entryContentBrief" v-html="MarkdownContentToHtmlRemoveLinks(entry.fields.Content)">
    </div> 
  </div>

  `,
  props: ['entry'],
  mixins: [AirBlogBase],
  mounted: function() {
    },
}

var EntryDetailfullComponent = {
  template: `
  <div class="ComponentListWrapper">
    <main role="main" class="">
    <h1>{{entry.fields.Title}}</h1>
    <p class="text-muted byline">
      By 
        <span v-for="author in AuthorsForThisEntry(entry)">
          {{author.fields.Name}} &nbsp;
        </span>
      on 
        <span>
          {{entry.createdTime | DatePretty}}
        </span>
    </p>
    <ul class='tagCloud'>
      <li v-for="tag in TagsForThisEntry(entry)"><a v-bind:href="CreateEntityLink(tag)" v-html="tag.fields.Name"></a></li>
    </ul>
    <div id="entryContent" v-html="MarkdownContentToHtml(entry.fields.Content)"></div>
    </main>
  </div> 

  `,
  props: ['entry'],
  mixins: [AirBlogBase],
  methods: {
    CreateEntityLink(ent){
      var ret=document.AirBlog.CreateItemLink(ent, "Tag");
      return ret;
    },
    AuthorsForThisEntry(entry) {
      return document.AirBlog.AuthorsForAnEntry(entry);
    },
    TagsForThisEntry(entry) {
      return document.AirBlog.LookupTags(entry.fields.Tags);
    },
    GetTagPublicDescriptionShortById(tagId){
      var tag=document.AirBlog.LookupTag(tagId);
      if (tag!=undefined && tag.fields!=undefined && tag.fields.PublicDescriptionShort!=undefined){
        var ret=tag.fields.PublicDescriptionShort;
        return ret;
      } else {
        return "";
      }
    }
  },
  mounted: function() {
      $('#entryContent').children().last().addClass('lastContentParagraph');
  }
}


var TagDetailComponent = {
  template: `
  <div class="ComponentListWrapper">
    <main role="main" class="">
    <h3>{{tag.fields.Name}}</h3>
    <ul>
      <li v-for="entry in RelatedEntries(tag)">
        <a class="simpleEntryListItem" v-bind:href="entry | MakeTemplateLink('Entry')">
          <span>{{entry.fields.Title}}</span>
          <span>{{entry.fields.Excerpt}}</span class="text-muted">
        </aquestioQuestion     
      </li>
    </ul>
    </main>
  </div> 
  `,
  props: ['tag'],
  mixins: [AirBlogBase],
  methods : {
    RelatedEntries(tag){
    var ret=document.AirBlog.Tag2Entries(tag.id);
    return ret;
    }
  }
}

var QuestionDetailComponent = {
  template: `
  <div class="ComponentListWrapper">
    <main role="main" class="">
    <h1>{{question.fields.Name}}</h1>
    <div style="margin-top: 4rem;" v-html="GetFormattedLongDescription(question)"></div>
    <h2>Related Articles</h2>
    <ul>
      <li v-for="entry in RelatedEntries(question)">
        <a class="simpleEntryListItem" v-bind:href="entry | MakeTemplateLink('Entry')">
          <span>{{entry.fields.Title}}</span>
          <span>{{entry.fields.Excerpt}}</span class="text-muted">
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
  props: ['question'],
  mixins: [AirBlogBase],
  methods : {
    RelatedEntries(tag){
    var ret=document.AirBlog.Question2Entries(tag.id);
    return ret;
    },
    GetFormattedLongDescription(question){
      return this.MarkdownContentToHtml(question.fields.PublicDescriptionLong);
    }
  }
}



export {
  EntryListComponent,
  EntryDetailbriefComponent,
  EntryDetailfullComponent,
  TagDetailComponent,
  QuestionDetailComponent
}