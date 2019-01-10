import {
  EntryListComponent,
  EntryDetailbriefComponent,
  EntryDetailfullComponent,
  TagDetailComponent,
  QuestionDetailComponent
} from '/components.js';
Vue.prototype.$md = 
      window.markdownit({
          html:         true,        // Enable HTML tags in source
          linkify:      true,        // Autoconvert URL-like text to links
          typographer:  true
      });

jQuery.loadScript = function (name, url, callback) { 
	if(jQuery[name])
		{ callback; } 
	else { jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
		}); } }
// from https://www.sitepoint.com/get-url-parameters-with-javascript/
// (this is a very common piece of code on the net)
function getAllUrlParams(url) {
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  var obj = {};
  if (queryString) {
    queryString = queryString.split('#')[0];
    var arr = queryString.split('&');
    for (var i = 0; i < arr.length; i++) {
      var a = arr[i].split('=');
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue; //paramValue.toLowerCase();
      if (paramName.match(/\[(\d+)?\]$/)) {
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];
        if (paramName.match(/\[\d+\]$/)) {
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          obj[key].push(paramValue);
        }
      } else {
        if (!obj[paramName]) {
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          obj[paramName].push(paramValue);
        }
      }
    }
  }
  return obj;
}

// The AB object, put into document.AirBlog, is the data layer for AirBlog
// It does nothing but data: retrieve, select, filter, relate, save(?)
function AB(callback){
	var that=this;
	const RUN_MODE="LOCAL"; // other option is LIVE
	const API_KEY=""; // need this for LIVE
	const APP_ID="appQTNunJetOT3r1B";
	const BLOGID="recCGKQBlTWHqrGCu";
	const BLOGNAME="n23";
	const PAGE_SIZE="99"; // 99 is max. After that you gotta add paging code
	var atEntries={};
	var atTags={};
	var atCategories={};
	var atMedia={};
	var atBlogs={};
	var atAuthors={};
	var atQuestions={};

	var atMyEntry={};
	var atMyTag={};
	var atMyCategory={};
	var atMyMedia={};
	var atMyBlog={};
	var atMyAuthor={};
	var atMyQuestion={};

	// finds the element matching whatever is in the query string, if it can
	var isMyX = function(entityURLName, entityArray, entityToTest){
		if (getAllUrlParams()[entityURLName] != undefined) {
			return entityToTest["id"]===getAllUrlParams()[entityURLName];
		}
		else if (entityArray != undefined && entityArray.length>0) {
			return entityToTest["id"]===entityArray[0].id;
		}
		else {
			return false;
		}
	}
	var findById = function(entityArray, id){
		if (entityArray && entityArray.length>0){
			//var ret = (entityArray.records.filter(function(item){return item.id===id;}));
			var ret = (entityArray.filter(function(item){return item.id===id;}));
			if (ret && ret.length && ret.length>0){
				return ret[0];
			}
		}
	}
	var idArrayToItems = function(idArray, itemLookupArray){
		if (idArray && idArray.length>0){
			var myList=itemLookupArray;
			if (myList && idArray){
				var ret=myList.filter(
					function(e) {
						return idArray.indexOf(e.id)>-1;
						}
					);
				return ret;
			}
		  }
		return [];	
	}
	var idArrayToItemFieldArray = function(idArray, itemLookupArray, itemLookupField){
		var arr=idArrayToItems(idArray, itemLookupArray);
		if (arr!=undefined && arr.length!=undefined && arr[0],fields[itemLookupField]!=undefined) {
			var ret=arr.map(item=>{
				var targetValue=item.fields[itemLookupField];
				return targetValue;})} else {}
	}
	var idArrayToItemFieldDelimitedString=function(idArray, itemLookupArray, itemLookupField, stringDelimiter){
		var tempArr=idArrayToItemFieldArray(idArry, itemLookupArray, itemLookupField);
		if (tempArray!=undefined && tempArray.length!=undefined) {
          var tempDat = tempArray.join(stringDelimiter);
          return tempDat;} else {}
    }

	var idArrayToDelimitedString = function(idArray, stringDelimiter){
		if (idArray!=undefined && idArray.length!=undefined) {
          var tempDat = idArray.join(stringDelimiter);
          return tempDat;} else {}
	}

	var isMyEntry=function(entry){return isMyX("entryid", atEntries, entry);}
	var isMyTag=function(entry){return isMyX("tagid", atTags, entry);}
	var isMyCategory=function(entry){return isMyX("categoryid", atCategories, entry);}
	var isMyMedia=function(entry){return isMyX("mediaid", atMedia, entry);}
	var isMyBlog2=function(entry){return isMyX("blogid", atBlogs, entry);}
	var isMyAuthor=function(entry){return isMyX("authorid", atAuthors, entry);}
	var isMyQuestion=function(entry){return isMyX("questionid", atQuestions, entry);}
	var isMyBlog=function(blog){return blog.id === BLOGID;}

	$.when(getAirTableData("Entries"), getAirTableData("Tags"), getAirTableData("Categories"), getAirTableData("Media"), getAirTableData("Blogs"), getAirTableData("Authors"), getAirTableData("Questions")).done(function(a1, a2, a3, a4, a5, a6, a7){
	    // the code here will be executed when all four ajax requests resolve.
	    // a1, a2, a3 and a4 are lists of length 3 containing the response text,
	    // status, and jqXHR object for each of the four ajax calls respectively.
		// (Inside JQuery we switch contexts. Yet again.... so we use 'that')
		that.atEntries=a1[0];
		that.atTags=a2[0];
		that.atCategories=a3[0];
		that.atMedia=a4[0];
		that.atBlogs=a5[0];
		that.atAuthors=a6[0];
		that.atQuestions=a7[0];

		that.atMyEntry=that.atEntries.records.find(isMyEntry);
		that.atMyTag=that.atTags.records.find(isMyTag);
		that.atMyCategory=that.atCategories.records.find(isMyCategory);
		that.atMyMedia=that.atMedia.records.find(isMyMedia);
		that.atMyBlog=that.atBlogs.records.find(isMyBlog);
		that.atMyAuthor=that.atAuthors.records.find(isMyAuthor);
		that.atMyQuestion=that.atQuestions.records.find(isMyQuestion);

		// For now, let's pick some entry as a default so binding will work
		if (!that.atMyEntry) {
			if(that.atEntries.records){
				that.atMyEntry=that.atEntries.records[0]
			}
		} 

		// set up any tracking/analytics
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', that.atMyBlog.fields['GA-Number']);
		var scriptUrl='https://www.googletagmanager.com/gtag/js?id='+that.atMyBlog.fields['GA-Number'];
		$.loadScript('GA', scriptUrl, function(){});

		// resume whatever the page wants to do
		callback(that);
	});	

	function getAirTableData(tableName) {
		//var qry="https://api.airtable.com/v0/" + APP_ID + "/" + tableName + "?maxRecords=" + PAGE_SIZE + "&view=Grid%20view&filterByFormula=AND(IS_AFTER(NOW(),{StartDate}),{Approved})&api_key=" + API_KEY;
		if (tableName!="Blogs"){
			var formula="AND(IS_AFTER(NOW(),{StartDate}),{Approved}, FIND(\"" + BLOGNAME + "\",ARRAYJOIN({Blog})))";
		}
		else
		{
			var formula="AND(IS_AFTER(NOW(),{StartDate}),{Approved})";
		}
		
		if (RUN_MODE==="LIVE") {
			return $.getJSON( "https://api.airtable.com/v0/" + APP_ID + "/" + tableName + "?maxRecords=" + PAGE_SIZE + "&view=Grid%20view&filterByFormula=" + formula + "&api_key=" + API_KEY, function( dat ){});
		}
		else { return $.getJSON( tableName + ".json", function( dat ){});}
	}
	
	this.FieldNameIdArrayToDelimitedString = function(entity, fieldName, stringDelimiter){
		if (entity!=undefined && entity.fields!=undefined) {
			var arrInput=entity.fields[fieldName];
			var ret=idArrayToDelimitedString(arrInput,stringDelimiter);
			return ret;	
		} else {}
		//return idArrayToItems(this.atMyEntry.fields.Blogs, this.atBlogs.records);
	}


	this.BlogsForMyEntry = function(){
		return idArrayToItems(this.atMyEntry.fields.Blogs, this.atBlogs.records);
	}
	this.AuthorsForAnEntry=function(entity){
		return idArrayToItems(entity.fields.Authors, this.atAuthors.records);
	}
	this.AuthorsForMyEntry = function(){
		return this.AuthorsForAnEntry(this.atMyEntry);
	}
	this.CategoriesForMyEntry = function(){
		return idArrayToItems(this.atMyEntry.fields.Categories, this.atCategories.records);
	}
	this.TagsForMyEntry = function(){
		return idArrayToItems(this.atMyEntry.fields.Tags, this.atTags.records);
	}
	this.MediaForMyEntry = function(){
		return idArrayToItems(this.atMyEntry.fields.Media, this.atMedia.records);
	}
	this.QuestionsForMyEntry = function(){
		return idArrayToItems(this.atMyEntry.fields.Questions, this.atQuestions.records);
	}


	this.LookupTags=function(tagIdArray){
		var ret=idArrayToItems(tagIdArray, this.atTags.records);
		return ret;
	}
	this.LookupTag = function(id) {
		var ret=findById(this.atTags.records,id);
	}

	this.BlogsForMyTag = function(){
		return idArrayToItems(this.atMyTag.fields.Blogs, this.atBlogs.records);
	}
	this.EntriesForMyTag = function(){
		return idArrayToItems(this.atMyTag.fields.Entries, this.atEntries.records);
	}
	this.BlogsForMyCategory = function(){
		return idArrayToItems(this.atMyCategory.fields.Blogs, this.atBlogs.records);
	}
	this.EntriesForMyCategory = function(){
		return idArrayToItems(this.atMyCategory.fields.Entries, this.atEntries.records);
	}
	this.BlogsForMyMedia = function(){
		return idArrayToItems(this.atMyMedia.fields.Blogs, this.atBlogs.records);
	}
	this.EntriesForMyMedia = function(){
		return idArrayToItems(this.atMyMedia.fields.Entries, this.atEntries.records);
	}

	this.LookupAuthors=function(authorIdArray){
		var ret=idArrayToItems(authorIdArray, this.atAuthors.records);
		return ret;
	}
	this.LookupAuthor = function(id) {
		var ret=findById(this.atAuthors.records,id);
	}

	this.BlogsForMyAuthor = function(){
		return idArrayToItems(this.atMyAuthor.fields.Blogs, this.atBlogs.records);
	}
	this.EntriesForMyAuthor = function(){
		return idArrayToItems(this.atMyAuthor.fields.Entries, this.atEntries.records);
	}


	this.BlogsForMyQuestion = function(){
		return idArrayToItems(this.atMyQuestion.fields.Blogs, this.atBlogs.records);
	}
	this.EntriesForMyQuestion = function(){
		return idArrayToItems(this.atMyQuestion.fields.Entries, this.atEntries.records);
	}

	this.LookupEntry = function(id) {
		var ret=findById(this.atEntries.records,id);
		return ret;
	}

    this.idListToSpacedString = function(value) {
    	return this.idArrayToDelimitedString(value, " ");
      }
	this.Tag2Entries = function(id) {
		var ret=this.atEntries.records.filter(function(tagItem){
			if(tagItem.fields!=undefined && tagItem.fields.Tags!=undefined){
			return tagItem.fields.Tags.indexOf(id)!=-1;
			} else {return false;};});
		return ret;
		}
	this.Question2Entries = function(id) {
		var ret=this.atEntries.records.filter(function(item){
			if(item.fields!=undefined && item.fields.Questions!=undefined){
			return item.fields.Questions.indexOf(id)!=-1;
			} else {return false;};});
		return ret;
		}


	this.SelectMyEntryById=function(elementId){
		if(elementId!=undefined){
			var foundEntry=this.LookupEntry(elementId);
			if (foundEntry!=undefined) {
				this.atMyEntry=foundEntry;
			} else {

			}
		} else {

		}
	}
	this.findMediaItemForAName=function(mediaItemList, name){
		return mediaItemList.filter(
			(function(mediaItem){return mediaItem.fields.Name===name;}));
		};
	this.filterMediaItemListToThoseThatContainThisEntry=function(mediaItemList, entry){
		return this.atMedia.records.filter(this.mediaItemReferencesThisEntry);
	}
	this.mediaItemReferencesThisEntry=function(mediaItem){
		return mediaItem.fields.Entries.includes(that.GetIDFromQS());
	}


	this.LookupQuestions=function(questionIdArray){
		if (questionIdArray){
			var myList=this.atQuestions.records;
			if (myList && questionIdArray){
				var ret=myList.filter(
					function(e) {
						return questionIdArray.indexOf(e.id)>-1;
						}
					);
				return ret;
			}
		  }
		return [];		  
		}
	this.LookupTags=function(tagIdArray){
		if (tagIdArray){
			var myList=this.atTags.records;
			if (myList && tagIdArray){
				var ret=myList.filter(
					function(e) {
						return tagIdArray.indexOf(e.id)>-1;
						}
					);
				return ret;
			}
		  }
		return [];		  
		}
	this.CreateItemLink=function(rec,itemType){
		  var idMatch=itemType+"Id="+rec.id;
		  var ret=rec.fields.TemplateFile + "?" + idMatch;
		  return ret;
		}
	}


