import {
  AirBlogBase,
  RelatedItemsBar,
  EntryDetailHeader,
  EntryListComponent,
  EntryDetailBriefComponent,
  EntryDetailFullComponent,
  TagDetailComponent,
  QuestionDetailComponent,
  EntryListPlainComponent,
  EntryExploreFooter,
  PlainFooter,
  NavMenuSubList,
  ModalAboutTheBlog,
  ModalReadArticle,
  BlogNavigationHeaderMenu
} from "/components.js";
Vue.prototype.$md = window.markdownit({
  html: true, // Enable HTML tags in source
  linkify: true, // Autoconvert URL-like text to links
  typographer: true
});

jQuery.loadScript = function(name, url, callback) {
  if (jQuery[name]) {
    callback;
  } else {
    jQuery.ajax({
      url: url,
      dataType: "script",
      success: callback,
      async: true
    });
  }
};
// from https://www.sitepoint.com/get-url-parameters-with-javascript/
// (this is a very common piece of code on the net)
function getAllUrlParams(url) {
  var queryString = url ? url.split("?")[1] : window.location.search.slice(1);
  var obj = {};
  if (queryString) {
    queryString = queryString.split("#")[0];
    var arr = queryString.split("&");
    for (var i = 0; i < arr.length; i++) {
      var a = arr[i].split("=");
      var paramName = a[0];
      var paramValue = typeof a[1] === "undefined" ? true : a[1];
      paramName = paramName.toLowerCase();
      if (typeof paramValue === "string") paramValue = paramValue; //paramValue.toLowerCase();
      if (paramName.match(/\[(\d+)?\]$/)) {
        var key = paramName.replace(/\[(\d+)?\]/, "");
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
        } else if (obj[paramName] && typeof obj[paramName] === "string") {
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
function AB(callback) {
  var that = this;
  const RUN_MODE = "LOCAL"; // other option is LIVE
  const API_KEY = ""; // need this for LIVE
  const APP_ID = "appQTNunJetOT3r1B";
  const BLOGID = "recCGKQBlTWHqrGCu";
  const BLOGNAME = "n23";
  const PAGE_SIZE = "99"; // 99 is max. After that you gotta add paging code
  var atEntries = {};
  var atTags = {};
  var atCategories = {};
  var atMedia = {};
  var atBlogs = {};
  var atAuthors = {};
  var atQuestions = {};

  var atMyEntry = {};
  var atMyTag = {};
  var atMyCategory = {};
  var atMyMedia = {};
  var atMyBlog = {};
  var atMyAuthor = {};
  var atMyQuestion = {};

  // finds the element matching whatever is in the query string, if it can
  var isMyX = function(entityURLName, entityArray, entityToTest) {
    if (getAllUrlParams()[entityURLName] != undefined) {
      return entityToTest["id"] === getAllUrlParams()[entityURLName];
    } else if (entityArray != undefined && entityArray.length > 0) {
      return entityToTest["id"] === entityArray[0].id;
    } else {
      return false;
    }
  };
  var findById = function(entityArray, id) {
    if (entityArray && entityArray.length > 0) {
      //var ret = (entityArray.records.filter(function(item){return item.id===id;}));
      var ret = entityArray.filter(function(item) {
        return item.id === id;
      });
      if (ret && ret.length && ret.length > 0) {
        return ret[0];
      }
    }
  };
  var idArrayToItems = function(idArray, itemLookupArray) {
    if (idArray && idArray.length > 0) {
      var myList = itemLookupArray;
      if (myList && idArray) {
        var ret = myList.filter(function(e) {
          return idArray.indexOf(e.id) > -1;
        });
        return ret;
      }
    }
    return [];
  };
  var idArrayToItemFieldArray = function(
    idArray,
    itemLookupArray,
    itemLookupField
  ) {
    var arr = idArrayToItems(idArray, itemLookupArray);
    if (
      (arr != undefined && arr.length != undefined && arr[0],
      fields[itemLookupField] != undefined)
    ) {
      var ret = arr.map(item => {
        var targetValue = item.fields[itemLookupField];
        return targetValue;
      });
    } else {
    }
  };
  var idArrayToItemFieldDelimitedString = function(
    idArray,
    itemLookupArray,
    itemLookupField,
    stringDelimiter
  ) {
    var tempArr = idArrayToItemFieldArray(
      idArry,
      itemLookupArray,
      itemLookupField
    );
    if (tempArray != undefined && tempArray.length != undefined) {
      var tempDat = tempArray.join(stringDelimiter);
      return tempDat;
    } else {
    }
  };

  var idArrayToDelimitedString = function(idArray, stringDelimiter) {
    if (idArray != undefined && idArray.length != undefined) {
      var tempDat = idArray.join(stringDelimiter);
      return tempDat;
    } else {
    }
  };
  var isMyEntry = function(entry) {
    return isMyX("entryid", atEntries, entry);
  };
  var isMyTag = function(entry) {
    return isMyX("tagid", atTags, entry);
  };
  var isMyCategory = function(entry) {
    return isMyX("categoryid", atCategories, entry);
  };
  var isMyMedia = function(entry) {
    return isMyX("mediaid", atMedia, entry);
  };
  var isMyBlog2 = function(entry) {
    return isMyX("blogid", atBlogs, entry);
  };
  var isMyAuthor = function(entry) {
    return isMyX("authorid", atAuthors, entry);
  };
  var isMyQuestion = function(entry) {
    return isMyX("questionid", atQuestions, entry);
  };
  var isMyBlog = function(blog) {
    return blog.id === BLOGID;
  };

  $.when(
    getAirTableData("Entries"),
    getAirTableData("Tags"),
    getAirTableData("Categories"),
    getAirTableData("Media"),
    getAirTableData("Blogs"),
    getAirTableData("Authors"),
    getAirTableData("Questions")
  ).done(function(a1, a2, a3, a4, a5, a6, a7) {
    // the code here will be executed when all four ajax requests resolve.
    // a1, a2, a3 and a4 are lists of length 3 containing the response text,
    // status, and jqXHR object for each of the four ajax calls respectively.
    // (Inside JQuery we switch contexts. Yet again.... so we use 'that')
    that.atEntries = a1[0];
    that.atTags = a2[0];
    that.atCategories = a3[0];
    that.atMedia = a4[0];
    that.atBlogs = a5[0];
    that.atAuthors = a6[0];
    that.atQuestions = a7[0];

    that.atMyEntry = that.atEntries.records.find(isMyEntry);
    that.atMyTag = that.atTags.records.find(isMyTag);
    that.atMyCategory = that.atCategories.records.find(isMyCategory);
    that.atMyMedia = that.atMedia.records.find(isMyMedia);
    that.atMyBlog = that.atBlogs.records.find(isMyBlog);
    that.atMyAuthor = that.atAuthors.records.find(isMyAuthor);
    that.atMyQuestion = that.atQuestions.records.find(isMyQuestion);

    // For now, let's pick some entry as a default so binding will work
    if (!that.atMyEntry) {
      if (that.atEntries.records) {
        that.atMyEntry = that.atEntries.records[0];
      }
    }

    // set up any tracking/analytics
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", that.atMyBlog.fields["GA-Number"]);
    var scriptUrl =
      "https://www.googletagmanager.com/gtag/js?id=" +
      that.atMyBlog.fields["GA-Number"];
    $.loadScript("GA", scriptUrl, function() {});

    // resume whatever the page wants to do
    callback(that);
  });

  function getAirTableData(tableName) {
    //var qry="https://api.airtable.com/v0/" + APP_ID + "/" + tableName + "?maxRecords=" + PAGE_SIZE + "&view=Grid%20view&filterByFormula=AND(IS_AFTER(NOW(),{StartDate}),{Approved})&api_key=" + API_KEY;
    if (tableName != "Blogs") {
      var formula =
        'AND(IS_AFTER(NOW(),{StartDate}),{Approved}, FIND("' +
        BLOGNAME +
        '",ARRAYJOIN({Blog})))';
    } else {
      var formula = "AND(IS_AFTER(NOW(),{StartDate}),{Approved})";
    }

    if (RUN_MODE === "LIVE") {
      return $.getJSON(
        "https://api.airtable.com/v0/" +
          APP_ID +
          "/" +
          tableName +
          "?maxRecords=" +
          PAGE_SIZE +
          "&view=Grid%20view&filterByFormula=" +
          formula +
          "&api_key=" +
          API_KEY,
        function(dat) {}
      );
    } else {
      return $.getJSON(tableName + ".json", function(dat) {});
    }
  }
  this.EntityFieldOrEmptyString=function(entity,fieldName){
    if(entity!=undefined && entity[fieldName]!=undefined){
      return entity[fieldName];
    } else {return "";}
  }
  this.FieldNameIdArrayToDelimitedString = function(
    entity,
    fieldName,
    stringDelimiter
  ) {
    if (entity != undefined && entity.fields != undefined) {
      var arrInput = entity.fields[fieldName];
      var ret = idArrayToDelimitedString(arrInput, stringDelimiter);
      return ret;
    } else {
    }
  };

  this.RelatedItems = function(item, relatedItemsFieldName) {
    if (
      item != undefined &&
      relatedItemsFieldName != undefined &&
      item.fields != undefined &&
      item.fields[relatedItemsFieldName] != undefined
    ) {
      var lookupTableName = "at" + relatedItemsFieldName;
      var fieldsToLookup = item.fields[relatedItemsFieldName];
      return idArrayToItems(
        fieldsToLookup,
        this[lookupTableName].records
      );
    } else {
    }
  };
  this.RelatedItemsByTheirFieldNameDelimited=function(item, relatedItemsFieldName, fieldToUse, delimiterBegin, delimiterEnd){
    var itemsToUse=this.RelatedItems(item, relatedItemsFieldName);
    if (itemsToUse!=undefined && itemsToUse.length!=undefined && itemsToUse.length!=0 && fieldToUse!=undefined && itemsToUse[0].fields!=undefined && itemsToUse[0].fields[fieldToUse]!=undefined) {
      var flds= itemsToUse.map(item => {
        return delimiterBegin+item.fields[fieldToUse]+delimiterEnd;});
      return flds.join();
      } else {}
  }
  this.CreateItemLink = function(rec, itemType) {
    if(rec!=undefined && rec.id!=undefined && rec.fields!=undefined && rec.fields.TemplateFile!=undefined){
      var idMatch = itemType + "Id=" + rec.id;
      var ret = rec.fields.TemplateFile + "?" + idMatch;
      return ret;
    } else {return "";}
  };

  this.LookupEntry = function(id) {
    var ret = findById(this.atEntries.records, id);
    return ret;
  };

  this.idListToSpacedString = function(value) {
    return this.idArrayToDelimitedString(value, " ");
  };
  this.SelectMyEntryById = function(elementId) {
    if (elementId != undefined) {
      var foundEntry = this.LookupEntry(elementId);
      if (foundEntry != undefined) {
        this.atMyEntry = foundEntry;
      } else {
      }
    } else {
    }
  };
	this.findMediaItemForAName=function(mediaItemList, name){
		return mediaItemList.filter(
			(function(mediaItem){return mediaItem.fields.Name===name;}));
		};
}


var mainApp;
function begin(airBlog) {
  mainApp = new Vue({
    el: "#mainApp",
    data: airBlog,
    mixins: [AirBlogBase],
    components: {
      RelatedItemsBar,
      EntryDetailHeader,
      EntryListComponent,
      EntryDetailBriefComponent,
      EntryDetailFullComponent,
      TagDetailComponent,
      QuestionDetailComponent,
      EntryListPlainComponent,
      EntryExploreFooter,
      PlainFooter,
      NavMenuSubList,
      ModalAboutTheBlog,
      ModalReadArticle,
      BlogNavigationHeaderMenu
    },
    computed: {
      menuItemToLink(rec, itemType) {
        return document.AirBlog.CreateItemLink(rec, itemType);
      }
    }
  });
}

// It all starts here
// Note the decision to use an object and not an anonymous function
$(document).ready(function() {
  document.AirBlog = new AB(begin);
});