var mainApp;
function begin(airBlog) {
    mainApp = new Vue({
    el: '#mainApp',
    data: airBlog,
	components: {
	    EntryListComponent,
	    EntryDetailbriefComponent,
	    EntryDetailfullComponent,
	    TagDetailComponent,
	    QuestionDetailComponent
	  },
    computed: {
      blogDescriptionToHTML(e) {
        var ret=this.$md.render(document.AirBlog.atMyBlog.fields.LongFormDescription);
        return ret;
      },
      menuItemToLink(rec, itemType) {
      	return document.AirBlog.CreateItemLink(rec, itemType);
	  }
	},
	methods : {
		makeEntityIntoALink(ent, entityName){
			if (ent!=undefined && ent.fields.TemplateFile!=undefined && ent.id!=undefined && entityName!=undefined) {
				var ret=ent.fields.TemplateFile+"?"+entityName+"Id="+ent.id;
				return ret;
			} else {}
		},
		AuthorsForThisEntry(entry) {
			return document.AirBlog.AuthorsForAnEntry(entry);
		  },
	}
  });

$(document).on('shown.bs.modal', '#modalArticle', function (event) {
     var triggerElement = $(event.relatedTarget); // Button that triggered 
     var elementId=triggerElement[0].getAttribute('href');
     document.AirBlog.SelectMyEntryById(elementId);
	$(".modal-backdrop").addClass("modalBackdropTweak");
});
$(document).on('shown.bs.modal', '#modalAbout', function (event) {
	$('.navbar-collapse').collapse('hide');
	$(".modal-backdrop").addClass("modalBackdropTweak");
});
$('.nav-setFilter').on('click', function(){
	// figure out what we're filtering and close the menu
    $('.navbar-toggler').collapse('hide');
});

};

function categoryClick(e){
	var catId=e.attributes.ncat.nodeValue;
	$(".articleItemOuter").hide();
	$('.'+catId).parent().show();
}


$(document).ready(function(){
	document.AirBlog=new AB(begin);
});

